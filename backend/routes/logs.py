from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.models.log import Log
from backend.database.db import SessionLocal
from pydantic import BaseModel

router = APIRouter()

class LogCreate(BaseModel):
    user_uid: str
    pill_dispensed: bool
    device_id: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_log(log: LogCreate, db: Session = Depends(get_db)):
    # Find user by RFID UID
    user = db.query(Log).filter(Log.user_id == log.user_uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    new_log = Log(
        user_id=user.id,
        pill_dispensed=log.pill_dispensed,
        device_id=log.device_id
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return {"status": "Log created"}
