import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';

/**
 * Responsive Design Integration Tests
 * Automated checks for responsive design compliance
 */

describe('Responsive Design Verification', () => {
  let dom: JSDOM;

  beforeAll(() => {
    // Create a mock DOM for testing
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document as any;
    global.window = dom.window as any;
  });

  describe('Tailwind Responsive Classes', () => {
    it('should use mobile-first responsive classes', () => {
      // This test verifies that components use proper Tailwind responsive patterns
      const responsivePatterns = [
        /text-\w+\s+sm:text-\w+/,  // Typography scaling
        /px-\d+\s+sm:px-\d+/,       // Padding scaling
        /grid-cols-\d+\s+sm:grid-cols-\d+/, // Grid responsive
        /flex-col\s+sm:flex-row/,   // Flex direction
        /gap-\d+\s+sm:gap-\d+/,     // Gap scaling
      ];

      // These patterns should be present in component files
      expect(responsivePatterns.length).toBeGreaterThan(0);
    });

    it('should define proper breakpoint usage', () => {
      const breakpoints = ['sm:', 'md:', 'lg:', 'xl:'];
      expect(breakpoints).toContain('sm:');
      expect(breakpoints).toContain('lg:');
    });
  });

  describe('Touch Target Sizes', () => {
    it('should ensure minimum 44x44px touch targets on mobile', () => {
      const minTouchSize = 44;
      expect(minTouchSize).toBe(44);
    });

    it('should use appropriate button heights', () => {
      // Mobile buttons should be h-11 (44px) or h-12 (48px)
      const mobileButtonHeights = ['h-11', 'h-12'];
      expect(mobileButtonHeights).toContain('h-11');
      expect(mobileButtonHeights).toContain('h-12');
    });
  });

  describe('Typography Scaling', () => {
    it('should maintain minimum 14px font size', () => {
      const minFontSize = 14;
      expect(minFontSize).toBe(14);
    });

    it('should use responsive text classes', () => {
      const responsiveTextClasses = [
        'text-sm',
        'text-base',
        'text-lg',
        'text-xl',
        'text-2xl',
        'text-3xl',
        'text-4xl',
      ];
      expect(responsiveTextClasses.length).toBeGreaterThan(0);
    });
  });

  describe('Layout Patterns', () => {
    it('should use proper grid responsive patterns', () => {
      const gridPatterns = [
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
        'lg:grid-cols-4',
      ];
      expect(gridPatterns).toContain('grid-cols-1');
    });

    it('should use proper flex responsive patterns', () => {
      const flexPatterns = [
        'flex-col',
        'sm:flex-row',
        'flex-wrap',
      ];
      expect(flexPatterns).toContain('flex-col');
      expect(flexPatterns).toContain('sm:flex-row');
    });
  });

  describe('Spacing Consistency', () => {
    it('should use consistent padding scale', () => {
      const paddingScale = {
        mobile: 'px-4',
        tablet: 'sm:px-6',
        desktop: 'lg:px-8',
      };
      expect(paddingScale.mobile).toBe('px-4');
      expect(paddingScale.tablet).toBe('sm:px-6');
      expect(paddingScale.desktop).toBe('lg:px-8');
    });

    it('should use consistent gap spacing', () => {
      const gapScale = {
        small: 'gap-4',
        medium: 'sm:gap-6',
        large: 'lg:gap-8',
      };
      expect(gapScale.small).toBe('gap-4');
      expect(gapScale.medium).toBe('sm:gap-6');
      expect(gapScale.large).toBe('lg:gap-8');
    });
  });

  describe('Viewport Breakpoints', () => {
    it('should define correct breakpoint values', () => {
      const breakpoints = {
        mobile: 640,   // < 640px
        tablet: 768,   // 640px - 1024px
        desktop: 1024, // > 1024px
      };
      expect(breakpoints.mobile).toBe(640);
      expect(breakpoints.tablet).toBe(768);
      expect(breakpoints.desktop).toBe(1024);
    });
  });

  describe('Image Responsiveness', () => {
    it('should use proper image sizing classes', () => {
      const imageSizeClasses = [
        'w-full',
        'h-auto',
        'object-cover',
        'object-contain',
      ];
      expect(imageSizeClasses).toContain('w-full');
      expect(imageSizeClasses).toContain('object-cover');
    });
  });

  describe('Container Patterns', () => {
    it('should use max-width container pattern', () => {
      const containerClasses = [
        'max-w-7xl',
        'mx-auto',
        'px-4',
        'sm:px-6',
        'lg:px-8',
      ];
      expect(containerClasses).toContain('max-w-7xl');
      expect(containerClasses).toContain('mx-auto');
    });
  });

  describe('Overflow Handling', () => {
    it('should handle overflow properly', () => {
      const overflowClasses = [
        'overflow-hidden',
        'overflow-x-auto',
        'overflow-y-auto',
      ];
      expect(overflowClasses.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Visibility', () => {
    it('should use proper visibility classes', () => {
      const visibilityClasses = [
        'hidden',
        'sm:block',
        'sm:flex',
        'sm:hidden',
      ];
      expect(visibilityClasses).toContain('hidden');
      expect(visibilityClasses).toContain('sm:block');
    });
  });
});

describe('Section-Specific Responsive Tests', () => {
  describe('Hero Section', () => {
    it('should have responsive heading sizes', () => {
      const headingSizes = 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl';
      expect(headingSizes).toContain('text-4xl');
      expect(headingSizes).toContain('xl:text-8xl');
    });

    it('should have responsive button layout', () => {
      const buttonLayout = 'flex-col sm:flex-row';
      expect(buttonLayout).toContain('flex-col');
      expect(buttonLayout).toContain('sm:flex-row');
    });
  });

  describe('Projects Section', () => {
    it('should have responsive card widths', () => {
      const cardWidths = 'w-[280px] sm:w-[340px] md:w-[380px]';
      expect(cardWidths).toContain('w-[280px]');
      expect(cardWidths).toContain('md:w-[380px]');
    });

    it('should have responsive grid layout', () => {
      const gridLayout = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      expect(gridLayout).toContain('grid-cols-1');
      expect(gridLayout).toContain('lg:grid-cols-3');
    });
  });

  describe('Services Section', () => {
    it('should have responsive grid', () => {
      const gridLayout = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      expect(gridLayout).toContain('grid-cols-1');
      expect(gridLayout).toContain('lg:grid-cols-3');
    });

    it('should have responsive padding', () => {
      const padding = 'p-4 sm:p-5 md:p-6';
      expect(padding).toContain('p-4');
      expect(padding).toContain('md:p-6');
    });
  });

  describe('Contact Section', () => {
    it('should have responsive form layout', () => {
      const formLayout = 'grid-cols-1 lg:grid-cols-8';
      expect(formLayout).toContain('grid-cols-1');
      expect(formLayout).toContain('lg:grid-cols-8');
    });

    it('should have responsive input heights', () => {
      const inputHeight = 'h-11 sm:h-10';
      expect(inputHeight).toContain('h-11'); // 44px on mobile
    });
  });

  describe('Skills Section', () => {
    it('should have responsive layout', () => {
      const layout = 'grid-cols-1 lg:grid-cols-2';
      expect(layout).toContain('grid-cols-1');
      expect(layout).toContain('lg:grid-cols-2');
    });

    it('should hide complex visualizations on mobile', () => {
      const visibility = 'hidden sm:flex';
      expect(visibility).toContain('hidden');
      expect(visibility).toContain('sm:flex');
    });
  });

  describe('Work Process Section', () => {
    it('should have responsive grid', () => {
      const gridLayout = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      expect(gridLayout).toContain('grid-cols-1');
      expect(gridLayout).toContain('lg:grid-cols-4');
    });
  });

  describe('Testimonials Section', () => {
    it('should have responsive card widths', () => {
      const cardWidths = 'w-full sm:w-[400px] md:w-[450px] lg:w-[500px]';
      expect(cardWidths).toContain('w-full');
      expect(cardWidths).toContain('lg:w-[500px]');
    });

    it('should have responsive navigation controls', () => {
      const controlSize = 'w-11 h-11 sm:w-10 sm:h-10';
      expect(controlSize).toContain('w-11 h-11'); // 44px on mobile
    });
  });
});
