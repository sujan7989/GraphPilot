from fastapi import APIRouter, HTTPException
from app.agents.graph_agent import GraphAnalystAgent
from app.models.graph import AIAnalysisRequest, AIAnalysisResult

router = APIRouter(prefix="/ai", tags=["ai"])
agent = GraphAnalystAgent()


@router.post("/analyze", response_model=AIAnalysisResult)
async def analyze_question(request: AIAnalysisRequest):
    """Analyze a natural language question about the engineering graph"""
    try:
        return agent.analyze(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
