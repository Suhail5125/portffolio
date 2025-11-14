import bcrypt from 'bcryptjs';
import type { InsertUser, InsertProject, InsertSkill, InsertContactMessage } from '../../shared/index.js';

/**
 * Test user fixtures
 */
export const testUsers = {
  admin: {
    username: 'admin',
    password: 'admin123',
    passwordHash: bcrypt.hashSync('admin123', 10),
  },
  testUser: {
    username: 'testuser',
    password: 'testpass123',
    passwordHash: bcrypt.hashSync('testpass123', 10),
  },
};

/**
 * Test project fixtures
 */
export const testProjects = {
  featured: {
    title: 'Featured Test Project',
    description: 'This is a featured test project with comprehensive details',
    imageUrl: 'https://example.com/featured.jpg',
    githubUrl: 'https://github.com/test/featured',
    liveUrl: 'https://featured.example.com',
    technologies: ['React', 'TypeScript', 'Node.js'],
    featured: true,
    order: 1,
  } satisfies InsertProject,

  regular: {
    title: 'Regular Test Project',
    description: 'This is a regular test project for testing purposes',
    imageUrl: 'https://example.com/regular.jpg',
    githubUrl: 'https://github.com/test/regular',
    liveUrl: '',
    technologies: ['Vue', 'JavaScript'],
    featured: false,
    order: 2,
  } satisfies InsertProject,

  minimal: {
    title: 'Minimal Test Project',
    description: 'Minimal project with required fields only',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    technologies: ['HTML', 'CSS'],
    featured: false,
    order: 3,
  } satisfies InsertProject,
};

/**
 * Test skill fixtures
 */
export const testSkills = {
  frontend: [
    {
      name: 'React',
      category: 'Frontend' as const,
      proficiency: 90,
      icon: 'react',
      order: 1,
    } satisfies InsertSkill,
    {
      name: 'TypeScript',
      category: 'Frontend' as const,
      proficiency: 85,
      icon: 'typescript',
      order: 2,
    } satisfies InsertSkill,
  ],

  backend: [
    {
      name: 'Node.js',
      category: 'Backend' as const,
      proficiency: 88,
      icon: 'nodejs',
      order: 3,
    } satisfies InsertSkill,
    {
      name: 'PostgreSQL',
      category: 'Backend' as const,
      proficiency: 80,
      icon: 'postgresql',
      order: 4,
    } satisfies InsertSkill,
  ],
};

/**
 * Test contact message fixtures
 */
export const testContactMessages = {
  unread: {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Inquiry',
    projectType: 'Web Development',
    message: 'This is a test message for testing purposes',
  } satisfies InsertContactMessage,

  read: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Another Test',
    projectType: 'Mobile App',
    message: 'This is another test message that has been read',
  } satisfies InsertContactMessage,
};

/**
 * Helper to create a test user data object for database insertion
 */
export function createTestUserData(username: string = 'admin'): InsertUser {
  const userData = testUsers[username as keyof typeof testUsers] || testUsers.admin;
  return {
    username: userData.username,
    password: userData.passwordHash,
  };
}
