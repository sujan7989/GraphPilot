from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class IncidentBase(BaseModel):
    id: str
    title: str
    severity: str
    status: str = "open"
    created_at: Optional[datetime] = None
    description: Optional[str] = None


class Incident(IncidentBase):
    pass


class IncidentCreate(IncidentBase):
    pass


class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
