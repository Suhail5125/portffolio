# Design Document: Project Restructure

## Overview

This design outlines the restructuring of the portfolio application to improve maintainability, eliminate code duplication, and establish a scalable architecture. The restructure will be performed incrementally to minimize risk and maintain functionality throughout the process.

### Goals
- Eliminate duplicate and unused code
- Organize server code into logical layers (routes, middleware, services)
- Fix database configuration inconsistencies
- Improve client component organization
- Maintain 100% backward compatibility

### Non-Goals
- Changing application functionality or features
- Modifying UI/UX design
- Performance optimization (unless directly related to structure)
- Adding new features

## Architecture

### Current Structure Issues
1. **Server**: Monolithic `routes.ts` (500+ lines) with mixed concerns
2. **Client**: Flat component structure with 20+ files in root
3. **Database**: Dialect mismatch between config (PostgreSQL) and schema (SQLite)
4. **Duplicates**: Multiple navigation and loading components

### Target Structure

```
project-root/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Navigation, Footer, etc.
│   │   │   ├── sections/        # Hero, Projects, Skills, etc.
│   │   │   ├── admin/           # Admin-specific components
│   │   │   ├── ui/              # Reusable UI components
│   │   │   └── 3d/
│   │   │       ├── core/        # Main 3D components
│   │   │       └── fallbacks/   # Fallback components
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── types/               # Frontend-specific types
│   │   └── ...
│   └── ...
├── server/
│   ├── middleware/
│   │   ├── auth.ts              # Authentication middleware
│   │   └── upload.ts            # File upload configuration
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   ├── auth.ts              # Auth endpoints
│   │   ├── projects.ts          # Project CRUD
│   │   ├── skills.ts            # Skills CRUD
│   │   ├── testimonials.ts      # Testimonials CRUD
│   │   ├── contact.ts           # Contact messages
│   │   └── about.ts             # About info
│   ├── services/
│   │   ├── project.service.ts   # Project business logic
│   │   ├── skill.service.ts     # Skill business logic
│   │   └── ...
│   ├── scripts/
│   │   ├── migrate-*.ts         # Migration scripts
│   │   └── seed.ts              # Seed data
│   ├── index.ts
│   ├── storage.ts
│   └── vite.ts
├── shared/
│   └── schema.ts                # Shared types and schemas
└── ...
```

## Components and Interfaces

### 1. Server Layer Separation

#### Middleware Layer
**Purpose**: Extract reusable request processing logic

**Files**:
- `server/middleware/auth.ts`
  - Export `isAuthenticated` middleware
  - Export passport configuration
  - Export session configuration

- `server/middleware/upload.ts`
  - Export multer configuration
  - Export file validation logic
  - Export storage configuration

#### Routes Layer
**Purpose**: Handle HTTP requests and responses

**Pattern**: Each route file exports a function that registers routes on an Express router

```typescript
// server/routes/projects.ts
export function registerProjectRoutes(router: Router, storage: Storage) {
  // Public routes
  router.get("/api/projects", async (req, res) => { ... });
  router.get("/api/projects/:id", async (req, res) => { ... });
  
  // Protected routes
  router.post("/api/projects", isAuthenticated, async (req, res) => { ... });
  router.put("/api/projects/:id", isAuthenticated, async (req, res) => { ... });
  router.delete("/api/projects/:id", isAuthenticated, async (req, res) => { ... });
}
```

**Route Files**:
- `auth.ts` - Login, logout, user session
- `projects.ts` - Project CRUD operations
- `skills.ts` - Skills CRUD and reordering
- `testimonials.ts` - Testimonials CRUD
- `contact.ts` - Contact message handling
- `about.ts` - About info management
- `index.ts` - Aggregates all routes

#### Services Layer (Optional for Phase 1)
**Purpose**: Business logic and complex operations

**Note**: For this restructure, we'll keep business logic in routes initially. Services can be added later if complexity grows.

### 2. Client Component Organization

#### Layout Components (`client/src/components/layout/`)
- `navigation.tsx` - Main navigation bar
- `floating-navbar.tsx` - Floating side navigation
- `footer.tsx` - Site footer
- `theme-provider.tsx` - Theme context
- `theme-toggle.tsx` - Theme switcher

#### Section Components (`client/src/components/sections/`)
- `hero-section.tsx`
- `projects-section.tsx`
- `skills-section.tsx`
- `services-section.tsx`
- `about-section.tsx`
- `testimonials-section.tsx`
- `contact-section.tsx`
- `work-process-section.tsx`

#### Supporting Components (stay in root)
- `project-card.tsx` - Used by projects section
- `tech-slider.tsx` - Used by multiple sections
- `scroll-indicator.tsx` - Global utility
- `seo.tsx` - Global utility
- `error-boundary.tsx` - Global utility
- `page-loader.tsx` - Global utility (keep this one)

#### 3D Components Reorganization
```
components/3d/
├── core/
│   ├── hero-scene.tsx
│   ├── skills-scene.tsx
│   ├── animated-geometry.tsx
│   ├── particle-field.tsx
│   └── skill-orb.tsx
└── fallbacks/
    ├── hero-scene.tsx
    └── skills-scene.tsx
```

### 3. Database Configuration Fix

**Decision**: Use PostgreSQL consistently (based on drizzle.config.ts)

**Changes Required**:
1. Update `shared/schema.ts` to use `pgTable` instead of `sqliteTable`
2. Update column types to PostgreSQL equivalents:
   - `text()` → `text()` (same)
   - `integer()` → `integer()` or `serial()` for IDs
   - `integer({ mode: "boolean" })` → `boolean()`
   - `integer({ mode: "timestamp" })` → `timestamp()`
3. Update storage.ts if needed for PostgreSQL-specific queries

**Alternative**: If SQLite is preferred, update drizzle.config.ts to use SQLite dialect

### 4. Dependency Cleanup

**To Remove** (if confirmed unused):
- `recharts` - No chart usage found
- `ws` - No WebSocket usage found
- `input-otp` - No OTP input found
- `embla-carousel-autoplay` & `embla-carousel-react` - Check carousel usage
- `cmdk` - No command palette found
- `react-resizable-panels` - Check panel usage
- `@react-three/postprocessing` & `postprocessing` - Check if post-processing is used

**Process**: 
1. Search codebase for imports
2. Remove unused packages
3. Test build to ensure no breakage

## Data Models

No changes to data models. All existing schemas remain the same, only the table definition syntax changes for database consistency.

## Error Handling

### During Restructure
1. **Import Errors**: Use TypeScript compiler to catch broken imports
2. **Runtime Errors**: Test each phase before moving to next
3. **Rollback Strategy**: Git commits after each successful phase

### Validation Steps
1. Run TypeScript type checking: `npm run check`
2. Build application: `npm run build`
3. Start dev server: `npm run dev`
4. Test critical paths:
   - Public portfolio loads
   - Admin login works
   - CRUD operations function
   - File uploads work

## Testing Strategy

### Manual Testing Checklist
- [x] Public portfolio homepage loads
- [x] All sections render correctly
- [x] Navigation works (both nav bars)
- [x] Project detail pages load
- [x] Admin login works
- [x] Admin dashboard accessible
- [x] Create/Edit/Delete projects
- [x] Create/Edit/Delete skills
- [x] Create/Edit/Delete testimonials
- [x] View/Manage contact messages
- [x] Edit about info
- [x] File upload works
- [x] Theme toggle works
- [x] Mobile responsive

### Automated Checks
- TypeScript compilation: `npm run check`
- Build succeeds: `npm run build`
- No console errors in dev mode

## Implementation Phases

### Phase 1: Cleanup (Low Risk)
1. Delete duplicate components
2. Remove unused dependencies
3. Test that application still works

### Phase 2: Database Fix (Medium Risk)
1. Decide on PostgreSQL vs SQLite
2. Update schema definitions
3. Test database operations
4. Update migrations if needed

### Phase 3: Client Reorganization (Low Risk)
1. Create new directory structure
2. Move components to new locations
3. Update all imports
4. Test application

### Phase 4: Server Reorganization (High Risk)
1. Create middleware files
2. Create route files
3. Update server/index.ts to use new structure
4. Test all API endpoints
5. Move migration scripts

### Phase 5: Documentation (Low Risk)
1. Update README with new structure
2. Add architecture documentation
3. Document conventions

## Migration Strategy

### Incremental Approach
- One phase at a time
- Git commit after each successful phase
- Test thoroughly before proceeding
- Keep old code until new code is verified

### Rollback Plan
- Each phase is a separate commit
- Can revert to previous commit if issues arise
- No destructive changes until verification

## Risk Assessment

### High Risk Areas
1. **Server route reorganization** - Most complex, affects all API endpoints
2. **Database schema changes** - Could affect existing data

### Mitigation
1. Test each endpoint after server restructure
2. Backup database before schema changes
3. Use TypeScript to catch import errors
4. Incremental commits for easy rollback

### Low Risk Areas
1. Component reorganization - TypeScript will catch import errors
2. Deleting unused code - No impact on functionality
3. Documentation updates - No code impact
