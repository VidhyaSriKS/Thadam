"""
Tests for THADAM TN Backend API and ML Engine.
"""
import pytest
from fastapi.testclient import TestClient

from app import app
from recommender import recommender, resolve_destination_preference


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["model_loaded"] is True
    assert data["dataset_rows"] == 114
    assert data["feature_count"] == 62


def test_recommend_endpoint_success(client):
    payload = {
        "interests": ["historical", "cultural"],
        "destination_preference": "Hidden",
        "crowd": "Low",
        "adults": 2,
        "total_budget": 15000.0,
    }
    response = client.post("/api/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["recommendations"]) == 10

    top_item = data["recommendations"][0]
    assert "destination_name" in top_item
    assert "final_score" in top_item
    assert "match_reasons" in top_item
    assert top_item["final_score"] > 0.0


def test_recommend_with_destination_mix(client):
    payload = {
        "interests": ["nature", "beach"],
        "destination_mix": {
            "famous": 10.0,
            "moderate": 20.0,
            "hidden": 70.0,
        },
        "crowd": "Low",
    }
    response = client.post("/api/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["recommendations"]) == 10


def test_resolve_destination_preference():
    assert resolve_destination_preference("famous", None) == "Famous"
    assert resolve_destination_preference("hidden", None) == "Hidden"
    assert resolve_destination_preference(None, {"famous": 60, "moderate": 20, "hidden": 20}) == "Famous"
    assert resolve_destination_preference(None, {"famous": 10, "moderate": 10, "hidden": 80}) == "Hidden"
    assert resolve_destination_preference(None, {"famous": 33, "moderate": 33, "hidden": 34}) == "Mixed"


def test_recommend_district_exact_match(client):
    # Test Madurai district request
    response = client.post("/api/recommend", json={"destination": "Madurai", "top_n": 3})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["recommendations"]) == 3
    for item in data["recommendations"]:
        assert item["district"].lower() == "madurai"

    # Test Coimbatore district request
    response_cbe = client.post("/api/recommend", json={"destination": "Coimbatore", "top_n": 3})
    assert response_cbe.status_code == 200
    data_cbe = response_cbe.json()
    for item in data_cbe["recommendations"]:
        assert item["district"].lower() == "coimbatore"
