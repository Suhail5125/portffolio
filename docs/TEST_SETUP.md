# Test Setup Guide

This guide will help you set up the test environment for running tests.

## Prerequisites

You need PostgreSQL installed and running on your system.

### Check if PostgreSQL is installed

```bash
# Windows (PowerShell)
Get-Service -Name postgresql*

# Or check if psql is available
psql --version
```

### Install PostgreSQL (if not installed)

**Windows:**
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for the `postgres` user
4. Default port is 5432

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Setup Test Database

### Option 1: Automatic Setup (Recommended)

Run the setup script:

```bash
npm run test:setup
```

This will:
- Create the `portfolio_test` database
- Run all migrations
- Prepare the database for testing

### Option 2: Manual Setup

If the automatic setup doesn't work, follow these steps:

1. **Connect to PostgreSQL:**

```bash
# Windows (if psql is in PATH)
psql -U postgres

# Or use pgAdmin GUI tool
```

2. **Create the test database:**

```sql
CREATE DATABASE portfolio_test;
```

3. **Exit psql:**

```sql
\q
```

4. **Run migrations:**

```bash
npm run db:push
```

## Configuration

The test configuration is in `.env.test`:

```env
TEST_DATABASE_URL=postgresql://localhost:5432/portfolio_test
SESSION_SECRET=test-session-secret-key-for-testing-only
NODE_ENV=test
```

**Update the connection string if needed:**
- Change `localhost` if PostgreSQL is on a different host
- Change `5432` if using a different port
- Add username/password: `postgresql://username:password@localhost:5432/portfolio_test`

## Running Tests

Once setup is complete:

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Troubleshooting

### Error: "TEST_DATABASE_URL environment variable is required"

**Solution:** Ensure `.env.test` exists with the correct `TEST_DATABASE_URL`.

### Error: "ECONNREFUSED" or "Connection refused"

**Solution:** PostgreSQL is not running. Start the PostgreSQL service:

- **Windows:** Open Services, find PostgreSQL, and start it
- **Mac:** `brew services start postgresql`
- **Linux:** `sudo systemctl start postgresql`

### Error: "database does not exist"

**Solution:** Run `npm run test:setup` to create the test database.

### Error: "password authentication failed"

**Solution:** Update the connection string in `.env.test` with correct credentials:

```env
TEST_DATABASE_URL=postgresql://postgres:your_password@localhost:5432/portfolio_test
```

### Tests are slow or hanging

**Solution:** 
1. Check if the test database has too much data
2. Clean the database: The tests automatically clean data between runs
3. Ensure only one test process is running at a time

## Alternative: Skip Database Tests

If you can't set up PostgreSQL right now, you can:

1. **Run only unit tests** (don't require database):
```bash
npm run test:unit
```

2. **Use an in-memory database** (future enhancement)

3. **Use Docker** for PostgreSQL:
```bash
docker run --name postgres-test -e POSTGRES_PASSWORD=test -p 5432:5432 -d postgres
```

Then update `.env.test`:
```env
TEST_DATABASE_URL=postgresql://postgres:test@localhost:5432/portfolio_test
```

## Next Steps

After successful setup:
1. Run `npm test` to verify everything works
2. Tests will automatically run in CI/CD pipelines
3. Add new tests as you develop features

For more information, see the main [README.md](../README.md).
