from fastapi import APIRouter, HTTPException
from app.repositories.incident_repository import IncidentRepository
from typing import List, Dict, Any

router = APIRouter(prefix="/incidents", tags=["incidents"])
incident_repo = IncidentRepository()


@router.get("", response_model=List[Dict[str, Any]])
async def get_incidents():
    """Get all incidents"""
    try:
        return incident_repo.get_all_incidents()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{incident_id}", response_model=Dict[str, Any])
async def get_incident(incident_id: str):
    """Get a specific incident by ID"""
    try:
        incident = incident_repo.get_incident_by_id(incident_id)
        if not incident:
            raise HTTPException(status_code=404, detail="Incident not found")
        return incident
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{incident_id}/dependencies", response_model=List[Dict[str, Any]])
async def get_incident_dependencies(incident_id: str):
    """Get dependency analysis for an incident"""
    try:
        return incident_repo.get_incident_with_dependencies(incident_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
