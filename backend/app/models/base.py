from sqlalchemy import Column
from sqlalchemy import Boolean
from sqlalchemy import DateTime

from datetime import datetime

from app.database import Base


class BaseModel(Base):
    __abstract__ = True

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    is_deleted = Column(
        Boolean,
        default=False,
        nullable=False
    )