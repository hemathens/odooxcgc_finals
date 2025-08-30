#!/usr/bin/env python3
"""
Setup script for Placement Tracker Backend
Run this after installing dependencies and setting up .env file
"""

import os
import sys
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def check_env_file():
    """Check if .env file exists"""
    env_path = Path(".env")
    if not env_path.exists():
        print("❌ .env file not found")
        print("📝 Please copy .env.example to .env and fill in your credentials")
        return False
    print("✅ .env file found")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        "fastapi", "uvicorn", "sqlalchemy", "jose", 
        "passlib", "google-auth", "pydantic"
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace("-", "_"))
            print(f"✅ {package}")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package}")
    
    if missing_packages:
        print(f"\n📦 Install missing packages: pip install {' '.join(missing_packages)}")
        return False
    return True

def initialize_database():
    """Initialize database tables"""
    try:
        from init_db import create_tables
        create_tables()
        print("✅ Database initialized")
        return True
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up Placement Tracker Backend...\n")
    
    checks = [
        ("Python Version", check_python_version),
        ("Environment File", check_env_file),
        ("Dependencies", check_dependencies),
        ("Database", initialize_database),
    ]
    
    all_passed = True
    for name, check_func in checks:
        print(f"\n📋 Checking {name}...")
        if not check_func():
            all_passed = False
    
    if all_passed:
        print("\n🎉 Setup completed successfully!")
        print("🚀 Run: python main.py")
        print("📖 API docs: http://localhost:8000/docs")
    else:
        print("\n❌ Setup incomplete. Please fix the issues above.")

if __name__ == "__main__":
    main()
