from pydantic import BaseModel
from datetime import datetime


class ContactCreate(BaseModel):
    full_name: str
    phone: str
    email: str
    message: str
    source: str = "contact"


class ContactWidgetCreate(BaseModel):
    full_name: str
    phone: str
    email: str
    source: str = "widget"


class ContactResponse(BaseModel):
    id: int
    full_name: str
    phone: str
    email: str | None
    message: str | None
    source: str
    is_archived: bool = False

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True