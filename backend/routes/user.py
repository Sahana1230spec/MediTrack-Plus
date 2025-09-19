from fastapi import APIRouter, Depends
from backend.database.db import SessionLocal
from sqlalchemy.orm import Session

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create")
def create_user(username: str, email: str, password: str, db: Session = Depends(get_db)):
    # Add your user creation logic here (placeholder)
    return {"msg": f"User {username} created"}
