from pydantic import BaseModel
from typing import List, Optional

from app.schemas.Discipline import DisciplineCreate, DisciplineResponse
from app.schemas.Deliverable import DeliverableCreate, DeliverableResponse
class CourseCreate(BaseModel):
    title: str
    description: str
    learning_mode: str
    image_url: str
    enroll_text: str = "Enroll Now"
    color: str = "#1a3af5"
    icon: str = "FaUserGraduate"

    disciplines: List[DisciplineCreate] = []
    deliverables: List[DeliverableCreate] = []
    
    
class CourseResponse(BaseModel):
    id: int
    title: str
    description: str
    learning_mode: str
    image_url: str
    enroll_text: str
    color: str
    icon: str

    disciplines: List[DisciplineResponse] = []
    deliverables: List[DeliverableResponse] = []

    class Config:
        from_attributes = True