import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createTestApp } from '../helpers/app';
import { getTestDb, cleanDatabase } from '../helpers/db';
import { users, skills } from '../../shared/index.js';
import { createTestUserData, testSkills } from '../helpers/fixtures';
import { getAuthCookie } from '../helpers/auth';

describe('Skills API', () => {
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

  describe('GET /api/skills (public access)', () => {
    it('should return empty array when no skills exist', async () => {
      const response = await request(app)
        .get('/api/skills');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all skills', async () => {
      // Seed test skills
      await db.insert(skills).values([
        ...testSkills.frontend,
        ...testSkills.backend,
      ]);

      const response = await request(app)
        .get('/api/skills');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(4);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('category');
      expect(response.body[0]).toHaveProperty('proficiency');
    });

    it('should not require authentication', async () => {
      const response = await request(app)
        .get('/api/skills');

      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/skills (requires authentication)', () => {
    it('should create a new skill with valid data', async () => {
      const newSkill = {
        name: 'Vue.js',
        category: 'Frontend',
        proficiency: 85,
        icon: 'vue',
        order: 5,
      };

      const response = await request(app)
        .post('/api/skills')
        .set('Cookie', authCookie)
        .send(newSkill);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', newSkill.name);
      expect(response.body).toHaveProperty('category', newSkill.category);
      expect(response.body).toHaveProperty('proficiency', newSkill.proficiency);
      expect(response.body).toHaveProperty('icon', newSkill.icon);
    });

    it('should create a skill with minimal required fields', async () => {
      const minimalSkill = {
        name: 'Docker',
        category: 'Tools',
        proficiency: 75,
        order: 1,
      };

      const response = await request(app)
        .post('/api/skills')
        .set('Cookie', authCookie)
        .send(minimalSkill);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', minimalSkill.name);
    });

    it('should reject skill creation without authentication', async () => {
      const newSkill = {
        name: 'Unauthorized Skill',
        category: 'Frontend',
        proficiency: 80,
        order: 1,
      };

      const response = await request(app)
        .post('/api/skills')
        .send(newSkill);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should reject skill with missing required fields', async () => {
      const invalidSkill = {
        name: 'Missing Category',
        proficiency: 80,
      };

      const response = await request(app)
        .post('/api/skills')
        .set('Cookie', authCookie)
        .send(invalidSkill);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject skill with invalid proficiency', async () => {
      const invalidSkill = {
        name: 'Invalid Proficiency',
        category: 'Frontend',
        proficiency: 150, // Should be 1-100
        order: 1,
      };

      const response = await request(app)
        .post('/api/skills')
        .set('Cookie', authCookie)
        .send(invalidSkill);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject skill with invalid category', async () => {
      const invalidSkill = {
        name: 'Invalid Category',
        category: 'InvalidCategory',
        proficiency: 80,
        order: 1,
      };

      const response = await request(app)
        .post('/api/skills')
        .set('Cookie', authCookie)
        .send(invalidSkill);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/skills/:id (requires authentication)', () => {
    it('should update an existing skill', async () => {
      // Create a skill first
      const [insertedSkill] = await db.insert(skills)
        .values(testSkills.frontend[0])
        .returning();

      const updates = {
        name: 'React.js Updated',
        proficiency: 95,
      };

      const response = await request(app)
        .put(`/api/skills/${insertedSkill.id}`)
        .set('Cookie', authCookie)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', insertedSkill.id);
      expect(response.body).toHaveProperty('name', updates.name);
      expect(response.body).toHaveProperty('proficiency', updates.proficiency);
    });

    it('should update only specified fields', async () => {
      const [insertedSkill] = await db.insert(skills)
        .values(testSkills.frontend[0])
        .returning();

      const updates = {
        proficiency: 92,
      };

      const response = await request(app)
        .put(`/api/skills/${insertedSkill.id}`)
        .set('Cookie', authCookie)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('proficiency', updates.proficiency);
      expect(response.body).toHaveProperty('name', testSkills.frontend[0].name);
    });

    it('should return 404 for non-existent skill', async () => {
      const updates = {
        name: 'Updated Name',
      };

      const response = await request(app)
        .put('/api/skills/00000000-0000-0000-0000-000000000000')
        .set('Cookie', authCookie)
        .send(updates);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Skill not found');
    });

    it('should reject update without authentication', async () => {
      const [insertedSkill] = await db.insert(skills)
        .values(testSkills.frontend[0])
        .returning();

      const updates = {
        name: 'Unauthorized Update',
      };

      const response = await request(app)
        .put(`/api/skills/${insertedSkill.id}`)
        .send(updates);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should reject update with invalid data', async () => {
      const [insertedSkill] = await db.insert(skills)
        .values(testSkills.frontend[0])
        .returning();

      const invalidUpdates = {
        proficiency: 200, // Invalid proficiency
      };

      const response = await request(app)
        .put(`/api/skills/${insertedSkill.id}`)
        .set('Cookie', authCookie)
        .send(invalidUpdates);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/skills/:id (requires authentication)', () => {
    it('should delete an existing skill', async () => {
      // Create a skill first
      const [insertedSkill] = await db.insert(skills)
        .values(testSkills.frontend[0])
        .returning();

      const response = await request(app)
        .delete(`/api/skills/${insertedSkill.id}`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Skill deleted successfully');

      // Verify skill is deleted
      const allSkills = await db.select().from(skills);
      expect(allSkills.find(s => s.id === insertedSkill.id)).toBeUndefined();
    });

    it('should return 404 for non-existent skill', async () => {
      const response = await request(app)
        .delete('/api/skills/00000000-0000-0000-0000-000000000000')
        .set('Cookie', authCookie);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Skill not found');
    });

    it('should reject deletion without authentication', async () => {
      const [insertedSkill] = await db.insert(skills)
        .values(testSkills.frontend[0])
        .returning();

      const response = await request(app)
        .delete(`/api/skills/${insertedSkill.id}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');

      // Verify skill still exists
      const allSkills = await db.select().from(skills);
      expect(allSkills.find(s => s.id === insertedSkill.id)).toBeDefined();
    });
  });

  describe('PUT /api/skills/reorder (requires authentication)', () => {
    it('should reorder skills successfully', async () => {
      // Create multiple skills
      const insertedSkills = await db.insert(skills)
        .values([
          testSkills.frontend[0],
          testSkills.frontend[1],
          testSkills.backend[0],
        ])
        .returning();

      const reorderData = {
        skills: insertedSkills.map((skill, index) => ({
          id: skill.id,
          category: skill.category,
          order: index + 10, // New order values
        })),
      };

      const response = await request(app)
        .post('/api/skills/reorder')
        .set('Cookie', authCookie)
        .send(reorderData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Skill order updated');
    });

    it('should reject reorder without authentication', async () => {
      const reorderData = {
        skills: [
          { id: '00000000-0000-0000-0000-000000000000', category: 'Frontend', order: 1 },
        ],
      };

      const response = await request(app)
        .post('/api/skills/reorder')
        .send(reorderData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should reject reorder with invalid data', async () => {
      const invalidReorderData = {
        skills: [], // Empty array
      };

      const response = await request(app)
        .post('/api/skills/reorder')
        .set('Cookie', authCookie)
        .send(invalidReorderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject reorder with missing required fields', async () => {
      const invalidReorderData = {
        skills: [
          { id: '00000000-0000-0000-0000-000000000000' }, // Missing category and order
        ],
      };

      const response = await request(app)
        .post('/api/skills/reorder')
        .set('Cookie', authCookie)
        .send(invalidReorderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Unauthorized access to protected endpoints', () => {
    it('should reject POST /api/skills without authentication', async () => {
      const response = await request(app)
        .post('/api/skills')
        .send({
          name: 'Test Skill',
          category: 'Frontend',
          proficiency: 80,
          order: 1,
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should reject PUT /api/skills/:id without authentication', async () => {
      const [insertedSkill] = await db.insert(skills)
        .values(testSkills.frontend[0])
        .returning();

      const response = await request(app)
        .put(`/api/skills/${insertedSkill.id}`)
        .send({ name: 'Updated' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should reject DELETE /api/skills/:id without authentication', async () => {
      const [insertedSkill] = await db.insert(skills)
        .values(testSkills.frontend[0])
        .returning();

      const response = await request(app)
        .delete(`/api/skills/${insertedSkill.id}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should reject POST /api/skills/reorder without authentication', async () => {
      const response = await request(app)
        .post('/api/skills/reorder')
        .send({
          skills: [
            { id: '00000000-0000-0000-0000-000000000000', category: 'Frontend', order: 1 },
          ],
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });
  });
});
