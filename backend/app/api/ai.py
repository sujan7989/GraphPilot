from fastapi import APIRouter, HTTPException
from app.agents.graph_agent import GraphAnalystAgent
from app.models.graph import AIAnalysisRequest, AIAnalysisResult
import logging

router = APIRouter(prefix="/ai", tags=["ai"])
agent = GraphAnalystAgent()
logger = logging.getLogger(__name__)


@router.post("/analyze", response_model=AIAnalysisResult)
async def analyze_question(request: AIAnalysisRequest):
    """Analyze a natural language question about the engineering graph"""
    try:
        result = agent.analyze(request)
        return result
    except Exception as e:
        logger.error(f"AI analysis error: {e}", exc_info=True)
        # Return a graceful fallback instead of 500
        return AIAnalysisResult(
            answer="I encountered an error processing your question. Please try rephrasing or use the Explorer and Impact Analysis pages for detailed graph information.",
            evidence=[],
            query_type="error"
        )
