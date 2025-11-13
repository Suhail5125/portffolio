# Design Document

## Overview

This design outlines the reorganization of the portfolio repository to improve maintainability, professionalism, and developer experience. The refactoring will focus on file organization, configuration management, and code structure without breaking existing functionality. All changes will be backward-compatible and will maintain the current API contracts.

## Architecture

### Directory Structure

The new repository structure will follow industry best practices:

```
portfolio/
├── .kiro/                    # Kiro specs and configuration
├── client/                   # Frontend application (unchanged)
├── server/                   # Backend application (enhanced)
│   ├── config/              # NEW: Configuration management
│   ├── controllers/         # NEW: Business logic layer
│   ├── middleware/          # Existing: Auth, upload
│   ├── migrations/          # Existing: Database migrations
│   ├── routes/              # Existing: Route definitions (simplified)
│   ├── scripts/             # Existing: Database scripts
│   ├── services/            # NEW: External service integrations
│   └── utils/               # NEW: Helper functions
├── shared/                   # Shared code (reorganized)
│   ├── schemas/             # NEW: Zod validation schemas
│   └── types/               # NEW: TypeScript type definitions
├── docs/                     # NEW: All documentation
│   ├── verification/        # NEW: Test reports and verification
│   └── guides/              # NEW: Setup and feature guides
├── scripts/                  # NEW: Setup and automation scripts
├── uploads/                  # User uploaded files
└── [config files]           # Root config files only
```

### Key Design Principles

1. **Separation of Concerns**: Business logic separated from routing
2. **Configuration Centralization**: All environment variables accessed through a single config module
3. **Type Safety**: Shared types and schemas properly organized
4. **Clean Root**: Only essential files in root directory
5. **Documentation Organization**: All docs in dedicated directory structure

## Components and Interfaces

### 1. Configuration Management System

**Location**: `server/config/index.ts`

```typescript
interface DatabaseConfig {
  url: string;
  poolSize?: number;
}

interface SessionConfig {
  secret: string;
  maxAge: number;
}

interface UploadConfig {
  maxFileSize: number;
  allowedTypes: string[];
  uploadDir: string;
}

interface AppConfig {
  port: number;
  nodeEnv: string;
  database: DatabaseConfig;
  session: SessionConfig;
  upload: UploadConfig;
}

export const config: AppConfig;
```

**Responsibilities**:
- Load and validate all environment variables at startup
- Provide typed configuration objects
- Throw descriptive errors for missing required variables
- Export configuration constants for use throughout the application

### 2. Shared Schema Organization

**Current**: Single `shared/schema.ts` file with mixed concerns

**New Structure**:
- `shared/types/index.ts` - TypeScript type definitions
- `shared/types/models.ts` - Database model types
- `shared/schemas/index.ts` - Zod validation schemas
- `shared/schemas/validation.ts` - Custom validation functions

**Migration Strategy**:
- Split existing schema.ts into logical files
- Update all imports across codebase
- Maintain backward compatibility with barrel exports

### 3. Controller Layer

**Location**: `server/controllers/`

Controllers will extract business logic from routes, making routes thin and focused on HTTP concerns.

```typescript
// Example: server/controllers/projects.ts
export class ProjectController {
  async getAllProjects(req: Request, res: Response): Promise<void>;
  async getProject(req: Request, res: Response): Promise<void>;
  async createProject(req: Request, res: Response): Promise<void>;
  async updateProject(req: Request, res: Response): Promise<void>;
  async deleteProject(req: Request, res: Response): Promise<void>;
}
```

**Controllers to Create**:
- `ProjectController` - Project CRUD operations
- `SkillController` - Skill management
- `TestimonialController` - Testimonial management
- `ContactController` - Contact message handling
- `AboutController` - About info management
- `AuthController` - Authentication logic

### 4. Service Layer

**Location**: `server/services/`

Services will handle external integrations and complex business logic.

```typescript
// Example: server/services/file-upload.ts
export class FileUploadService {
  async uploadFile(file: Express.Multer.File): Promise<string>;
  async deleteFile(filename: string): Promise<void>;
  async validateFile(file: Express.Multer.File): Promise<boolean>;
}
```

**Services to Create**:
- `FileUploadService` - File upload handling
- `EmailService` - Email notifications (future)
- `ValidationService` - Complex validation logic

### 5. Utility Functions

**Location**: `server/utils/`

Common helper functions extracted from various files.

```typescript
// server/utils/response.ts
export function successResponse<T>(data: T, message?: string);
export function errorResponse(message: string, status: number);

// server/utils/validation.ts
export function sanitizeValues<T>(values: T): T;
export function validateUrl(url: string): boolean;
```

## Data Models

No changes to database schema. The existing Drizzle ORM schema will be reorganized but maintain the same structure:

- `projects` - Portfolio projects
- `skills` - Technical skills
- `testimonials` - Client testimonials
- `contactMessages` - Contact form submissions
- `aboutInfo` - About page information
- `users` - Admin users

## File Organization Plan

### Documentation Files to Move

**To `docs/guides/`**:
- `DEPLOYMENT.md`
- `FEATURES.md`
- `POSTGRESQL_MIGRATION_GUIDE.md`
- `POSTGRESQL_SETUP_COMPLETE.md`
- `design_guidelines.md`
- `replit.md`

**To `docs/verification/`**:
- `ABOUT_INFO_VERIFICATION.md`
- `ADMIN_DASHBOARD_VERIFICATION.md`
- `FINAL_VERIFICATION_REPORT.md`
- `FILE_UPLOAD_TEST_GUIDE.md`
- `UPLOAD_IMPLEMENTATION_SUMMARY.md`
- `STARRED_MESSAGES_FEATURE.md`

**To Delete** (if outdated):
- `CLEANUP.md`

### Scripts to Move

**To `scripts/`**:
- `setup-database.ps1`
- `setup-postgres.md`
- `commit-changes.bat`
- `final-commit.bat`

**To Delete**:
- `test-starred-api.ts` (move to tests/ if needed, or delete)

### Root Directory After Cleanup

Only these files should remain in root:
- `.env` (gitignored)
- `.env.example` (NEW)
- `.gitignore` (updated)
- `.replit`
- `components.json`
- `drizzle.config.ts`
- `package.json`
- `package-lock.json`
- `postcss.config.js`
- `README.md`
- `tailwind.config.ts`
- `tsconfig.json`
- `vite.config.ts`

## Error Handling

### Configuration Errors

When required environment variables are missing:
```typescript
throw new Error(`Missing required environment variable: ${varName}`);
```

### Migration Errors

If file moves fail:
- Log the error
- Provide clear instructions for manual intervention
- Do not leave repository in broken state

### Import Path Updates

Strategy for updating imports after file reorganization:
1. Create barrel exports for backward compatibility
2. Update imports incrementally
3. Test after each major change
4. Use TypeScript compiler to catch broken imports

## Testing Strategy

### Validation Steps

1. **Configuration Loading**
   - Verify all environment variables load correctly
   - Test missing variable error handling
   - Validate typed config objects

2. **Import Path Verification**
   - Run TypeScript compiler (`npm run check`)
   - Verify no broken imports
   - Test application startup

3. **Functionality Testing**
   - Start development server
   - Test all API endpoints
   - Verify file uploads work
   - Test admin authentication

4. **Build Verification**
   - Run production build
   - Verify all files bundle correctly
   - Test production server startup

### Rollback Plan

If issues arise:
1. Git stash or commit changes
2. Revert to previous commit
3. Identify specific issue
4. Fix and retry

## Implementation Phases

### Phase 1: File Organization (Low Risk)
- Move documentation files
- Move scripts
- Update .gitignore
- Create .env.example

### Phase 2: Configuration Management (Medium Risk)
- Create config module
- Update server/index.ts to use config
- Update storage.ts to use config
- Update middleware to use config

### Phase 3: Shared Code Reorganization (Medium Risk)
- Split shared/schema.ts
- Create barrel exports
- Update imports across codebase
- Verify TypeScript compilation

### Phase 4: Server Structure Enhancement (Low Risk - Optional)
- Create controller layer
- Create service layer
- Create utils directory
- Refactor routes to use controllers

## Migration Considerations

### Backward Compatibility

- Maintain existing API contracts
- Keep existing route paths
- Preserve database schema
- No breaking changes to client code

### Environment Variables

Current variables used (from code analysis):
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `SESSION_SECRET` - Session encryption key (inferred)

### Import Path Updates

Files that import from `shared/schema.ts`:
- `server/storage.ts`
- `server/routes/*.ts`
- `client/src/types/api.ts`

Strategy: Create barrel export at `shared/index.ts` to maintain compatibility during transition.

## Security Considerations

1. **Environment Variables**: Never commit .env file, always use .env.example
2. **Uploads Directory**: Add to .gitignore to prevent committing user files
3. **Sensitive Scripts**: Add .bat files to .gitignore if they contain credentials
4. **Configuration Validation**: Fail fast if required security variables are missing

## Performance Impact

Expected performance impact: **None**

- File reorganization does not affect runtime performance
- Configuration loading happens once at startup
- Controller/service layers add minimal overhead
- Import path changes are resolved at build time

## Dependencies

No new dependencies required. All changes use existing packages:
- `dotenv` - Already installed
- `zod` - Already installed
- `drizzle-orm` - Already installed

## Future Enhancements

After this reorganization, the codebase will be better positioned for:
- Adding automated tests
- Implementing CI/CD pipelines
- Adding API documentation (Swagger/OpenAPI)
- Implementing caching strategies
- Adding monitoring and logging
- Scaling to microservices if needed
