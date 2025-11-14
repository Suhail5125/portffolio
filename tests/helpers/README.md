# Test Helpers

This directory contains utility functions and fixtures for testing the portfolio application.

## Files

### `db.ts` - Database Helpers

Provides functions for managing the test database connection and cleaning data between tests.

**Functions:**

- `setupTestDatabase()` - Establishes connection to the test database
  - Returns: `{ db, pool }` - Database instance and connection pool
  - Throws: Error if TEST_DATABASE_URL is not set or connection fails

- `cleanDatabase(db)` - Removes all data from test database tables
  - Deletes data in the correct order to respect foreign key constraints
  - Safe to call between tests to ensure isolation

- `teardownTestDatabase()` - Closes the test database connection
  - Should be called in `afterAll()` hooks

- `getTestDb()` - Returns the current test database instance
  - Throws: Error if database not initialized

**Usage Example:**

```typescript
import { setupTestDatabase, cleanDatabase, teardownTestDatabase } from './helpers/db';

describe('My Test Suite', () => {
  let db;

  beforeAll(async () => {
    ({ db } = await setupTestDatabase());
  });

  afterEach(async () => {
    await cleanDatabase(db);
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  it('should test something', async () => {
    // Your test code here
  });
});
```

### `auth.ts` - Authentication Helpers

Provides functions for handling authentication in integration tests.

**Functions:**

- `getAuthCookie(app, username?, password?)` - Login and get authentication cookie
  - Parameters:
    - `app` - Express application instance
    - `username` - Username for login (default: 'admin')
    - `password` - Password for login (default: 'admin123')
  - Returns: Array of cookie strings to use in subsequent requests
  - Throws: Error if login fails

- `authenticatedRequest(app, method, path, authCookie)` - Make an authenticated request
  - Parameters:
    - `app` - Express application instance
    - `method` - HTTP method ('get', 'post', 'put', 'delete')
    - `path` - Request path
    - `authCookie` - Authentication cookie from `getAuthCookie()`
  - Returns: Supertest Test object for chaining

**Usage Example:**

```typescript
import request from 'supertest';
import { app } from '@/server';
import { getAuthCookie, authenticatedRequest } from './helpers/auth';

describe('Protected Routes', () => {
  let authCookie: string[];

  beforeAll(async () => {
    authCookie = await getAuthCookie(app);
  });

  it('should access protected route', async () => {
    const response = await authenticatedRequest(app, 'get', '/api/projects', authCookie);
    expect(response.status).toBe(200);
  });
});
```

### `fixtures.ts` - Test Data Fixtures

Provides pre-defined test data for users, projects, skills, and contact messages.

**Exports:**

- `testUsers` - Test user fixtures
  - `admin` - Admin user with username 'admin' and password 'admin123'
  - `testUser` - Regular test user

- `testProjects` - Test project fixtures
  - `featured` - Featured project with full details
  - `regular` - Regular project
  - `minimal` - Minimal project with only required fields

- `testSkills` - Test skill fixtures
  - `frontend` - Array of frontend skills (React, TypeScript)
  - `backend` - Array of backend skills (Node.js, PostgreSQL)

- `testContactMessages` - Test contact message fixtures
  - `unread` - Unread message
  - `read` - Read message

**Functions:**

- `createTestUserData(username?)` - Create user data for database insertion
  - Parameters:
    - `username` - Username to create data for (default: 'admin')
  - Returns: `InsertUser` object with hashed password

**Usage Example:**

```typescript
import { testProjects, testUsers, createTestUserData } from './helpers/fixtures';
import { storage } from '@/server/storage';

describe('Project Tests', () => {
  it('should create a project', async () => {
    // Create test user first
    const userData = createTestUserData('admin');
    await storage.createUser(userData);

    // Create test project
    const project = await storage.createProject(testProjects.featured);
    expect(project.title).toBe('Featured Test Project');
  });
});
```

## Setup

### Prerequisites

1. Create a test database:
   ```bash
   createdb portfolio_test
   ```

2. Ensure `.env.test` file exists with TEST_DATABASE_URL:
   ```
   TEST_DATABASE_URL=postgresql://localhost:5432/portfolio_test
   SESSION_SECRET=test-session-secret-key-for-testing-only
   NODE_ENV=test
   ```

3. Run database migrations on the test database:
   ```bash
   DATABASE_URL=postgresql://localhost:5432/portfolio_test npm run db:push
   ```

### Running Tests

```bash
# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Best Practices

1. **Database Isolation**: Always clean the database between tests using `cleanDatabase()`
2. **Test Data**: Use fixtures from `fixtures.ts` for consistent test data
3. **Authentication**: Use `getAuthCookie()` once per test suite, not per test
4. **Cleanup**: Always call `teardownTestDatabase()` in `afterAll()` hooks
5. **Error Handling**: Wrap database operations in try-catch blocks for better error messages

## Troubleshooting

### "TEST_DATABASE_URL environment variable is required"

Make sure you have a `.env.test` file with the TEST_DATABASE_URL set.

### "Failed to connect to test database"

1. Ensure PostgreSQL is running
2. Verify the test database exists: `psql -l | grep portfolio_test`
3. Check the connection string format in `.env.test`

### "relation does not exist"

Run migrations on the test database:
```bash
DATABASE_URL=postgresql://localhost:5432/portfolio_test npm run db:push
```
