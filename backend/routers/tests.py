from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_tests():
    """Get user tests - placeholder"""
    return {"message": "Tests endpoint - to be implemented"}
