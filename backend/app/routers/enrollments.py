from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.enrollment import Enrollment
from app.schemas.enrollment import EnrollmentCreate, EnrollmentResponse

router = APIRouter(
    prefix="/enrollments",
    tags=["Enrollments"]
)

@router.post("/", response_model=EnrollmentResponse)
def create_enrollment(data: EnrollmentCreate, db: Session = Depends(get_db)):
    # Mapping the validated Pydantic data to the SQLAlchemy model
    enrollment = Enrollment(
        student_name=data.student_name,
        phone=data.phone,
        parents_no=data.parents_no,
        email=data.email,
        date_of_birth=data.date_of_birth,
        gender=data.gender,
        address=data.address,
        about_us=data.about_us,
        current_school_name=data.current_school_name,
        academic_board=data.academic_board,
        current_grade=data.current_grade,
        subjects=data.subjects,
        last_academic_results=data.last_academic_results,
        programme=data.programme,
        area_of_interest=data.area_of_interest,
        hobbies=data.hobbies,
        future_goals=data.future_goals
    )

    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment
@router.get("/")
def get_enrollments(
    db: Session = Depends(get_db)
):
    return db.query(Enrollment).all()

@router.delete("/{enrollment_id}")
def delete_enrollment(
    enrollment_id: int,
    db: Session = Depends(get_db)
):
    enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if enrollment:
        db.delete(enrollment)
        db.commit()
        return {"message": "Enrollment deleted successfully"}
    return {"message": "Enrollment not found"}