#!/usr/bin/env python3
"""
Database Data Viewer - View all your PostgreSQL data
"""

from sqlalchemy import text
from database import engine, SessionLocal
from models import User, StudentProfile, Job, Application
import json
from datetime import datetime

def format_datetime(dt):
    """Format datetime for display"""
    if dt:
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    return "None"

def view_users():
    """Display all users"""
    print("\n" + "="*60)
    print("👥 USERS TABLE")
    print("="*60)
    
    db = SessionLocal()
    users = db.query(User).all()
    
    if not users:
        print("No users found.")
        db.close()
        return
    
    print(f"Total Users: {len(users)}")
    print("-" * 60)
    
    for user in users:
        print(f"ID: {user.id}")
        print(f"Name: {user.name}")
        print(f"Email: {user.email}")
        print(f"Role: {user.role}")
        print(f"Provider: {user.provider}")
        print(f"Active: {user.is_active}")
        print(f"Created: {format_datetime(user.created_at)}")
        if user.company_name:
            print(f"Company: {user.company_name}")
        print("-" * 40)
    
    db.close()

def view_student_profiles():
    """Display all student profiles"""
    print("\n" + "="*60)
    print("🎓 STUDENT PROFILES TABLE")
    print("="*60)
    
    db = SessionLocal()
    profiles = db.query(StudentProfile).all()
    
    if not profiles:
        print("No student profiles found.")
        db.close()
        return
    
    print(f"Total Student Profiles: {len(profiles)}")
    print("-" * 60)
    
    for profile in profiles:
        print(f"ID: {profile.id}")
        print(f"User ID: {profile.user_id}")
        print(f"CGPA: {profile.cgpa}")
        print(f"Backlogs: {profile.backlogs}")
        print(f"Upgrades Used: {profile.upgrades_used}")
        print(f"Placed: {profile.placed_final}")
        if profile.highest_accepted_tier:
            print(f"Highest Tier: {profile.highest_accepted_tier}")
        if profile.highest_accepted_package_lpa:
            print(f"Highest Package: {profile.highest_accepted_package_lpa} LPA")
        print("-" * 40)
    
    db.close()

def view_jobs():
    """Display all jobs"""
    print("\n" + "="*60)
    print("💼 JOBS TABLE")
    print("="*60)
    
    db = SessionLocal()
    jobs = db.query(Job).all()
    
    if not jobs:
        print("No jobs found.")
        db.close()
        return
    
    print(f"Total Jobs: {len(jobs)}")
    print("-" * 60)
    
    for job in jobs:
        print(f"ID: {job.id}")
        print(f"Title: {job.title}")
        print(f"Company: {job.company_name}")
        print(f"Category: {job.category}")
        if job.package_lpa:
            print(f"Package: {job.package_lpa} LPA")
        print(f"Min CGPA: {job.min_cgpa}")
        print(f"Max Backlogs: {job.max_backlogs}")
        print(f"Active: {job.is_active}")
        print(f"Created: {format_datetime(job.created_at)}")
        print("-" * 40)
    
    db.close()

def view_applications():
    """Display all applications"""
    print("\n" + "="*60)
    print("📋 APPLICATIONS TABLE")
    print("="*60)
    
    db = SessionLocal()
    applications = db.query(Application).all()
    
    if not applications:
        print("No applications found.")
        db.close()
        return
    
    print(f"Total Applications: {len(applications)}")
    print("-" * 60)
    
    for app in applications:
        print(f"ID: {app.id}")
        print(f"Student ID: {app.student_id}")
        print(f"Job ID: {app.job_id}")
        print(f"Status: {app.status}")
        print(f"Final Acceptance: {app.is_final_acceptance}")
        if app.offered_package_lpa:
            print(f"Offered Package: {app.offered_package_lpa} LPA")
        print(f"Applied: {format_datetime(app.created_at)}")
        print("-" * 40)
    
    db.close()

def view_database_stats():
    """Show database statistics"""
    print("\n" + "="*60)
    print("📊 DATABASE STATISTICS")
    print("="*60)
    
    db = SessionLocal()
    
    user_count = db.query(User).count()
    student_count = db.query(User).filter(User.role == 'student').count()
    tpo_count = db.query(User).filter(User.role == 'tpo').count()
    company_count = db.query(User).filter(User.role == 'company').count()
    
    profile_count = db.query(StudentProfile).count()
    job_count = db.query(Job).count()
    active_job_count = db.query(Job).filter(Job.is_active == True).count()
    application_count = db.query(Application).count()
    
    print(f"Total Users: {user_count}")
    print(f"  - Students: {student_count}")
    print(f"  - TPOs: {tpo_count}")
    print(f"  - Companies: {company_count}")
    print(f"Student Profiles: {profile_count}")
    print(f"Total Jobs: {job_count}")
    print(f"Active Jobs: {active_job_count}")
    print(f"Applications: {application_count}")
    
    db.close()

def view_raw_sql():
    """Execute custom SQL queries"""
    print("\n" + "="*60)
    print("🔍 RAW SQL QUERIES")
    print("="*60)
    
    queries = [
        ("List all tables", "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"),
        ("Database version", "SELECT version();"),
        ("Current database", "SELECT current_database();"),
        ("Current user", "SELECT current_user;"),
    ]
    
    with engine.connect() as connection:
        for description, query in queries:
            print(f"\n{description}:")
            result = connection.execute(text(query))
            for row in result:
                print(f"  {row[0]}")

def main():
    """Main function to display all data"""
    print("="*60)
    print("🗄️  PLACEMENT TRACKER DATABASE VIEWER")
    print("="*60)
    
    try:
        view_database_stats()
        view_raw_sql()
        view_users()
        view_student_profiles()
        view_jobs()
        view_applications()
        
        print("\n" + "="*60)
        print("✅ Database viewing completed successfully!")
        print("="*60)
        
    except Exception as e:
        print(f"❌ Error viewing database: {e}")

if __name__ == "__main__":
    main()
