**Team Number: 41**
**Team Name: Drakshushi**

# Placement Preparation Tracker

_A Final Round Submission for ODOO X CGC Mohali Hackathon_

---

## 📝 Project Overview

A unified platform supporting the placement journey of final-year undergraduates at CGC.  
Features:  
- Resume Builder (templates, auto-fill, PDF export)
- Job/Internship Application Tracking
- Placement Rules Enforcement
- Practice Exams: Aptitude, Reasoning, Coding, English, Interview
- Analytics & Notifications
- Timeline, Placement History, and Offer Management

---

## 👥 Roles

- **Student:**  
  Dashboard, profile, resume building, job browsing, tests, applications, progress tracking

- **TPO/Admin:**  
  Manage placement drives, job postings, rules enforcement, analytics, reports, student oversight

- **Recruiter/Company:**  
  Post jobs/internships, filter and shortlist, interview scheduling, manage offers

---

## ⚙️ Tech Stack

- **Backend:** Django REST Framework, PostgreSQL, SimpleJWT
- **Frontend:** ReactJS
- **Storage:** Django Storages (configurable for resume/media uploads)
- **Deployment Ready:** WSGI/ASGI compatible

---

## 🚀 Setup & Run

### Backend
```
git clone https://github.com/hemathens/odooxcgc_finals
cd <your-backend-folder>
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate.bat (Windows)
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
### Frontend
```
cd placement-frontend
npm install
npm start
```

- App: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000](http://localhost:8000)

---

## 🔗 Key API Endpoints

| Endpoint                   | Method | Purpose                           |
|----------------------------|--------|-----------------------------------|
| /api/users/register/       | POST   | Register new user                 |
| /api/users/login/          | POST   | Login and get JWT tokens          |
| /api/users/profile/        | GET    | Logged-in user profile            |
| /api/jobs/                 | GET/POST| Browse/post jobs                  |
| /api/applications/         | GET/POST| Track/manage applications         |

---

## ⭐ Features Demo

- All hackathon features included as per [CGC-Finale-Round-Problem-Statements.pdf](CGC-Finale-Round-Problem-Statements.pdf)
- Intuitive dashboards and workflows for all user types
- Placement rules and eligibility enforced at backend
- Notification via pop-ups and APIs  
- Analytics and progress visualization

---

## 📄 Submission & Credits

Developed by Team **hemathens**,  
For ODOO X CGC Mohali Finale  
See all code, issues, and updates on [GitHub](https://github.com/hemathens/odooxcgc_finals)

Contact: [your-email@domain.com]  
Raise issues or feature requests via GitHub.
