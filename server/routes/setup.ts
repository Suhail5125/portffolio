import { Router } from 'express';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { users } from '@shared';
import bcrypt from 'bcryptjs';
import { sql } from 'drizzle-orm';
import { config } from '../config';

const router = Router();
const { Pool } = pg;

// One-time setup endpoint - should be disabled after first use
router.get('/setup-database', async (req, res) => {
  try {
    const pool = new Pool({ connectionString: config.database.url });
    const db = drizzle(pool);

    // Check if setup already done
    const existingUsers = await db.select().from(users).limit(1);
    
    if (existingUsers.length > 0) {
      return res.json({
        success: false,
        message: 'Setup already completed. Admin user exists.',
        adminUrl: '/admin'
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
    });

    await pool.end();

    res.json({
      success: true,
      message: 'Database setup complete! Admin user created.',
      credentials: {
        username: 'admin',
        password: 'admin123',
        warning: 'CHANGE THIS PASSWORD IMMEDIATELY AFTER LOGIN!'
      },
      adminUrl: '/admin'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      hint: 'Make sure DATABASE_URL is set correctly'
    });
  }
});

export default router;
