import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/sections/hero-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ServicesSection } from '@/components/sections/services-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { WorkProcessSection } from '@/components/sections/work-process-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { ContactSection } from '@/components/sections/contact-section';

/**
 * Section Centering Verification Tests
 * Verifies that all section titles and subtitles have proper centering classes
 * and that no section causes horizontal overflow
 */

describe('Section Centering Verification', () => {
  describe('Hero Section', () => {
    it('should have centered text elements', () => {
      const mockAboutInfo = {
        id: 1,
        name: 'Test User',
        title: 'Developer',
        bio: 'Test bio',
        email: 'test@example.com',
        githubUrl: 'https://github.com/test',
        linkedinUrl: 'https://linkedin.com/in/test',
        twitterUrl: null,
        instagramUrl: null,
        avatarUrl: null,
        resumeUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { container } = render(
        <HeroSection aboutInfo={mockAboutInfo} isLoading={false} />
      );

      // Check main container has text-center
      const mainContainer = container.querySelector('.text-center');
      expect(mainContainer).toBeTruthy();

      // Check heading has text-center
      const heading = container.querySelector('h1');
      expect(heading?.className).toContain('text-center');

      // Check description has text-center
      const description = container.querySelector('p.text-center');
      expect(description).toBeTruthy();
    });
  });

  describe('Projects Section', () => {
    it('should have centered title and subtitle', () => {
      const { container } = render(
        <ProjectsSection projects={[]} isLoading={false} />
      );

      // Find h2 title
      const title = container.querySelector('h2');
      expect(title?.className).toContain('text-center');

      // Find subtitle paragraph
      const subtitle = container.querySelector('p.text-muted-foreground');
      expect(subtitle?.className).toContain('text-center');
      expect(subtitle?.className).toContain('mx-auto');
    });
  });

  describe('Services Section', () => {
    it('should have centered title and subtitle', () => {
      const { container } = render(<ServicesSection />);

      // Find h2 title
      const title = container.querySelector('h2');
      expect(title?.className).toContain('text-center');

      // Find subtitle paragraph
      const subtitle = container.querySelector('p.text-muted-foreground');
      expect(subtitle?.className).toContain('text-center');
      expect(subtitle?.className).toContain('mx-auto');
    });
  });

  describe('Skills Section', () => {
    it('should have centered title and subtitle', () => {
      const { container } = render(
        <SkillsSection skills={[]} isLoading={false} />
      );

      // Find h2 title
      const title = container.querySelector('h2');
      expect(title?.className).toContain('text-center');

      // Find subtitle paragraph
      const subtitle = container.querySelector('p.text-muted-foreground');
      expect(subtitle?.className).toContain('text-center');
      expect(subtitle?.className).toContain('mx-auto');
    });
  });

  describe('Work Process Section', () => {
    it('should have centered title and subtitle', () => {
      const { container } = render(<WorkProcessSection />);

      // Find h2 title
      const title = container.querySelector('h2');
      expect(title?.className).toContain('text-center');

      // Find subtitle paragraph
      const subtitle = container.querySelector('p.text-muted-foreground');
      expect(subtitle?.className).toContain('text-center');
      expect(subtitle?.className).toContain('mx-auto');
    });
  });

  describe('Testimonials Section', () => {
    it('should have centered title and subtitle', () => {
      const { container } = render(
        <TestimonialsSection testimonials={[]} isLoading={false} />
      );

      // Find h2 title
      const title = container.querySelector('h2');
      expect(title?.className).toContain('text-center');

      // Find subtitle paragraph
      const subtitle = container.querySelector('p.text-muted-foreground');
      expect(subtitle?.className).toContain('text-center');
      expect(subtitle?.className).toContain('mx-auto');
    });
  });

  describe('Contact Section', () => {
    it('should have centered title and subtitle', () => {
      const mockOnSubmit = async () => {};
      const { container } = render(
        <ContactSection onSubmit={mockOnSubmit} isSubmitting={false} />
      );

      // Find h2 title
      const title = container.querySelector('h2');
      expect(title?.className).toContain('text-center');

      // Find subtitle paragraph
      const subtitle = container.querySelector('p.text-muted-foreground');
      expect(subtitle?.className).toContain('text-center');
      expect(subtitle?.className).toContain('mx-auto');
    });
  });

  describe('Overflow Prevention', () => {
    it('should use max-w-full or w-full on containers to prevent overflow', () => {
      const mockAboutInfo = {
        id: 1,
        name: 'Test User',
        title: 'Developer',
        bio: 'Test bio',
        email: 'test@example.com',
        githubUrl: 'https://github.com/test',
        linkedinUrl: 'https://linkedin.com/in/test',
        twitterUrl: null,
        instagramUrl: null,
        avatarUrl: null,
        resumeUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { container } = render(
        <HeroSection aboutInfo={mockAboutInfo} isLoading={false} />
      );

      // Check for max-w-full or w-full classes
      const socialLinksContainer = container.querySelector('.w-full.max-w-full');
      expect(socialLinksContainer).toBeTruthy();
    });

    it('should use proper responsive padding that prevents overflow', () => {
      const { container } = render(
        <ProjectsSection projects={[]} isLoading={false} />
      );

      // Check for responsive padding classes
      const mainContainer = container.querySelector('.px-4');
      expect(mainContainer).toBeTruthy();
    });
  });

  describe('Responsive Container Patterns', () => {
    it('should use max-w-7xl mx-auto pattern for main containers', () => {
      const { container } = render(
        <ServicesSection />
      );

      // Check for max-w-7xl mx-auto pattern
      const mainContainer = container.querySelector('.max-w-7xl.mx-auto');
      expect(mainContainer).toBeTruthy();
    });

    it('should use max-w-2xl mx-auto for subtitles', () => {
      const { container } = render(
        <ProjectsSection projects={[]} isLoading={false} />
      );

      // Check for max-w-2xl mx-auto on subtitle
      const subtitle = container.querySelector('.max-w-2xl.mx-auto');
      expect(subtitle).toBeTruthy();
    });
  });
});
