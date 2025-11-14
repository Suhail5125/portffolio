# Visual Regression Baseline Documentation

## Capture Date
2025-11-14T17:27:32.566Z

## Viewports Tested
- Mobile: 375x667px (iPhone SE)
- Tablet: 768x1024px (iPad Portrait)
- Desktop: 1024x768px (Desktop)

## Sections Captured
- Navigation Header (nav)
- Hero Section ([class*="hero"])
- Projects Section ([class*="projects"])
- Skills Section ([class*="skills"])
- Services Section ([class*="services"])
- Work Process Section ([class*="work-process"])
- Footer (footer)

## Purpose
These baseline screenshots represent the current state of the responsive design implementation.
They will be used to compare against future changes and verify that responsive design fixes
are properly applied.

## Requirements Coverage
All requirements from the responsive design specification (Requirements 1.1 through 10.4):
- Navigation header visibility and centering
- Hero section layout and content visibility
- Projects section title and card centering
- Skills section category bubbles and scrolling
- Services section card visibility
- Work process section layout
- Footer availability box and copyright layout
- Section title centering
- Content overflow prevention

## How to Use
1. Run this test suite to capture baseline screenshots
2. Make responsive design changes
3. Run the comparison tests to verify changes
4. Review diff images to identify any regressions

## Screenshot Locations
- Baseline: tests/screenshots/baseline/
- Current: tests/screenshots/current/
- Diffs: tests/screenshots/diff/
