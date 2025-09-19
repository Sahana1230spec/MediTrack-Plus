from sqlalchemy import Column, Integer, String, Boolean
from backend.database.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    rfid_uid = Column(String, unique=True, index=True)  # RFID tag UID
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
