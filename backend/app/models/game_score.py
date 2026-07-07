from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.models.base import BaseModel


class GameScore(BaseModel):
    __tablename__ = "game_scores"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    phone = Column(
        String(20),
        nullable=False
    )

    course = Column(
        String(100),
        nullable=False
    )

    score = Column(
        Integer,
        nullable=False
    )

    coupon_code = Column(
        String(50)
    )

    discount = Column(
        Integer
    )
