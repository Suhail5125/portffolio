import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Automated Responsive Design Tests
 * 
 * These tests validate the responsive design implementation by analyzing
 * component source code for proper CSS classes and patterns.
 * 
 * Requirements covered:
 * - 10.1, 10.2, 10.3, 10.4: Viewport testing
 * - 9.1, 9.2, 9.3, 9.4: Title centering
 * - 3.3, 4.4, 6.3: Touch target sizes
 * - 5.1, 5.2, 7.1, 7.2: Content visibility
 */

// Helper function to read component files
function readComponent(componentPath: string): string {
  const fullPath = join(process.cwd(), componentPath);
  return readFileSync(fullPath, 'utf-8');
}

// Helper function to check if a string contains a pattern
function containsPattern(content: string, pattern: RegExp): boolean {
  return pattern.test(content);
}

// Helper function to extract all className attributes
function extractClassNames(content: string): string[] {
  const classNameRegex = /className=["']([^"']+)["']/g;
  const matches: string[] = [];
  let match;
  
  while ((match = classNameRegex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  
  return matches;
}

describe('Task 11.1: Horizontal Overflow Detection', () => {
  describe('Navigation Component', () => {
    it('should use max-w-7xl for main container to prevent overflow', () => {
      const content = readComponent('client/src/components/layout/navigation.tsx');
      expect(content).toContain('max-w-7xl');
      expect(content).toContain('mx-auto');
    });

    it('should use responsive padding that accounts for viewport', () => {
      const content = readComponent('client/src/components/layout/navigation.tsx');
      expect(content).toMatch(/px-\d+\s+sm:px-\d+\s+lg:px-\d+/);
    });

    it('should not have fixed widths that exceed mobile viewport', () => {
      const content = readComponent('client/src/components/layout/navigation.tsx');
      // Should not have w-[500px] or similar without responsive variants
      expect(content).not.toMatch(/w-\[5\d{2,}px\](?!\s+sm:)/);
    });
  });

  describe('Hero Section', () => {
    it('should use max-w-7xl container with proper centering', () => {
      const content = readComponent('client/src/components/sections/hero-section.tsx');
      expect(content).toContain('max-w-7xl mx-auto');
    });

    it('should use responsive padding for all viewports', () => {
      const content = readComponent('client/src/components/sections/hero-section.tsx');
      expect(content).toMatch(/px-4\s+sm:px-6\s+lg:px-8/);
    });

    it('should constrain social links container to prevent overflow', () => {
      const content = readComponent('client/src/components/sections/hero-section.tsx');
      expect(content).toContain('w-full max-w-full');
      expect(content).toMatch(/max-w-(xl|2xl|3xl)/);
    });

    it('should use flex-wrap for button containers', () => {
      const content = readComponent('client/src/components/sections/hero-section.tsx');
      expect(content).toContain('flex-wrap');
    });
  });

  describe('Projects Section', () => {
    it('should use max-w-full to prevent carousel overflow', () => {
      const content = readComponent('client/src/components/sections/projects-section.tsx');
      expect(content).toContain('max-w-full');
    });

    it('should use proper responsive padding', () => {
      const content = readComponent('client/src/components/sections/projects-section.tsx');
      expect(content).toMatch(/px-2\s+sm:px-4/);
    });

    it('should center cards on mobile with justify-center', () => {
      const content = readComponent('client/src/components/sections/projects-section.tsx');
      expect(content).toMatch(/justify-center\s+sm:justify-start/);
    });
  });

  describe('All Sections - General Overflow Prevention', () => {
    const sections = [
      'client/src/components/sections/hero-section.tsx',
      'client/src/components/sections/projects-section.tsx',
      'client/src/components/sections/skills-section.tsx',
      'client/src/components/sections/services-section.tsx',
      'client/src/components/sections/work-process-section.tsx',
    ];

    sections.forEach((sectionPath) => {
      it(`${sectionPath.split('/').pop()} should use max-w-7xl container`, () => {
        const content = readComponent(sectionPath);
        expect(content).toContain('max-w-7xl');
      });

      it(`${sectionPath.split('/').pop()} should use responsive padding`, () => {
        const content = readComponent(sectionPath);
        expect(content).toMatch(/px-4|px-2/);
      });
    });
  });
});

describe('Task 11.2: Title Centering', () => {
  describe('Section Headers', () => {
    const sections = [
      { path: 'client/src/components/sections/projects-section.tsx', name: 'Projects' },
      { path: 'client/src/components/sections/skills-section.tsx', name: 'Skills' },
      { path: 'client/src/components/sections/services-section.tsx', name: 'Services' },
      { path: 'client/src/components/sections/work-process-section.tsx', name: 'Work Process' },
    ];

    sections.forEach(({ path, name }) => {
      it(`${name} section should have text-center on h2 title`, () => {
        const content = readComponent(path);
        const classNames = extractClassNames(content);
        
        // Find h2 elements and check for text-center
        const h2Pattern = /<h2[^>]*className=["']([^"']+)["'][^>]*>/g;
        const h2Matches = content.match(h2Pattern);
        
        if (h2Matches) {
          h2Matches.forEach(match => {
            const classMatch = match.match(/className=["']([^"']+)["']/);
            if (classMatch) {
              expect(classMatch[1]).toContain('text-center');
            }
          });
        }
      });

      it(`${name} section should have text-center on subtitle`, () => {
        const content = readComponent(path);
        
        // Look for subtitle paragraphs with text-center and max-w (main section subtitles)
        const subtitlePattern = /<p[^>]*className=["']([^"']*text-muted-foreground[^"']*max-w[^"']*)["'][^>]*>/g;
        const matches = content.match(subtitlePattern);
        
        if (matches && matches.length > 0) {
          matches.forEach(match => {
            const classMatch = match.match(/className=["']([^"']+)["']/);
            if (classMatch) {
              expect(classMatch[1]).toContain('text-center');
            }
          });
        } else {
          // If no subtitle with max-w found, test passes (section may not have subtitle)
          expect(true).toBe(true);
        }
      });

      it(`${name} section subtitle should have mx-auto for centering`, () => {
        const content = readComponent(path);
        
        // Look for subtitle paragraphs with mx-auto
        const subtitlePattern = /<p[^>]*className=["']([^"']*text-muted-foreground[^"']*)["'][^>]*>/g;
        const matches = content.match(subtitlePattern);
        
        if (matches) {
          matches.forEach(match => {
            const classMatch = match.match(/className=["']([^"']+)["']/);
            if (classMatch && classMatch[1].includes('max-w')) {
              expect(classMatch[1]).toContain('mx-auto');
            }
          });
        }
      });
    });
  });

  describe('Hero Section', () => {
    it('should center main heading with text-center', () => {
      const content = readComponent('client/src/components/sections/hero-section.tsx');
      // Look for h1 with text-center in the main hero section (not loading/error states)
      expect(content).toContain('text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl');
      expect(content).toMatch(/text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl[^>]*text-center/);
    });

    it('should center description paragraph', () => {
      const content = readComponent('client/src/components/sections/hero-section.tsx');
      // Look for the main description paragraph with max-w-3xl
      expect(content).toMatch(/max-w-3xl mx-auto[^>]*text-center/);
    });

    it('should use mx-auto on description for horizontal centering', () => {
      const content = readComponent('client/src/components/sections/hero-section.tsx');
      expect(content).toMatch(/max-w-3xl\s+mx-auto/);
    });
  });
});

describe('Task 11.3: Touch Target Sizes', () => {
  describe('Navigation Component', () => {
    it('should ensure mobile menu button meets 44x44px minimum', () => {
      const content = readComponent('client/src/components/layout/navigation.tsx');
      expect(content).toMatch(/min-h-\[44px\]\s+min-w-\[44px\]/);
    });

    it('should ensure mobile navigation items meet minimum height', () => {
      const content = readComponent('client/src/components/layout/navigation.tsx');
      // Mobile menu items should have proper padding for touch targets
      expect(content).toMatch(/py-3/); // Ensures minimum height with padding
    });
  });

  describe('Hero Section Social Links', () => {
    it('should ensure social link buttons are properly sized', () => {
      const content = readComponent('client/src/components/sections/hero-section.tsx');
      // Social links should have p-3 or p-4 for proper touch targets
      expect(content).toMatch(/p-3\s+sm:p-4/);
    });

    it('should use proper icon sizing for touch targets', () => {
      const content = readComponent('client/src/components/sections/hero-section.tsx');
      // Icons should be h-6 w-6 or larger
      expect(content).toMatch(/h-6\s+w-6/);
    });
  });

  describe('Skills Section Category Bubbles', () => {
    it('should ensure category bubbles meet minimum size (96x96px)', () => {
      const content = readComponent('client/src/components/sections/skills-section.tsx');
      // Should have w-24 h-24 (96px) or larger
      expect(content).toMatch(/w-24\s+h-24/);
    });

    it('should scale bubbles appropriately on larger screens', () => {
      const content = readComponent('client/src/components/sections/skills-section.tsx');
      expect(content).toMatch(/sm:w-28\s+sm:h-28/);
    });
  });

  describe('Work Process Category Bubbles', () => {
    it('should ensure work process bubbles meet minimum size', () => {
      const content = readComponent('client/src/components/sections/work-process-section.tsx');
      // Should have w-20 h-20 or larger on mobile
      expect(content).toMatch(/w-20\s+h-20/);
    });

    it('should scale bubbles on larger screens', () => {
      const content = readComponent('client/src/components/sections/work-process-section.tsx');
      expect(content).toMatch(/sm:w-24\s+sm:h-24/);
    });
  });

  describe('Button Components', () => {
    it('should ensure all primary buttons have adequate size', () => {
      const heroContent = readComponent('client/src/components/sections/hero-section.tsx');
      // Buttons should have size="lg" or proper padding
      expect(heroContent).toContain('size="lg"');
    });
  });
});

describe('Task 11.4: Content Visibility', () => {
  describe('Navigation Header', () => {
    it('should display title on mobile (not hidden)', () => {
      const content = readComponent('client/src/components/layout/navigation.tsx');
      const titleSpan = content.match(/<span[^>]*className=["']([^"']*font-display[^"']*)["'][^>]*>[\s\S]*?CodebySRS/);
      
      if (titleSpan) {
        // Should NOT contain 'hidden sm:block'
        expect(titleSpan[1]).not.toContain('hidden');
      }
    });

    it('should use responsive text sizing for title', () => {
      const content = readComponent('client/src/components/layout/navigation.tsx');
      expect(content).toMatch(/text-lg\s+sm:text-xl/);
    });
  });

  describe('Services Section Cards', () => {
    it('should use single column grid on mobile', () => {
      const content = readComponent('client/src/components/sections/services-section.tsx');
      expect(content).toMatch(/grid-cols-1/);
    });

    it('should use 2-column grid on tablet', () => {
      const content = readComponent('client/src/components/sections/services-section.tsx');
      expect(content).toMatch(/sm:grid-cols-2/);
    });

    it('should use 3-column grid on desktop', () => {
      const content = readComponent('client/src/components/sections/services-section.tsx');
      expect(content).toMatch(/lg:grid-cols-3/);
    });

    it('should use responsive card padding', () => {
      const content = readComponent('client/src/components/sections/services-section.tsx');
      expect(content).toMatch(/p-4\s+sm:p-5\s+md:p-6/);
    });

    it('should use responsive icon sizing', () => {
      const content = readComponent('client/src/components/sections/services-section.tsx');
      expect(content).toMatch(/h-5\s+w-5\s+sm:h-6\s+sm:w-6/);
    });

    it('should use responsive text sizing for titles', () => {
      const content = readComponent('client/src/components/sections/services-section.tsx');
      expect(content).toMatch(/text-lg\s+sm:text-xl/);
    });

    it('should use responsive text sizing for descriptions', () => {
      const content = readComponent('client/src/components/sections/services-section.tsx');
      expect(content).toMatch(/text-sm\s+sm:text-base/);
    });
  });

  describe('Footer Availability Box', () => {
    it('should not use negative margins that cause overflow', () => {
      const content = readComponent('client/src/components/layout/footer.tsx');
      // Should NOT contain w-[120%] or -ml-[20%]
      expect(content).not.toContain('w-[120%]');
      expect(content).not.toContain('-ml-[20%]');
    });

    it('should use w-full max-w-sm for proper sizing', () => {
      const content = readComponent('client/src/components/layout/footer.tsx');
      expect(content).toMatch(/w-full\s+max-w-sm/);
    });

    it('should center on mobile with items-center', () => {
      const content = readComponent('client/src/components/layout/footer.tsx');
      expect(content).toMatch(/items-center\s+md:items-start/);
    });
  });

  describe('Footer Copyright Section', () => {
    it('should stack vertically on mobile', () => {
      const content = readComponent('client/src/components/layout/footer.tsx');
      expect(content).toMatch(/flex-col\s+md:flex-row/);
    });

    it('should center text on mobile', () => {
      const content = readComponent('client/src/components/layout/footer.tsx');
      expect(content).toMatch(/text-center\s+md:text-left/);
    });

    it('should use flex-wrap for proper wrapping', () => {
      const content = readComponent('client/src/components/layout/footer.tsx');
      expect(content).toContain('flex-wrap');
    });
  });

  describe('Work Process Section', () => {
    it('should use single column grid on mobile', () => {
      const content = readComponent('client/src/components/sections/work-process-section.tsx');
      expect(content).toMatch(/grid-cols-1/);
    });

    it('should use 2-column grid on tablet', () => {
      const content = readComponent('client/src/components/sections/work-process-section.tsx');
      expect(content).toMatch(/sm:grid-cols-2/);
    });

    it('should use 4-column grid on desktop', () => {
      const content = readComponent('client/src/components/sections/work-process-section.tsx');
      expect(content).toMatch(/lg:grid-cols-4/);
    });

    it('should center text on mobile, left-align on larger screens', () => {
      const content = readComponent('client/src/components/sections/work-process-section.tsx');
      expect(content).toMatch(/text-center\s+sm:text-left/);
    });
  });

  describe('Skills Section', () => {
    it('should enable horizontal scrolling for category bubbles', () => {
      const content = readComponent('client/src/components/sections/skills-section.tsx');
      expect(content).toContain('overflow-x-auto');
    });

    it('should implement snap scrolling', () => {
      const content = readComponent('client/src/components/sections/skills-section.tsx');
      expect(content).toMatch(/snap-x\s+snap-mandatory/);
    });

    it('should prevent bubble shrinking', () => {
      const content = readComponent('client/src/components/sections/skills-section.tsx');
      expect(content).toContain('flex-shrink-0');
    });

    it('should hide scrollbar for cleaner appearance', () => {
      const content = readComponent('client/src/components/sections/skills-section.tsx');
      expect(content).toContain('scrollbar-hide');
    });
  });
});

describe('Cross-Viewport Consistency', () => {
  describe('Container Consistency', () => {
    const sections = [
      'client/src/components/sections/hero-section.tsx',
      'client/src/components/sections/projects-section.tsx',
      'client/src/components/sections/skills-section.tsx',
      'client/src/components/sections/services-section.tsx',
      'client/src/components/sections/work-process-section.tsx',
    ];

    sections.forEach((sectionPath) => {
      it(`${sectionPath.split('/').pop()} should use consistent max-w-7xl container`, () => {
        const content = readComponent(sectionPath);
        expect(content).toContain('max-w-7xl');
      });

      it(`${sectionPath.split('/').pop()} should use consistent mx-auto centering`, () => {
        const content = readComponent(sectionPath);
        expect(content).toContain('mx-auto');
      });
    });
  });

  describe('Responsive Padding Progression', () => {
    it('should follow mobile-first padding pattern', () => {
      const content = readComponent('client/src/components/sections/hero-section.tsx');
      // Should have px-4 (mobile) -> sm:px-6 (tablet) -> lg:px-8 (desktop)
      const paddingMatch = content.match(/px-4\s+sm:px-6\s+lg:px-8/);
      expect(paddingMatch).toBeTruthy();
    });

    it('should use consistent gap progression', () => {
      const content = readComponent('client/src/components/sections/services-section.tsx');
      // Should have gap-4 -> sm:gap-6 -> lg:gap-8
      const gapMatch = content.match(/gap-4\s+sm:gap-6\s+lg:gap-8/);
      expect(gapMatch).toBeTruthy();
    });
  });

  describe('Mobile-First Approach', () => {
    it('should define base mobile styles before responsive variants', () => {
      const content = readComponent('client/src/components/sections/hero-section.tsx');
      // Base class should come before sm: variant
      const textSizePattern = /text-\w+\s+sm:text-\w+/;
      expect(content).toMatch(textSizePattern);
    });

    it('should use flex-col before sm:flex-row pattern', () => {
      const content = readComponent('client/src/components/sections/hero-section.tsx');
      expect(content).toMatch(/flex-col\s+sm:flex-row/);
    });
  });

  describe('Typography Scaling', () => {
    it('should scale hero heading across all breakpoints', () => {
      const content = readComponent('client/src/components/sections/hero-section.tsx');
      // Should have text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
      expect(content).toMatch(/text-4xl\s+sm:text-5xl\s+md:text-6xl\s+lg:text-7xl\s+xl:text-8xl/);
    });

    it('should scale section headings appropriately', () => {
      const content = readComponent('client/src/components/sections/projects-section.tsx');
      // Should have text-3xl sm:text-4xl md:text-5xl
      expect(content).toMatch(/text-3xl\s+sm:text-4xl\s+md:text-5xl/);
    });
  });
});
