from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from models import UserRole, JobCategory, ApplicationStatus, MessageRole
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole
    company_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: UserRole

class GoogleLoginRequest(BaseModel):
    id_token: str
    role: UserRole

class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str] = None
    provider: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

# Student Profile
class StudentProfileBase(BaseModel):
    cgpa: float = 0.0
    skills: List[str] = Field(default_factory=list)
    backlogs: int = 0

class StudentProfileResponse(StudentProfileBase):
    id: int
    user_id: int
    upgrades_used: int
    highest_accepted_tier: Optional[JobCategory] = None
    highest_accepted_package_lpa: Optional[float] = None
    placed_final: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Job schemas
class JobBase(BaseModel):
    title: str
    description: Optional[str] = None
    company_name: str
    package_lpa: Optional[float] = None  # Required for non-internships
    category: JobCategory  # Must be consistent with package rules
    min_cgpa: float = 0.0
    required_skills: List[str] = Field(default_factory=list)
    max_backlogs: int = 999

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Application schemas
class ApplyRequest(BaseModel):
    job_id: int

class AcceptOfferRequest(BaseModel):
    application_id: int
    final: bool = False

class ApplicationResponse(BaseModel):
    id: int
    student_id: int
    job_id: int
    status: ApplicationStatus
    is_final_acceptance: bool
    offered_package_lpa: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Chat schemas
class ChatMessageRequest(BaseModel):
    content: str
    conversation_id: Optional[int] = None

class ChatMessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: MessageRole
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatConversationResponse(BaseModel):
    id: int
    user_id: int
    title: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessageResponse] = Field(default_factory=list)
    
    class Config:
        from_attributes = True
