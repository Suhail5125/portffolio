# Environment Variables Documentation

This document provides a comprehensive reference for all environment variables used in the Portfolio Application. Environment variables are used to configure the application for different environments (development, test, production) without changing the code.

## Table of Contents

- [Quick Start](#quick-start)
- [Required Variables](#required-variables)
- [Optional Variables](#optional-variables)
- [Development Configuration](#development-configuration)
- [Production Configuration](#production-configuration)
- [Test Configuration](#test-configuration)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the required variables (see [Required Variables](#required-variables))

3. Generate a secure session secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. Start the application:
   ```bash
   npm run dev
   ```

## Required Variables

These variables **must** be set for the application to run properly.

### DATABASE_URL

**Description**: PostgreSQL database connection string

**Format**: `postgresql://[user]:[password]@[host]:[port]/[database]`

**Example Values**:
- Development: `postgresql://localhost:5432/portfolio`
- Production: `postgresql://user:password@db.example.com:5432/portfolio_prod`
- Railway: `postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway`
- Render: `postgresql://user:password@dpg-abc123.oregon-postgres.render.com/portfolio_db`

**Notes**:
- Ensure the database exists before starting the application
- Run migrations after setting up: `npm run db:push`
- Use a separate database for each environment

**Security**: 🔒 **SENSITIVE** - Contains database credentials. Never commit to version control.

---

### SESSION_SECRET

**Description**: Secret key used to encrypt and sign session cookies

**Format**: String (minimum 32 characters recommended)

**Example Values**:
- Development: `dev-session-secret-key-change-in-production`
- Production: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

**Generation Command**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Notes**:
- **MUST** be changed from the default value in production
- **MUST** be at least 32 characters long in production
- Should be different for each environment
- Changing this value will invalidate all existing sessions

**Security**: 🔒 **HIGHLY SENSITIVE** - Protects user sessions. Use a cryptographically secure random string.

---

## Optional Variables

These variables have sensible defaults but can be customized as needed.

### PORT

**Description**: Port number on which the application server listens

**Type**: Integer

**Default**: `5000`

**Example Values**:
- Development: `5000`
- Production: `3000` or `8080`
- Platform-managed: Often set automatically by hosting platforms

**Notes**:
- Most hosting platforms (Railway, Render, Heroku) set this automatically
- Must be a valid port number (1-65535)
- Ensure the port is not already in use

---

### NODE_ENV

**Description**: Specifies the runtime environment

**Type**: String (enum)

**Allowed Values**: `development`, `production`, `test`

**Default**: `development`

**Example Values**:
- Development: `development`
- Production: `production`
- Testing: `test`

**Notes**:
- Affects security settings (cookie security, CORS, logging)
- In production, enables stricter security measures
- Automatically set by most hosting platforms

---

### CORS_ORIGIN

**Description**: Allowed origin for Cross-Origin Resource Sharing (CORS)

**Type**: String (URL)

**Default**: 
- Development: `http://localhost:5173`
- Production: Empty string (same-origin only)

**Example Values**:
- Development: `http://localhost:5173`
- Production with custom domain: `https://myportfolio.com`
- Multiple origins: Not currently supported (requires code modification)

**Notes**:
- Controls which domains can make API requests to your backend
- In production, set to your frontend domain if using separate hosting
- Leave empty for same-origin deployments (frontend and backend on same domain)

---

### SESSION_MAX_AGE

**Description**: Maximum session lifetime in milliseconds

**Type**: Integer (milliseconds)

**Default**: `86400000` (24 hours)

**Example Values**:
- 1 hour: `3600000`
- 24 hours: `86400000`
- 7 days: `604800000`
- 30 days: `2592000000`

**Notes**:
- After this time, users will need to log in again
- Shorter values are more secure but less convenient
- Consider your security requirements when setting this value

---

### SESSION_CHECK_PERIOD

**Description**: How often to check for expired sessions (in milliseconds)

**Type**: Integer (milliseconds)

**Default**: `86400000` (24 hours)

**Example Values**:
- 1 hour: `3600000`
- 24 hours: `86400000`

**Notes**:
- Used by the session store to clean up expired sessions
- Should typically match or be less than SESSION_MAX_AGE
- Lower values use more resources but clean up faster

---

### RATE_LIMIT_WINDOW

**Description**: Time window for rate limiting (in milliseconds)

**Type**: Integer (milliseconds)

**Default**: `900000` (15 minutes)

**Example Values**:
- 5 minutes: `300000`
- 15 minutes: `900000`
- 1 hour: `3600000`

**Notes**:
- Requests are counted within this time window
- After the window expires, the counter resets
- Works in conjunction with RATE_LIMIT_MAX

---

### RATE_LIMIT_MAX

**Description**: Maximum number of requests allowed per time window

**Type**: Integer

**Default**: `100`

**Example Values**:
- Strict: `50`
- Moderate: `100`
- Lenient: `200`

**Notes**:
- Applies to authentication and contact form endpoints
- Helps prevent brute force attacks and spam
- Adjust based on your expected traffic patterns

---

### UPLOAD_DIR

**Description**: Directory path for uploaded files (relative to project root)

**Type**: String (path)

**Default**: `uploads`

**Example Values**:
- Local: `uploads`
- Custom: `public/uploads`
- Absolute: `/var/www/uploads`

**Notes**:
- Directory will be created automatically if it doesn't exist
- Ensure the application has write permissions
- Consider using cloud storage (S3, Cloudinary) for production

---

### UPLOAD_MAX_FILE_SIZE

**Description**: Maximum file size for uploads (in bytes)

**Type**: Integer (bytes)

**Default**: `5242880` (5 MB)

**Example Values**:
- 1 MB: `1048576`
- 5 MB: `5242880`
- 10 MB: `10485760`
- 50 MB: `52428800`

**Notes**:
- Larger files require more memory and bandwidth
- Consider your hosting platform's limits
- Balance between user experience and resource usage

---

### LOG_LEVEL

**Description**: Logging verbosity level

**Type**: String (enum)

**Allowed Values**: `error`, `warn`, `info`, `http`, `verbose`, `debug`, `silly`

**Default**: 
- Development: `debug`
- Production: `info`

**Example Values**:
- Production: `info` or `warn`
- Development: `debug`
- Troubleshooting: `verbose` or `debug`

**Notes**:
- Lower levels (error, warn) produce less output
- Higher levels (debug, silly) produce more detailed logs
- Use `debug` for development, `info` or `warn` for production

---

### TEST_DATABASE_URL

**Description**: PostgreSQL connection string for the test database

**Type**: String (connection string)

**Default**: None (must be set for tests to run)

**Example Values**:
- Local: `postgresql://localhost:5432/portfolio_test`
- CI/CD: `postgresql://postgres:postgres@localhost:5432/test_db`

**Notes**:
- **Only used in test environment**
- Must point to a separate database from development/production
- Database will be cleaned between test runs
- Required for running integration tests

---

## Development Configuration

Recommended `.env` file for local development:

```bash
# Database
DATABASE_URL=postgresql://localhost:5432/portfolio

# Server
PORT=5000
NODE_ENV=development

# Session (can use simple value for development)
SESSION_SECRET=dev-session-secret-change-in-production

# CORS (Vite dev server default port)
CORS_ORIGIN=http://localhost:5173

# Rate Limiting (more lenient for development)
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=200

# Logging
LOG_LEVEL=debug

# Uploads
UPLOAD_DIR=uploads
UPLOAD_MAX_FILE_SIZE=5242880
```

### Development Setup Steps

1. Install PostgreSQL locally
2. Create development database:
   ```bash
   createdb portfolio
   ```
3. Copy `.env.example` to `.env`
4. Update `DATABASE_URL` with your credentials
5. Run migrations:
   ```bash
   npm run db:push
   ```
6. (Optional) Seed database:
   ```bash
   npm run db:seed
   ```
7. Start development server:
   ```bash
   npm run dev
   ```

---

## Production Configuration

Recommended environment variables for production deployment:

```bash
# Database (provided by hosting platform)
DATABASE_URL=postgresql://user:password@host:port/database

# Server
PORT=3000  # Often set automatically by platform
NODE_ENV=production

# Session (MUST be secure!)
SESSION_SECRET=<generate-secure-64-character-random-string>
SESSION_MAX_AGE=86400000  # 24 hours

# CORS (set to your frontend domain if separate)
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting (stricter for production)
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info

# Uploads
UPLOAD_DIR=uploads
UPLOAD_MAX_FILE_SIZE=5242880  # 5MB
```

### Production Setup Steps

1. Set all required environment variables in your hosting platform
2. Generate a secure `SESSION_SECRET`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Set `NODE_ENV=production`
4. Configure database connection string
5. Run migrations:
   ```bash
   npm run db:push
   ```
6. Deploy application
7. Verify health endpoint: `https://yourdomain.com/api/health`

### Platform-Specific Notes

#### Railway
- `DATABASE_URL` is automatically set when you add PostgreSQL plugin
- `PORT` is automatically set by Railway
- Set other variables in the "Variables" tab

#### Render
- `DATABASE_URL` is automatically set when you create PostgreSQL instance
- `PORT` is automatically set by Render
- Set other variables in the "Environment" section

#### Vercel
- Vercel is frontend-only; backend needs separate hosting
- Set `CORS_ORIGIN` to your Vercel domain on the backend
- Backend `DATABASE_URL` must be accessible from backend host

#### VPS (Self-Hosted)
- All variables must be set manually
- Consider using a `.env` file or systemd environment files
- Ensure proper file permissions (`.env` should be 600)

---

## Test Configuration

Recommended `.env.test` file for running tests:

```bash
# Test Database (separate from development!)
TEST_DATABASE_URL=postgresql://localhost:5432/portfolio_test

# Session (simple value for testing)
SESSION_SECRET=test-session-secret-for-testing-only

# Node Environment
NODE_ENV=test

# Logging (minimal for cleaner test output)
LOG_LEVEL=error
```

### Test Setup Steps

1. Create test database:
   ```bash
   createdb portfolio_test
   ```
2. Create `.env.test` file with test configuration
3. Run tests:
   ```bash
   npm test
   ```

**Note**: The test database will be cleaned between test runs. Never use your development or production database for testing!

---

## Security Notes

### Critical Security Practices

1. **Never Commit Secrets**
   - Add `.env` to `.gitignore` (already configured)
   - Never commit `.env` files to version control
   - Use `.env.example` for documentation only

2. **Use Strong Session Secrets**
   - Minimum 32 characters (64+ recommended for production)
   - Use cryptographically secure random generation
   - Different secret for each environment
   - Rotate secrets periodically

3. **Protect Database Credentials**
   - Use strong database passwords
   - Restrict database access by IP when possible
   - Enable SSL for database connections in production
   - Use connection pooling for better security and performance

4. **Environment-Specific Configuration**
   - Use `NODE_ENV=production` in production
   - Enable stricter security settings in production
   - Use HTTPS in production (enforced by hosting platforms)
   - Set appropriate CORS origins

5. **Rate Limiting**
   - Keep rate limits reasonable but not too lenient
   - Monitor for abuse patterns
   - Adjust limits based on actual usage

6. **File Uploads**
   - Limit file sizes to prevent resource exhaustion
   - Validate file types on both client and server
   - Consider using cloud storage for production
   - Scan uploaded files for malware if handling user uploads

### Secret Rotation

If you need to rotate secrets (recommended periodically):

1. **Session Secret**:
   - Generate new secret
   - Update environment variable
   - Restart application
   - Note: All users will be logged out

2. **Database Password**:
   - Update password in database
   - Update `DATABASE_URL` environment variable
   - Restart application

### Secrets Management

For production deployments, consider using:
- **Railway**: Built-in environment variables (encrypted at rest)
- **Render**: Environment variables (encrypted at rest)
- **AWS**: AWS Secrets Manager or Parameter Store
- **Azure**: Azure Key Vault
- **GCP**: Google Secret Manager
- **HashiCorp Vault**: For self-hosted solutions

---

## Troubleshooting

### Common Issues

#### "Missing required environment variables: DATABASE_URL"

**Cause**: `DATABASE_URL` is not set

**Solution**:
1. Ensure `.env` file exists
2. Check that `DATABASE_URL` is defined in `.env`
3. Verify the connection string format is correct
4. Restart the application

---

#### "Missing required environment variables: SESSION_SECRET (must be changed from default in production)"

**Cause**: Using default session secret in production

**Solution**:
1. Generate a secure secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Set `SESSION_SECRET` environment variable
3. Restart the application

---

#### "PORT must be a valid number"

**Cause**: `PORT` environment variable is not a valid integer

**Solution**:
1. Check `PORT` value in `.env`
2. Ensure it's a number between 1-65535
3. Remove any quotes or special characters
4. Restart the application

---

#### Database connection fails

**Cause**: Incorrect database URL or database not running

**Solution**:
1. Verify PostgreSQL is running:
   ```bash
   # macOS/Linux
   pg_isready
   
   # Windows
   pg_ctl status
   ```
2. Check database exists:
   ```bash
   psql -l
   ```
3. Verify connection string format
4. Check credentials are correct
5. Ensure database is accessible from your application

---

#### CORS errors in browser

**Cause**: Frontend and backend on different origins without proper CORS configuration

**Solution**:
1. Set `CORS_ORIGIN` to your frontend URL
2. Ensure `NODE_ENV` is set correctly
3. Restart the application
4. Clear browser cache

---

#### Rate limit errors

**Cause**: Too many requests from same IP

**Solution**:
1. Wait for the rate limit window to expire
2. Adjust `RATE_LIMIT_MAX` if limits are too strict
3. Adjust `RATE_LIMIT_WINDOW` if needed
4. Consider implementing user-specific rate limiting

---

#### File upload fails

**Cause**: File too large or upload directory not writable

**Solution**:
1. Check file size against `UPLOAD_MAX_FILE_SIZE`
2. Verify upload directory exists and is writable
3. Check disk space
4. Verify file type is allowed

---

### Getting Help

If you encounter issues not covered here:

1. Check application logs for detailed error messages
2. Verify all required environment variables are set
3. Ensure database is accessible and migrations are up to date
4. Review the deployment guide for your platform
5. Check the [GitHub Issues](https://github.com/yourusername/portfolio/issues) for similar problems

---

## Additional Resources

- [Deployment Guides](../deployment/) - Platform-specific deployment instructions
- [API Documentation](../api/) - Complete API reference
- [Architecture Documentation](../architecture/) - System architecture overview
- [Contributing Guide](../CONTRIBUTING.md) - Development guidelines

---

**Last Updated**: 2024
**Version**: 1.0.0
