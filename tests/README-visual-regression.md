# Visual Regression Testing

## Overview

The visual regression testing suite validates responsive design implementation by capturing screenshots
at multiple viewports and comparing before/after states. This ensures that responsive design fixes
are properly applied and prevents future regressions.

## Test Coverage

### Task 12.1: Capture Baseline Screenshots

Captures screenshots of all sections at three key viewports:
- **Mobile**: 375x667px (iPhone SE)
- **Tablet**: 768x1024px (iPad Portrait)  
- **Desktop**: 1024x768px (Desktop)

**Sections Captured**:
- Navigation Header
- Hero Section
- Projects Section
- Skills Section
- Services Section
- Work Process Section
- Footer

### Task 12.2: Compare Before and After Implementations

Validates that responsive design fixes are properly implemented:
- ✓ Titles are now centered (before: left-aligned)
- ✓ No horizontal scroll (before: overflow present)
- ✓ Footer availability box fits (before: overflow)
- ✓ All content is visible (before: cut off)

## Running the Tests

### Prerequisites

1. Start the development server:
```bash
npm run dev
```

2. Ensure the app is running at `http://localhost:5000`

### Run All Visual Regression Tests

```bash
npm run test:visual
```

### Capture Baseline Screenshots Only
```bash
npm run test:visual:baseline
```

### Run Comparison Tests Only
```bash
npm run test:visual:compare
```

### With Custom URL
```bash
TEST_URL=http://localhost:3000 npm run test:visual
```

## Screenshot Locations

- **Baseline**: `tests/screenshots/baseline/` - Original state screenshots
- **Current**: `tests/screenshots/current/` - Current implementation screenshots
- **Diff**: `tests/screenshots/diff/` - Visual difference images

## Requirements Coverage

All requirements from the responsive design specification (Requirements 1.1 through 10.4):

- **Requirement 1**: Navigation header visibility and centering
- **Requirement 2**: Hero section layout and content visibility
- **Requirement 3**: Projects section title and card centering
- **Requirement 4**: Skills section category bubbles and scrolling
- **Requirement 5**: Services section card visibility
- **Requirement 6**: Work process section layout
- **Requirement 7**: Footer availability box sizing
- **Requirement 8**: Footer copyright layout
- **Requirement 9**: Section title centering
- **Requirement 10**: Content overflow prevention

## Test Methodology

1. **Screenshot Capture**: Uses Playwright to capture screenshots at different viewports
2. **Visual Validation**: Compares element positioning, sizing, and visibility
3. **Code Analysis**: Validates CSS classes and responsive patterns
4. **Functional Testing**: Tests actual page rendering and behavior

## Generated Reports

### Baseline Documentation
`tests/screenshots/baseline-documentation.md` - Documents the baseline state

### Comparison Report
`tests/screenshots/comparison-report.md` - Details before/after comparisons

## CI/CD Integration

Add to your CI pipeline:
```yaml
- name: Run Visual Regression Tests
  run: |
    npm run dev &
    sleep 5
    npm run test:visual
```

## Maintenance

### Updating Baselines
When making intentional design changes:
1. Delete old baseline screenshots
2. Run `npm run test:visual:baseline` to capture new baselines
3. Commit new baseline screenshots to version control

### Adding New Sections
Update `SECTIONS` array in `tests/visual-regression.test.ts`:
```typescript
{ name: 'new-section', selector: '[class*="new-section"]', description: 'New Section' }
```

## Troubleshooting

### Server Not Running
Ensure dev server is running before tests:
```bash
npm run dev
```

### Screenshots Not Captured
Check that selectors match your component structure:
- Navigation: `nav`
- Sections: `[class*="section-name"]`
- Footer: `footer`

### Playwright Installation
If Playwright browsers aren't installed:
```bash
npx playwright install chromium
```

## Related Files

- **Test Suite**: `tests/visual-regression.test.ts`
- **Design Document**: `.kiro/specs/responsive-design-fixes/design.md`
- **Requirements**: `.kiro/specs/responsive-design-fixes/requirements.md`
- **Tasks**: `.kiro/specs/responsive-design-fixes/tasks.md`
