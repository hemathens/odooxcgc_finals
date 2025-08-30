# PostgreSQL Database Management Options

## 🖥️ GUI Tools (Recommended)

### 1. pgAdmin 4 (Already Installed)
- **Location**: Installed with PostgreSQL
- **Access**: Search "pgAdmin" in Start Menu
- **Connection Details**:
  - Host: localhost
  - Port: 5432
  - Database: placement_tracker
  - Username: placement_user
  - Password: placement_password_2024

### 2. DBeaver (Free Alternative)
- **Download**: https://dbeaver.io/download/
- **Features**: Universal database tool, great interface
- **Setup**: Add PostgreSQL connection with same credentials

### 3. DataGrip (JetBrains - Paid)
- **Download**: https://www.jetbrains.com/datagrip/
- **Features**: Professional database IDE

## 🌐 Web-Based Options

### 1. Adminer (Lightweight)
```bash
# Download adminer.php and run with PHP
php -S localhost:8080 adminer.php
```

### 2. phpPgAdmin
- Web-based PostgreSQL administration
- Requires Apache/Nginx + PHP setup

## 📱 Command Line Tools

### 1. psql (Built-in)
```bash
# Connect to database
psql -U placement_user -d placement_tracker

# Common commands
\dt          # List tables
\d users     # Describe table
SELECT * FROM users LIMIT 5;
```

### 2. pgcli (Enhanced psql)
```bash
pip install pgcli
pgcli postgresql://placement_user:placement_password_2024@localhost:5432/placement_tracker
```

## 🐍 Python Scripts

### Custom Database Viewer
```bash
cd backend
.venv\Scripts\activate
python view_database_data.py
```

### Interactive Python Shell
```python
from database import SessionLocal
from models import User, Job, Application

db = SessionLocal()
users = db.query(User).all()
for user in users:
    print(f"{user.name} - {user.email}")
```

## 🔧 Quick Access Commands

### View All Data
```bash
# Method 1: Custom script
python view_database_data.py

# Method 2: Direct SQL
psql -U placement_user -d placement_tracker -c "SELECT * FROM users;"

# Method 3: pgAdmin GUI
# Open pgAdmin → Connect to server → Browse tables
```

### Common SQL Queries
```sql
-- Count all records
SELECT 
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM jobs) as jobs,
  (SELECT COUNT(*) FROM applications) as applications;

-- View recent applications
SELECT u.name, j.title, a.status, a.created_at 
FROM applications a
JOIN users u ON a.student_id = u.id
JOIN jobs j ON a.job_id = j.id
ORDER BY a.created_at DESC;

-- Student statistics
SELECT 
  COUNT(*) as total_students,
  AVG(sp.cgpa) as avg_cgpa,
  COUNT(CASE WHEN sp.placed_final = true THEN 1 END) as placed_students
FROM users u
JOIN student_profiles sp ON u.id = sp.user_id
WHERE u.role = 'student';
```
