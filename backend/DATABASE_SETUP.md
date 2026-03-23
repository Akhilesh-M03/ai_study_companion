# Database Setup Guide

This guide explains how to set up PostgreSQL for the AI Study Companion application.

## Overview

The application uses:

- **PostgreSQL** for user authentication (username, email, hashed_password)
- **Hindsight SDK** for quiz history and personalization (quiz attempts, scores, weak topics)
- **Alembic** for database migrations

## Quick Start

### 1. Install PostgreSQL

**On Windows:**

- Download from https://www.postgresql.org/download/windows/
- Run installer with default settings
- Note the password for the `postgres` user

**On macOS:**

```bash
brew install postgresql
brew services start postgresql
```

**On Linux (Ubuntu/Debian):**

```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database and User

```bash
# Connect to PostgreSQL as default user
psql -U postgres

# Create database
CREATE DATABASE ai_study_companion;

# Create database user
CREATE USER study_user WITH PASSWORD 'your_secure_password';

# Grant privileges
ALTER ROLE study_user SET client_encoding TO 'utf8';
ALTER ROLE study_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE study_user SET default_transaction_deferrable TO on;
ALTER ROLE study_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE ai_study_companion TO study_user;

# Exit
\q
```

### 3. Set Environment Variable

Create or update `.env` in the backend directory:

```bash
DATABASE_URL=postgresql://study_user:your_secure_password@localhost:5432/ai_study_companion
```

Or if using different host/port:

```bash
DATABASE_URL=postgresql://study_user:your_secure_password@your_host:5432/ai_study_companion
```

### 4. Run Migrations

From `backend/` directory:

```bash
# Create initial tables
python -m alembic upgrade head
```

### 5. Verify Connection

```bash
# Test connection with your connection string
python -c "from sqlalchemy import create_engine; engine = create_engine('postgresql://study_user:password@localhost:5432/ai_study_companion'); print('✓ Connection successful')"
```

## Running the Application

```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

The database tables are automatically created on first startup if they don't exist.

## Creating New Migrations

When you update models (e.g., add new fields to User):

```bash
# Generate migration from model changes
python -m alembic revision --autogenerate -m "Description of change"

# Apply migration
python -m alembic upgrade head
```

## Viewing Migrations

```bash
# Show migration history
python -m alembic history

# Show current revision
python -m alembic current
```

## Troubleshooting

### Connection refused

```
psycopg2.OperationalError: connection to server at "localhost" (127.0.0.1), port 5432 failed
```

- Check PostgreSQL is running: `sudo systemctl status postgresql` (Linux) or look for `postgres.exe` (Windows)
- Verify DATABASE_URL in `.env`
- Check credentials

### Authentication failed

```
psycopg2.OperationalError: FATAL: password authentication failed for user "study_user"
```

- Verify password in DATABASE_URL matches what you set with `CREATE USER`
- Password should be URL-encoded if it contains special characters

### "Role does not exist"

- Run the CREATE USER command above
- Ensure you created the user before databases

## Cloud Database (Optional)

For production, you may want to use a managed PostgreSQL service:

- **AWS RDS PostgreSQL**: https://aws.amazon.com/rds/postgresql/
- **Google Cloud SQL**: https://cloud.google.com/sql/docs/postgres
- **Heroku Postgres**: https://www.heroku.com/postgres (deprecated but still available)
- **Render PostgreSQL**: https://render.com/

Just update your `DATABASE_URL` to the connection string provided by the service.

## Testing

Tests use an in-memory SQLite database, so no PostgreSQL setup is needed for testing:

```bash
pytest tests/ -v
```

## Common Commands

```bash
# Start PostgreSQL service
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS
# Windows: Started automatically if configured

# Connect to database
psql -U study_user -d ai_study_companion -h localhost

# List tables
\dt

# Show table schema
\d users

# Backup database
pg_dump -U study_user ai_study_companion > backup.sql

# Restore database
psql -U study_user ai_study_companion < backup.sql
```
