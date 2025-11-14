import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createTestApp } from '../helpers/app';
import { getTestDb, cleanDatabase } from '../helpers/db';
import { users, contactMessages } from '../../shared/index.js';
import { createTestUserData, testContactMessages } from '../helpers/fixtures';
import { getAuthCookie } from '../helpers/auth';

describe('Contact API', () => {
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

  describe('POST /api/contact', () => {
    it('should submit contact form with valid data (public access)', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send(testContactMessages.unread);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', testContactMessages.unread.name);
      expect(response.body).toHaveProperty('email', testContactMessages.unread.email);
      expect(response.body).toHaveProperty('subject', testContactMessages.unread.subject);
      expect(response.body).toHaveProperty('message', testContactMessages.unread.message);
      expect(response.body).toHaveProperty('projectType', testContactMessages.unread.projectType);
      expect(response.body).toHaveProperty('read', false);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should reject contact form with missing required fields', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          // Missing email, subject, message, projectType
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject contact form with invalid email', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          ...testContactMessages.unread,
          email: 'invalid-email',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('email');
    });

    it('should reject contact form with name containing invalid characters', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          ...testContactMessages.unread,
          name: 'John123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Name can only contain letters and spaces');
    });

    it('should reject contact form with message too short', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          ...testContactMessages.unread,
          message: 'Short',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Message must be at least 10 characters');
    });

    it('should reject contact form with message too long', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send({
          ...testContactMessages.unread,
          message: 'a'.repeat(1001),
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Message must be less than 1000 characters');
    });
  });

  describe('GET /api/contact/messages', () => {
    beforeEach(async () => {
      // Seed some test messages
      await db.insert(contactMessages).values([
        testContactMessages.unread,
        testContactMessages.read,
      ]);
    });

    it('should get all contact messages when authenticated', async () => {
      const response = await request(app)
        .get('/api/contact/messages')
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      
      // Verify message structure
      const message = response.body[0];
      expect(message).toHaveProperty('id');
      expect(message).toHaveProperty('name');
      expect(message).toHaveProperty('email');
      expect(message).toHaveProperty('subject');
      expect(message).toHaveProperty('message');
      expect(message).toHaveProperty('projectType');
      expect(message).toHaveProperty('read');
      expect(message).toHaveProperty('createdAt');
    });

    it('should reject unauthenticated access to contact messages', async () => {
      const response = await request(app)
        .get('/api/contact/messages');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should return empty array when no messages exist', async () => {
      // Clean messages
      await cleanDatabase(db);
      await db.insert(users).values(createTestUserData('admin'));
      
      const response = await request(app)
        .get('/api/contact/messages')
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('PUT /api/contact/messages/:id/read', () => {
    let messageId: string;

    beforeEach(async () => {
      // Create a test message
      const result = await db.insert(contactMessages)
        .values(testContactMessages.unread)
        .returning();
      messageId = result[0].id;
    });

    it('should mark message as read when authenticated', async () => {
      const response = await request(app)
        .put(`/api/contact/messages/${messageId}/read`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Message marked as read');

      // Verify message was marked as read in database
      const messages = await db.select().from(contactMessages);
      const updatedMessage = messages.find(m => m.id === messageId);
      expect(updatedMessage?.read).toBe(true);
    });

    it('should reject unauthenticated access to mark message as read', async () => {
      const response = await request(app)
        .put(`/api/contact/messages/${messageId}/read`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should return 404 for non-existent message', async () => {
      const response = await request(app)
        .put('/api/contact/messages/non-existent-id/read')
        .set('Cookie', authCookie);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Message not found');
    });
  });
});
