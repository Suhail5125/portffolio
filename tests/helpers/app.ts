import express, { type Express } from 'express';
import { registerRoutes } from '../../server/routes';

/**
 * Create a test Express application instance
 * This sets up the app with all routes and middleware for testing
 */
export async function createTestApp(): Promise<Express> {
  const app = express();
  
  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // Register all routes (includes auth setup)
  await registerRoutes(app);
  
  return app;
}
