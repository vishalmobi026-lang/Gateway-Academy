from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.enquiry import Enquiry

from app.schemas.enquiry import (
    EnquiryCreate,
    EnquiryResponse
)

router = APIRouter(
    prefix="/enquiries",
    tags=["Enquiries"]
)


@router.post("/", response_model=EnquiryResponse)
def create_enquiry(
    data: EnquiryCreate,
    db: Session = Depends(get_db)
):
    enquiry = Enquiry(
        full_name=data.full_name,
        phone=data.phone,
        email=data.email,
        message=data.message,
        source=data.source
    )

    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)

    return enquiry

@router.get("/")
def get_enquiries(
    db: Session = Depends(get_db)
):
    # Return only non-archived enquiries
    return db.query(Enquiry).filter(Enquiry.is_archived == False).all()


@router.get("/archived")
def get_archived_enquiries(
    db: Session = Depends(get_db)
):
    return db.query(Enquiry).filter(Enquiry.is_archived == True).all()


@router.patch("/{enquiry_id}/archive")
def archive_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db)
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    enquiry.is_archived = True
    db.commit()
    return {"message": "Enquiry archived successfully"}


@router.patch("/{enquiry_id}/restore")
def restore_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db)
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    enquiry.is_archived = False
    db.commit()
    return {"message": "Enquiry restored successfully"}


@router.delete("/{enquiry_id}")
def delete_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db)
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if enquiry:
        db.delete(enquiry)
        db.commit()
        return {"message": "Enquiry permanently deleted"}
    return {"message": "Enquiry not found"}
