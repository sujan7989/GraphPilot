// Impact analysis with depth parameter
MATCH (target:Service {id: $service_id})
MATCH (affected:Service)
WHERE (affected)-[:DEPENDS_ON*1..$depth]->(target)
RETURN DISTINCT 
    affected.id AS service_id,
    affected.name AS service_name,
    affected.status AS status,
    affected.criticality AS criticality,
    length(shortestPath((affected)-[:DEPENDS_ON*]->(target))) AS hops
ORDER BY hops, service_name;

// Impact analysis with ownership information
MATCH (target:Service {id: $service_id})
MATCH (affected:Service)-[:DEPENDS_ON*1..$depth]->(target)
OPTIONAL MATCH (team:Team)-[:OWNS]->(affected)
RETURN DISTINCT 
    affected.id AS service_id,
    affected.name AS service_name,
    team.name AS owning_team,
    length(shortestPath((affected)-[:DEPENDS_ON*]->(target))) AS hops
ORDER BY hops, service_name;
