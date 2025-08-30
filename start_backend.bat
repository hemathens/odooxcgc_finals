@echo off
echo Starting Placement Tracker Backend...
cd backend
call .venv\Scripts\activate.bat
python start_server.py
pause
