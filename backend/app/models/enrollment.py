from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import Date
from app.models.base import BaseModel


class Enrollment(BaseModel):
    __tablename__ = "enrollments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    # (page1)this first section for the student profile
    student_name = Column(
        String(100),
        nullable=False
    )

    phone = Column(
        String(20),
        nullable=False
    )
    parents_no=Column(
        String(20),
        nullable=False
    )

    email = Column(
        String(100),
        nullable=False
    )
    date_of_birth = Column(
        Date
    )
    gender = Column(
        String(20)
    )
    
    address = Column(
        Text
    )
    about_us = Column(
        String(100)
    )
    #(page) this section for the academics for the students
    
    current_school_name=Column(
        String(100)
    )
    
    academic_board=Column(
        String(100)
    )
    current_grade = Column(String(50))
    subjects=Column(String(200))
    last_academic_results = Column(String(50))
    
    programme = Column(
        String(100),
        nullable=False
    )
    #(page3) this is a section of interest  
    area_of_interest=Column(String(100))
    hobbies=(String(100))
    future_goals=Column(String(100))
    