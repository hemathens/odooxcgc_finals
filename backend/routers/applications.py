from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from database import get_db
from routers.auth import get_current_user
from models import (
    User,
    UserRole,
    StudentProfile,
    Job,
    Application,
    JobCategory,
    ApplicationStatus,
)
from schemas import ApplyRequest, ApplicationResponse, AcceptOfferRequest

router = APIRouter()


def _skills_set(skills_json: str) -> set:
    try:
        return set(s.lower() for s in (json.loads(skills_json or "[]") or []))
    except Exception:
        return set()


def _tier_rank(tier: Optional[JobCategory]) -> int:
    if tier is None:
        return 0
    return {
        JobCategory.INTERNSHIP: 0,
        JobCategory.TIER3: 1,
        JobCategory.TIER2: 2,
        JobCategory.TIER1: 3,
    }[tier]


@router.get("/my", response_model=List[ApplicationResponse])
async def list_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can view their applications")

    apps = (
        db.query(Application)
        .filter(Application.student_id == current_user.id)
        .order_by(Application.created_at.desc())
        .all()
    )

    return [
        ApplicationResponse.model_validate(a)
        for a in apps
    ]


@router.post("/apply", response_model=ApplicationResponse)
async def apply_to_job(
    body: ApplyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can apply to jobs")

    job = db.query(Job).filter(Job.id == body.job_id, Job.is_active == True).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found or inactive")

    # Ensure student profile exists
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    if profile.placed_final:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are already placed (Tier-1 final)")

    # Eligibility checks
    if job.category != JobCategory.INTERNSHIP:
        if profile.cgpa is not None and job.min_cgpa is not None and profile.cgpa < job.min_cgpa:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="CGPA below required minimum")
        if profile.backlogs is not None and job.max_backlogs is not None and profile.backlogs > job.max_backlogs:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Backlogs exceed allowed maximum")
        required_skills = _skills_set(job.required_skills_json)
        student_skills = _skills_set(profile.skills_json)
        if required_skills and not required_skills.issubset(student_skills):
            missing = sorted(required_skills - student_skills)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required skills: {', '.join(missing)}",
            )

    # Restriction: once accepted somewhere, no applying to lower package jobs
    if profile.highest_accepted_package_lpa is not None and job.category != JobCategory.INTERNSHIP and job.package_lpa is not None:
        if job.package_lpa < profile.highest_accepted_package_lpa:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot apply to a job offering a lower package than your accepted offer",
            )

    # Prevent duplicate active applications to same job
    existing = (
        db.query(Application)
        .filter(
            Application.student_id == current_user.id,
            Application.job_id == job.id,
            Application.status.in_([ApplicationStatus.APPLIED, ApplicationStatus.SHORTLISTED, ApplicationStatus.OFFERED]),
        )
        .first()
    )
    if existing:
        return ApplicationResponse.model_validate(existing)

    app = Application(
        student_id=current_user.id,
        job_id=job.id,
        status=ApplicationStatus.APPLIED,
        offered_package_lpa=job.package_lpa,
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    return ApplicationResponse.model_validate(app)


@router.post("/accept", response_model=ApplicationResponse)
async def accept_offer(
    body: AcceptOfferRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can accept offers")

    app = (
        db.query(Application)
        .filter(Application.id == body.application_id, Application.student_id == current_user.id)
        .first()
    )
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    job = db.query(Job).filter(Job.id == app.job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    if profile.placed_final:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are already placed (Tier-1 final)")

    current_tier = profile.highest_accepted_tier
    new_tier = job.category if job.category != JobCategory.INTERNSHIP else current_tier

    # Restrict downgrades or same-tier re-acceptance for TIER jobs
    if job.category != JobCategory.INTERNSHIP and current_tier is not None:
        if _tier_rank(job.category) <= _tier_rank(current_tier):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No downgrade or same-tier acceptance allowed")

    # Enforce max 2 upgrades across tiers (T3->T2->T1)
    is_upgrade = (
        job.category in (JobCategory.TIER3, JobCategory.TIER2, JobCategory.TIER1)
        and current_tier is not None
        and _tier_rank(job.category) > _tier_rank(current_tier)
    )
    if is_upgrade and profile.upgrades_used >= 2:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Maximum of 2 upgrades already used")

    # Accept
    app.status = ApplicationStatus.ACCEPTED
    app.is_final_acceptance = bool(body.final and job.category == JobCategory.TIER1)
    app.offered_package_lpa = job.package_lpa

    # Update profile
    if job.category != JobCategory.INTERNSHIP:
        if is_upgrade:
            profile.upgrades_used += 1
        profile.highest_accepted_tier = job.category
        profile.highest_accepted_package_lpa = job.package_lpa

    if app.is_final_acceptance:
        profile.placed_final = True
        # Withdraw all other pending applications
        pending_statuses = [ApplicationStatus.APPLIED, ApplicationStatus.SHORTLISTED, ApplicationStatus.OFFERED]
        others = (
            db.query(Application)
            .filter(
                Application.student_id == current_user.id,
                Application.id != app.id,
                Application.status.in_(pending_statuses),
            )
            .all()
        )
        for other in others:
            other.status = ApplicationStatus.WITHDRAWN

    db.commit()
    db.refresh(app)

    return ApplicationResponse.model_validate(app)
