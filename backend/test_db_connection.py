#!/usr/bin/env python3
"""
Database connection test script for PostgreSQL setup
Run this after setting up PostgreSQL to verify everything works
"""

import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from config import settings

def test_connection():
    """Test PostgreSQL connection"""
    print("Testing PostgreSQL connection...")
    print(f"Database URL: {settings.database_url.replace('placement_password_2024', '***')}")
    
    try:
        # Create engine
        engine = create_engine(settings.database_url)
        
        # Test connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ Connection successful!")
            print(f"PostgreSQL version: {version}")
            
        # Test database exists
        with engine.connect() as connection:
            result = connection.execute(text("SELECT current_database();"))
            db_name = result.fetchone()[0]
            print(f"✅ Connected to database: {db_name}")
            
        return True
        
    except SQLAlchemyError as e:
        print(f"❌ Database connection failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def create_tables():
    """Create all database tables"""
    try:
        from database import engine, Base
        from models import User, StudentProfile, Job, Application
        
        print("\nCreating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # List created tables
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Created tables: {', '.join(tables)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to create tables: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("PostgreSQL Setup Verification")
    print("=" * 50)
    
    # Test connection
    if test_connection():
        # Create tables if connection successful
        create_tables()
        print("\n✅ PostgreSQL setup completed successfully!")
    else:
        print("\n❌ PostgreSQL setup failed. Please check your configuration.")
        sys.exit(1)
