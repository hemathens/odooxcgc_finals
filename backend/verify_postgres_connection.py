#!/usr/bin/env python3
"""
PostgreSQL Connection Verification Script
Run this to confirm your backend is connected to PostgreSQL
"""

import sys
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.exc import SQLAlchemyError
from config import settings
from database import engine, SessionLocal
from models import User, StudentProfile, Job, Application

def test_basic_connection():
    """Test basic PostgreSQL connection"""
    print("🔍 Testing PostgreSQL Connection...")
    print(f"Database URL: {settings.database_url.replace('placement_password_2024', '***')}")
    
    try:
        with engine.connect() as connection:
            # Get PostgreSQL version
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ Connected to PostgreSQL!")
            print(f"   Version: {version.split(',')[0]}")
            
            # Get current database name
            result = connection.execute(text("SELECT current_database();"))
            db_name = result.fetchone()[0]
            print(f"   Database: {db_name}")
            
            # Get current user
            result = connection.execute(text("SELECT current_user;"))
            user = result.fetchone()[0]
            print(f"   User: {user}")
            
        return True
    except SQLAlchemyError as e:
        print(f"❌ Connection failed: {e}")
        return False

def verify_tables():
    """Verify that tables exist and show their structure"""
    print("\n🔍 Verifying Database Tables...")
    
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        if not tables:
            print("⚠️  No tables found. Creating tables...")
            from database import Base
            Base.metadata.create_all(bind=engine)
            tables = inspector.get_table_names()
        
        print(f"✅ Found {len(tables)} tables:")
        for table in tables:
            columns = inspector.get_columns(table)
            print(f"   📋 {table} ({len(columns)} columns)")
            for col in columns[:3]:  # Show first 3 columns
                print(f"      - {col['name']}: {col['type']}")
            if len(columns) > 3:
                print(f"      ... and {len(columns) - 3} more columns")
        
        return True
    except Exception as e:
        print(f"❌ Table verification failed: {e}")
        return False

def test_crud_operations():
    """Test basic CRUD operations"""
    print("\n🔍 Testing Database Operations...")
    
    try:
        db = SessionLocal()
        
        # Count existing users
        user_count = db.query(User).count()
        print(f"✅ Current users in database: {user_count}")
        
        # Test insert (if no users exist)
        if user_count == 0:
            print("   Creating test user...")
            test_user = User(
                name="Test User",
                email="test@example.com",
                role="student",
                password_hash="test_hash"
            )
            db.add(test_user)
            db.commit()
            print("   ✅ Test user created successfully!")
            
            # Clean up test user
            db.delete(test_user)
            db.commit()
            print("   ✅ Test user removed successfully!")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ CRUD operations failed: {e}")
        return False

def check_vs_sqlite():
    """Confirm we're NOT using SQLite"""
    print("\n🔍 Confirming Database Type...")
    
    if "postgresql" in settings.database_url.lower():
        print("✅ Using PostgreSQL (not SQLite)")
        
        # Check if old SQLite file exists
        import os
        sqlite_file = "placement_tracker.db"
        if os.path.exists(sqlite_file):
            print(f"⚠️  Old SQLite file found: {sqlite_file}")
            print("   You can safely delete this file now")
        else:
            print("✅ No old SQLite files found")
        
        return True
    else:
        print("❌ Still using SQLite! Check your configuration")
        return False

def main():
    """Run all verification tests"""
    print("=" * 60)
    print("POSTGRESQL CONNECTION VERIFICATION")
    print("=" * 60)
    
    tests = [
        ("Basic Connection", test_basic_connection),
        ("Database Type Check", check_vs_sqlite),
        ("Table Verification", verify_tables),
        ("CRUD Operations", test_crud_operations)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        if test_func():
            passed += 1
        else:
            print(f"❌ {test_name} failed!")
    
    print("\n" + "=" * 60)
    print(f"VERIFICATION RESULTS: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 PostgreSQL connection verified successfully!")
        print("Your backend is properly connected to PostgreSQL database.")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
    
    print("=" * 60)

if __name__ == "__main__":
    main()
