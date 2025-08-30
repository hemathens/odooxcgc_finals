# Backend Setup Guide

## Step 1: Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt
```

## Step 2: Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` file and add your Google OAuth credentials:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```

## Step 3: Initialize Database

```bash
python init_db.py
```

## Step 4: Run the API Server

```bash
python main.py
```

The API will be available at:
- **API Server**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## Step 5: Test Authentication

Use the interactive API docs at http://localhost:8000/docs to test:
1. Register a new user
2. Login with credentials
3. Test Google OAuth flow
