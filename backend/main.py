from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Import routers
from routers import auth, users, applications, tests, notifications, jobs

app = FastAPI(
    title="Placement Tracker API",
    description="Backend API for Placement Tracker - Career Services Platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(tests.router, prefix="/api/tests", tags=["Tests"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])

@app.get("/")
async def root():
    return {"message": "Placement Tracker API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "placement-tracker-api"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
