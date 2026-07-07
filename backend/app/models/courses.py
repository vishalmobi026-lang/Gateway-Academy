from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    learning_mode = Column(String(100))
    image_url = Column(String(500))
    enroll_text = Column(String(50), default="Enroll Now")
    color = Column(String(50), default="#1a3af5")
    icon = Column(String(50), default="FaUserGraduate")

    disciplines = relationship(
        "CourseDiscipline",
        back_populates="course",
        cascade="all, delete-orphan"
    )

    deliverables = relationship(
        "CourseDeliverable",
        back_populates="course",
        cascade="all, delete-orphan"
    )