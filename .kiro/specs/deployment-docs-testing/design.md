# Design Document: Deployment, Documentation, and Testing

## Overview

This design outlines the approach for deploying the portfolio website to production, creating comprehensive documentation, and implementing a testing strategy. The solution focuses on three main pillars:

1. **Deployment Infrastructure** - Multi-platform deployment support with automated CI/CD
2. **Documentation Suite** - Comprehensive guides covering API, architecture, and operations
3. **Testing Framework** - Unit and integration tests for core functionality

The design prioritizes simplicity, maintainability, and developer experience while ensuring production readiness.

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Production Environment                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Frontend   │────────▶│   Backend    │                  │
│  │  (Static)    │         │  (Express)   │                  │
│  │              │         │              │                  │
│  │  - React     │         │  - REST API  │                  │
│  │  - Vite      │         │  - Auth      │                  │
│  │  - Tailwind  │         │  - Sessions  │                  │
│  └──────────────┘         └──────┬───────┘                  │
│                                   │                          │
│                                   ▼                          │
│                          ┌──────────────┐                    │
│                          │  PostgreSQL  │                    │
│                          │   Database   │                    │
│                          └──────────────┘                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Development Environment                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  Test Suite  │────────▶│  Test DB     │                  │
│  │              │         │              │                  │
│  │  - Vitest    │         │  PostgreSQL  │                  │
│  │  - Supertest │         │  (Test)      │                  │
│  └──────────────┘         └──────────────┘                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Repository                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Push/PR
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      CI/CD Pipeline                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Build    │─▶│   Test     │─▶│   Deploy   │            │
│  │            │  │            │  │            │            │
│  │ - Install  │  │ - Unit     │  │ - Railway  │            │
│  │ - TypeCheck│  │ - Integr.  │  │ - Render   │            │
│  │ - Build    │  │ - Lint     │  │ - Vercel   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Deployment Configuration

#### Environment Configuration Manager
**Purpose**: Centralize environment variable management and validation

**Interface**:
```typescript
interface EnvironmentConfig {
  server: {
    port: number;
    nodeEnv: 'development' | 'production' | 'test';
    isDevelopment: boolean;
    isProduction: boolean;
  };
  database: {
    url: string;
  };
  session: {
    secret: string;
    maxAge: number;
  };
  security: {
    corsOrigin: string;
    rateLimitWindow: number;
    rateLimitMax: number;
  };
}

function loadConfig(): EnvironmentConfig;
function validateConfig(config: Partial<EnvironmentConfig>): void;
```

**Implementation Details**:
- Use `dotenv` for loading environment variables
- Validate required variables on startup
- Provide sensible defaults for development
- Throw descriptive errors for missing production variables
- Export typed configuration object

#### Health Check Endpoint
**Purpose**: Provide system status monitoring

**Interface**:
```typescript
GET /api/health

Response:
{
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  database: {
    connected: boolean;
    responseTime: number;
  };
  memory: {
    used: number;
    total: number;
  };
}
```

**Implementation Details**:
- Check database connectivity with simple query
- Measure database response time
- Include memory usage statistics
- Return 200 for healthy, 503 for unhealthy
- Cache results for 10 seconds to prevent overload

#### Deployment Scripts
**Purpose**: Automate deployment tasks

**Scripts**:
```json
{
  "scripts": {
    "deploy:build": "npm run build",
    "deploy:migrate": "npm run db:push",
    "deploy:seed": "npm run db:seed",
    "deploy:check": "npm run check && npm run lint",
    "deploy:full": "npm run deploy:check && npm run deploy:build"
  }
}
```

### 2. Documentation Structure

#### API Documentation
**Location**: `docs/api/README.md`

**Structure**:
```markdown
# API Documentation

## Authentication
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/user

## Projects
- GET /api/projects
- GET /api/projects/:id
- POST /api/projects (auth required)
- PUT /api/projects/:id (auth required)
- DELETE /api/projects/:id (auth required)

## Skills
- GET /api/skills
- POST /api/skills (auth required)
- PUT /api/skills/:id (auth required)
- DELETE /api/skills/:id (auth required)
- PUT /api/skills/reorder (auth required)

## Contact
- POST /api/contact/messages
- GET /api/contact/messages (auth required)
- PUT /api/contact/messages/:id/read (auth required)

## About
- GET /api/about
- PUT /api/about (auth required)
```

**Format for Each Endpoint**:
```markdown
### POST /api/auth/login

Authenticate a user and create a session.

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response** (200 OK):
```json
{
  "id": "number",
  "username": "string"
}
```

**Errors**:
- 400: Invalid credentials
- 500: Server error
```

#### Architecture Documentation
**Location**: `docs/architecture/README.md`

**Contents**:
- System overview and technology stack
- Directory structure and organization
- Data flow diagrams
- Database schema with relationships
- Authentication and session management
- Security measures and best practices
- Performance considerations

#### Deployment Guides
**Location**: `docs/deployment/`

**Files**:
- `railway.md` - Railway deployment guide
- `render.md` - Render deployment guide
- `vercel.md` - Vercel + backend deployment guide
- `vps.md` - VPS deployment guide
- `troubleshooting.md` - Common issues and solutions

**Each Guide Includes**:
1. Prerequisites
2. Step-by-step deployment instructions
3. Environment variable configuration
4. Database setup
5. Custom domain configuration
6. SSL/HTTPS setup
7. Monitoring and logging
8. Rollback procedures

#### Contributing Guide
**Location**: `docs/CONTRIBUTING.md`

**Contents**:
- Development setup
- Code style and conventions
- Git workflow and branching strategy
- Pull request process
- Testing requirements
- Documentation requirements

### 3. Testing Framework

#### Test Infrastructure

**Technology Stack**:
- **Test Runner**: Vitest (fast, Vite-native)
- **HTTP Testing**: Supertest (API endpoint testing)
- **Assertions**: Vitest built-in assertions
- **Test Database**: PostgreSQL (separate test instance)

**Configuration**:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'tests/']
    }
  }
});
```

#### Test Structure

```
tests/
├── setup.ts                    # Test environment setup
├── helpers/
│   ├── db.ts                   # Database test utilities
│   ├── auth.ts                 # Authentication helpers
│   └── fixtures.ts             # Test data fixtures
├── unit/
│   ├── validation.test.ts      # Zod schema tests
│   ├── utils.test.ts           # Utility function tests
│   └── middleware.test.ts      # Middleware tests
└── integration/
    ├── auth.test.ts            # Authentication flow tests
    ├── projects.test.ts        # Projects CRUD tests
    ├── skills.test.ts          # Skills management tests
    └── contact.test.ts         # Contact form tests
```

#### Test Database Setup

**Purpose**: Isolated database for testing

**Implementation**:
```typescript
// tests/helpers/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 
  'postgresql://localhost:5432/portfolio_test';

export async function setupTestDatabase() {
  const client = postgres(TEST_DATABASE_URL);
  const db = drizzle(client);
  
  // Run migrations
  await migrate(db, { migrationsFolder: './migrations' });
  
  return { db, client };
}

export async function cleanDatabase(db: Database) {
  // Clear all tables
  await db.delete(projects);
  await db.delete(skills);
  await db.delete(contactMessages);
  await db.delete(users);
}

export async function teardownTestDatabase(client: PostgresClient) {
  await client.end();
}
```

#### Unit Tests

**Validation Tests**:
```typescript
// tests/unit/validation.test.ts
import { describe, it, expect } from 'vitest';
import { insertProjectSchema, insertSkillSchema } from '@/shared/schemas';

describe('Project Validation', () => {
  it('should validate valid project data', () => {
    const validProject = {
      title: 'Test Project',
      description: 'A test project',
      imageUrl: 'https://example.com/image.jpg',
      technologies: ['React', 'TypeScript'],
      featured: false
    };
    
    const result = insertProjectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });
  
  it('should reject project with missing title', () => {
    const invalidProject = {
      description: 'A test project',
      imageUrl: 'https://example.com/image.jpg'
    };
    
    const result = insertProjectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
  });
});
```

**Utility Tests**:
```typescript
// tests/unit/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, slugify } from '@/lib/utils';

describe('Utility Functions', () => {
  it('should format dates correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('January 15, 2024');
  });
  
  it('should create valid slugs', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('Test & Demo')).toBe('test-demo');
  });
});
```

#### Integration Tests

**Authentication Tests**:
```typescript
// tests/integration/auth.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '@/server';
import { setupTestDatabase, cleanDatabase } from '../helpers/db';

describe('Authentication API', () => {
  let db, client;
  
  beforeEach(async () => {
    ({ db, client } = await setupTestDatabase());
    await seedTestUser(db);
  });
  
  afterEach(async () => {
    await cleanDatabase(db);
    await client.end();
  });
  
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('admin');
  });
  
  it('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'wrongpassword'
      });
    
    expect(response.status).toBe(400);
  });
  
  it('should logout successfully', async () => {
    // Login first
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    
    const cookie = loginResponse.headers['set-cookie'];
    
    // Logout
    const logoutResponse = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookie);
    
    expect(logoutResponse.status).toBe(200);
  });
});
```

**Projects CRUD Tests**:
```typescript
// tests/integration/projects.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '@/server';

describe('Projects API', () => {
  let authCookie: string;
  
  beforeEach(async () => {
    // Setup and login
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    
    authCookie = response.headers['set-cookie'];
  });
  
  it('should get all projects', async () => {
    const response = await request(app)
      .get('/api/projects');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  it('should create a new project (authenticated)', async () => {
    const newProject = {
      title: 'New Project',
      description: 'Test description',
      imageUrl: 'https://example.com/image.jpg',
      technologies: ['React'],
      featured: false
    };
    
    const response = await request(app)
      .post('/api/projects')
      .set('Cookie', authCookie)
      .send(newProject);
    
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('New Project');
  });
  
  it('should reject unauthenticated project creation', async () => {
    const newProject = {
      title: 'New Project',
      description: 'Test description'
    };
    
    const response = await request(app)
      .post('/api/projects')
      .send(newProject);
    
    expect(response.status).toBe(401);
  });
});
```

## Data Models

### Configuration Schema

```typescript
// server/config.ts
interface ServerConfig {
  port: number;
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

interface DatabaseConfig {
  url: string;
}

interface SessionConfig {
  secret: string;
  maxAge: number;
  secure: boolean;
}

interface SecurityConfig {
  corsOrigin: string;
  rateLimitWindow: number;
  rateLimitMax: number;
}

interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
  session: SessionConfig;
  security: SecurityConfig;
}
```

### Health Check Response

```typescript
interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  database: {
    connected: boolean;
    responseTime: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}
```

### Test Fixtures

```typescript
// tests/helpers/fixtures.ts
interface TestUser {
  username: string;
  password: string;
  passwordHash: string;
}

interface TestProject {
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  featured: boolean;
}

interface TestSkill {
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
}

export const fixtures = {
  users: {
    admin: TestUser;
  };
  projects: {
    featured: TestProject;
    regular: TestProject;
  };
  skills: {
    frontend: TestSkill[];
    backend: TestSkill[];
  };
};
```

## Error Handling

### Deployment Errors

**Configuration Errors**:
```typescript
class ConfigurationError extends Error {
  constructor(missingVars: string[]) {
    super(`Missing required environment variables: ${missingVars.join(', ')}`);
    this.name = 'ConfigurationError';
  }
}
```

**Database Connection Errors**:
```typescript
class DatabaseConnectionError extends Error {
  constructor(originalError: Error) {
    super(`Failed to connect to database: ${originalError.message}`);
    this.name = 'DatabaseConnectionError';
    this.cause = originalError;
  }
}
```

**Handling Strategy**:
- Validate configuration on startup
- Fail fast with descriptive errors
- Log errors with context
- Provide troubleshooting hints in error messages

### Test Errors

**Test Setup Errors**:
```typescript
// tests/setup.ts
beforeAll(async () => {
  try {
    await setupTestDatabase();
  } catch (error) {
    console.error('Failed to setup test database:', error);
    console.error('Make sure TEST_DATABASE_URL is set and database is running');
    process.exit(1);
  }
});
```

**Test Isolation**:
- Each test suite gets a clean database
- Use transactions for test isolation
- Rollback after each test
- Clean up resources in afterEach/afterAll

## Testing Strategy

### Test Pyramid

```
        ┌─────────────┐
        │     E2E     │  (Manual - not automated)
        │   Testing   │
        └─────────────┘
       ┌───────────────┐
       │  Integration  │  (Focus area - API tests)
       │    Tests      │
       └───────────────┘
      ┌─────────────────┐
      │   Unit Tests    │  (Core logic only)
      │                 │
      └─────────────────┘
```

### Test Coverage Goals

- **Unit Tests**: 70%+ coverage for utilities and validation
- **Integration Tests**: 80%+ coverage for API endpoints
- **Critical Paths**: 100% coverage for authentication and data mutations

### Test Execution

**Local Development**:
```bash
npm run test              # Run all tests
npm run test:unit         # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:watch        # Watch mode
npm run test:coverage     # Generate coverage report
```

**CI/CD Pipeline**:
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: portfolio_test
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

## Security Considerations

### Production Security Checklist

1. **Environment Variables**:
   - Never commit `.env` files
   - Use platform secret management
   - Rotate secrets regularly

2. **Database**:
   - Use connection pooling
   - Enable SSL for database connections
   - Regular backups
   - Restrict database access by IP

3. **API Security**:
   - Rate limiting on all endpoints
   - CORS configuration
   - Input validation
   - SQL injection prevention (using ORM)
   - XSS protection

4. **Authentication**:
   - Secure session configuration
   - HTTP-only cookies
   - CSRF protection
   - Strong password requirements

5. **Headers**:
   ```typescript
   app.use((req, res, next) => {
     res.setHeader('X-Content-Type-Options', 'nosniff');
     res.setHeader('X-Frame-Options', 'DENY');
     res.setHeader('X-XSS-Protection', '1; mode=block');
     res.setHeader('Strict-Transport-Security', 'max-age=31536000');
     next();
   });
   ```

### Test Security

- Use separate test database
- Never use production credentials in tests
- Clean up test data after execution
- Don't commit test credentials to repository

## Performance Optimization

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          '3d-vendor': ['three', '@react-three/fiber', '@react-three/drei']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
});
```

### Database Optimization

- Add indexes on frequently queried columns
- Use connection pooling
- Implement query result caching
- Optimize N+1 queries

### Caching Strategy

```typescript
// Cache static assets
app.use(express.static('dist', {
  maxAge: '1y',
  immutable: true
}));

// Cache API responses (where appropriate)
app.get('/api/projects', cacheMiddleware(300), getProjects);
```

## Monitoring and Logging

### Application Logging

```typescript
// server/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Monitoring Endpoints

- `/api/health` - Health check
- `/api/metrics` - Application metrics (optional)

### External Monitoring

Recommended services:
- **Uptime**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Plausible
- **Performance**: Lighthouse CI

## Deployment Workflow

### Pre-Deployment Checklist

1. ✅ All tests passing
2. ✅ TypeScript compilation successful
3. ✅ Environment variables documented
4. ✅ Database migrations ready
5. ✅ Build process tested locally
6. ✅ Security checklist completed
7. ✅ Documentation updated

### Deployment Steps

1. **Build**:
   ```bash
   npm run deploy:check
   npm run deploy:build
   ```

2. **Database**:
   ```bash
   npm run deploy:migrate
   ```

3. **Deploy**:
   - Push to main branch (triggers CI/CD)
   - Or manual deployment via platform CLI

4. **Verify**:
   - Check health endpoint
   - Test critical user flows
   - Monitor error logs

### Rollback Procedure

1. Revert to previous deployment
2. Restore database backup if needed
3. Verify system health
4. Investigate and fix issue
5. Redeploy with fix

## Documentation Maintenance

### Documentation Updates

- Update API docs when endpoints change
- Update deployment guides when process changes
- Keep architecture docs in sync with code
- Review and update quarterly

### Documentation Review Process

1. Developer makes code changes
2. Developer updates relevant documentation
3. Documentation reviewed in PR
4. Documentation deployed with code

## Success Metrics

### Deployment Success

- ✅ Application accessible on public URL
- ✅ All health checks passing
- ✅ Database connected and operational
- ✅ Authentication working
- ✅ Admin panel accessible
- ✅ Contact form functional
- ✅ No console errors
- ✅ HTTPS enabled

### Documentation Success

- ✅ All API endpoints documented
- ✅ Deployment guides for 3+ platforms
- ✅ Architecture diagrams complete
- ✅ Contributing guide available
- ✅ Troubleshooting section comprehensive

### Testing Success

- ✅ Test suite runs successfully
- ✅ 70%+ unit test coverage
- ✅ 80%+ integration test coverage
- ✅ All critical paths tested
- ✅ Tests run in CI/CD
- ✅ Test documentation complete
