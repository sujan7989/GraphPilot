from fastapi import APIRouter, HTTPException
from app.repositories.service_repository import ServiceRepository
from typing import List, Dict, Any

router = APIRouter(prefix="/services", tags=["services"])
service_repo = ServiceRepository()


@router.get("", response_model=List[Dict[str, Any]])
async def get_services():
    """Get all services"""
    try:
        return service_repo.get_all_services()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{service_id}", response_model=Dict[str, Any])
async def get_service(service_id: str):
    """Get a specific service by ID"""
    try:
        service = service_repo.get_service_by_id(service_id)
        if not service:
            raise HTTPException(status_code=404, detail="Service not found")
        return service
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{service_id}/dependencies", response_model=List[Dict[str, Any]])
async def get_service_dependencies(service_id: str):
    """Get services that this service depends on"""
    try:
        return service_repo.get_dependencies(service_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{service_id}/dependents", response_model=List[Dict[str, Any]])
async def get_service_dependents(service_id: str):
    """Get services that depend on this service"""
    try:
        return service_repo.get_dependents(service_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{service_id}/graph", response_model=Dict[str, Any])
async def get_service_graph(service_id: str, depth: int = 2):
    """Get graph data for a service"""
    try:
        return service_repo.get_service_graph(service_id, depth)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
