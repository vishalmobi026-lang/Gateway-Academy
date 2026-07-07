from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from typing import List

from app.database import get_db
from app.models.question import Question
from app.schemas.question import QuestionCreate, QuestionResponse

router = APIRouter(
    prefix="/questions",
    tags=["Questions"]
)

@router.post("/", response_model=dict)
def save_questions(questions: List[QuestionCreate], db: Session = Depends(get_db)):
    for q in questions:
        # Check if question already exists to avoid duplicates
        exists = db.query(Question).filter(Question.question_text == q.q).first()
        if not exists:
            # Pad options with empty strings if less than 4
            opts = q.options + [""] * (4 - len(q.options))
            new_question = Question(
                topic=q.topic,
                question_text=q.q,
                option1=opts[0],
                option2=opts[1],
                option3=opts[2],
                option4=opts[3],
                correct_index=q.correct
            )
            db.add(new_question)
    
    db.commit()
    return {"message": "Questions saved successfully"}

@router.get("/fallback", response_model=List[QuestionResponse])
def get_fallback_questions(course: str, limit: int = 10, db: Session = Depends(get_db)):
    db_questions = db.query(Question).filter(Question.topic == course).order_by(func.random()).limit(limit).all()
    
    result = []
    for db_q in db_questions:
        options = [db_q.option1, db_q.option2, db_q.option3, db_q.option4]
        # Remove empty options if any
        options = [opt for opt in options if opt != ""]
        result.append(QuestionResponse(
            q=db_q.question_text,
            options=options,
            correct=db_q.correct_index
        ))
        
    return result
