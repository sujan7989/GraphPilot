# GraphPilot Graph Schema

This document describes the graph data model used in GraphPilot for the NovaCart engineering dependency intelligence system.

## Node Types

### Team
Represents engineering teams responsible for services.

**Properties:**
- `id` (string, required) - Unique identifier (e.g., "team-payments")
- `name` (string, required) - Team name (e.g., "Payments Team")
- `description` (string, optional) - Team description

**Example:**
```cypher
CREATE (:Team {
  id: "team-payments",
  name: "Payments Team",
  description: "Handles payment processing and fraud detection"
})
```

### Developer
Represents individual engineers.

**Properties:**
- `id` (string, required) - Unique identifier (e.g., "dev-1")
- `name` (string, required) - Developer name
- `role` (string, required) - Job role (e.g., "Senior Engineer")

**Example:**
```cypher
CREATE (:Developer {
  id: "dev-1",
  name: "Alice Chen",
  role: "Senior Engineer"
})
```

### Service
Represents microservices in the system.

**Properties:**
- `id` (string, required) - Unique identifier (e.g., "svc-payment")
- `name` (string, required) - Service name
- `description` (string, optional) - Service description
- `status` (string, required) - Current status (active, deprecated, etc.)
- `criticality` (string, required) - Business criticality (high, medium, low)

**Example:**
```cypher
CREATE (:Service {
  id: "svc-payment",
  name: "Payment Service",
  description: "Handles payment processing and transactions",
  status: "active",
  criticality: "high"
})
```

### API
Represents REST/GraphQL endpoints exposed by services.

**Properties:**
- `id` (string, required) - Unique identifier (e.g., "api-payment-process")
- `name` (string, required) - API name
- `method` (string, required) - HTTP method (GET, POST, PUT, DELETE)
- `endpoint` (string, required) - API endpoint path

**Example:**
```cypher
CREATE (:API {
  id: "api-payment-process",
  name: "Process Payment",
  method: "POST",
  endpoint: "/api/v1/payments/process"
})
```

### Database
Represents data stores used by services.

**Properties:**
- `id` (string, required) - Unique identifier (e.g., "db-users")
- `name` (string, required) - Database name
- `engine` (string, required) - Database engine (PostgreSQL, Redis, MongoDB, etc.)
- `environment` (string, required) - Deployment environment

**Example:**
```cypher
CREATE (:Database {
  id: "db-users",
  name: "Users Database",
  engine: "PostgreSQL",
  environment: "Production"
})
```

### Incident
Represents system incidents and outages.

**Properties:**
- `id` (string, required) - Unique identifier (e.g., "inc-001")
- `title` (string, required) - Incident title
- `severity` (string, required) - Severity level (critical, high, medium, low)
- `status` (string, required) - Current status (investigating, resolved, open)
- `created_at` (datetime, required) - Incident creation timestamp
- `description` (string, optional) - Incident description

**Example:**
```cypher
CREATE (:Incident {
  id: "inc-001",
  title: "Payment Gateway Timeout",
  severity: "high",
  status: "resolved",
  created_at: "2024-08-20T10:00:00Z",
  description: "Payment gateway experienced timeouts affecting checkout flow"
})
```

### Deployment
Represents deployment records.

**Properties:**
- `id` (string, required) - Unique identifier (e.g., "dep-001")
- `version` (string, required) - Deployment version
- `deployed_at` (datetime, required) - Deployment timestamp
- `status` (string, required) - Deployment status (success, failed, rolled_back)

**Example:**
```cypher
CREATE (:Deployment {
  id: "dep-001",
  version: "v1.2.3",
  deployed_at: "2024-08-20T10:00:00Z",
  status: "success"
})
```

### Environment
Represents deployment environments.

**Properties:**
- `id` (string, required) - Unique identifier (e.g., "env-prod")
- `name` (string, required) - Environment name

**Example:**
```cypher
CREATE (:Environment {
  id: "env-prod",
  name: "Production"
})
```

## Relationship Types

### OWNS
**Direction:** Team → Service  
**Description:** A team owns and is responsible for a service.

**Example:**
```cypher
MATCH (t:Team {id: "team-payments"}), (s:Service {id: "svc-payment"})
CREATE (t)-[:OWNS]->(s)
```

### MEMBER_OF
**Direction:** Developer → Team  
**Description:** A developer belongs to a team.

**Example:**
```cypher
MATCH (d:Developer {id: "dev-1"}), (t:Team {id: "team-payments"})
CREATE (d)-[:MEMBER_OF]->(t)
```

### DEPENDS_ON
**Direction:** Service → Service  
**Description:** A service depends on another service (direct dependency).

**Example:**
```cypher
MATCH (s1:Service {id: "svc-checkout"}), (s2:Service {id: "svc-payment"})
CREATE (s1)-[:DEPENDS_ON]->(s2)
```

### EXPOSES
**Direction:** Service → API  
**Description:** A service exposes an API endpoint.

**Example:**
```cypher
MATCH (s:Service {id: "svc-payment"}), (a:API {id: "api-payment-process"})
CREATE (s)-[:EXPOSES]->(a)
```

### USES
**Direction:** Service → Database  
**Description:** A service uses a database.

**Example:**
```cypher
MATCH (s:Service {id: "svc-user"}), (d:Database {id: "db-users"})
CREATE (s)-[:USES]->(d)
```

### AFFECTS
**Direction:** Incident → Service  
**Description:** An incident affects a service.

**Example:**
```cypher
MATCH (i:Incident {id: "inc-001"}), (s:Service {id: "svc-payment"})
CREATE (i)-[:AFFECTS]->(s)
```

### DEPLOYED_TO
**Direction:** Deployment → Environment  
**Description:** A deployment was made to an environment.

**Example:**
```cypher
MATCH (d:Deployment {id: "dep-001"}), (e:Environment {id: "env-prod"})
CREATE (d)-[:DEPLOYED_TO]->(e)
```

### TRIGGERED
**Direction:** Deployment → Service  
**Description:** A deployment triggered a service deployment.

**Example:**
```cypher
MATCH (d:Deployment {id: "dep-001"}), (s:Service {id: "svc-payment"})
CREATE (d)-[:TRIGGERED]->(s)
```

## Indexes

For optimal query performance, the following indexes should be created:

```cypher
-- Service indexes
CREATE INDEX service_id IF NOT EXISTS FOR (s:Service) ON (s.id);
CREATE INDEX service_name IF NOT EXISTS FOR (s:Service) ON (s.name);
CREATE INDEX service_status IF NOT EXISTS FOR (s:Service) ON (s.status);
CREATE INDEX service_criticality IF NOT EXISTS FOR (s:Service) ON (s.criticality);

-- Incident indexes
CREATE INDEX incident_id IF NOT EXISTS FOR (i:Incident) ON (i.id);
CREATE INDEX incident_severity IF NOT EXISTS FOR (i:Incident) ON (i.severity);
CREATE INDEX incident_status IF NOT EXISTS FOR (i:Incident) ON (i.status);
CREATE INDEX incident_created_at IF NOT EXISTS FOR (i:Incident) ON (i.created_at);

-- Team indexes
CREATE INDEX team_id IF NOT EXISTS FOR (t:Team) ON (t.id);

-- Developer indexes
CREATE INDEX developer_id IF NOT EXISTS FOR (d:Developer) ON (d.id);

-- Database indexes
CREATE INDEX database_id IF NOT EXISTS FOR (d:Database) ON (d.id);

-- API indexes
CREATE INDEX api_id IF NOT EXISTS FOR (a:API) ON (a.id);
```

## Common Query Patterns

### Find all services owned by a team
```cypher
MATCH (t:Team {id: $team_id})-[:OWNS]->(s:Service)
RETURN s
```

### Find all dependencies of a service (transitive)
```cypher
MATCH (s:Service {id: $service_id})-[:DEPENDS_ON*]->(dep:Service)
RETURN DISTINCT dep
```

### Find all services that could be affected by a service failure
```cypher
MATCH (s:Service {id: $service_id})<-[:DEPENDS_ON*]-(affected:Service)
RETURN DISTINCT affected
```

### Find all incidents affecting a service
```cypher
MATCH (i:Incident)-[:AFFECTS]->(s:Service {id: $service_id})
RETURN i
ORDER BY i.created_at DESC
```

### Find all databases used by a service and its dependencies
```cypher
MATCH (s:Service {id: $service_id})-[:DEPENDS_ON*0..]->(dep:Service)-[:USES]->(d:Database)
RETURN DISTINCT d
```

### Find developers on call for a service (via team ownership)
```cypher
MATCH (d:Developer)-[:MEMBER_OF]->(t:Team)-[:OWNS]->(s:Service {id: $service_id})
RETURN d
```

## Schema Constraints

### Uniqueness Constraints
```cypher
CREATE CONSTRAINT service_id_unique IF NOT EXISTS FOR (s:Service) REQUIRE s.id IS UNIQUE;
CREATE CONSTRAINT incident_id_unique IF NOT EXISTS FOR (i:Incident) REQUIRE i.id IS UNIQUE;
CREATE CONSTRAINT team_id_unique IF NOT EXISTS FOR (t:Team) REQUIRE t.id IS UNIQUE;
CREATE CONSTRAINT developer_id_unique IF NOT EXISTS FOR (d:Developer) REQUIRE d.id IS UNIQUE;
CREATE CONSTRAINT database_id_unique IF NOT EXISTS FOR (d:Database) REQUIRE d.id IS UNIQUE;
CREATE CONSTRAINT api_id_unique IF NOT EXISTS FOR (a:API) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT deployment_id_unique IF NOT EXISTS FOR (d:Deployment) REQUIRE d.id IS UNIQUE;
CREATE CONSTRAINT environment_id_unique IF NOT EXISTS FOR (e:Environment) REQUIRE e.id IS UNIQUE;
```

## Schema Evolution

This schema is designed to be extensible. Future additions may include:

- **Monitoring nodes**: Metrics, alerts, dashboards
- **SLA nodes**: Service level agreements
- **Feature flags nodes**: Feature flag management
- **Change request nodes**: Change tracking and approvals
- **Additional relationship types**: Rate limiting, caching, event streaming
