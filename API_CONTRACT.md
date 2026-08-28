# GraphPilot API Contract

## Base URL
- **Local Development**: `http://localhost:8000/api`
- **Production**: `https://graphpilot.onrender.com/api`

## Authentication
None required (public API)

## Content-Type
All requests: `application/json`

---

## Services API

### GET /api/services
Get all services

**Response 200 OK**
```json
[
  {
    "id": "svc-payment",
    "name": "Payment Service",
    "description": "Handles payment processing and transactions",
    "status": "active",
    "criticality": "high"
  }
]
```

### GET /api/services/{service_id}
Get a specific service by ID

**Response 200 OK**
```json
{
  "id": "svc-payment",
  "name": "Payment Service",
  "description": "Handles payment processing and transactions",
  "status": "active",
  "criticality": "high"
}
```

**Response 404 Not Found**
```json
{
  "detail": "Service not found"
}
```

### GET /api/services/{service_id}/dependencies
Get services that this service depends on

**Response 200 OK**
```json
[
  {
    "id": "svc-config",
    "name": "Config Service",
    "status": "active",
    "criticality": "high"
  }
]
```

### GET /api/services/{service_id}/dependents
Get services that depend on this service

**Response 200 OK**
```json
[
  {
    "id": "svc-checkout",
    "name": "Checkout Service",
    "status": "active",
    "criticality": "high"
  }
]
```

### GET /api/services/{service_id}/graph?depth={depth}
Get graph data for a service

**Query Parameters**
- `depth` (optional, default: 2) - Traversal depth

**Response 200 OK**
```json
{
  "nodes": [...],
  "relationships": [...]
}
```

---

## Incidents API

### GET /api/incidents
Get all incidents

**Response 200 OK**
```json
[
  {
    "id": "inc-005",
    "title": "Fraud Detection Alert",
    "severity": "critical",
    "status": "investigating",
    "created_at": "2026-08-26T16:20:13.271195",
    "description": "Unusual payment patterns detected requiring investigation"
  }
]
```

### GET /api/incidents/{incident_id}
Get a specific incident by ID

**Response 200 OK**
```json
{
  "id": "inc-005",
  "title": "Fraud Detection Alert",
  "severity": "critical",
  "status": "investigating",
  "created_at": "2026-08-26T16:20:13.271195",
  "description": "Unusual payment patterns detected requiring investigation"
}
```

**Response 404 Not Found**
```json
{
  "detail": "Incident not found"
}
```

### GET /api/incidents/{incident_id}/dependencies
Get dependency analysis for an incident

**Response 200 OK**
```json
{
  "incident": {...},
  "affected_services": [...]
}
```

---

## Graph API

### GET /api/graph/stats
Get graph statistics

**Response 200 OK**
```json
{
  "services": 25,
  "teams": 6,
  "incidents": 8,
  "databases": 10,
  "relationships": 273
}
```

### GET /api/graph/search?q={query}
Search for nodes in the graph

**Query Parameters**
- `q` - Search term

**Response 200 OK**
```json
[
  {
    "id": "svc-payment",
    "name": "Payment Service",
    "label": "Service"
  }
]
```

### GET /api/graph/node/{node_id}?node_type={type}
Get details for a specific node

**Query Parameters**
- `node_type` (optional, default: "Service") - Node type

**Response 200 OK**
```json
{
  "node": {...},
  "connections": [...]
}
```

**Response 404 Not Found**
```json
{
  "detail": "Node not found"
}
```

### POST /api/graph/impact-analysis
Analyze the impact of a service failure

**Request Body**
```json
{
  "service_id": "svc-payment",
  "depth": 3
}
```

**Response 200 OK**
```json
{
  "target_service": "svc-payment",
  "affected_services": [
    {
      "service_id": "svc-checkout",
      "service_name": "Checkout Service",
      "status": "active",
      "criticality": "high",
      "hops": 1
    }
  ],
  "total_affected": 1,
  "max_hops": 3
}
```

**Response 400 Bad Request**
```json
{
  "detail": "Invalid depth: 15. Must be an integer between 1 and 10."
}
```

### GET /api/graph/database/{database_id}/impact?depth={depth}
Get impact analysis for a database

**Query Parameters**
- `depth` (optional, default: 4) - Traversal depth

**Response 200 OK**
```json
[
  {
    "id": "svc-payment",
    "name": "Payment Service",
    "status": "active",
    "criticality": "high"
  }
]
```

---

## AI API

### POST /api/ai/analyze
Analyze a natural language question about the engineering graph

**Request Body**
```json
{
  "question": "How many services do we have?"
}
```

**Response 200 OK**
```json
{
  "answer": "There are 25 services in the NovaCart engineering system.",
  "evidence": [...],
  "query_type": "services_count"
}
```

**Response 200 OK (Error Fallback)**
```json
{
  "answer": "I encountered an error processing your question. Please try rephrasing or use the Explorer and Impact Analysis pages for detailed graph information.",
  "evidence": [],
  "query_type": "error"
}
```

---

## Health Check

### GET /health
Health check endpoint

**Response 200 OK**
```json
{
  "status": "healthy",
  "database": {
    "status": "healthy",
    "database": "connected"
  }
}
```

**Response 200 OK (Degraded)**
```json
{
  "status": "degraded",
  "database": {
    "status": "unhealthy",
    "error": "Connection refused"
  }
}
```

---

## Error Responses

### 500 Internal Server Error
```json
{
  "detail": "Error message from server"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 400 Bad Request
```json
{
  "detail": "Invalid request parameter"
}
```

---

## CORS Configuration
- **Allowed Origins**: `https://graph-pilot.vercel.app` (production), `*` (development)
- **Allowed Methods**: All
- **Allowed Headers**: All
- **Credentials**: Supported
