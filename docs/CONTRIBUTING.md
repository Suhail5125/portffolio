# Contributing Guide

Thank you for your interest in contributing to this portfolio website project! This guide will help you get started with development and understand our processes.

## Table of Contents

- [Development Setup](#development-setup)
- [Code Style and Conventions](#code-style-and-conventions)
- [Git Workflow](#git-workflow)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Documentation Requirements](#documentation-requirements)
- [Getting Help](#getting-help)

---

## Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher
- **npm** (comes with Node.js)
- **PostgreSQL** 14 or higher
- **Git** for version control

### Initial Setup

1. **Fork and Clone the Repository**

   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/portfolio.git
   cd portfolio
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory:

   ```bash
   # Copy the example file
   cp .env.example .env
   ```

   Edit `.env` and configure the following variables:

   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/portfolio

   # Session
   SESSION_SECRET=your-secret-key-here

   # Server
   PORT=5000
   NODE_ENV=development
   ```

4. **Set Up the Database**

   ```bash
   # Create the database
   createdb portfolio

   # Push the schema to the database
   npm run db:push

   # Seed with sample data
   npm run db:seed
   ```

5. **Start the Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

### Development Tools

- **Type Checking**: `npm run check` - Run TypeScript type checking
- **Linting**: `npm run lint` - Check for type errors
- **Database Studio**: `npm run db:studio` - Open Drizzle Studio to view/edit database
- **Tests**: `npm run test` - Run all tests
- **Test Watch Mode**: `npm run test:watch` - Run tests in watch mode

---

## Code Style and Conventions

### File Naming

- **Components**: `kebab-case.tsx` (e.g., `hero-section.tsx`, `project-card.tsx`)
- **Pages**: `kebab-case.tsx` (e.g., `home.tsx`, `admin-login.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-projects.ts`, `use-auth.ts`)
- **Utilities**: `kebab-case.ts` (e.g., `format-date.ts`, `api-client.ts`)
- **Routes**: `kebab-case.ts` (e.g., `projects.ts`, `auth.ts`)
- **Directories**: `kebab-case` (e.g., `components/`, `admin/`)

### Code Naming

- **React Components**: `PascalCase` (e.g., `HeroSection`, `ProjectCard`)
- **Functions**: `camelCase` (e.g., `getUserProjects`, `formatDate`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`, `MAX_FILE_SIZE`)
- **Configuration Objects**: `camelCase` (e.g., `dbConfig`, `authOptions`)

### TypeScript

- Always use TypeScript for new files
- Define proper types and interfaces
- Avoid using `any` - use `unknown` if type is truly unknown
- Use type inference where possible
- Export types that are used across files

```typescript
// Good
interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string;
}

export function ProjectCard({ title, description, imageUrl }: ProjectCardProps) {
  // ...
}

// Avoid
export function ProjectCard(props: any) {
  // ...
}
```

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use proper prop destructuring
- Add JSDoc comments for complex components

```typescript
/**
 * Displays a project card with image, title, and description
 * @param title - The project title
 * @param description - Brief project description
 * @param imageUrl - Optional project image URL
 */
export function ProjectCard({ title, description, imageUrl }: ProjectCardProps) {
  // Component implementation
}
```

### Formatting

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings (except JSX attributes)
- **Semicolons**: Required
- **Line Length**: Aim for 80-100 characters, max 120
- **Trailing Commas**: Use in multi-line arrays and objects

```typescript
// Good
const config = {
  name: 'Portfolio',
  version: '1.0.0',
  features: ['projects', 'skills', 'contact'],
};

// Avoid
const config = {
  name: "Portfolio",
  version: "1.0.0",
  features: ["projects", "skills", "contact"]
}
```

### Import Organization

Organize imports in the following order:

1. External dependencies (React, third-party libraries)
2. Internal absolute imports (using `@/` alias)
3. Relative imports
4. Type imports (if not inline)

```typescript
// External
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// Internal
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// Relative
import { ProjectCard } from './project-card';
import type { Project } from './types';
```

### Component Structure

Organize component files in this order:

1. Imports
2. Type definitions
3. Constants
4. Component definition
5. Helper functions (if small and component-specific)
6. Exports

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types
interface ProjectFormProps {
  onSubmit: (data: ProjectData) => void;
}

// 3. Constants
const MAX_TITLE_LENGTH = 100;

// 4. Component
export function ProjectForm({ onSubmit }: ProjectFormProps) {
  const [title, setTitle] = useState('');
  
  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}

// 5. Helper functions
function validateTitle(title: string): boolean {
  return title.length > 0 && title.length <= MAX_TITLE_LENGTH;
}
```

### API Routes

- Use RESTful conventions
- Return appropriate HTTP status codes
- Validate input with Zod schemas
- Handle errors consistently
- Add JSDoc comments for endpoints

```typescript
/**
 * GET /api/projects
 * Retrieves all projects, optionally filtered by featured status
 */
router.get('/projects', async (req, res) => {
  try {
    const projects = await db.select().from(projectsTable);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});
```

### Database Operations

- Use Drizzle ORM for all database operations
- Define schemas in `shared/schema.ts`
- Use transactions for multi-step operations
- Handle errors appropriately

```typescript
// Good
const newProject = await db.insert(projectsTable)
  .values(projectData)
  .returning();

// Avoid raw SQL unless absolutely necessary
```

---

## Git Workflow

### Branching Strategy

We use a feature branch workflow:

- `main` - Production-ready code
- `develop` - Integration branch for features (if used)
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Creating a Branch

```bash
# Update your local main branch
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b feature/add-blog-section

# Or for a bug fix
git checkout -b fix/contact-form-validation
```

### Commit Messages

Write clear, descriptive commit messages following this format:

```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
# Good commit messages
git commit -m "feat: add blog post management to admin panel"
git commit -m "fix: resolve contact form validation error"
git commit -m "docs: update API documentation for projects endpoint"
git commit -m "refactor: extract project card logic into custom hook"

# Avoid
git commit -m "updates"
git commit -m "fix bug"
git commit -m "changes"
```

### Keeping Your Branch Updated

```bash
# Regularly sync with main
git checkout main
git pull origin main
git checkout feature/your-feature
git rebase main

# Or merge if you prefer
git merge main
```

---

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**
   ```bash
   npm run test
   ```

2. **Run type checking**
   ```bash
   npm run check
   ```

3. **Test your changes locally**
   - Start the dev server and verify functionality
   - Test in different browsers if UI changes
   - Check responsive design on mobile

4. **Update documentation**
   - Update relevant docs if you changed APIs or features
   - Add JSDoc comments to new functions
   - Update README if needed

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature
   ```

### Creating a Pull Request

1. Go to the repository on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- List key changes
- Be specific about what was added/modified

## Testing
- [ ] All tests pass
- [ ] Added new tests for new features
- [ ] Manually tested the changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### PR Requirements

Your pull request must:

- ✅ Pass all automated tests
- ✅ Have no TypeScript errors
- ✅ Include tests for new features
- ✅ Update relevant documentation
- ✅ Follow code style conventions
- ✅ Have a clear description
- ✅ Reference related issues

### Review Process

1. **Automated Checks**: CI/CD will run tests and type checking
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

### Addressing Feedback

```bash
# Make requested changes
git add .
git commit -m "fix: address PR feedback"
git push origin feature/your-feature
```

The PR will automatically update with your new commits.

---

## Testing Requirements

### Test Coverage

All contributions should include appropriate tests:

- **New Features**: Must include tests covering core functionality
- **Bug Fixes**: Must include a test that would have caught the bug
- **Refactoring**: Existing tests must still pass

### Types of Tests

#### Unit Tests

Test individual functions and utilities in isolation.

**Location**: `tests/unit/`

**Example**:
```typescript
// tests/unit/validation.test.ts
import { describe, it, expect } from 'vitest';
import { insertProjectSchema } from '@shared/schemas';

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
});
```

#### Integration Tests

Test API endpoints and database operations.

**Location**: `tests/integration/`

**Example**:
```typescript
// tests/integration/projects.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '@/server';

describe('Projects API', () => {
  it('should get all projects', async () => {
    const response = await request(app).get('/api/projects');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test suite
npm run test:unit
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Database

Tests use a separate test database configured via `TEST_DATABASE_URL` environment variable.

Add to your `.env`:
```env
TEST_DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_test
```

### Writing Good Tests

- **Descriptive names**: Test names should clearly describe what they test
- **Arrange-Act-Assert**: Structure tests with setup, execution, and verification
- **One assertion per test**: Focus each test on a single behavior
- **Clean up**: Use `beforeEach` and `afterEach` to set up and tear down
- **Avoid test interdependence**: Tests should be able to run in any order

```typescript
// Good
describe('User Authentication', () => {
  it('should return 200 when credentials are valid', async () => {
    // Arrange
    const credentials = { username: 'admin', password: 'admin123' };
    
    // Act
    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials);
    
    // Assert
    expect(response.status).toBe(200);
  });
});
```

---

## Documentation Requirements

### Code Documentation

#### JSDoc Comments

Add JSDoc comments for:
- Public functions and methods
- Complex logic
- API endpoints
- React components with non-obvious props

```typescript
/**
 * Formats a date string into a human-readable format
 * @param date - The date to format (Date object or ISO string)
 * @param format - The desired format (default: 'MMMM dd, yyyy')
 * @returns Formatted date string
 * @example
 * formatDate(new Date('2024-01-15')) // "January 15, 2024"
 */
export function formatDate(date: Date | string, format = 'MMMM dd, yyyy'): string {
  // Implementation
}
```

#### Inline Comments

Use inline comments for:
- Complex algorithms
- Non-obvious business logic
- Workarounds or hacks (with explanation)

```typescript
// Calculate the average proficiency across all skills
// We filter out skills with 0 proficiency to avoid skewing the average
const avgProficiency = skills
  .filter(skill => skill.proficiency > 0)
  .reduce((sum, skill) => sum + skill.proficiency, 0) / skills.length;
```

### Documentation Files

#### When to Update Documentation

Update documentation when you:
- Add new API endpoints → Update `docs/api/README.md`
- Change environment variables → Update `docs/configuration/environment-variables.md`
- Modify deployment process → Update relevant deployment guide
- Add new features → Update main `README.md`
- Change architecture → Update `docs/architecture/README.md`

#### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep formatting consistent
- Use proper markdown syntax

### README Updates

If your changes affect:
- Installation steps
- Available scripts
- Configuration
- Features

Update the main `README.md` accordingly.

---

## Getting Help

### Resources

- **Documentation**: Check the `docs/` directory
- **API Reference**: See `docs/api/README.md`
- **Architecture**: See `docs/architecture/README.md`
- **Issues**: Browse existing GitHub issues

### Asking Questions

If you need help:

1. **Check existing documentation** first
2. **Search closed issues** - your question may have been answered
3. **Open a new issue** with:
   - Clear description of the problem
   - Steps to reproduce (if applicable)
   - Your environment (OS, Node version, etc.)
   - What you've already tried

### Communication

- Be respectful and constructive
- Provide context and details
- Be patient - maintainers are volunteers
- Help others when you can

---

## Code of Conduct

### Our Standards

- Be welcoming and inclusive
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other conduct inappropriate in a professional setting

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

## Thank You!

Thank you for contributing to this project! Your efforts help make this portfolio website better for everyone.

If you have suggestions for improving this contributing guide, please open an issue or submit a PR.

Happy coding! 🚀
