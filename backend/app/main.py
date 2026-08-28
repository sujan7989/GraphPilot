from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import services, incidents, graph, ai
from app.db.health import check_database_health
from app.config import get_settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title="GraphPilot API",
    description="AI-Powered Engineering Dependency Intelligence",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(",") if settings.cors_origins != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(services.router, prefix="/api")
app.include_router(incidents.router, prefix="/api")
app.include_router(graph.router, prefix="/api")
app.include_router(ai.router, prefix="/api")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    db_health = check_database_health()
    return {
        "status": "healthy" if db_health["status"] == "healthy" else "degraded",
        "database": db_health
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "GraphPilot API - AI-Powered Engineering Dependency Intelligence",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
