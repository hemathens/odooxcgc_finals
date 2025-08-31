from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import User, StudentProfile, Job, Application, UserRole
from schemas import UserResponse
from routers.auth import get_current_user
from typing import List, Optional

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get user profile"""
    return UserResponse.model_validate(current_user)

@router.get("/")
async def get_users(
    role: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get users by role (for TPO dashboard)"""
    query = db.query(User)
    
    if role:
        try:
            enum_role = UserRole(role)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role filter")
        query = query.filter(User.role == enum_role)
    
    users = query.all()
    
    # Transform users data with additional info
    result = []
    for user in users:
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "company_name": user.company_name,
            "created_at": user.created_at
        }
        
        # Add student profile if exists
        if user.role == UserRole.STUDENT:
            student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
            if student_profile:
                user_data["student_profile"] = {
                    "cgpa": student_profile.cgpa,
                    "placed_final": student_profile.placed_final,
                    "highest_accepted_package_lpa": student_profile.highest_accepted_package_lpa,
                    "course": "Computer Science"  # Add course field to model later
                }
        
        result.append(user_data)
    
    return result

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dashboard statistics for TPO"""
    
    # Count total students
    total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()
    
    # Count placed students
    placed_students = db.query(User).join(StudentProfile).filter(
        User.role == UserRole.STUDENT,
        StudentProfile.placed_final == True
    ).count()
    
    # Count active companies
    active_companies = db.query(User).filter(
        User.role == UserRole.COMPANY,
        User.is_active == True
    ).count()
    
    # Count active jobs
    active_jobs = db.query(Job).filter(Job.is_active == True).count()
    
    # Count total applications
    total_applications = db.query(Application).count()
    
    return {
        "totalStudents": total_students,
        "placedStudents": placed_students,
        "activeCompanies": active_companies,
        "activeJobs": active_jobs,
        "totalApplications": total_applications,
        "upcomingTests": 0  # Will implement tests later
    }
