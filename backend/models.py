from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Enum
from sqlalchemy.sql import func
from database import Base
import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TPO = "tpo"
    COMPANY = "company"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)  # Nullable for OAuth users
    role = Column(Enum(UserRole), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    provider = Column(String(20), default="local")  # "local" or "google"
    google_id = Column(String(100), nullable=True, unique=True)
    company_name = Column(String(200), nullable=True)  # For company users
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
