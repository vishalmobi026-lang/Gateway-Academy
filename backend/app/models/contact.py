from sqlalchemy import Column, Boolean
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

from app.models.base import BaseModel


class Contact(BaseModel):
    __tablename__ = "contacts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    full_name = Column(
        String(100),
        nullable=False
    )

    phone = Column(
        String(20),
        nullable=False
    )

    email = Column(
        String(100)
    )

    source = Column(
        String(50),
        nullable=False
    )
