import { describe, it, expect } from 'vitest';
import {
  insertProjectSchema,
  insertSkillSchema,
  insertContactMessageSchema,
  insertUserSchema,
} from '../../shared/schemas/validation';

describe('Validation Schemas', () => {
  describe('Project Validation', () => {
    it('should validate valid project data', () => {
      const validProject = {
        title: 'Test Project',
        description: 'A test project description',
        imageUrl: 'https://example.com/image.jpg',
        technologies: ['React', 'TypeScript'],
        featured: false,
        githubUrl: 'https://github.com/user/repo',
        liveUrl: 'https://example.com',
      };

      const result = insertProjectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });

    it('should validate project with minimal required fields', () => {
      const minimalProject = {
        title: 'Minimal Project',
        description: 'Description',
        technologies: ['JavaScript'],
        featured: false,
      };

      const result = insertProjectSchema.safeParse(minimalProject);
      expect(result.success).toBe(true);
    });

    it('should reject project with missing title', () => {
      const invalidProject = {
        description: 'A test project',
        technologies: ['React'],
        featured: false,
      };

      const result = insertProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });

    it('should reject project with missing description', () => {
      const invalidProject = {
        title: 'Test Project',
        technologies: ['React'],
        featured: false,
      };

      const result = insertProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });

    it('should reject project with empty technologies array', () => {
      const invalidProject = {
        title: 'Test Project',
        description: 'Description',
        technologies: [],
        featured: false,
      };

      const result = insertProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('At least one technology is required');
      }
    });

    it('should reject project with invalid githubUrl', () => {
      const invalidProject = {
        title: 'Test Project',
        description: 'Description',
        technologies: ['React'],
        featured: false,
        githubUrl: 'not-a-valid-url',
      };

      const result = insertProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });

    it('should accept project with empty string URLs', () => {
      const validProject = {
        title: 'Test Project',
        description: 'Description',
        technologies: ['React'],
        featured: false,
        githubUrl: '',
        liveUrl: '',
        imageUrl: '',
      };

      const result = insertProjectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });

    it('should reject project with invalid type for featured', () => {
      const invalidProject = {
        title: 'Test Project',
        description: 'Description',
        technologies: ['React'],
        featured: 'yes', // Should be boolean
      };

      const result = insertProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });
  });

  describe('Skill Validation', () => {
    it('should validate valid skill data', () => {
      const validSkill = {
        name: 'React',
        category: 'Frontend',
        proficiency: 85,
        icon: 'react-icon',
        displayOrder: 1,
      };

      const result = insertSkillSchema.safeParse(validSkill);
      expect(result.success).toBe(true);
    });

    it('should validate skill with minimal required fields', () => {
      const minimalSkill = {
        name: 'JavaScript',
        category: 'Frontend',
        proficiency: 50,
        displayOrder: 1,
      };

      const result = insertSkillSchema.safeParse(minimalSkill);
      expect(result.success).toBe(true);
    });

    it('should reject skill with missing name', () => {
      const invalidSkill = {
        category: 'Frontend',
        proficiency: 85,
        displayOrder: 1,
      };

      const result = insertSkillSchema.safeParse(invalidSkill);
      expect(result.success).toBe(false);
    });

    it('should reject skill with invalid category', () => {
      const invalidSkill = {
        name: 'React',
        category: 'InvalidCategory',
        proficiency: 85,
        displayOrder: 1,
      };

      const result = insertSkillSchema.safeParse(invalidSkill);
      expect(result.success).toBe(false);
    });

    it('should accept all valid categories', () => {
      const categories = ['Frontend', 'Backend', '3D/Graphics', 'Tools', 'Other'];
      
      categories.forEach(category => {
        const skill = {
          name: 'Test Skill',
          category,
          proficiency: 50,
          displayOrder: 1,
        };
        
        const result = insertSkillSchema.safeParse(skill);
        expect(result.success).toBe(true);
      });
    });

    it('should reject skill with proficiency below 1', () => {
      const invalidSkill = {
        name: 'React',
        category: 'Frontend',
        proficiency: 0,
        displayOrder: 1,
      };

      const result = insertSkillSchema.safeParse(invalidSkill);
      expect(result.success).toBe(false);
    });

    it('should reject skill with proficiency above 100', () => {
      const invalidSkill = {
        name: 'React',
        category: 'Frontend',
        proficiency: 101,
        displayOrder: 1,
      };

      const result = insertSkillSchema.safeParse(invalidSkill);
      expect(result.success).toBe(false);
    });

    it('should accept proficiency at boundary values', () => {
      const skill1 = {
        name: 'React',
        category: 'Frontend',
        proficiency: 1,
        displayOrder: 1,
      };
      
      const skill100 = {
        name: 'React',
        category: 'Frontend',
        proficiency: 100,
        displayOrder: 1,
      };

      expect(insertSkillSchema.safeParse(skill1).success).toBe(true);
      expect(insertSkillSchema.safeParse(skill100).success).toBe(true);
    });
  });

  describe('Contact Message Validation', () => {
    it('should validate valid contact message data', () => {
      const validMessage = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I would like to discuss a project with you.',
        projectType: 'Web Development',
      };

      const result = insertContactMessageSchema.safeParse(validMessage);
      expect(result.success).toBe(true);
    });

    it('should reject message with missing email', () => {
      const invalidMessage = {
        name: 'John Doe',
        subject: 'Project Inquiry',
        message: 'I would like to discuss a project.',
        projectType: 'Web Development',
      };

      const result = insertContactMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
    });

    it('should reject message with invalid email format', () => {
      const invalidMessage = {
        name: 'John Doe',
        email: 'not-an-email',
        subject: 'Project Inquiry',
        message: 'I would like to discuss a project.',
        projectType: 'Web Development',
      };

      const result = insertContactMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email');
      }
    });

    it('should reject message with empty email', () => {
      const invalidMessage = {
        name: 'John Doe',
        email: '',
        subject: 'Project Inquiry',
        message: 'I would like to discuss a project.',
        projectType: 'Web Development',
      };

      const result = insertContactMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Email is required');
      }
    });

    it('should reject message with name too short', () => {
      const invalidMessage = {
        name: 'J',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I would like to discuss a project.',
        projectType: 'Web Development',
      };

      const result = insertContactMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters');
      }
    });

    it('should reject message with name too long', () => {
      const invalidMessage = {
        name: 'A'.repeat(101),
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I would like to discuss a project.',
        projectType: 'Web Development',
      };

      const result = insertContactMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 100 characters');
      }
    });

    it('should reject message with name containing invalid characters', () => {
      const invalidMessage = {
        name: 'John123',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I would like to discuss a project.',
        projectType: 'Web Development',
      };

      const result = insertContactMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('letters and spaces');
      }
    });

    it('should accept name with spaces', () => {
      const validMessage = {
        name: 'John Michael Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I would like to discuss a project.',
        projectType: 'Web Development',
      };

      const result = insertContactMessageSchema.safeParse(validMessage);
      expect(result.success).toBe(true);
    });

    it('should reject message with message too short', () => {
      const invalidMessage = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'Short',
        projectType: 'Web Development',
      };

      const result = insertContactMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 10 characters');
      }
    });

    it('should reject message with message too long', () => {
      const invalidMessage = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'A'.repeat(1001),
        projectType: 'Web Development',
      };

      const result = insertContactMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 1000 characters');
      }
    });

    it('should reject message with missing subject', () => {
      const invalidMessage = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: '',
        message: 'I would like to discuss a project.',
        projectType: 'Web Development',
      };

      const result = insertContactMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Subject is required');
      }
    });

    it('should reject message with subject too long', () => {
      const invalidMessage = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'A'.repeat(201),
        message: 'I would like to discuss a project.',
        projectType: 'Web Development',
      };

      const result = insertContactMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 200 characters');
      }
    });

    it('should reject message with missing projectType', () => {
      const invalidMessage = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Project Inquiry',
        message: 'I would like to discuss a project.',
        projectType: '',
      };

      const result = insertContactMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Project type is required');
      }
    });
  });

  describe('User Validation', () => {
    it('should validate valid user data', () => {
      const validUser = {
        username: 'admin',
        password: 'securePassword123',
      };

      const result = insertUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should reject user with missing username', () => {
      const invalidUser = {
        password: 'securePassword123',
      };

      const result = insertUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });}
);