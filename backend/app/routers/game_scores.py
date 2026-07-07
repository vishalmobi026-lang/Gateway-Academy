from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db

from app.models.game_score import GameScore

from app.schemas.game_score import (
    GameScoreCreate,
    GameScoreResponse
)

router = APIRouter(
    prefix="/scores",
    tags=["Game Scores"]
)


@router.post("/", response_model=GameScoreResponse)
def create_score(
    data: GameScoreCreate,
    db: Session = Depends(get_db)
):
    score = GameScore(
        name=data.name,
        phone=data.phone,
        course=data.course,
        score=data.score,
        coupon_code=data.coupon_code,
        discount=data.discount
    )

    db.add(score)
    db.commit()
    db.refresh(score)

    return score


@router.get("/")
def get_scores(
    db: Session = Depends(get_db)
):
    return db.query(GameScore).all()


@router.get("/verify/{coupon_code}")
def verify_coupon(
    coupon_code: str,
    db: Session = Depends(get_db)
):
    # Case-insensitive match so GTEC-B2-U5YP == gtec-b2-u5yp == Gtec-B2-U5yp
    record = db.query(GameScore).filter(
        func.lower(GameScore.coupon_code) == coupon_code.lower()
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="INVALID_HASH: No matching record found")
    return record


@router.delete("/{score_id}")
def delete_score(
    score_id: int,
    db: Session = Depends(get_db)
):
    score = db.query(GameScore).filter(GameScore.id == score_id).first()
    if score:
        db.delete(score)
        db.commit()
        return {"message": "Score deleted successfully"}
    return {"message": "Score not found"}