from fastapi import APIRouter, HTTPException
from app.services.graph_service import GraphService
from app.services.impact_service import ImpactService
from app.repositories.graph_repository import GraphRepository
from app.models.graph import ImpactAnalysisRequest
from typing import List, Dict, Any
import logging

router = APIRouter(prefix="/graph", tags=["graph"])
graph_service = GraphService()
logger = logging.getLogger(__name__)
impact_service = ImpactService()


@router.get("/stats")
async def get_graph_stats():
    """Get graph statistics"""
    try:
        return graph_service.get_graph_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search")
async def search_nodes(q: str):
    """Search for nodes in the graph"""
    try:
        return graph_service.search_nodes(q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/node/{node_id}")
async def get_node_details(node_id: str, node_type: str = "Service"):
    """Get details for a specific node"""
    try:
        details = graph_service.get_node_details(node_id, node_type)
        if not details:
            raise HTTPException(status_code=404, detail="Node not found")
        return details
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/impact-analysis")
async def analyze_impact(request: ImpactAnalysisRequest):
    """Analyze the impact of a service failure"""
    try:
        graph_repo = GraphRepository()
        result = graph_repo.get_impact_analysis(request.service_id, request.depth)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        error_detail = f"Impact analysis failed: {str(e)}"
        logger.error(error_detail, exc_info=True)
        # Return graceful fallback instead of 500
        return {
            "target_service": request.service_id,
            "affected_services": [],
            "total_affected": 0,
            "max_hops": request.depth,
            "error": "Unable to perform impact analysis. Please try again or use the Explorer page to view dependencies."
        }


@router.get("/database/{database_id}/impact")
async def get_database_impact(database_id: str, depth: int = 4):
    """Get impact analysis for a database"""
    try:
        return impact_service.get_database_impact(database_id, depth)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
