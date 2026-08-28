from app.db.driver import get_driver
from typing import List, Dict, Any


class ServiceRepository:
    def __init__(self):
        self.driver = get_driver()
    
    def _validate_depth(self, depth: int) -> int:
        """Validate depth parameter to ensure safe value for query construction"""
        if not isinstance(depth, int) or depth < 1 or depth > 10:
            raise ValueError(f"Invalid depth: {depth}. Must be an integer between 1 and 10.")
        return depth
    
    def get_all_services(self) -> List[Dict[str, Any]]:
        query = """
        MATCH (s:Service)
        RETURN s.id AS id, s.name AS name, s.description AS description, 
               s.status AS status, s.criticality AS criticality
        ORDER BY s.name
        """
        with self.driver.session() as session:
            result = session.run(query)
            return [dict(record) for record in result]
    
    def get_service_by_id(self, service_id: str) -> Dict[str, Any]:
        query = """
        MATCH (s:Service {id: $service_id})
        RETURN s.id AS id, s.name AS name, s.description AS description,
               s.status AS status, s.criticality AS criticality
        """
        with self.driver.session() as session:
            result = session.run(query, {"service_id": service_id})
            record = result.single()
            return dict(record) if record else None
    
    def get_dependencies(self, service_id: str) -> List[Dict[str, Any]]:
        query = """
        MATCH (s:Service {id: $service_id})-[:DEPENDS_ON]->(dependency:Service)
        RETURN dependency.id AS id, dependency.name AS name, 
               dependency.status AS status, dependency.criticality AS criticality
        ORDER BY dependency.name
        """
        with self.driver.session() as session:
            result = session.run(query, {"service_id": service_id})
            return [dict(record) for record in result]
    
    def get_dependents(self, service_id: str) -> List[Dict[str, Any]]:
        query = """
        MATCH (dependent:Service)-[:DEPENDS_ON]->(s:Service {id: $service_id})
        RETURN dependent.id AS id, dependent.name AS name,
               dependent.status AS status, dependent.criticality AS criticality
        ORDER BY dependent.name
        """
        with self.driver.session() as session:
            result = session.run(query, {"service_id": service_id})
            return [dict(record) for record in result]
    
    def get_service_graph(self, service_id: str, depth: int = 2) -> Dict[str, Any]:
        depth = self._validate_depth(depth)
        # Simplified query for direct dependencies only (avoid variable-length relationship issues)
        query = """
        MATCH (s:Service {id: $service_id})
        OPTIONAL MATCH (s)-[r1:DEPENDS_ON]->(dep:Service)
        RETURN collect(DISTINCT {id: s.id, name: s.name, status: s.status, criticality: s.criticality}) + 
               collect(DISTINCT {id: dep.id, name: dep.name, status: dep.status, criticality: dep.criticality}) AS nodes,
               collect(DISTINCT {type: 'DEPENDS_ON', source: s.id, target: dep.id}) AS relationships
        """
        
        with self.driver.session() as session:
            result = session.run(query, {"service_id": service_id})
            record = result.single()
            return dict(record) if record else {"nodes": [], "relationships": []}
