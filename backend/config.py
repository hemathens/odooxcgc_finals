from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://placement_user:placement_password_2024@localhost:5432/placement_tracker"
    
    # JWT
    secret_key: str = "your-super-secret-jwt-key-here-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Google OAuth
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    
    # CORS
    frontend_url: str = "http://localhost:8080"
    
    # Email (optional)
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()
