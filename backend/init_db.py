from database import engine, Base
# Import models module to ensure all models are registered with Base
from models import User, StudentProfile, Job, Application


def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()
