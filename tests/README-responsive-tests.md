# Responsive Design Automated Tests

## Overview

The `responsive-design-automated.test.ts` file contains comprehensive automated tests that validate the responsive design implementation across the portfolio website. These tests analyze component source code to ensure proper CSS classes and responsive patterns are in place.

## Test Coverage

### Task 11.1: Horizontal Overflow Detection (20 tests)

Tests that verify no content causes horizontal scrolling on mobile devices:

- **Navigation Component**: Validates max-width containers, responsive padding, and absence of fixed widths
- **Hero Section**: Checks container constraints, padding, and social links overflow prevention
- **Projects Section**: Verifies carousel overflow prevention and card centering
- **All Sections**: Ensures consistent max-w-7xl containers and responsive padding across all major sections

### Task 11.2: Title Centering (15 tests)

Tests that ensure all section titles and subtitles are properly centered:

- **Section Headers**: Validates text-center class on h2 titles and subtitles for Projects, Skills, Services, and Work Process sections
- **Hero Section**: Checks main heading and description paragraph centering with mx-auto

### Task 11.3: Touch Target Sizes (9 tests)

Tests that verify all interactive elements meet minimum touch target sizes (44x44px):

- **Navigation**: Mobile menu button and navigation items
- **Hero Section**: Social link buttons and icon sizing
- **Skills Section**: Category bubble sizing (96x96px minimum)
- **Work Process**: Category bubble sizing
- **Buttons**: Primary button sizing

### Task 11.4: Content Visibility (23 tests)

Tests that ensure all content is visible and properly displayed:

- **Navigation Header**: Title visibility on mobile (not hidden)
- **Services Section**: Grid layouts, card padding, icon sizing, and text sizing
- **Footer**: Availability box sizing without negative margins, copyright section layout
- **Work Process**: Grid layouts and text alignment
- **Skills Section**: Horizontal scrolling, snap scrolling, and scrollbar hiding

### Cross-Viewport Consistency (16 tests)

Tests that validate consistent patterns across all breakpoints:

- **Container Consistency**: max-w-7xl and mx-auto usage
- **Responsive Padding Progression**: px-4 → sm:px-6 → lg:px-8
- **Mobile-First Approach**: Base classes before responsive variants
- **Typography Scaling**: Proper heading size progression

## Running the Tests

### Run all responsive design tests:
```bash
npx vitest --run --config vitest.standalone.config.ts tests/responsive-design-automated.test.ts
```

### Run with watch mode:
```bash
npx vitest --config vitest.standalone.config.ts tests/responsive-design-automated.test.ts
```

### Run with coverage:
```bash
npx vitest --run --coverage --config vitest.standalone.config.ts tests/responsive-design-automated.test.ts
```

## Test Methodology

These tests use static code analysis to validate responsive design patterns:

1. **File Reading**: Tests read component source files directly
2. **Pattern Matching**: Regular expressions extract className attributes
3. **Class Validation**: Tests verify presence of required Tailwind CSS classes
4. **Pattern Verification**: Tests ensure proper responsive class patterns (e.g., `text-lg sm:text-xl`)

## Requirements Coverage

The tests cover all requirements from the responsive design specification:

- **Requirements 10.1-10.4**: Viewport testing across mobile, tablet, and desktop
- **Requirements 9.1-9.4**: Title and subtitle centering
- **Requirements 3.3, 4.4, 6.3**: Touch target sizes
- **Requirements 5.1-5.2, 7.1-7.2**: Content visibility

## Benefits

1. **Fast Execution**: Tests run in milliseconds without browser automation
2. **Early Detection**: Catches responsive design issues during development
3. **Regression Prevention**: Ensures responsive patterns aren't accidentally removed
4. **Documentation**: Tests serve as living documentation of responsive design requirements
5. **CI/CD Integration**: Can be easily integrated into continuous integration pipelines

## Maintenance

When adding new components or sections:

1. Add the component path to relevant test suites
2. Verify the component follows established responsive patterns
3. Run tests to ensure new code meets responsive design standards

## Related Files

- **Design Document**: `.kiro/specs/responsive-design-fixes/design.md`
- **Requirements**: `.kiro/specs/responsive-design-fixes/requirements.md`
- **Tasks**: `.kiro/specs/responsive-design-fixes/tasks.md`
- **Existing Tests**: `tests/responsive-breakpoints-standalone.test.ts`
