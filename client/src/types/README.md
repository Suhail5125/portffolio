# Types Directory

This directory contains **frontend-specific** type definitions for the client application.

## When to Use `client/src/types/` vs `shared/`

### Use `client/src/types/` for:

1. **API Response Types**
   - Wrapper types for API responses (e.g., `ApiResponse<T>`, `ApiError`)
   - Upload responses, authentication responses
   - Any types that represent the structure of HTTP responses

2. **Client-Side Extended Types**
   - Types that extend shared types with UI-specific properties
   - Example: `ProjectWithStats` extends `Project` with computed UI properties
   - Types with temporary UI state (e.g., `isEditing`, `isDragging`, `isSelected`)

3. **Frontend-Only Data Structures**
   - Form state types
   - Component prop types (when reused across multiple components)
   - UI state management types
   - Client-side utility types

4. **Third-Party Library Types**
   - Custom type definitions for external libraries
   - Extended types from UI libraries

### Use `shared/` for:

1. **Database Schema Types**
   - Types inferred from Drizzle ORM schemas
   - Example: `Project`, `Skill`, `Testimonial`, `ContactMessage`, `AboutInfo`, `User`

2. **Validation Schemas**
   - Zod schemas for data validation
   - Example: `insertProjectSchema`, `insertSkillSchema`

3. **Types Used by Both Client and Server**
   - Any type that needs to be shared between frontend and backend
   - Business logic types
   - Domain model types

## Import Guidelines

### Importing from `types/`
```typescript
// Import API response types
import type { ApiResponse, UploadResponse } from "@/types/api";

// Import extended types
import type { ProjectWithStats } from "@/types/api";
```

### Importing from `shared/`
```typescript
// Import base entity types
import type { Project, Skill, InsertProject } from "@shared";
```

### Re-exports
The `types/api.ts` file re-exports commonly used shared types for convenience:
```typescript
// Both of these work:
import type { Project } from "@shared";
import type { Project } from "@/types/api";
```

## File Organization

```
client/src/types/
├── README.md          # This file - documentation
├── api.ts             # API response types and re-exports
└── [future files]     # Add more type files as needed
```

## Best Practices

1. **Keep types close to usage**: If a type is only used in one component, define it in that component file
2. **Use this directory for reusable types**: Only move types here when they're used in multiple places
3. **Document complex types**: Add JSDoc comments for non-obvious types
4. **Prefer type over interface**: Use `type` for simple types, `interface` for extensible objects
5. **Export types explicitly**: Always use `export type` for type-only exports

## Examples

### ✅ Good: Frontend-specific API response type
```typescript
// client/src/types/api.ts
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}
```

### ✅ Good: Extended type with UI state
```typescript
// client/src/types/api.ts
export interface SkillWithState extends Skill {
  isEditing?: boolean;
  isDragging?: boolean;
}
```

### ❌ Bad: Database schema type (belongs in shared/)
```typescript
// Don't do this - use shared/schema.ts instead
export interface Project {
  id: string;
  title: string;
  // ...
}
```

### ❌ Bad: Single-use component prop type (keep in component)
```typescript
// Don't do this - define in the component file instead
export interface ButtonProps {
  onClick: () => void;
  label: string;
}
```
