from sqlalchemy import Column, Boolean
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

from app.models.base import BaseModel


class Enquiry(BaseModel):
    __tablename__ = "enquiries"

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

    message = Column(
        Text
    )

    source = Column(
        String(50),
        nullable=False
    )

    is_archived = Column(
        Boolean,
        default=False,
        nullable=False
    )