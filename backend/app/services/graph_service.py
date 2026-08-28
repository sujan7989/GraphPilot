from app.repositories.graph_repository import GraphRepository
from app.repositories.service_repository import ServiceRepository
from typing import Dict, Any, List


class GraphService:
    def __init__(self):
        self.graph_repo = GraphRepository()
        self.service_repo = ServiceRepository()
    
    def get_graph_stats(self) -> Dict[str, Any]:
        return self.graph_repo.get_graph_stats()
    
    def search_nodes(self, search_term: str) -> List[Dict[str, Any]]:
        return self.graph_repo.search_nodes(search_term)
    
    def get_node_details(self, node_id: str, node_type: str = "Service") -> Dict[str, Any]:
        return self.graph_repo.get_node_with_connections(node_id, node_type)
    
    def get_service_graph(self, service_id: str, depth: int = 2) -> Dict[str, Any]:
        return self.service_repo.get_service_graph(service_id, depth)
