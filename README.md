# GraphPilot - AI-Powered Engineering Dependency Intelligence

GraphPilot is an AI-powered web application that helps engineering teams understand, visualize, and analyze their service dependencies using graph database technology. Built for NovaCart, a fictional e-commerce platform, it provides real-time insights into system architecture, impact analysis, and incident investigation.

## 🚀 Features

- **Interactive Graph Visualization**: Explore service dependencies with React Flow
- **Impact Analysis**: Predict cascade failures by analyzing dependency chains
- **Incident Tracking**: Monitor and investigate engineering incidents
- **AI-Powered Assistant**: Ask natural language questions about your graph
- **Real-time Dashboard**: Overview of services, teams, incidents, and databases
- **Multi-hop Traversals**: Deep dependency analysis across the graph

## 🏗️ Architecture

### Technology Stack

**Backend:**
- FastAPI - Modern Python web framework
- Neo4j Python Driver - Official Neo4j driver for CognoDB
- Pydantic - Data validation and settings management
- Uvicorn - ASGI server
- python-dotenv - Environment variable management

**Frontend:**
- React 18 - UI library
- TypeScript - Type safety
- Vite - Build tool and dev server
- Tailwind CSS - Styling
- React Router - Client-side routing
- TanStack Query - Data fetching and caching
- React Flow - Graph visualization
- Lucide React - Icons

**Database:**
- CognoDB Cloud - Neo4j-compatible graph database

### Graph Data Model

#### Node Types

| Node Type | Properties | Description |
|-----------|------------|-------------|
| Team | id, name, description | Engineering teams |
| Developer | id, name, role | Team members |
| Service | id, name, description, status, criticality | Microservices |
| API | id, name, method, endpoint | Service endpoints |
| Database | id, name, engine, environment | Data stores |
| Incident | id, title, severity, status, created_at, description | System incidents |
| Deployment | id, version, deployed_at, status | Deployment records |
| Environment | id, name | Deployment environments |

#### Relationship Types

| Relationship | From → To | Description |
|--------------|-----------|-------------|
| OWNS | Team → Service | Team owns a service |
| MEMBER_OF | Developer → Team | Developer belongs to team |
| DEPENDS_ON | Service → Service | Service depends on another |
| EXPOSES | Service → API | Service exposes an API |
| USES | Service → Database | Service uses a database |
| AFFECTS | Incident → Service | Incident affects a service |
| DEPLOYED_TO | Deployment → Environment | Deployment to environment |
| TRIGGERED | Deployment → Service | Deployment triggered service |

### Project Structure

```
GraphPilot/
├── backend/
│   ├── app/
│   │   ├── agents/          # AI Graph Analyst Agent
│   │   ├── api/             # FastAPI routers
│   │   ├── db/              # Database driver and health
│   │   ├── models/          # Pydantic models
│   │   ├── repositories/    # Data access layer
│   │   ├── services/        # Business logic layer
│   │   ├── config.py        # Configuration
│   │   └── main.py          # FastAPI app
│   ├── queries/             # Cypher query files
│   ├── scripts/
│   │   └── seed.py          # Idempotent seed script
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── .env                      # Environment variables (not committed)
├── .env.example             # Environment template
└── .gitignore
```

## 📊 Seed Data

The application is seeded with realistic data for NovaCart:

- **110 nodes**: 6 teams, 18 developers, 25 services, 28 APIs, 10 databases, 8 incidents, 12 deployments, 3 environments
- **273 relationships**: Service dependencies, team ownership, database usage, API exposure, incident impacts

### Key Services

- Payment Service (high criticality)
- Checkout Service (high criticality)
- Order Service (high criticality)
- Auth Service (high criticality)
- Inventory Service (high criticality)
- Fraud Service (high criticality)
- And 19 additional supporting services

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- CognoDB Cloud account

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
# Copy .env.example to .env in the project root
# Update with your CognoDB credentials
COGNODB_URI=bolt+s://your-cognodb-instance
COGNODB_USERNAME=your-username
COGNODB_PASSWORD=your-password
OPENAI_API_KEY=your-openai-key  # Optional, for AI features
CORS_ORIGINS=*  # Comma-separated list of allowed origins for production (e.g., https://your-frontend.com)
```

5. Seed the database:
```bash
python scripts/seed.py
```

6. Start the backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (optional for local development):
```bash
# Copy .env.example to .env in the frontend directory
# For local development, leave VITE_API_URL empty to use Vite proxy
# For production, set to your deployed backend URL
VITE_API_URL=https://your-backend-domain.com
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### Health
- `GET /health` - Health check with database status

### Services
- `GET /services` - List all services
- `GET /services/{id}` - Get service details
- `GET /services/{id}/dependencies` - Get service dependencies
- `GET /services/{id}/dependents` - Get services that depend on this service
- `GET /services/{id}/graph?depth=2` - Get dependency graph visualization data

### Incidents
- `GET /incidents` - List all incidents
- `GET /incidents/{id}` - Get incident details
- `GET /incidents/{id}/dependencies` - Get incident dependency chain

### Graph
- `GET /graph/stats` - Get graph statistics
- `GET /graph/search?q=query` - Search nodes in graph
- `GET /graph/node/{id}?node_type=Service` - Get node details
- `POST /graph/impact-analysis` - Analyze impact of service failure
- `GET /graph/database/{id}/impact?depth=4` - Analyze database impact

### AI Assistant
- `POST /ai/analyze` - Ask natural language questions about the graph

## 🔍 Cypher Queries

### Direct Dependencies
```cypher
MATCH (s1:Service {id: $service_id})-[:DEPENDS_ON]->(s2:Service)
RETURN s2
```

### Multi-hop Impact Analysis
```cypher
MATCH path = (s:Service {id: $service_id})-[:DEPENDS_ON*1..$depth]->(dependent:Service)
RETURN dependent, length(path) as hops
ORDER BY hops
```

### Database Impact
```cypher
MATCH (d:Database {id: $db_id})<-[:USES]-(s:Service)
RETURN s
```

### Incident Investigation
```cypher
MATCH (i:Incident {id: $incident_id})-[:AFFECTS]->(s:Service)
OPTIONAL MATCH (s)-[:DEPENDS_ON*1..3]->(affected:Service)
RETURN s, affected
```

## 🎯 Usage

### Dashboard
View an overview of your engineering graph including:
- Total services, teams, incidents, and databases
- Recent incidents with severity and status
- Service overview with status and criticality

### Graph Explorer
- Search and select services
- View service details (name, description, status, criticality)
- Explore dependencies and dependents
- Visualize dependency graph with React Flow
- Interactive graph with zoom, pan, and minimap

### Impact Analysis
- Select a service to analyze
- Set traversal depth (1-6 hops)
- View affected services sorted by hop distance
- Understand cascade failure scenarios

### Incidents
- View all incidents with severity and status
- See affected services for each incident
- Track incident resolution progress

### AI Assistant
- Ask natural language questions about your graph
- Examples:
  - "What services could be affected if Payment Service fails?"
  - "How many incidents have we had recently?"
  - "Which teams own the most services?"
  - "What databases does the Order Service use?"

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Configure build command: `npm run build`
4. Configure output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-backend-domain.com`

### Backend (Render/Railway)
1. Connect your GitHub repository to Render/Railway
2. Set root directory to `backend`
3. Configure build command: `pip install -r requirements.txt`
4. Configure start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `COGNODB_URI` - Your CognoDB connection URI
   - `COGNODB_USERNAME` - Your CognoDB username
   - `COGNODB_PASSWORD` - Your CognoDB password
   - `OPENAI_API_KEY` - Your OpenAI API key (optional, for AI features)
   - `CORS_ORIGINS` - Comma-separated list of allowed origins (e.g., `https://your-frontend-domain.com`)

**IMPORTANT CORS Configuration:**
- After deploying frontend to Vercel, update `CORS_ORIGINS` in backend with your actual Vercel URL
- For local development, you can use `CORS_ORIGINS=*`
- For production, use the exact Vercel domain (e.g., `https://graphpilot.vercel.app`)
- Multiple origins can be separated by commas: `https://graphpilot.vercel.app,https://www.graphpilot.com`

### Database (CognoDB Cloud)
- Database is already hosted on CognoDB Cloud
- Ensure your backend has the correct connection credentials

## 📝 License

This project is part of a take-home assignment for GraphPilot.

## 🤝 Contributing

This is a take-home assignment. For questions or feedback, please contact the hiring team.

## 📧 Support

For issues or questions, please open an issue in the repository.
