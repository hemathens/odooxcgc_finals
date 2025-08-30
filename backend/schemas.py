from pydantic import BaseModel, EmailStr
from typing import Optional
from models import UserRole
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
