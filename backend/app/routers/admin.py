from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User
from app.models.enrollment import Enrollment
from app.models.enquiry import Enquiry
from app.models.game_score import GameScore

from app.utils.dependencies import (
    get_current_admin
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/dashboard")
def dashboard(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):

    return {
        "admin": current_user.username,
        "users": db.query(User).count(),
        "enrollments": db.query(Enrollment).count(),
        "enquiries": db.query(Enquiry).count(),
        "scores": db.query(GameScore).count()
    }