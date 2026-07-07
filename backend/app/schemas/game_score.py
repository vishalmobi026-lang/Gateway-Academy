from pydantic import BaseModel
from datetime import datetime


class GameScoreCreate(BaseModel):
    name: str
    phone: str
    course: str

    score: int

    coupon_code: str | None = None

    discount: int | None = None
    
    
class GameScoreResponse(BaseModel):
    id: int

    name: str
    phone: str
    course: str

    score: int

    coupon_code: str | None

    discount: int | None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True