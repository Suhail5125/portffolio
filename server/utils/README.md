# Utils

## Purpose

Utility functions provide common, reusable helper functions that can be used throughout the application. These are pure functions or simple helpers that don't fit into controllers or services.

## Responsibilities

- Provide common data transformation functions
- Offer formatting and parsing utilities
- Supply validation helpers
- Provide response formatting utilities
- Include date/time manipulation helpers
- Contain string manipulation functions

## Structure

Organize utilities by category in separate files:

```typescript
// Example: response.ts
export function successResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    message
  };
}

export function errorResponse(message: string, status: number) {
  return {
    success: false,
    error: message,
    status
  };
}

// Example: validation.ts
export function sanitizeValues<T>(values: T): T {
  // Remove null/undefined values
  // Trim strings
  // Return sanitized object
}

export function isValidUrl(url: string): boolean {
  // URL validation logic
}
```

## Best Practices

- Keep functions pure (no side effects) when possible
- Make functions small and focused on one task
- Use TypeScript generics for reusable type-safe utilities
- Document complex utility functions
- Write unit tests for utility functions
- Avoid business logic (that belongs in services)

## Future Implementation

Common utility categories to create:
- **response.ts** - HTTP response formatting helpers
- **validation.ts** - Common validation functions
- **sanitization.ts** - Data sanitization utilities
- **date.ts** - Date formatting and manipulation
- **string.ts** - String manipulation helpers
- **array.ts** - Array transformation utilities
- **object.ts** - Object manipulation helpers
