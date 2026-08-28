// Multi-hop impact analysis
MATCH (target:Service {id: $service_id})
MATCH (affected:Service)
WHERE (affected)-[:DEPENDS_ON*1..4]->(target)
RETURN DISTINCT 
    affected.id AS service_id,
    affected.name AS service_name,
    affected.status AS status,
    affected.criticality AS criticality,
    length(shortestPath((affected)-[:DEPENDS_ON*]->(target))) AS hops
ORDER BY hops, service_name;

// Database impact analysis
MATCH (db:Database {id: $database_id})
MATCH (service:Service)-[:USES|DEPENDS_ON*1..4]->(db)
RETURN DISTINCT 
    service.id AS id,
    service.name AS name,
    service.status AS status,
    service.criticality AS criticality
ORDER BY service.name;

// Service graph visualization
MATCH (s:Service {id: $service_id})
OPTIONAL MATCH (s)-[r1:DEPENDS_ON*1..2]->(dep:Service)
OPTIONAL MATCH (s)-[r2:DEPENDS_ON*1..2]<(dep2:Service)
RETURN collect(DISTINCT s) + collect(DISTINCT dep) + collect(DISTINCT dep2) AS nodes,
       collect(DISTINCT r1) + collect(DISTINCT r2) AS relationships;
