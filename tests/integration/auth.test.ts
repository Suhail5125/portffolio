import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createTestApp } from '../helpers/app';
import { getTestDb, cleanDatabase } from '../helpers/db';
import { users } from '../../shared/index.js';
import { createTestUserData } from '../helpers/fixtures';

describe('Authentication API', () => {
  let app: Express;
  let db: ReturnType<typeof getTestDb>;

  beforeEach(async () => {
    // Create test app
    app = await createTestApp();
    db = getTestDb();
    
    // Clean database and seed test user
    await cleanDatabase(db);
    await db.insert(users).values(createTestUserData('admin'));
  });

  afterEach(async () => {
    await cleanDatabase(db);
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username', 'admin');
      expect(response.body.user).not.toHaveProperty('password');
      
      // Check that session cookie is set
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(Array.isArray(cookies) ? cookies : [cookies]).toHaveLength(1);
    });

    it('should fail login with invalid username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'admin123',
        });

      expect(response.status).toBe(401);
      expect(response.body).not.toHaveProperty('user');
    });

    it('should fail login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).not.toHaveProperty('user');
    });

    it('should fail login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      // First login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123',
        });

      expect(loginResponse.status).toBe(200);
      const cookies = loginResponse.headers['set-cookie'];

      // Then logout
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);

      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body).toHaveProperty('message', 'Logout successful');
    });

    it('should allow logout even without authentication', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logout successful');
    });
  });

  describe('GET /api/auth/user', () => {
    it('should return user info when authenticated', async () => {
      // First login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123',
        });

      const cookies = loginResponse.headers['set-cookie'];

      // Get user info
      const userResponse = await request(app)
        .get('/api/auth/user')
        .set('Cookie', cookies);

      expect(userResponse.status).toBe(200);
      expect(userResponse.body).toHaveProperty('id');
      expect(userResponse.body).toHaveProperty('username', 'admin');
      expect(userResponse.body).not.toHaveProperty('password');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/user');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Not authenticated');
    });
  });

  describe('Protected Routes', () => {
    it('should deny access to protected routes without authentication', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          title: 'Test Project',
          description: 'Test description',
          technologies: ['React'],
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should allow access to protected routes with valid session', async () => {
      // First login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123',
        });

      expect(loginResponse.status).toBe(200);
      const cookies = loginResponse.headers['set-cookie'];

      // Access protected route
      const protectedResponse = await request(app)
        .post('/api/projects')
        .set('Cookie', cookies)
        .send({
          title: 'Test Project',
          description: 'Test description',
          imageUrl: '',
          githubUrl: '',
          liveUrl: '',
          technologies: ['React'],
          featured: false,
          order: 1,
        });

      expect(protectedResponse.status).toBe(201);
      expect(protectedResponse.body).toHaveProperty('id');
      expect(protectedResponse.body).toHaveProperty('title', 'Test Project');
    });

    it('should deny access after logout', async () => {
      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123',
        });

      const cookies = loginResponse.headers['set-cookie'];

      // Logout
      await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);

      // Try to access protected route
      const protectedResponse = await request(app)
        .post('/api/projects')
        .set('Cookie', cookies)
        .send({
          title: 'Test Project',
          description: 'Test description',
          technologies: ['React'],
        });

      expect(protectedResponse.status).toBe(401);
      expect(protectedResponse.body).toHaveProperty('error', 'Unauthorized');
    });
  });
});
