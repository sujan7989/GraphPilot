// Get all services
MATCH (s:Service)
RETURN s.id AS id, s.name AS name, s.description AS description, 
       s.status AS status, s.criticality AS criticality
ORDER BY s.name;

// Get service by ID
MATCH (s:Service {id: $service_id})
RETURN s.id AS id, s.name AS name, s.description AS description,
       s.status AS status, s.criticality AS criticality;

// Get direct dependencies
MATCH (s:Service {id: $service_id})-[:DEPENDS_ON]->(dependency:Service)
RETURN dependency.id AS id, dependency.name AS name, 
       dependency.status AS status, dependency.criticality AS criticality
ORDER BY dependency.name;

// Get dependents (services that depend on this one)
MATCH (dependent:Service)-[:DEPENDS_ON]->(s:Service {id: $service_id})
RETURN dependent.id AS id, dependent.name AS name,
       dependent.status AS status, dependent.criticality AS criticality
ORDER BY dependent.name;
