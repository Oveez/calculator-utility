import time
import os
import logging
from typing import Dict, Any, List
from fastapi import FastAPI, Request, HTTPException, Security, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security.api_key import APIKeyHeader
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app import __version__, __engine_version__
from app.config import settings
from app.lifespan import lifespan, is_engine_warmed, get_warm_time, get_uptime_seconds
from app.schemas import TaxCalculationRequest, TaxCalculationResponse
from app.adapter import execute_policyengine_calculation

# Configure privacy-preserving application logger
logger = logging.getLogger("policyengine_api")
logger.setLevel(logging.INFO if not settings.DEBUG else logging.DEBUG)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.RATE_LIMIT_PER_MINUTE}/minute"])

# Initialize FastAPI application
app = FastAPI(
    title="ToolCastle PolicyEngine US API",
    description="Statutory microsimulation API integrating policyengine-us for ToolCastle tax calculators.",
    version=__version__,
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Optional API Key Authentication Header
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def verify_api_key(api_key: str = Security(api_key_header)) -> None:
    """Validate API secret key if REQUIRE_API_KEY is enabled."""
    if not settings.REQUIRE_API_KEY:
        return
    if not api_key or api_key != settings.API_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing X-API-Key authentication header.",
        )


@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    """Enforce max request payload size limit (64KB) to mitigate DOS attacks."""
    if request.method in ("POST", "PUT", "PATCH"):
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                length_int = int(content_length)
                if length_int > settings.MAX_REQUEST_SIZE_BYTES:
                    return JSONResponse(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        content={
                            "error": "PayloadTooLarge",
                            "message": f"Request payload ({length_int} bytes) exceeds limit of {settings.MAX_REQUEST_SIZE_BYTES} bytes."
                        }
                    )
            except ValueError:
                pass
    return await call_next(request)


@app.middleware("http")
async def sanitized_access_log(request: Request, call_next):
    """Log request metadata without recording sensitive personal or financial inputs."""
    start_time = time.time()
    response = await call_next(request)
    duration_ms = (time.time() - start_time) * 1000

    # Privacy guarantee: Log only method, path, status, and duration; no payload data
    client_host = request.client.host if request.client else "unknown"
    logger.info(
        f"{request.method} {request.url.path} -> {response.status_code} ({duration_ms:.2f}ms) [client={client_host}]"
    )
    return response


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Inject server execution timing header into responses."""
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unhandled exceptions cleanly without leaking internal stack traces."""
    return JSONResponse(
        status_code=500,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred during tax calculation.",
            "request_id": request.headers.get("X-Request-Id", "unknown"),
        },
    )


@app.get("/", tags=["General"])
async def root() -> Dict[str, Any]:
    """Root endpoint returning service identity, version, and license information."""
    return {
        "service": "ToolCastle PolicyEngine US API",
        "service_version": __version__,
        "engine_version": __engine_version__,
        "status": "operational",
        "license": "GNU Affero General Public License v3.0 (AGPL-3.0)",
        "source_repository": "https://github.com/PolicyEngine/policyengine-us",
        "cutoff_date": "2026-10-01",
    }


@app.get("/health", tags=["Monitoring"])
async def health_check() -> Dict[str, Any]:
    """Service health and container readiness endpoint."""
    return {
        "status": "healthy" if is_engine_warmed() else "degraded",
        "engine_warmed": is_engine_warmed(),
        "warmup_time_seconds": round(get_warm_time(), 2),
        "uptime_seconds": round(get_uptime_seconds(), 2),
        "environment": settings.ENVIRONMENT,
    }


@app.get("/api/v1/info", tags=["Tax Engine Metadata"])
async def engine_info() -> Dict[str, Any]:
    """Metadata detailing supported tax years, filing statuses, and state jurisdictions."""
    all_states: List[str] = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
    ]
    return {
        "engine": "PolicyEngine US",
        "version": __engine_version__,
        "supported_tax_years": [2025, 2026],
        "default_tax_year": settings.DEFAULT_TAX_YEAR,
        "authoritative_sources": [
            "IRS Revenue Procedure 2025-32 (2026 Inflation Adjustments)",
            "Social Security Administration (2026 Wage Base $184,500)",
            "Relevant State Departments of Revenue"
        ],
        "supported_filing_statuses": [
            "SINGLE",
            "JOINT",
            "SEPARATE",
            "HEAD_OF_HOUSEHOLD",
            "SURVIVING_SPOUSE"
        ],
        "supported_states": all_states,
        "state_count": len(all_states),
    }


@app.post(
    "/api/v1/calculate",
    response_model=TaxCalculationResponse,
    tags=["Tax Calculation"],
    summary="Execute authoritative US tax calculation via PolicyEngine US",
)
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def calculate_tax(
    request: Request,
    payload: TaxCalculationRequest,
) -> TaxCalculationResponse:
    """Execute authoritative US federal, state, and payroll tax calculation.
    
    Accepts validated Form 1040 parameters, models the topological household structure,
    and returns comprehensive tax liability, take-home pay, and marginal/effective tax rates.
    """
    await verify_api_key(request.headers.get("X-API-Key"))
    try:
        response = execute_policyengine_calculation(payload)
        return response
    except ValueError as e:
        logger.warning(f"Validation error in calculation: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"PolicyEngine calculation failure: {type(e).__name__} - {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected calculation error occurred while processing the tax scenario. Please verify the input values.",
        )

