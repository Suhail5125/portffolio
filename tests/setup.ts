import { beforeAll, afterAll } from 'vitest';
import dotenv from 'dotenv';
import { setupTestDatabase, teardownTestDatabase } from './helpers/db';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Ensure we're using the test database
if (!process.env.TEST_DATABASE_URL) {
  console.error('❌ TEST_DATABASE_URL environment variable is not set');
  console.error('Please create a .env.test file with TEST_DATABASE_URL');
  console.error('Example: TEST_DATABASE_URL=postgresql://localhost:5432/portfolio_test');
  process.exit(1);
}

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// Set required environment variables for the application
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = 'test-session-secret-key-for-testing-only';
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

// Global test setup
beforeAll(async () => {
  console.log('🔧 Setting up test environment...');
  
  try {
    // Initialize test database connection
    await setupTestDatabase();
    console.log('✅ Test database connected:', process.env.TEST_DATABASE_URL?.split('@')[1] || 'configured');
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    throw error;
  }
});

// Global test teardown
afterAll(async () => {
  console.log('🧹 Cleaning up test environment...');
  
  try {
    await teardownTestDatabase();
    console.log('✅ Test database connection closed');
  } catch (error) {
    console.error('❌ Failed to teardown test database:', error);
  }
});
