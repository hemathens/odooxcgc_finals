from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json

from database import get_db
from routers.auth import get_current_user
from models import User, UserRole, Job, JobCategory
from schemas import JobCreate, JobResponse

router = APIRouter()


def compute_category_from_package(package_lpa: float) -> JobCategory:
    if package_lpa >= 15.0:
        return JobCategory.TIER1
    if 8.0 <= package_lpa < 15.0:
        return JobCategory.TIER2
    if 3.0 <= package_lpa < 8.0:
        return JobCategory.TIER3
    # Below 3 LPA doesn't fit defined tiers; reject for non-internships
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Package must be >= 3 LPA for Tier-3/2/1 jobs",
    )


def ensure_category_rules(payload: JobCreate) -> JobCategory:
    if payload.category == JobCategory.INTERNSHIP:
        # Internship can have None or any stipend; we don't enforce package range
        return JobCategory.INTERNSHIP
    if payload.package_lpa is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="package_lpa is required for non-internship jobs",
        )
    computed = compute_category_from_package(payload.package_lpa)
    if computed != payload.category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category {payload.category} does not match package {payload.package_lpa} LPA; expected {computed}",
        )
    return computed


@router.post("/", response_model=JobResponse)
async def create_job(
    body: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in (UserRole.TPO, UserRole.COMPANY):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only TPO or Company can create jobs")

    category = ensure_category_rules(body)

    job = Job(
        title=body.title,
        description=body.description,
        company_name=body.company_name,
        package_lpa=body.package_lpa,
        category=category,
        min_cgpa=body.min_cgpa,
        required_skills_json=json.dumps(body.required_skills or []),
        max_backlogs=body.max_backlogs,
        is_active=True,
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return JobResponse(
        id=job.id,
        title=job.title,
        description=job.description,
        company_name=job.company_name,
        package_lpa=job.package_lpa,
        category=job.category,
        min_cgpa=job.min_cgpa,
        required_skills=json.loads(job.required_skills_json or "[]"),
        max_backlogs=job.max_backlogs,
        is_active=job.is_active,
        created_at=job.created_at,
    )


@router.get("/", response_model=List[JobResponse])
async def list_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.is_active == True).order_by(Job.created_at.desc()).all()
    out: List[JobResponse] = []
    for job in jobs:
        out.append(
            JobResponse(
                id=job.id,
                title=job.title,
                description=job.description,
                company_name=job.company_name,
                package_lpa=job.package_lpa,
                category=job.category,
                min_cgpa=job.min_cgpa,
                required_skills=json.loads(job.required_skills_json or "[]"),
                max_backlogs=job.max_backlogs,
                is_active=job.is_active,
                created_at=job.created_at,
            )
        )
    return out

