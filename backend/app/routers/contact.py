from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.contact import Enquiry

from app.schemas.contact import (
    ContactCreate,
    ContactResponse
)
from backend.app.models.contact import Contact
from backend.app.schemas.enquiry import EnquiryResponse
router = APIRouter(
    prefix="/contacts",
    tags=["Contacts"]
)


@router.post("/", response_model=ContactResponse)
def create_contact(
    data: ContactCreate,
    db: Session = Depends(get_db)
):
    contact = Contact(
        full_name=data.full_name,
        phone=data.phone,
        email=data.email,
        message=data.message,
        source=data.source
    )

    db.add(contact)
    db.commit()
    db.refresh(contact)

    return contact


@router.get("/")
def get_contacts(
    db: Session = Depends(get_db)
):
    # Return only non-archived contacts
    return db.query(Contact).filter(Contact.is_archived == False).all()


@router.get("/archived")
def get_archived_contacts(
    db: Session = Depends(get_db)
):
    return db.query(Contact).filter(Contact.is_archived == True).all()


@router.patch("/{contact_id}/archive")
def archive_contact(
    contact_id: int,
    db: Session = Depends(get_db)
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    contact.is_archived = True
    db.commit()
    return {"message": "Contact archived successfully"}


@router.patch("/{contact_id}/restore")
def restore_contact(
    contact_id: int,
    db: Session = Depends(get_db)
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    contact.is_archived = False
    db.commit()
    return {"message": "Contact restored successfully"}


@router.delete("/{contact_id}")
def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db)
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
    return {"message": "Contact permanently deleted"}