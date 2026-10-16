import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """Create test client using FastAPI TestClient."""
    return TestClient(app)


def test_root_endpoint(client):
    """Verify service root metadata, license, and engine version."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "ToolCastle PolicyEngine US API"
    assert data["engine_version"] == "2.44.0"
    assert "AGPL-3.0" in data["license"]
    assert data["cutoff_date"] == "2026-10-01"


def test_health_endpoint(client):
    """Verify service health endpoint responds with valid JSON."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "uptime_seconds" in data
    assert "engine_warmed" in data


def test_engine_info_endpoint(client):
    """Verify supported tax years, states, and authoritative sources."""
    response = client.get("/api/v1/info")
    assert response.status_code == 200
    data = response.json()
    assert data["engine"] == "PolicyEngine US"
    assert 2026 in data["supported_tax_years"]
    assert 2025 in data["supported_tax_years"]
    assert data["state_count"] == 51
    assert "CA" in data["supported_states"]
    assert "NY" in data["supported_states"]
    assert "TX" in data["supported_states"]


def test_cors_headers(client):
    """Verify CORS headers are returned for allowed origins."""
    headers = {"Origin": "http://localhost:4321"}
    response = client.get("/", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:4321"


def test_process_time_header(client):
    """Verify X-Process-Time-Ms custom header is injected."""
    response = client.get("/")
    assert response.status_code == 200
    assert "x-process-time-ms" in response.headers

