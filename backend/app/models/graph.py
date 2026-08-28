from pydantic import BaseModel
from typing import List, Optional, Any, Dict


class Node(BaseModel):
    id: str
    label: str
    properties: Dict[str, Any]


class Relationship(BaseModel):
    id: Optional[str] = None
    type: str
    source: str
    target: str
    properties: Dict[str, Any]


class GraphData(BaseModel):
    nodes: List[Node]
    relationships: List[Relationship]


class ImpactAnalysisRequest(BaseModel):
    service_id: str
    depth: int = 4


class ImpactAnalysisResult(BaseModel):
    target_service: str
    affected_services: List[Dict[str, Any]]
    total_affected: int
    max_hops: int


class AIAnalysisRequest(BaseModel):
    question: str


class AIAnalysisResult(BaseModel):
    answer: str
    evidence: List[Dict[str, Any]]
    query_type: str
