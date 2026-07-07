from pydantic import BaseModel
from typing import List, Optional

class DisciplineBase(BaseModel):
    name: str


class DisciplineCreate(DisciplineBase):
    pass


class DisciplineResponse(DisciplineBase):
    id: int

    class Config:
        from_attributes = True