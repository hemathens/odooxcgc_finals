from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_applications():
    """Get user applications - placeholder"""
    return {"message": "Applications endpoint - to be implemented"}
