from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.models.base import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(
        String(100),
        unique=True,
        nullable=False
    )

    password_hash = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(50),
        default="admin"
    )