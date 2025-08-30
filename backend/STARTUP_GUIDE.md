# Placement Tracker - Backend Startup Guide

## Quick Start Commands

### 1. Activate Virtual Environment & Install Dependencies
```powershell
cd backend
.venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Create Environment File
Create `.env` file in backend directory:
```
DATABASE_URL=postgresql://placement_user:placement_password_2024@localhost:5432/placement_tracker
SECRET_KEY=your-super-secret-jwt-key-here-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:8080
```

### 3. Test Database Connection
```powershell
python test_db_connection.py
```

### 4. Start the Server
```powershell
python start_server.py
```

## Server Endpoints

Once running, your API will be available at:
- **API Base**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## Available API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/{user_id}` - Get user by ID

### Applications
- `GET /api/applications/` - Get user applications
- `POST /api/applications/` - Create new application
- `PUT /api/applications/{app_id}` - Update application
- `DELETE /api/applications/{app_id}` - Delete application

### Jobs
- `GET /api/jobs/` - Get available jobs
- `POST /api/jobs/` - Create new job (TPO/Company only)
- `GET /api/jobs/{job_id}` - Get job details
- `PUT /api/jobs/{job_id}` - Update job

### Tests
- `GET /api/tests/` - Get scheduled tests
- `POST /api/tests/` - Schedule new test
- `PUT /api/tests/{test_id}` - Update test details

### Notifications
- `GET /api/notifications/` - Get user notifications
- `POST /api/notifications/` - Create notification
- `PUT /api/notifications/{notif_id}/read` - Mark as read

## Database Schema

### Tables Created:
- `users` - User accounts (students, TPOs, companies)
- `student_profiles` - Extended student information
- `jobs` - Job postings
- `applications` - Student job applications

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Verify database credentials in `.env`
3. Check if `placement_tracker` database exists
4. Run `python test_db_connection.py` for diagnostics

### Server Startup Issues
1. Activate virtual environment first
2. Install all requirements: `pip install -r requirements.txt`
3. Check for port conflicts (default: 8000)
4. Verify `.env` file exists and is properly formatted

## Next Steps

1. **Start Backend**: Run `python start_server.py`
2. **Start Frontend**: In separate terminal, run frontend dev server
3. **Test Integration**: Visit http://localhost:8080 and test API calls
4. **View API Docs**: Visit http://localhost:8000/docs for interactive testing
