from app.db.driver import get_driver
from typing import List, Dict, Any


class IncidentRepository:
    def __init__(self):
        self.driver = get_driver()
    
    def get_all_incidents(self) -> List[Dict[str, Any]]:
        query = """
        MATCH (i:Incident)
        RETURN i.id AS id, i.title AS title, i.severity AS severity,
               i.status AS status, i.created_at AS created_at, i.description AS description
        ORDER BY i.created_at DESC
        """
        with self.driver.session() as session:
            result = session.run(query)
            return [dict(record) for record in result]
    
    def get_incident_by_id(self, incident_id: str) -> Dict[str, Any]:
        query = """
        MATCH (i:Incident {id: $incident_id})
        OPTIONAL MATCH (i)-[:AFFECTS]->(s:Service)
        RETURN i.id AS id, i.title AS title, i.severity AS severity,
               i.status AS status, i.created_at AS created_at, i.description AS description,
               collect(DISTINCT {id: s.id, name: s.name}) AS affected_services
        """
        with self.driver.session() as session:
            result = session.run(query, {"incident_id": incident_id})
            record = result.single()
            return dict(record) if record else None
    
    def get_incident_with_dependencies(self, incident_id: str) -> Dict[str, Any]:
        query = """
        MATCH (i:Incident {id: $incident_id})-[:AFFECTS]->(service:Service)
        OPTIONAL MATCH path = (service)-[:DEPENDS_ON*1..3]->(dependency:Service)
        RETURN i.id AS incident, i.title AS incident_title, i.severity AS severity,
               i.status AS status, service.name AS affected_service,
               dependency.name AS dependency, length(path) AS hops
        ORDER BY hops
        """
        with self.driver.session() as session:
            result = session.run(query, {"incident_id": incident_id})
            return [dict(record) for record in result]
