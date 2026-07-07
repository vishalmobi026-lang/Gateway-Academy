from sqlalchemy import Column, Integer, String
from app.models.base import BaseModel

class Question(BaseModel):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(100), nullable=False)
    question_text = Column(String(500), nullable=False)
    option1 = Column(String(100), nullable=False)
    option2 = Column(String(100), nullable=False)
    option3 = Column(String(100), nullable=False)
    option4 = Column(String(100), nullable=False)
    correct_index = Column(Integer, nullable=False)
