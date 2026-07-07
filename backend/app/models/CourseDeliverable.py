from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class CourseDeliverable(Base):
    __tablename__ = "course_deliverables"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"))

    course = relationship("Course", back_populates="deliverables")