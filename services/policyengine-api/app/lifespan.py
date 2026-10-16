import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI

logger = logging.getLogger("policyengine_api")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

_warmed: bool = False
_warm_time_seconds: float = 0.0
_start_time: float = time.time()


def is_engine_warmed() -> bool:
    """Return whether the PolicyEngine calculation graph has been pre-warmed."""
    return _warmed


def get_warm_time() -> float:
    """Return the time in seconds taken to pre-warm the engine."""
    return _warm_time_seconds


def get_uptime_seconds() -> float:
    """Return application uptime in seconds."""
    return time.time() - _start_time


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler to pre-warm PolicyEngine US on startup."""
    global _warmed, _warm_time_seconds
    logger.info("Initializing PolicyEngine US calculation engine...")
    t0 = time.time()

    try:
        from policyengine_us import Simulation

        # Execute minimal warm-up simulation to compile dependency graph into memory
        sim = Simulation(situation={
            "people": {
                "p": {
                    "age": {2026: 30},
                    "employment_income": {2026: 1000},
                }
            },
            "tax_units": {
                "t": {
                    "members": ["p"],
                    "filing_status": {2026: "SINGLE"},
                }
            },
            "families": {"f": {"members": ["p"]}},
            "spm_units": {"s": {"members": ["p"]}},
            "households": {
                "h": {
                    "members": ["p"],
                    "state_code": {2026: "CA"},
                }
            }
        })
        _ = float(sim.calculate("income_tax", 2026)[0])
        _warm_time_seconds = time.time() - t0
        _warmed = True
        logger.info(f"PolicyEngine US successfully pre-warmed in {_warm_time_seconds:.2f}s")
    except Exception as e:
        logger.error(f"Failed to pre-warm PolicyEngine US: {e}")
        _warmed = False

    yield

    logger.info("Shutting down PolicyEngine API service.")

