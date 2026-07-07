from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional

class EnrollmentCreate(BaseModel):
    # Personal Profile
    student_name: str
    phone: str
    parents_no: str
    email: EmailStr
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    about_us: Optional[str] = None

    # Academics
    current_school_name: Optional[str] = None
    academic_board: Optional[str] = None
    current_grade: Optional[str] = None
    subjects: Optional[str] = None
    last_academic_results: Optional[str] = None
    programme: str

    # Interests
    area_of_interest: Optional[str] = None
    hobbies: Optional[str] = None
    future_goals: Optional[str] = None

class EnrollmentResponse(EnrollmentCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True