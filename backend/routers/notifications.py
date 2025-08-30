from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_notifications():
    """Get user notifications - placeholder"""
    return {"message": "Notifications endpoint - to be implemented"}
