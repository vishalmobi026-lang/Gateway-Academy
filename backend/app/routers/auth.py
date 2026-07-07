# app/routers/auth.py

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User

from app.schemas.auth import (
    UserCreate,
    LoginRequest
)

from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)
@router.post("/register")
def register(
    data: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(
            User.username == data.username
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    user = User(
        username=data.username,
        password_hash=hash_password(
            data.password
        ),
        role="admin"
    )

    db.add(user)

    db.commit()

    return {
        "message": "Admin created successfully"
    }
@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.username == data.username
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token(
        {
            "sub": user.username,
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    # Return users without password_hash for safety
    return [{"id": u.id, "username": u.username, "role": u.role} for u in users]

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return {"message": "User deleted successfully"}
    return {"message": "User not found"}