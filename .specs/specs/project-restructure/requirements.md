# Requirements Document

## Introduction

This document outlines the requirements for restructuring the portfolio project to improve code organization, eliminate duplicates, fix architectural issues, and establish a scalable foundation. The restructure will address server-side monolithic code, duplicate components, database inconsistencies, and improve overall maintainability.

## Glossary

- **Application**: The full-stack portfolio web application consisting of client and server components
- **Server**: The Express.js backend API that handles authentication, data persistence, and business logic
- **Client**: The React frontend that renders the portfolio UI and admin dashboard
- **Storage Layer**: The database abstraction layer using Drizzle ORM
- **Route Handler**: Express.js endpoint functions that process HTTP requests
- **Middleware**: Express.js functions that process requests before reaching route handlers
- **Service Layer**: Business logic layer between routes and storage
- **Component**: React UI component
- **Admin Dashboard**: Protected interface for content management
- **Public Portfolio**: Public-facing portfolio website

## Requirements

### Requirement 1: Remove Duplicate and Unused Code

**User Story:** As a developer, I want to eliminate duplicate and unused code, so that the codebase is cleaner and easier to maintain.

#### Acceptance Criteria

1. WHEN the Application is analyzed for duplicate navigation components, THE Application SHALL contain only the actively used navigation components
2. WHEN the Application is analyzed for duplicate loading components, THE Application SHALL contain only one loading component implementation
3. WHEN the Application is analyzed for unused dependencies, THE Application SHALL have all unused npm packages removed from package.json
4. THE Application SHALL have the unused `floating-nav.tsx` component removed
5. THE Application SHALL have either `loading-screen.tsx` or `page-loader.tsx` removed based on usage preference

### Requirement 2: Restructure Server Architecture

**User Story:** As a developer, I want the server code organized into logical layers, so that the codebase is maintainable and follows best practices.

#### Acceptance Criteria

1. THE Server SHALL organize route handlers into separate files under `server/routes/` directory
2. THE Server SHALL extract authentication middleware into `server/middleware/auth.ts`
3. THE Server SHALL extract file upload configuration into `server/middleware/upload.ts`
4. THE Server SHALL implement a service layer in `server/services/` for business logic
5. THE Server SHALL move migration scripts from root to `server/scripts/` directory
6. WHEN a new route is added, THE Server SHALL allow adding it to the appropriate route file without modifying other routes

### Requirement 3: Fix Database Configuration Inconsistency

**User Story:** As a developer, I want consistent database configuration, so that the application uses the correct database dialect throughout.

#### Acceptance Criteria

1. THE Application SHALL use a single database dialect consistently across all configuration files
2. WHEN the schema is defined, THE Application SHALL use the same ORM table definitions that match the drizzle config dialect
3. THE Application SHALL have the database dialect explicitly documented in the project README
4. IF PostgreSQL is chosen, THEN THE Application SHALL use `pgTable` in schema definitions
5. IF SQLite is chosen, THEN THE Application SHALL use `dialect: "sqlite"` in drizzle config

### Requirement 4: Organize Client Components

**User Story:** As a developer, I want client components organized by feature and purpose, so that I can easily locate and maintain them.

#### Acceptance Criteria

1. THE Client SHALL organize section components into `client/src/components/sections/` directory
2. THE Client SHALL organize layout components into `client/src/components/layout/` directory
3. THE Client SHALL maintain the existing `ui/`, `admin/`, and `3d/` component directories
4. THE Client SHALL rename `3d-fallback/` to `3d/fallbacks/` for better hierarchy
5. WHEN a developer searches for a component, THE Client SHALL have a clear directory structure that indicates component purpose

### Requirement 5: Establish Type Organization

**User Story:** As a developer, I want frontend-specific types organized separately, so that type definitions are easy to find and maintain.

#### Acceptance Criteria

1. THE Client SHALL create a `client/src/types/` directory for frontend-specific type definitions
2. THE Client SHALL keep shared types in the `shared/` directory
3. THE Client SHALL have API response types defined in the types directory
4. THE Client SHALL have component prop types co-located with components or in the types directory based on reusability

### Requirement 6: Maintain Backward Compatibility

**User Story:** As a developer, I want the restructure to maintain all existing functionality, so that no features are broken during the refactor.

#### Acceptance Criteria

1. THE Application SHALL maintain all existing API endpoints with identical behavior
2. THE Application SHALL maintain all existing frontend routes and navigation
3. THE Application SHALL maintain all existing authentication and authorization logic
4. THE Application SHALL maintain all existing database operations
5. WHEN the restructure is complete, THE Application SHALL pass all existing functionality tests

### Requirement 7: Improve Import Paths

**User Story:** As a developer, I want clean import paths after restructuring, so that code is readable and maintainable.

#### Acceptance Criteria

1. THE Application SHALL update all import statements to reflect new file locations
2. THE Application SHALL use path aliases (`@/*`, `@shared/*`) consistently
3. THE Application SHALL have no broken imports after restructuring
4. THE Application SHALL have relative imports only for closely related files

### Requirement 8: Document Project Structure

**User Story:** As a developer, I want clear documentation of the new project structure, so that team members understand the organization.

#### Acceptance Criteria

1. THE Application SHALL include a project structure diagram in the README
2. THE Application SHALL document the purpose of each major directory
3. THE Application SHALL document naming conventions for files and folders
4. THE Application SHALL document where to place new code based on its purpose
