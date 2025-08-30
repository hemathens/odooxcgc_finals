#!/usr/bin/env python3
"""
Server startup script with database initialization
"""

import uvicorn
from database import engine, Base
from models import User, StudentProfile, Job, Application
from config import settings

def initialize_database():
    """Initialize database tables"""
    try:
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False

def start_server():
    """Start the FastAPI server"""
    print("Starting Placement Tracker API server...")
    print(f"Server will be available at: http://localhost:8000")
    print(f"API Documentation: http://localhost:8000/docs")
    print(f"Alternative docs: http://localhost:8000/redoc")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    print("=" * 60)
    print("PLACEMENT TRACKER - BACKEND SERVER")
    print("=" * 60)
    
    # Initialize database first
    if initialize_database():
        print("\n" + "=" * 60)
        start_server()
    else:
        print("❌ Cannot start server due to database issues")
        exit(1)
