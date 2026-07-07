from pydantic import BaseModel
from typing import List

class QuestionBase(BaseModel):
    q: str
    options: List[str]
    correct: int

class QuestionCreate(QuestionBase):
    topic: str

class QuestionResponse(QuestionBase):
    pass
