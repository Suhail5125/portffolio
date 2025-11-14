import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createTestApp } from '../helpers/app';
import { getTestDb, cleanDatabase } from '../helpers/db';
import { users, projects } from '../../shared/index.js';
import { createTestUserData, testProjects } from '../helpers/fixtures';
import { getAuthCookie } from '../helpers/auth';

describe('Projects API', () => {
  let app: Express;
  let db: ReturnType<typeof getTestDb>;
  let authCookie: string[];

  beforeEach(async () => {
    // Create test app
    app = await createTestApp();
    db = getTestDb();
    
    // Clean database and seed test user
    await cleanDatabase(db);
    await db.insert(users).values(createTestUserData('admin'));
    
    // Get auth cookie for protected routes
    authCookie = await getAuthCookie(app);
  });

  afterEach(async () => {
    await cleanDatabase(db);
  });

  describe('GET /api/projects (public access)', () => {
    it('should return empty array when no projects exist', async () => {
      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all projects', async () => {
      // Seed test projects
      await db.insert(projects).values([
        testProjects.featured,
        testProjects.regular,
      ]);

      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('technologies');
    });

    it('should not require authentication', async () => {
      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/projects/:id (public access)', () => {
    it('should return a specific project by id', async () => {
      // Seed a test project
      const [insertedProject] = await db.insert(projects)
        .values(testProjects.featured)
        .returning();

      const response = await request(app)
        .get(`/api/projects/${insertedProject.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', insertedProject.id);
      expect(response.body).toHaveProperty('title', testProjects.featured.title);
      expect(response.body).toHaveProperty('description', testProjects.featured.description);
      expect(response.body).toHaveProperty('technologies');
      expect(response.body.technologies).toEqual(testProjects.featured.technologies);
    });

    it('should return 404 for non-existent project', async () => {
      const response = await request(app)
        .get('/api/projects/99999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Project not found');
    });

    it('should not require authentication', async () => {
      const [insertedProject] = await db.insert(projects)
        .values(testProjects.featured)
        .returning();

      const response = await request(app)
        .get(`/api/projects/${insertedProject.id}`);

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/projects (requires authentication)', () => {
    it('should create a new project with valid data', async () => {
      const newProject = {
        title: 'New Test Project',
        description: 'A brand new test project',
        imageUrl: 'https://example.com/new.jpg',
        githubUrl: 'https://github.com/test/new',
        liveUrl: 'https://new.example.com',
        technologies: ['React', 'Node.js'],
        featured: true,
        order: 1,
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Cookie', authCookie)
        .send(newProject);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', newProject.title);
      expect(response.body).toHaveProperty('description', newProject.description);
      expect(response.body).toHaveProperty('technologies');
      expect(response.body.technologies).toEqual(newProject.technologies);
      expect(response.body).toHaveProperty('featured', newProject.featured);
    });

    it('should create a project with minimal required fields', async () => {
      const minimalProject = {
        title: 'Minimal Project',
        description: 'Minimal description',
        imageUrl: '',
        githubUrl: '',
        liveUrl: '',
        technologies: ['HTML'],
        featured: false,
        order: 1,
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Cookie', authCookie)
        .send(minimalProject);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', minimalProject.title);
    });

    it('should reject project creation without authentication', async () => {
      const newProject = {
        title: 'Unauthorized Project',
        description: 'This should fail',
        imageUrl: '',
        githubUrl: '',
        liveUrl: '',
        technologies: ['React'],
        featured: false,
        order: 1,
      };

      const response = await request(app)
        .post('/api/projects')
        .send(newProject);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should reject project with missing required fields', async () => {
      const invalidProject = {
        description: 'Missing title',
        technologies: ['React'],
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Cookie', authCookie)
        .send(invalidProject);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject project with invalid data types', async () => {
      const invalidProject = {
        title: 'Test Project',
        description: 'Test description',
        imageUrl: '',
        githubUrl: '',
        liveUrl: '',
        technologies: 'not-an-array', // Should be an array
        featured: false,
        order: 1,
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Cookie', authCookie)
        .send(invalidProject);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/projects/:id (requires authentication)', () => {
    it('should update an existing project', async () => {
      // Create a project first
      const [insertedProject] = await db.insert(projects)
        .values(testProjects.regular)
        .returning();

      const updates = {
        title: 'Updated Project Title',
        description: 'Updated description',
        featured: true,
      };

      const response = await request(app)
        .put(`/api/projects/${insertedProject.id}`)
        .set('Cookie', authCookie)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', insertedProject.id);
      expect(response.body).toHaveProperty('title', updates.title);
      expect(response.body).toHaveProperty('description', updates.description);
      expect(response.body).toHaveProperty('featured', updates.featured);
    });

    it('should update only specified fields', async () => {
      const [insertedProject] = await db.insert(projects)
        .values(testProjects.regular)
        .returning();

      const updates = {
        title: 'Only Title Updated',
      };

      const response = await request(app)
        .put(`/api/projects/${insertedProject.id}`)
        .set('Cookie', authCookie)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', updates.title);
      expect(response.body).toHaveProperty('description', testProjects.regular.description);
    });

    it('should return 404 for non-existent project', async () => {
      const updates = {
        title: 'Updated Title',
      };

      const response = await request(app)
        .put('/api/projects/99999')
        .set('Cookie', authCookie)
        .send(updates);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Project not found');
    });

    it('should reject update without authentication', async () => {
      const [insertedProject] = await db.insert(projects)
        .values(testProjects.regular)
        .returning();

      const updates = {
        title: 'Unauthorized Update',
      };

      const response = await request(app)
        .put(`/api/projects/${insertedProject.id}`)
        .send(updates);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should reject update with invalid data', async () => {
      const [insertedProject] = await db.insert(projects)
        .values(testProjects.regular)
        .returning();

      const invalidUpdates = {
        technologies: 'not-an-array',
      };

      const response = await request(app)
        .put(`/api/projects/${insertedProject.id}`)
        .set('Cookie', authCookie)
        .send(invalidUpdates);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/projects/:id (requires authentication)', () => {
    it('should delete an existing project', async () => {
      // Create a project first
      const [insertedProject] = await db.insert(projects)
        .values(testProjects.regular)
        .returning();

      const response = await request(app)
        .delete(`/api/projects/${insertedProject.id}`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Project deleted successfully');

      // Verify project is deleted
      const getResponse = await request(app)
        .get(`/api/projects/${insertedProject.id}`);

      expect(getResponse.status).toBe(404);
    });

    it('should return 404 for non-existent project', async () => {
      const response = await request(app)
        .delete('/api/projects/99999')
        .set('Cookie', authCookie);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Project not found');
    });

    it('should reject deletion without authentication', async () => {
      const [insertedProject] = await db.insert(projects)
        .values(testProjects.regular)
        .returning();

      const response = await request(app)
        .delete(`/api/projects/${insertedProject.id}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');

      // Verify project still exists
      const getResponse = await request(app)
        .get(`/api/projects/${insertedProject.id}`);

      expect(getResponse.status).toBe(200);
    });
  });

  describe('Unauthorized access to protected endpoints', () => {
    it('should reject POST /api/projects without authentication', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          title: 'Test',
          description: 'Test',
          imageUrl: '',
          githubUrl: '',
          liveUrl: '',
          technologies: ['React'],
          featured: false,
          order: 1,
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should reject PUT /api/projects/:id without authentication', async () => {
      const [insertedProject] = await db.insert(projects)
        .values(testProjects.regular)
        .returning();

      const response = await request(app)
        .put(`/api/projects/${insertedProject.id}`)
        .send({ title: 'Updated' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should reject DELETE /api/projects/:id without authentication', async () => {
      const [insertedProject] = await db.insert(projects)
        .values(testProjects.regular)
        .returning();

      const response = await request(app)
        .delete(`/api/projects/${insertedProject.id}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });
  });
});
