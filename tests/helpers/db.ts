import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import {
  users,
  projects,
  skills,
  contactMessages,
  aboutInfo,
  testimonials,
} from '../../shared/index.js';

const { Pool } = pg;

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

if (!TEST_DATABASE_URL) {
  throw new Error('TEST_DATABASE_URL environment variable is required for tests');
}

let testPool: pg.Pool | null = null;
let testDb: ReturnType<typeof drizzle> | null = null;

/**
 * Set up test database connection
 */
export async function setupTestDatabase() {
  if (testPool && testDb) {
    return { db: testDb, pool: testPool };
  }

  testPool = new Pool({
    connectionString: TEST_DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 10000,
  });

  testDb = drizzle(testPool);

  // Test the connection
  try {
    await testPool.query('SELECT 1');
  } catch (error) {
    throw new Error(`Failed to connect to test database: ${error}`);
  }

  return { db: testDb, pool: testPool };
}

/**
 * Clean all data from test database tables
 * Deletes in order to respect foreign key constraints
 */
export async function cleanDatabase(db: ReturnType<typeof drizzle>) {
  await db.delete(contactMessages);
  await db.delete(testimonials);
  await db.delete(projects);
  await db.delete(skills);
  await db.delete(aboutInfo);
  await db.delete(users);
}

/**
 * Tear down test database connection
 */
export async function teardownTestDatabase() {
  if (testPool) {
    await testPool.end();
    testPool = null;
    testDb = null;
  }
}

/**
 * Get the current test database instance
 */
export function getTestDb() {
  if (!testDb) {
    throw new Error('Test database not initialized. Call setupTestDatabase() first.');
  }
  return testDb;
}
