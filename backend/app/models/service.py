from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ServiceBase(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    status: str = "active"
    criticality: str = "medium"


class Service(ServiceBase):
    pass


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    criticality: Optional[str] = None
