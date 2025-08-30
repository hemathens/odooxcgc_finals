-- PostgreSQL setup script for Placement Tracker
-- Run this script as postgres superuser

-- Create database
CREATE DATABASE placement_tracker;

-- Create user for the application
CREATE USER placement_user WITH PASSWORD 'placement_password_2024';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE placement_tracker TO placement_user;

-- Connect to the database and grant schema privileges
\c placement_tracker;
GRANT ALL ON SCHEMA public TO placement_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO placement_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO placement_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO placement_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO placement_user;

-- Display confirmation
SELECT 'Database setup completed successfully!' as status;
