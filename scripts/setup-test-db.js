#!/usr/bin/env node

/**
 * Test Database Setup Script
 * 
 * This script creates the test database and runs migrations.
 * Run this before running tests for the first time.
 */

import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load test environment
dotenv.config({ path: '.env.test' });

const { Pool } = pg;

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

if (!TEST_DATABASE_URL) {
  console.error('❌ TEST_DATABASE_URL not found in .env.test');
  console.error('Please ensure .env.test exists with TEST_DATABASE_URL configured');
  process.exit(1);
}

// Parse database URL to get database name
const dbUrl = new URL(TEST_DATABASE_URL);
const testDbName = dbUrl.pathname.slice(1); // Remove leading slash
const adminDbUrl = TEST_DATABASE_URL.replace(`/${testDbName}`, '/postgres');

console.log('🔧 Setting up test database...');
console.log(`📦 Database: ${testDbName}`);

async function setupTestDatabase() {
  let adminPool;
  let testPool;

  try {
    // Connect to postgres database to create test database
    console.log('\n1️⃣ Connecting to PostgreSQL...');
    adminPool = new Pool({ connectionString: adminDbUrl });
    
    // Check if test database exists
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1
    `;
    const result = await adminPool.query(checkDbQuery, [testDbName]);
    
    if (result.rows.length === 0) {
      // Create test database
      console.log(`2️⃣ Creating test database '${testDbName}'...`);
      await adminPool.query(`CREATE DATABASE ${testDbName}`);
      console.log('✅ Test database created');
    } else {
      console.log(`✅ Test database '${testDbName}' already exists`);
    }
    
    await adminPool.end();
    
    // Connect to test database and run migrations
    console.log('\n3️⃣ Running migrations on test database...');
    testPool = new Pool({ connectionString: TEST_DATABASE_URL });
    const db = drizzle(testPool);
    
    // Run migrations
    const migrationsFolder = join(__dirname, '..', 'migrations');
    await migrate(db, { migrationsFolder });
    
    console.log('✅ Migrations completed');
    
    await testPool.end();
    
    console.log('\n✨ Test database setup complete!');
    console.log('You can now run: npm test');
    
  } catch (error) {
    console.error('\n❌ Error setting up test database:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 PostgreSQL is not running or not accessible.');
      console.error('Please ensure PostgreSQL is installed and running:');
      console.error('  - Windows: Check PostgreSQL service in Services');
      console.error('  - Mac: brew services start postgresql');
      console.error('  - Linux: sudo systemctl start postgresql');
    } else if (error.code === '42P04') {
      console.log('✅ Database already exists, continuing...');
    }
    
    process.exit(1);
  } finally {
    if (adminPool) await adminPool.end().catch(() => {});
    if (testPool) await testPool.end().catch(() => {});
  }
}

setupTestDatabase();
