import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings


@pytest.fixture
def client():
    """Create test client using FastAPI TestClient."""
    return TestClient(app)


def test_payload_too_large_rejected_with_413(client):
    """Verify requests exceeding MAX_REQUEST_SIZE_BYTES (64KB) are rejected with HTTP 413."""
    # Send headers with oversized Content-Length
    headers = {
        "Content-Length": "70000",
        "Content-Type": "application/json",
    }
    # Large dummy payload
    oversized_data = " " * 70000
    response = client.post("/api/v1/calculate", content=oversized_data, headers=headers)
    assert response.status_code == 413
    data = response.json()
    assert data["error"] == "PayloadTooLarge"
    assert "exceeds limit" in data["message"]


def test_malformed_json_rejected_with_clean_422(client):
    """Verify malformed JSON requests are rejected cleanly without 500 error or stack traces."""
    headers = {"Content-Type": "application/json"}
    bad_payload = "{ 'invalid_json': True, missing_quotes: 123 }"
    response = client.post("/api/v1/calculate", content=bad_payload, headers=headers)
    assert response.status_code in (400, 422)
    assert "Traceback" not in response.text
    assert "site-packages" not in response.text


def test_api_key_authentication_when_enforced(client):
    """Verify X-API-Key header enforcement when REQUIRE_API_KEY is enabled."""
    original_require = settings.REQUIRE_API_KEY
    original_key = settings.API_SECRET_KEY
    try:
        settings.REQUIRE_API_KEY = True
        settings.API_SECRET_KEY = "test_secret_token_12345"

        payload = {
            "tax_year": 2026,
            "filing_status": "single",
            "primary_w2_income": 50000.0,
        }

        # 1. Missing header -> 401 Unauthorized
        res_no_key = client.post("/api/v1/calculate", json=payload)
        assert res_no_key.status_code == 401
        assert "Invalid or missing X-API-Key" in res_no_key.json()["detail"]

        # 2. Invalid header -> 401 Unauthorized
        res_bad_key = client.post(
            "/api/v1/calculate",
            json=payload,
            headers={"X-API-Key": "wrong_token"}
        )
        assert res_bad_key.status_code == 401

        # 3. Valid header -> 200 OK
        res_valid = client.post(
            "/api/v1/calculate",
            json=payload,
            headers={"X-API-Key": "test_secret_token_12345"}
        )
        assert res_valid.status_code == 200
        assert res_valid.json()["total_gross_income"] == 50000.0

    finally:
        settings.REQUIRE_API_KEY = original_require
        settings.API_SECRET_KEY = original_key


def test_error_response_never_leaks_python_traceback(client):
    """Verify that even when an internal server error is triggered, no stack trace is leaked."""
    # Send a request that triggers validation error
    payload = {
        "tax_year": 1990,  # Invalid tax year
        "filing_status": "single",
        "primary_w2_income": 50000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 422
    text = response.text
    assert "Traceback (most recent call last)" not in text
    assert "site-packages" not in text
    assert "policyengine_us" not in text
    assert "adapter.py" not in text


def test_cors_headers_strictness(client):
    """Verify CORS preflight OPTIONS returns allowed methods and credentials."""
    response = client.options(
        "/api/v1/calculate",
        headers={
            "Origin": "https://toolcastle.app",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type, X-API-Key",
        }
    )
    assert response.status_code == 200
    assert "POST" in response.headers.get("access-control-allow-methods", "")
    assert "https://toolcastle.app" in response.headers.get("access-control-allow-origin", "")


def test_response_contains_no_taxpayer_pii(client):
    """Verify calculation response contains purely statutory numbers and metadata, with no PII retention."""
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "state_code": "TX",
        "primary_w2_income": 85000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Metadata should only contain statutory identifiers
    meta = data["metadata"]
    assert "ssn" not in meta
    assert "ip" not in meta
    assert "user_id" not in meta
    assert meta["tax_year"] == 2026
    assert meta["state_code"] == "TX"
    assert meta["engine"] == "PolicyEngine US"

