from pydantic import BaseModel
from typing import List, Optional
class DeliverableBase(BaseModel):
    name: str


class DeliverableCreate(DeliverableBase):
    pass


class DeliverableResponse(DeliverableBase):
    id: int

    class Config:
        from_attributes = True