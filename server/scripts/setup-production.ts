import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { users } from '@shared';
import bcrypt from 'bcryptjs';
import { sql } from 'drizzle-orm';
import { config } from '../config';

const { Pool } = pg;
const pool = new Pool({ connectionString: config.database.url });
const db = drizzle(pool);

async function setupProduction() {
  console.log('🚀 Starting production setup...');

  try {
    // Test database connection
    console.log('📊 Testing database connection...');
    await db.execute(sql`SELECT 1`);
    console.log('✅ Database connection successful');

    // Check if admin user exists
    console.log('👤 Checking for admin user...');
    const existingAdmin = await db.select().from(users).limit(1);

    if (existingAdmin.length === 0) {
      console.log('👤 Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await db.insert(users).values({
        username: 'admin',
        password: hashedPassword,
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('📝 Username: admin');
      console.log('📝 Password: admin123');
      console.log('⚠️  IMPORTANT: Change this password after first login!');
    } else {
      console.log('✅ Admin user already exists');
    }

    console.log('🎉 Production setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupProduction();
