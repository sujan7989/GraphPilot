from app.repositories.graph_repository import GraphRepository
from app.models.graph import ImpactAnalysisRequest, ImpactAnalysisResult
from typing import Dict, Any


class ImpactService:
    def __init__(self):
        self.graph_repo = GraphRepository()
    
    def analyze_impact(self, request: ImpactAnalysisRequest) -> ImpactAnalysisResult:
        result = self.graph_repo.get_impact_analysis(request.service_id, request.depth)
        
        return ImpactAnalysisResult(
            target_service=result["target_service"],
            affected_services=result["affected_services"],
            total_affected=result["total_affected"],
            max_hops=result["max_hops"]
        )
    
    def get_database_impact(self, database_id: str, depth: int = 4) -> Dict[str, Any]:
        return self.graph_repo.get_database_impact(database_id, depth)
