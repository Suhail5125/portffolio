# Controllers

## Purpose

Controllers contain the business logic for handling HTTP requests and responses. They act as an intermediary between routes and services, processing request data, calling appropriate services, and formatting responses.

## Responsibilities

- Extract and validate request parameters, query strings, and body data
- Call service layer methods to perform business operations
- Handle errors and format error responses
- Format successful responses with appropriate status codes
- Keep routes thin by moving business logic here

## Structure

Each controller should focus on a specific domain or resource:

```typescript
// Example: ProjectController
export class ProjectController {
  async getAllProjects(req: Request, res: Response): Promise<void> {
    // 1. Extract query parameters
    // 2. Call service methods
    // 3. Format and send response
  }
  
  async createProject(req: Request, res: Response): Promise<void> {
    // 1. Validate request body
    // 2. Call service to create project
    // 3. Return created resource
  }
}
```

## Best Practices

- Keep controllers focused on HTTP concerns (request/response handling)
- Delegate complex business logic to services
- Use dependency injection for testability
- Return consistent response formats
- Handle errors gracefully with appropriate status codes
- Avoid direct database access (use services/repositories instead)

## Future Implementation

When refactoring routes, create controllers for:
- **ProjectController** - Project CRUD operations
- **SkillController** - Skill management
- **TestimonialController** - Testimonial management
- **ContactController** - Contact message handling
- **AboutController** - About info management
- **AuthController** - Authentication logic
