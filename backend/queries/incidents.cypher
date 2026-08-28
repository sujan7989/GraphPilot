// Get all incidents
MATCH (i:Incident)
RETURN i.id AS id, i.title AS title, i.severity AS severity,
       i.status AS status, i.created_at AS created_at, i.description AS description
ORDER BY i.created_at DESC;

// Get incident with affected services
MATCH (i:Incident {id: $incident_id})
OPTIONAL MATCH (i)-[:AFFECTS]->(s:Service)
RETURN i.id AS id, i.title AS title, i.severity AS severity,
       i.status AS status, i.created_at AS created_at, i.description AS description,
       collect(DISTINCT {id: s.id, name: s.name}) AS affected_services;

// Incident investigation with dependency paths
MATCH (i:Incident {id: $incident_id})-[:AFFECTS]->(service:Service)
OPTIONAL MATCH path = (service)-[:DEPENDS_ON*1..3]->(dependency:Service)
RETURN 
    i.id AS incident,
    i.title AS incident_title,
    i.severity AS severity,
    service.name AS affected_service,
    dependency.name AS dependency,
    length(path) AS hops
ORDER BY hops;
