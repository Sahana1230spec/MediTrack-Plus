from fastapi import APIRouter

router = APIRouter()

@router.get("/reminders")
def get_reminders():
    # Example dummy data, replace with actual logic
    return [{"pill": "Paracetamol", "time": "08:00"}, {"pill": "Vitamin D", "time": "20:00"}]
