import request from 'supertest';
import type { Express } from 'express';

/**
 * Login and get authentication cookie for testing
 * 
 * @param app - Express application instance
 * @param username - Username for login (default: 'admin')
 * @param password - Password for login (default: 'admin123')
 * @returns Array of cookie strings to use in subsequent requests
 */
export async function getAuthCookie(
  app: Express,
  username: string = 'admin',
  password: string = 'admin123'
): Promise<string[]> {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username, password });

  if (response.status !== 200) {
    throw new Error(
      `Login failed with status ${response.status}: ${JSON.stringify(response.body)}`
    );
  }

  const cookies = response.headers['set-cookie'];
  if (!cookies) {
    throw new Error('No cookies returned from login');
  }

  // Ensure cookies is always an array
  const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
  
  if (cookieArray.length === 0) {
    throw new Error('No cookies returned from login');
  }

  return cookieArray;
}

/**
 * Make an authenticated request with the provided auth cookie
 * 
 * @param app - Express application instance
 * @param method - HTTP method
 * @param path - Request path
 * @param authCookie - Authentication cookie from getAuthCookie
 * @returns Supertest Test object for chaining
 */
export function authenticatedRequest(
  app: Express,
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  authCookie: string[]
) {
  return request(app)[method](path).set('Cookie', authCookie);
}
