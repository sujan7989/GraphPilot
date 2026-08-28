from app.db.driver import get_driver
from typing import List, Dict, Any


class GraphRepository:
    def __init__(self):
        self.driver = get_driver()
    
    def _validate_depth(self, depth: int) -> int:
        """Validate depth parameter to ensure safe value for query construction"""
        if not isinstance(depth, int) or depth < 1 or depth > 10:
            raise ValueError(f"Invalid depth: {depth}. Must be an integer between 1 and 10.")
        return depth
    
    def _validate_node_type(self, node_type: str) -> str:
        """Validate node_type parameter to ensure safe value for query construction"""
        allowed_types = ["Service", "Team", "Developer", "Incident", "Database", "API", "Deployment", "Environment"]
        if node_type not in allowed_types:
            raise ValueError(f"Invalid node_type: {node_type}. Must be one of {allowed_types}")
        return node_type
    
    def get_impact_analysis(self, service_id: str, depth: int = 4) -> Dict[str, Any]:
        depth = self._validate_depth(depth)
        
        # First check if the service exists
        check_query = "MATCH (s:Service {id: $service_id}) RETURN s.id AS id LIMIT 1"
        with self.driver.session() as session:
            check_result = session.run(check_query, {"service_id": service_id})
            if not check_result.single():
                raise ValueError(f"Service with id '{service_id}' not found")
        
        # Simplified query: find services that depend on the target
        # If target fails, services that depend on it are affected
        query = """
        MATCH (target:Service {id: $service_id})
        MATCH (affected:Service)-[r:DEPENDS_ON]->(target)
        RETURN DISTINCT 
            affected.id AS service_id,
            affected.name AS service_name,
            affected.status AS status,
            affected.criticality AS criticality,
            1 AS hops
        ORDER BY service_name
        """
        
        with self.driver.session() as session:
            result = session.run(query, {"service_id": service_id, "depth": depth})
            affected_services = []
            for record in result:
                affected_services.append({
                    "service_id": record["service_id"],
                    "service_name": record["service_name"],
                    "status": record["status"],
                    "criticality": record["criticality"],
                    "hops": record["hops"],
                    "path": record.get("path", [])
                })
            
                "target_service": service_id,
                "affected_services": affected_services,
                "total_affected": len(affected_services),
                "max_hops": depth
            }
    
    def get_database_impact(self, database_id: str, depth: int = 4) -> List[Dict[str, Any]]:
        depth = self._validate_depth(depth)
        query = """
        MATCH (db:Database {id: $database_id})
        MATCH (service:Service)-[:USES|DEPENDS_ON*1..$depth]->(db)
        RETURN DISTINCT 
            service.id AS id,
            service.name AS name,
            service.status AS status,
            service.criticality AS criticality
        ORDER BY service.name
        """
        
        with self.driver.session() as session:
            result = session.run(query, {"database_id": database_id, "depth": depth})
            return [dict(record) for record in result]
    
    def get_node_with_connections(self, node_id: str, node_type: str = "Service") -> Dict[str, Any]:
        node_type = self._validate_node_type(node_type)
        query = """
        MATCH (n {id: $node_id})
        WHERE $node_type IN labels(n)
        OPTIONAL MATCH (n)-[r]->(connected)
        OPTIONAL MATCH (n)<-[r2]-(connected2)
        RETURN n, collect(DISTINCT {type: type(r), target: connected.id, target_label: labels(connected)[0]}) + 
               collect(DISTINCT {type: type(r2), source: connected2.id, source_label: labels(connected2)[0]}) AS connections
        """
        
        with self.driver.session() as session:
            result = session.run(query, {"node_id": node_id, "node_type": node_type})
            record = result.single()
            if record:
                node_dict = dict(record["n"])
                connections = [c for c in record["connections"] if c.get("target") or c.get("source")]
                return {"node": node_dict, "connections": connections}
            return None
    
    def search_nodes(self, search_term: str, limit: int = 20) -> List[Dict[str, Any]]:
        query = """
        MATCH (n)
        WHERE n.name CONTAINS $search_term OR n.id CONTAINS $search_term
        RETURN n.id AS id, n.name AS name, labels(n)[0] AS label
        LIMIT $limit
        """
        
        with self.driver.session() as session:
            result = session.run(query, {"search_term": search_term, "limit": limit})
            return [dict(record) for record in result]
    
    def get_graph_stats(self) -> Dict[str, Any]:
        queries = {
            "services": "MATCH (s:Service) RETURN count(s) AS count",
            "teams": "MATCH (t:Team) RETURN count(t) AS count",
            "incidents": "MATCH (i:Incident) RETURN count(i) AS count",
            "databases": "MATCH (d:Database) RETURN count(d) AS count",
            "relationships": "MATCH ()-[r]->() RETURN count(r) AS count"
        }
        
        stats = {}
        with self.driver.session() as session:
            for key, query in queries.items():
                result = session.run(query)
                record = result.single()
                stats[key] = record["count"] if record else 0
        
        return stats
