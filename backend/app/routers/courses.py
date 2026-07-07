from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Course, CourseDiscipline, CourseDeliverable
from app.schemas import CourseCreate, CourseResponse

router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)

@router.post("/", response_model=CourseResponse)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):

    db_course = Course(
        title=course.title,
        description=course.description,
        learning_mode=course.learning_mode,
        image_url=course.image_url,
        enroll_text=course.enroll_text,
        color=course.color,
        icon=course.icon
    )

    db.add(db_course)
    db.commit()
    db.refresh(db_course)

    # Save disciplines
    for discipline in course.disciplines:
        db_discipline = CourseDiscipline(
            name=discipline.name,
            course_id=db_course.id
        )
        db.add(db_discipline)

    # Save deliverables
    for deliverable in course.deliverables:
        db_deliverable = CourseDeliverable(
            name=deliverable.name,
            course_id=db_course.id
        )
        db.add(db_deliverable)

    db.commit()
    db.refresh(db_course)

    return db_course

@router.get("/", response_model=list[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

@router.put("/{course_id}", response_model=CourseResponse)
def update_course(course_id: int, course: CourseCreate, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    db_course.title = course.title
    db_course.description = course.description
    db_course.learning_mode = course.learning_mode
    db_course.image_url = course.image_url
    db_course.enroll_text = course.enroll_text
    db_course.color = course.color
    db_course.icon = course.icon

    db.query(CourseDiscipline).filter(CourseDiscipline.course_id == course_id).delete()
    db.query(CourseDeliverable).filter(CourseDeliverable.course_id == course_id).delete()

    for discipline in course.disciplines:
        db_discipline = CourseDiscipline(name=discipline.name, course_id=db_course.id)
        db.add(db_discipline)

    for deliverable in course.deliverables:
        db_deliverable = CourseDeliverable(name=deliverable.name, course_id=db_course.id)
        db.add(db_deliverable)

    db.commit()
    db.refresh(db_course)
    return db_course

@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    db_course = db.query(Course).filter(Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    db.delete(db_course)
    db.commit()
    return {"message": "Course deleted successfully"}