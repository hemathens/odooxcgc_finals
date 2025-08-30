@echo off
echo Creating PostgreSQL database and user...

echo Creating database and user...
psql -U postgres -c "CREATE DATABASE placement_tracker;"
psql -U postgres -c "CREATE USER placement_user WITH PASSWORD 'placement_password_2024';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE placement_tracker TO placement_user;"
psql -U postgres -d placement_tracker -c "GRANT ALL ON SCHEMA public TO placement_user;"
psql -U postgres -d placement_tracker -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO placement_user;"
psql -U postgres -d placement_tracker -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO placement_user;"

echo Database setup completed!
pause
