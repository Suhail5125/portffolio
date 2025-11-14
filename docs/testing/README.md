# Testing Documentation

## Overview

This document provides comprehensive guidance on testing the Portfolio System. Our testing strategy focuses on ensuring code quality, preventing regressions, and maintaining confidence in the application's functionality through automated tests.

## Testing Philosophy

Our testing approach follows these core principles:

- **Test What Matters**: Focus on testing core functionality and critical user paths rather than implementation details
- **Fast Feedback**: Tests should run quickly to enable rapid development cycles
- **Isolated Tests**: Each test should be independent and not rely on the state from other tests
- **Readable Tests**: Tests serve as documentation - they should be clear and easy to understand
- **Maintainable**: Tests should be easy to update when requirements change

## Test Types

### Unit Tests

Unit tests verify individual functions, utilities, and validation logic in isolation. They are fast, focused, and test a single unit of code.

**What to test with unit tests:**
- Validation schemas (Zod schemas)
- Utility functions (date formatting, string manipulation, etc.)
- Pure functions with clear inputs and outputs
- Business logic that doesn't require external dependencies

**Location**: `tests/unit/`

**Example**: Testing validation schemas to ensure data integrity

### Integration Tests

Integration tests verify that different parts of the system work together correctly. They test API endpoints with real database interactions.

**What to test with integration tests:**
- API endpoints (authentication, CRUD operations)
- Request/response flows
- Database operations
- Authentication and authorization
- Error handling

**Location**: `tests/integration/`

**Example**: Testing the complete authentication flow from login to accessing protected routes

## Test Infrastructure

### Technology Stack

- **Test Runner**: [Vitest](https://vitest.dev/) - Fast, Vite-native test framework
- **HTTP Testing**: [Supertest](https://github.com/ladjs/supertest) - HTTP assertion library for testing Express APIs
- **Assertions**: Vitest built-in assertions (Jest-compatible)
- **Test Database**: PostgreSQL (separate test instance)

### Configuration

The test configuration is defined in `vitest.config.ts`:

```typescript
{
  test: {
    globals: true,              // Enable global test APIs (describe, it, expect)
    environment: 'node',        // Node.js environment for backend tests
    setupFiles: ['./tests/setup.ts'],  // Run setup before all tests
    coverage: {
      provider: 'v8',           // Use V8 coverage provider
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'tests/']
    },
    testTimeout: 10000,         // 10 second timeout for tests
    hookTimeout: 10000          // 10 second timeout for hooks
  }
}
```

## Running Tests

### Run All Tests

```bash
npm test
```

This runs all tests once and exits. Use this for CI/CD pipelines and pre-commit checks.

### Run Specific Test Suites

**Unit tests only:**
```bash
npm run test:unit
```

**Integration tests only:**
```bash
npm run test:integration
```

### Watch Mode

Run tests in watch mode for active development:

```bash
npm run test:watch
```

Tests will automatically re-run when you save changes to test files or source code.

### Generate Coverage Reports

```bash
npm run test:coverage
```

This generates coverage reports in multiple formats:
- **Terminal**: Summary displayed in console
- **HTML**: Detailed report in `coverage/index.html`
- **JSON**: Machine-readable report in `coverage/coverage-final.json`

### Run Specific Test Files

```bash
# Run a specific test file
npx vitest tests/integration/auth.test.ts

# Run tests matching a pattern
npx vitest auth
```

### Run Specific Tests

```bash
# Run tests with a specific name
npx vitest -t "should login successfully"
```

## Test Database Setup

### Prerequisites

Tests require a separate PostgreSQL database to avoid interfering with development or production data.

### Environment Configuration

Create a `.env.test` file in the project root:

```env
TEST_DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_test
```

**Important**: Never use your development or production database for tests!

### Database Connection

The test database connection is managed in `tests/helpers/db.ts`:

```typescript
import { setupTestDatabase, cleanDatabase, teardownTestDatabase } from './helpers/db';

// In your test file
beforeEach(async () => {
  const { db, pool } = await setupTestDatabase();
  await cleanDatabase(db);
});

afterEach(async () => {
  await teardownTestDatabase();
});
```

### Database Lifecycle

1. **Setup**: `setupTestDatabase()` creates a connection pool to the test database
2. **Clean**: `cleanDatabase()` removes all data from tables before each test
3. **Teardown**: `teardownTestDatabase()` closes the connection pool after tests

This ensures each test starts with a clean slate and tests don't interfere with each other.

## Test Helpers

### Database Helpers (`tests/helpers/db.ts`)

**`setupTestDatabase()`**
- Creates a connection to the test database
- Returns database instance and connection pool
- Validates the connection is working

**`cleanDatabase(db)`**
- Deletes all data from all tables
- Respects foreign key constraints (deletes in correct order)
- Call this in `beforeEach` to ensure test isolation

**`teardownTestDatabase()`**
- Closes the database connection pool
- Call this in `afterAll` to clean up resources

**`getTestDb()`**
- Returns the current test database instance
- Throws error if database not initialized

### Authentication Helpers (`tests/helpers/auth.ts`)

**`getAuthCookie(app, username, password)`**
- Logs in a user and returns authentication cookie
- Use this to test protected endpoints
- Default credentials: `admin` / `admin123`

```typescript
const authCookie = await getAuthCookie(app);
const response = await request(app)
  .post('/api/projects')
  .set('Cookie', authCookie)
  .send(projectData);
```

**`authenticatedRequest(app, method, path, authCookie)`**
- Helper for making authenticated requests
- Automatically sets the authentication cookie

### Test Fixtures (`tests/helpers/fixtures.ts`)

Pre-defined test data for consistent testing:

**`testUsers`**
- `admin`: Default admin user
- `testUser`: Additional test user

**`testProjects`**
- `featured`: Featured project with all fields
- `regular`: Regular project
- `minimal`: Project with only required fields

**`testSkills`**
- `frontend`: Array of frontend skills
- `backend`: Array of backend skills

**`testContactMessages`**
- `unread`: Unread contact message
- `read`: Read contact message

**`createTestUserData(username)`**
- Helper function to create user data for database insertion

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { insertProjectSchema } from '../../shared/schemas/validation';

describe('Project Validation', () => {
  it('should validate valid project data', () => {
    const validProject = {
      title: 'Test Project',
      description: 'A test project description',
      technologies: ['React', 'TypeScript'],
      featured: false,
    };

    const result = insertProjectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('should reject project with missing title', () => {
    const invalidProject = {
      description: 'A test project',
      technologies: ['React'],
      featured: false,
    };

    const result = insertProjectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createTestApp } from '../helpers/app';
import { getTestDb, cleanDatabase } from '../helpers/db';
import { getAuthCookie } from '../helpers/auth';
import { users } from '../../shared/index.js';
import { createTestUserData } from '../helpers/fixtures';

describe('Projects API', () => {
  let app: Express;
  let db: ReturnType<typeof getTestDb>;
  let authCookie: string[];

  beforeEach(async () => {
    // Create test app and get database
    app = await createTestApp();
    db = getTestDb();
    
    // Clean database and seed test user
    await cleanDatabase(db);
    await db.insert(users).values(createTestUserData('admin'));
    
    // Get authentication cookie
    authCookie = await getAuthCookie(app);
  });

  afterEach(async () => {
    await cleanDatabase(db);
  });

  describe('POST /api/projects', () => {
    it('should create a new project when authenticated', async () => {
      const newProject = {
        title: 'New Project',
        description: 'Test description',
        imageUrl: '',
        githubUrl: '',
        liveUrl: '',
        technologies: ['React'],
        featured: false,
        order: 1,
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Cookie', authCookie)
        .send(newProject);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New Project');
    });

    it('should reject unauthenticated requests', async () => {
      const newProject = {
        title: 'New Project',
        description: 'Test description',
        technologies: ['React'],
      };

      const response = await request(app)
        .post('/api/projects')
        .send(newProject);

      expect(response.status).toBe(401);
    });
  });
});
```

### Test Structure Best Practices

1. **Use descriptive test names**: Test names should clearly describe what is being tested
   ```typescript
   it('should return 401 when accessing protected route without authentication', ...)
   ```

2. **Follow AAA pattern**: Arrange, Act, Assert
   ```typescript
   it('should create a project', async () => {
     // Arrange: Set up test data
     const projectData = { title: 'Test', ... };
     
     // Act: Perform the action
     const response = await request(app).post('/api/projects').send(projectData);
     
     // Assert: Verify the result
     expect(response.status).toBe(201);
   });
   ```

3. **One assertion per test**: Focus each test on a single behavior
   - Good: `it('should return 404 for non-existent project', ...)`
   - Avoid: `it('should handle all error cases', ...)` (too broad)

4. **Clean up after tests**: Use `afterEach` to clean database and close connections

5. **Use test helpers**: Leverage existing helpers for common operations (auth, fixtures, etc.)

## Common Testing Patterns

### Testing Protected Endpoints

```typescript
it('should allow access with valid authentication', async () => {
  const authCookie = await getAuthCookie(app);
  
  const response = await request(app)
    .post('/api/projects')
    .set('Cookie', authCookie)
    .send(projectData);
  
  expect(response.status).toBe(201);
});
```

### Testing Validation Errors

```typescript
it('should reject invalid email format', async () => {
  const invalidData = {
    email: 'not-an-email',
    // ... other fields
  };
  
  const result = schema.safeParse(invalidData);
  
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues[0].message).toContain('valid email');
  }
});
```

### Testing Database Operations

```typescript
it('should persist project to database', async () => {
  const authCookie = await getAuthCookie(app);
  
  // Create project
  const createResponse = await request(app)
    .post('/api/projects')
    .set('Cookie', authCookie)
    .send(projectData);
  
  const projectId = createResponse.body.id;
  
  // Verify it was saved
  const getResponse = await request(app)
    .get(`/api/projects/${projectId}`);
  
  expect(getResponse.status).toBe(200);
  expect(getResponse.body.title).toBe(projectData.title);
});
```

### Testing Error Handling

```typescript
it('should return 404 for non-existent resource', async () => {
  const response = await request(app)
    .get('/api/projects/99999');
  
  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('error');
});
```

## Debugging Tests

### View Test Output

Run tests with verbose output:
```bash
npx vitest --reporter=verbose
```

### Debug Specific Test

Add `.only` to run a single test:
```typescript
it.only('should login successfully', async () => {
  // This test will run alone
});
```

### Skip Tests

Skip tests temporarily with `.skip`:
```typescript
it.skip('should handle edge case', async () => {
  // This test will be skipped
});
```

### Console Logging

Add console.log statements to debug:
```typescript
it('should create project', async () => {
  const response = await request(app).post('/api/projects').send(data);
  console.log('Response:', response.body);
  expect(response.status).toBe(201);
});
```

### Database Inspection

Inspect database state during tests:
```typescript
it('should save to database', async () => {
  await createProject();
  
  const projects = await db.select().from(projectsTable);
  console.log('Projects in DB:', projects);
  
  expect(projects).toHaveLength(1);
});
```

## Continuous Integration

### GitHub Actions

Tests run automatically on every push and pull request via GitHub Actions (`.github/workflows/test.yml`).

The CI pipeline:
1. Sets up Node.js environment
2. Installs dependencies
3. Starts PostgreSQL service
4. Runs all tests
5. Generates coverage report
6. Uploads coverage to Codecov (if configured)

### Pre-commit Testing

Run tests before committing:
```bash
npm test
```

Consider adding a pre-commit hook to automatically run tests.

## Coverage Goals

- **Unit Tests**: 70%+ coverage for utilities and validation
- **Integration Tests**: 80%+ coverage for API endpoints
- **Critical Paths**: 100% coverage for authentication and data mutations

View current coverage:
```bash
npm run test:coverage
```

Open the HTML report:
```bash
# Windows
start coverage/index.html

# macOS
open coverage/index.html

# Linux
xdg-open coverage/index.html
```

## Troubleshooting

### Tests Fail to Connect to Database

**Error**: `Failed to connect to test database`

**Solution**:
1. Ensure PostgreSQL is running
2. Verify `TEST_DATABASE_URL` in `.env.test` is correct
3. Check that the test database exists
4. Verify database credentials

### Tests Timeout

**Error**: `Test timed out after 10000ms`

**Solution**:
1. Check for infinite loops or hanging promises
2. Ensure all async operations use `await`
3. Increase timeout in `vitest.config.ts` if needed
4. Check database connection isn't hanging

### Tests Pass Individually but Fail Together

**Cause**: Tests are not properly isolated

**Solution**:
1. Ensure `cleanDatabase()` is called in `beforeEach`
2. Check for shared state between tests
3. Verify database connections are properly closed
4. Use separate test data for each test

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**:
1. Kill any running development servers
2. Use a different port for tests
3. Ensure previous test runs have fully terminated

### Flaky Tests

**Symptoms**: Tests pass sometimes and fail other times

**Solution**:
1. Check for race conditions in async code
2. Ensure proper use of `await` for all promises
3. Avoid relying on timing or delays
4. Check for shared state between tests
5. Verify database is properly cleaned between tests

## Best Practices

1. **Write tests first**: Consider TDD (Test-Driven Development) for new features
2. **Keep tests simple**: Each test should be easy to understand
3. **Test behavior, not implementation**: Focus on what the code does, not how
4. **Use meaningful test data**: Make test data realistic and representative
5. **Don't test external dependencies**: Mock external APIs and services
6. **Maintain test code**: Refactor tests when refactoring code
7. **Run tests frequently**: Run tests during development, not just before commits
8. **Review test failures**: Don't ignore failing tests - fix them or remove them

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Supertest Documentation](https://github.com/ladjs/supertest)
- [Testing Best Practices](https://testingjavascript.com/)
- [Jest Matchers (Vitest Compatible)](https://jestjs.io/docs/expect)

## Getting Help

If you encounter issues with tests:

1. Check this documentation first
2. Review existing test files for examples
3. Check the troubleshooting section
4. Review test output and error messages carefully
5. Ask the team for help

## Contributing

When adding new features:

1. Write tests for new functionality
2. Ensure all tests pass before submitting PR
3. Maintain or improve code coverage
4. Follow existing test patterns and conventions
5. Update this documentation if adding new testing patterns
