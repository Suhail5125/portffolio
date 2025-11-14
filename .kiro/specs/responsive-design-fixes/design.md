# Design Document

## Overview

This design document addresses critical responsive design failures in the portfolio website's home page. The previous implementation did not properly apply mobile-responsive classes, resulting in content overflow, misaligned elements, and poor user experience on mobile devices. This specification provides concrete solutions for each identified issue with specific Tailwind CSS classes and layout adjustments.

The design follows a mobile-first approach with emphasis on:
- Proper content centering using flexbox and text alignment
- Preventing horizontal overflow with max-width constraints
- Ensuring all interactive elements are visible and accessible
- Consistent spacing that adapts to viewport size

## Architecture

### Responsive Strategy

**Core Principles:**
1. **Mobile-First**: Base styles target mobile (<640px), enhance for larger screens
2. **Content Centering**: Use `text-center`, `mx-auto`, `justify-center`, `items-center`
3. **Overflow Prevention**: Apply `max-w-full`, `w-full`, proper padding calculations
4. **Visibility Assurance**: Ensure min-height, proper z-index, no negative margins on mobile
5. **Touch Optimization**: Maintain 44x44px minimum touch targets

### Breakpoint System

- **Mobile**: < 640px (base styles, sm: prefix for 640px+)
- **Tablet**: 640px - 1024px (sm: and md: prefixes)
- **Desktop**: > 1024px (lg: and xl: prefixes)

## Components and Interfaces

### 1. Navigation Component (`navigation.tsx`)

**Current Issues:**
- Title "CodebySRS" is hidden on mobile (uses `hidden sm:block`)
- Header may not be properly centered

**Design Solution:**

```typescript
// Logo and title - ALWAYS visible
<span className="font-display text-lg sm:text-xl font-bold gradient-text-cyan-magenta">
  CodebySRS
</span>
```

**Key Changes:**
- Remove `hidden sm:block` from title span
- Use `text-lg` on mobile, `text-xl` on larger screens
- Ensure logo container uses flexbox centering


### 2. Hero Section (`hero-section.tsx`)

**Current Issues:**
- Content may not be properly centered on mobile
- Buttons and social links may overflow or misalign
- Padding may cause horizontal scroll

**Design Solution:**

```typescript
// Main container - ensure centering
<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-32 pb-32 text-center">

// Heading - ensure proper sizing and centering
<h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-8 text-center">

// Description - ensure centering and max-width
<p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed text-center">

// Button container - ensure proper stacking and centering
<div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 mb-12">

// Social links container - prevent overflow
<div className="flex w-full max-w-full sm:max-w-xl flex-wrap items-center justify-center gap-4 sm:gap-6 mx-auto">
```

**Key Changes:**
- Add `text-center` to all text elements
- Use `mx-auto` for horizontal centering
- Apply `max-w-full` to prevent overflow
- Ensure `items-center justify-center` on flex containers
- Use `w-full` with `max-w-full` on social links container

### 3. Projects Section (`projects-section.tsx`)

**Current Issues:**
- Section title and subtitle not centered on mobile
- Project cards not centered within viewport
- Carousel may cause horizontal overflow

**Design Solution:**

```typescript
// Section header container - ensure centering
<div className="text-center mb-8 w-full">

// Title - ensure centering
<h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center">
  <span className="gradient-text-cyan-purple">Featured Projects</span>
</h2>

// Subtitle - ensure centering
<p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 text-center">
  Innovation meets design in our latest creations
</p>

// Carousel container - center and prevent overflow
<div className="relative w-full max-w-full overflow-x-auto sm:overflow-x-hidden pb-20">
  <div className="relative max-w-[1280px] mx-auto px-2 sm:px-4">
    <div className="relative flex gap-4 justify-center sm:justify-start">
```

**Key Changes:**
- Add `text-center` to title and subtitle
- Use `mx-auto` on subtitle with `max-w-2xl`
- Apply `max-w-full` to carousel container
- Use `justify-center` on mobile, `justify-start` on larger screens
- Ensure proper padding that doesn't cause overflow


### 4. Skills Section (`skills-section.tsx`)

**Current Issues:**
- Category bubbles not positioned properly on mobile
- Bubbles don't slide when focused
- Content may overflow viewport

**Design Solution:**

```typescript
// Main container - ensure proper layout
<section className="min-h-screen py-12 sm:py-16 md:py-20 relative overflow-hidden">
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Category selector - horizontal scroll on mobile
<div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scrollbar-hide mb-8 sm:mb-0">
  {categories.map((category) => (
    <button
      className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center"
      onClick={() => {
        setSelectedCategory(category);
        // Scroll button into view
        event.currentTarget.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest', 
          inline: 'center' 
        });
      }}
    >
```

**Key Changes:**
- Use `overflow-x-auto` for horizontal scrolling
- Add `snap-x snap-mandatory` for smooth snapping
- Implement `scrollIntoView` on button click to center focused category
- Use `flex-shrink-0` to prevent button compression
- Add `scrollbar-hide` utility class for cleaner appearance
- Ensure minimum touch target size (96x96px on mobile)

### 5. Services Section (`services-section.tsx`)

**Current Issues:**
- Service cards not fully visible on mobile
- Titles and descriptions cut off
- Cards too tall for mobile viewport

**Design Solution:**

```typescript
// Section container - ensure proper spacing
<section className="min-h-screen py-12 sm:py-16 md:py-20 relative flex items-center">
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

// Section header - ensure centering
<div className="text-center mb-8 sm:mb-12">
  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center">
  <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-center">

// Services grid - single column on mobile
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

// Service card - optimized height
<div className="glass rounded-xl border border-border/50 p-4 sm:p-5 md:p-6 hover-elevate transition-all">
  <div className="flex flex-col h-full">
    // Icon
    <div className="p-2.5 sm:p-3 rounded-lg mb-3 sm:mb-4">
      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
    </div>
    // Title
    <h3 className="text-lg sm:text-xl font-bold mb-2 text-center sm:text-left">
    // Description
    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-center sm:text-left">
```

**Key Changes:**
- Use `flex items-center` on section to vertically center content
- Single column grid on mobile for better visibility
- Reduce padding on mobile (p-4 vs p-6)
- Smaller icons and text on mobile
- Center text on mobile, left-align on larger screens
- Use `h-full` and flexbox for consistent card heights


### 6. Work Process Section (`work-process-section.tsx`)

**Current Issues:**
- Title and subtitle not centered on mobile
- Category bubbles not properly positioned
- Process cards half-visible or cut off

**Design Solution:**

```typescript
// Section container
<section className="min-h-screen py-12 sm:py-16 md:py-20 relative overflow-hidden">
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Section header - ensure centering
<div className="text-center mb-8 sm:mb-12">
  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center">
    <span className="gradient-text-cyan-purple">Our Work Process</span>
  </h2>
  <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 text-center">
    From concept to completion
  </p>
</div>

// Category bubbles - horizontal scroll
<div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scrollbar-hide mb-8 justify-center sm:justify-start">
  <button className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full">

// Process steps grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
  <div className="glass rounded-xl border border-border/50 p-4 sm:p-5 md:p-6">
    // Step number
    <div className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 text-center sm:text-left">
    // Step title
    <h3 className="text-lg sm:text-xl font-bold mb-2 text-center sm:text-left">
    // Step description
    <p className="text-sm sm:text-base text-muted-foreground text-center sm:text-left">
```

**Key Changes:**
- Add `text-center` to all section headers
- Use `mx-auto` with `max-w-2xl` for subtitle
- Implement horizontal scrolling for category bubbles
- Add `justify-center` on mobile for bubble container
- Single column grid on mobile, two on tablet, four on desktop
- Center text on mobile, left-align on larger screens
- Ensure cards fit within viewport with proper padding

### 7. Footer Component (`footer.tsx`)

**Current Issues:**
- "Available for Work" box has negative margins causing overflow (`w-[120%] -ml-[20%]`)
- Copyright line not properly responsive
- Content not centered on mobile

**Design Solution:**

```typescript
// Footer container
<footer className="relative py-12 border-t border-border overflow-hidden">
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Main grid - stack on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

// Brand section - center on mobile
<div className="flex flex-col items-center md:items-start">
  <h3 className="font-display text-2xl font-bold gradient-text-cyan-magenta mb-4 text-center md:text-left">
  <p className="text-muted-foreground text-sm leading-relaxed text-center md:text-left">

// Availability box - REMOVE negative margins
<div className="flex flex-col items-center md:items-start">
  <div className="glass rounded-xl border border-border/50 p-4 sm:p-6 w-full max-w-sm hover-elevate transition-all relative overflow-hidden">
    // Remove: w-[120%] -ml-[20%]
    // Add: w-full max-w-sm

// Copyright section - stack on mobile
<div className="pt-6 border-t border-border/80">
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
    // Copyright text
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <p className="text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-2">
    
    // Links
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground/70">
```

**Key Changes:**
- Remove negative margins and percentage widths from availability box
- Use `w-full max-w-sm` instead of `w-[120%] -ml-[20%]`
- Add `items-center` on mobile, `items-start` on desktop
- Use `text-center` on mobile, `text-left` on desktop
- Stack copyright content vertically on mobile
- Use `flex-wrap` and `justify-center` for proper wrapping
- Ensure all text is centered on mobile viewports


## Data Models

No data model changes required. All modifications are presentational/UI-only.

## Error Handling

### Responsive Layout Fallbacks

1. **Overflow Detection**: Use browser DevTools to identify horizontal scroll
2. **Content Truncation**: Implement text wrapping with `break-words` where needed
3. **Image Scaling**: Ensure all images use `max-w-full` and proper aspect ratios
4. **Touch Target Validation**: Verify all interactive elements meet 44x44px minimum

### Browser Compatibility

- Test on iOS Safari (primary mobile browser)
- Test on Chrome Mobile (Android)
- Verify touch events work properly
- Test with various viewport sizes (375px, 390px, 414px)

## Testing Strategy

### Manual Testing Checklist

**Per Section Testing:**
1. Open section on mobile device or DevTools mobile view
2. Verify no horizontal scrolling
3. Check all titles/subtitles are centered
4. Confirm all content is visible
5. Test interactive elements (buttons, links)
6. Verify proper spacing and padding

**Viewport Testing:**
- 375px (iPhone SE) - minimum supported width
- 390px (iPhone 12/13/14)
- 414px (iPhone Plus models)
- 768px (iPad portrait)
- 1024px (iPad landscape)

**Specific Tests:**
1. **Header**: Title visible at all sizes
2. **Hero**: No overflow, buttons stack properly
3. **Projects**: Cards centered, no horizontal scroll
4. **Skills**: Categories slide when focused
5. **Services**: All cards visible, content readable
6. **Work Process**: Title centered, cards not cut off
7. **Footer**: Availability box fits, copyright wraps properly

### Automated Testing

```typescript
// Test for horizontal overflow
describe('Responsive Layout', () => {
  it('should not have horizontal scroll on mobile', () => {
    cy.viewport(375, 667);
    cy.visit('/');
    cy.window().then((win) => {
      expect(win.document.body.scrollWidth).to.equal(win.innerWidth);
    });
  });
  
  it('should center section titles on mobile', () => {
    cy.viewport(375, 667);
    cy.get('h2').each(($el) => {
      cy.wrap($el).should('have.class', 'text-center');
    });
  });
});
```

## Implementation Notes

### Critical Tailwind Classes

**Centering:**
```css
text-center          /* Center text */
mx-auto             /* Center block element */
items-center        /* Center flex items vertically */
justify-center      /* Center flex items horizontally */
```

**Overflow Prevention:**
```css
max-w-full          /* Prevent width overflow */
w-full              /* Full width of container */
overflow-hidden     /* Hide overflow */
overflow-x-auto     /* Allow horizontal scroll */
```

**Responsive Spacing:**
```css
px-4 sm:px-6 lg:px-8        /* Responsive horizontal padding */
py-12 sm:py-16 md:py-20     /* Responsive vertical padding */
gap-4 sm:gap-6 lg:gap-8     /* Responsive gap */
```

**Responsive Typography:**
```css
text-lg sm:text-xl          /* Responsive text size */
text-3xl sm:text-4xl md:text-5xl  /* Responsive heading */
```

### Mobile-Specific Optimizations

1. **Reduce Padding**: Use smaller padding on mobile to maximize content space
2. **Stack Layouts**: Use `flex-col` on mobile, `flex-row` on larger screens
3. **Single Column Grids**: Use `grid-cols-1` on mobile
4. **Center Everything**: Default to centered layout on mobile
5. **Touch Targets**: Ensure minimum 44x44px for all interactive elements

### Common Patterns

**Responsive Container:**
```typescript
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

**Responsive Section Header:**
```typescript
<div className="text-center mb-8 sm:mb-12">
  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center">
  <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-center">
</div>
```

**Responsive Grid:**
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
```

**Horizontal Scroll Container:**
```typescript
<div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scrollbar-hide">
  <div className="flex-shrink-0 w-24 h-24">
```

## Performance Considerations

1. **CSS Bundle Size**: Tailwind purge removes unused classes
2. **Scroll Performance**: Use `will-change: transform` for smooth scrolling
3. **Touch Events**: Use passive event listeners
4. **Image Loading**: Implement lazy loading for off-screen images

## Accessibility Considerations

1. **Touch Targets**: Minimum 44x44px (WCAG 2.1 Level AAA)
2. **Text Contrast**: Ensure sufficient contrast ratios
3. **Focus Indicators**: Visible focus states on all interactive elements
4. **Semantic HTML**: Proper heading hierarchy
5. **ARIA Labels**: Add labels for icon-only buttons

## Migration Strategy

1. **Component-by-Component**: Fix one section at a time
2. **Test After Each Change**: Verify on real device or DevTools
3. **Maintain Functionality**: Ensure no features break
4. **Visual Regression**: Compare before/after screenshots
5. **User Testing**: Get feedback on mobile usability
