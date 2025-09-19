from fastapi import FastAPI
from backend.routes import auth, pill, user, logs
from backend.database.db import engine, Base

# Create all tables in DB
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MediTrack+ Backend", version="1.0")

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(pill.router, prefix="/api/pill", tags=["pill"])
app.include_router(user.router, prefix="/api/user", tags=["user"])
app.include_router(logs.router, prefix="/api/logs", tags=["logs"])

@app.get("/")
async def root():
    return {"message": "MediTrack+ Backend is running"}
