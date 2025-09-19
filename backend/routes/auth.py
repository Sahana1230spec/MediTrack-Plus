from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database.db import SessionLocal
from backend.models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/check_uid")
def check_uid(uid: str = Query(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.rfid_uid == uid).first()
    return "true" if user and user.is_active else "false"
