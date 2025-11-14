# Production Deployment Checklist

This comprehensive checklist ensures your portfolio application is properly configured, secure, and ready for production deployment. Follow each section carefully and check off items as you complete them.

## Table of Contents

- [Pre-Deployment Verification](#pre-deployment-verification)
- [Security Checklist](#security-checklist)
- [Configuration Verification](#configuration-verification)
- [Database Setup](#database-setup)
- [Post-Deployment Verification](#post-deployment-verification)
- [Rollback Procedure](#rollback-procedure)

---

## Pre-Deployment Verification

Complete these checks before deploying to production.

### Code Quality

- [ ] All TypeScript compilation errors resolved
  ```bash
  npm run check
  ```

- [ ] All linting errors resolved
  ```bash
  npm run lint
  ```

- [ ] All tests passing
  ```bash
  npm test
  ```

- [ ] Test coverage meets requirements (70%+ unit, 80%+ integration)
  ```bash
  npm run test:coverage
  ```

- [ ] No console.log statements in production code (except in logger)

- [ ] All TODO/FIXME comments addressed or documented

### Build Verification

- [ ] Production build completes successfully
  ```bash
  npm run build
  ```

- [ ] Build output directory (`dist/`) contains all necessary files

- [ ] Static assets are properly bundled and optimized

- [ ] Source maps are generated (for debugging) or excluded (for security)

- [ ] Bundle sizes are reasonable (check for large dependencies)

### Dependencies

- [ ] All dependencies are up to date
  ```bash
  npm outdated
  ```

- [ ] No critical security vulnerabilities
  ```bash
  npm audit
  ```

- [ ] Production dependencies only (no dev dependencies in production)

- [ ] Package-lock.json is committed and up to date

### Version Control

- [ ] All changes committed to Git

- [ ] Working on correct branch (main/production)

- [ ] No uncommitted changes
  ```bash
  git status
  ```

- [ ] Latest changes pushed to remote repository
  ```bash
  git push origin main
  ```

- [ ] Release tagged (optional but recommended)
  ```bash
  git tag -a v1.0.0 -m "Production release v1.0.0"
  git push origin v1.0.0
  ```

---

## Security Checklist

Ensure all security measures are in place before going live.

### Environment Variables & Secrets

- [ ] `.env` file is in `.gitignore` (never committed)

- [ ] `.env.example` is up to date with all required variables

- [ ] `SESSION_SECRET` is set to a cryptographically secure random string (minimum 32 characters)
  ```bash
  # Generate secure secret
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- [ ] `SESSION_SECRET` is different from development/test environments

- [ ] Database credentials are strong and unique

- [ ] No default or example passwords are used

- [ ] All secrets are stored securely (platform secret manager, not in code)

### Authentication & Sessions

- [ ] Session configuration uses secure settings in production
  - `secure: true` (HTTPS only)
  - `httpOnly: true` (prevents XSS)
  - `sameSite: 'strict'` or `'lax'`

- [ ] Session timeout is appropriate (`SESSION_MAX_AGE` set)

- [ ] Password hashing is using bcrypt with appropriate cost factor

- [ ] Admin credentials are changed from defaults

- [ ] Failed login attempts are logged

### API Security

- [ ] Rate limiting is enabled on all endpoints
  - Authentication endpoints: stricter limits
  - Contact form: spam prevention
  - Public endpoints: reasonable limits

- [ ] CORS is properly configured
  - `CORS_ORIGIN` set to your domain (or empty for same-origin)
  - No wildcard (`*`) in production

- [ ] Input validation is implemented on all endpoints
  - Zod schemas validate all inputs
  - File uploads are validated (type, size)

- [ ] SQL injection protection (using Drizzle ORM parameterized queries)

- [ ] XSS protection headers are set

### Security Headers

- [ ] Security headers are configured in middleware
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security` (HSTS)

- [ ] Content Security Policy (CSP) is configured (if applicable)

### HTTPS & SSL

- [ ] HTTPS is enabled (required for production)

- [ ] SSL certificate is valid and not expired

- [ ] HTTP automatically redirects to HTTPS

- [ ] SSL certificate auto-renewal is configured (Let's Encrypt)

### Database Security

- [ ] Database uses strong password

- [ ] Database access is restricted by IP (if possible)

- [ ] Database connections use SSL/TLS in production

- [ ] Database user has minimum required privileges (not superuser)

- [ ] Database backups are encrypted

### File Uploads (if applicable)

- [ ] File size limits are enforced (`UPLOAD_MAX_FILE_SIZE`)

- [ ] File type validation is implemented

- [ ] Uploaded files are scanned for malware (if handling user uploads)

- [ ] Upload directory has proper permissions (not publicly writable)

- [ ] Consider using cloud storage (S3, Cloudinary) instead of local storage

### Logging & Monitoring

- [ ] Sensitive data is not logged (passwords, tokens, PII)

- [ ] Error messages don't expose system internals

- [ ] Log level is appropriate for production (`info` or `warn`)

- [ ] Failed authentication attempts are logged

- [ ] Suspicious activity is logged and monitored

---

## Configuration Verification

Verify all configuration settings are correct for production.

### Required Environment Variables

- [ ] `DATABASE_URL` is set and points to production database
  ```bash
  # Format: postgresql://user:password@host:port/database
  ```

- [ ] `SESSION_SECRET` is set (minimum 32 characters, cryptographically secure)

- [ ] `NODE_ENV` is set to `production`

- [ ] `PORT` is set (or will be set by hosting platform)

### Optional Environment Variables

- [ ] `CORS_ORIGIN` is set to your frontend domain (if separate hosting)
  ```bash
  # Example: https://yourdomain.com
  ```

- [ ] `SESSION_MAX_AGE` is set appropriately (default: 24 hours)
  ```bash
  # 24 hours = 86400000 milliseconds
  ```

- [ ] `RATE_LIMIT_WINDOW` is configured (default: 15 minutes)
  ```bash
  # 15 minutes = 900000 milliseconds
  ```

- [ ] `RATE_LIMIT_MAX` is configured (default: 100 requests)

- [ ] `LOG_LEVEL` is set to `info` or `warn` for production

- [ ] `UPLOAD_DIR` is configured (if using file uploads)

- [ ] `UPLOAD_MAX_FILE_SIZE` is set appropriately (default: 5MB)

### Platform-Specific Configuration

#### Railway
- [ ] PostgreSQL plugin is added and connected
- [ ] Environment variables are set in "Variables" tab
- [ ] Custom domain is configured (if applicable)
- [ ] Health check path is set to `/api/health`

#### Render
- [ ] PostgreSQL instance is created and connected
- [ ] Environment variables are set in "Environment" section
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm run start`
- [ ] Health check path is set to `/api/health`
- [ ] Auto-deploy is enabled (recommended)

#### Vercel + Backend
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to separate service (Railway, Render, VPS)
- [ ] `CORS_ORIGIN` on backend points to Vercel domain
- [ ] API base URL is configured in frontend

#### VPS (Self-Hosted)
- [ ] Node.js is installed (v18 or later)
- [ ] PostgreSQL is installed and running
- [ ] PM2 is installed for process management
- [ ] Nginx is configured as reverse proxy
- [ ] Firewall is configured (UFW or iptables)
- [ ] SSL certificate is installed (Let's Encrypt)

### Application Configuration

- [ ] Database connection pooling is configured

- [ ] Session store is configured (using database or Redis)

- [ ] Static file serving is optimized

- [ ] Compression is enabled (gzip/brotli)

- [ ] Cache headers are set for static assets

---

## Database Setup

Ensure the production database is properly configured and initialized.

### Database Creation

- [ ] Production database is created

- [ ] Database user is created with appropriate privileges

- [ ] Database connection string is correct and tested
  ```bash
  # Test connection (replace with your DATABASE_URL)
  psql "postgresql://user:password@host:port/database" -c "SELECT 1"
  ```

- [ ] Database is accessible from application server

### Schema Migration

- [ ] Database migrations are ready to run

- [ ] Backup of current database (if updating existing deployment)
  ```bash
  # Create backup before migration
  pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
  ```

- [ ] Run database migrations
  ```bash
  npm run db:push
  ```

- [ ] Verify all tables are created correctly
  ```bash
  # List all tables
  psql $DATABASE_URL -c "\dt"
  ```

- [ ] Verify table schemas match expectations
  ```bash
  # Describe specific table
  psql $DATABASE_URL -c "\d users"
  psql $DATABASE_URL -c "\d projects"
  psql $DATABASE_URL -c "\d skills"
  ```

### Initial Data

- [ ] Admin user is created (if not using seed script)

- [ ] Initial data is seeded (if applicable)
  ```bash
  npm run db:seed
  ```

- [ ] Verify admin login works

- [ ] Sample content is added (optional, for demo purposes)

### Database Optimization

- [ ] Indexes are created on frequently queried columns

- [ ] Database statistics are updated
  ```bash
  psql $DATABASE_URL -c "ANALYZE"
  ```

- [ ] Connection pool size is appropriate for your plan

### Database Backup

- [ ] Automated backup schedule is configured

- [ ] Backup retention policy is set

- [ ] Backup restoration procedure is tested

- [ ] Backup storage location is secure and accessible

---

## Post-Deployment Verification

After deployment, verify everything is working correctly.

### Application Health

- [ ] Application is running and accessible

- [ ] Health check endpoint returns healthy status
  ```bash
  curl https://yourdomain.com/api/health
  ```

- [ ] Expected response:
  ```json
  {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 123,
    "database": {
      "connected": true,
      "responseTime": 45
    },
    "memory": {
      "used": 125829120,
      "total": 536870912,
      "percentage": 23.4
    }
  }
  ```

- [ ] No errors in application logs

- [ ] Application restarts automatically if it crashes (PM2, platform auto-restart)

### Frontend Verification

- [ ] Homepage loads correctly

- [ ] All pages are accessible

- [ ] Navigation works properly

- [ ] Images and assets load correctly

- [ ] No console errors in browser developer tools

- [ ] Responsive design works on mobile devices

- [ ] 3D elements render correctly (if applicable)

### API Endpoints

- [ ] Public endpoints are accessible without authentication
  - `GET /api/projects`
  - `GET /api/projects/:id`
  - `GET /api/skills`
  - `GET /api/about`
  - `POST /api/contact/messages`

- [ ] Protected endpoints require authentication
  - `POST /api/projects` (401 without auth)
  - `PUT /api/projects/:id` (401 without auth)
  - `DELETE /api/projects/:id` (401 without auth)
  - `GET /api/contact/messages` (401 without auth)

- [ ] Authentication flow works correctly
  - Login with valid credentials succeeds
  - Login with invalid credentials fails
  - Logout works properly
  - Session persists across requests

### Admin Panel

- [ ] Admin login page is accessible

- [ ] Can log in with admin credentials

- [ ] Dashboard loads correctly

- [ ] Can create new projects

- [ ] Can edit existing projects

- [ ] Can delete projects

- [ ] Can manage skills

- [ ] Can view contact messages

- [ ] Can mark messages as read

- [ ] Can update about section

### Contact Form

- [ ] Contact form is accessible

- [ ] Form validation works (client-side)

- [ ] Form submission succeeds with valid data

- [ ] Form submission fails with invalid data

- [ ] Rate limiting prevents spam

- [ ] Contact messages appear in admin panel

- [ ] Email notifications work (if configured)

### Performance

- [ ] Page load times are acceptable (< 3 seconds)

- [ ] API response times are fast (< 500ms for most endpoints)

- [ ] Database queries are optimized (check slow query logs)

- [ ] Static assets are cached properly

- [ ] Images are optimized and load quickly

- [ ] No memory leaks (monitor over time)

### Security

- [ ] HTTPS is working (green padlock in browser)

- [ ] HTTP redirects to HTTPS

- [ ] Security headers are present
  ```bash
  curl -I https://yourdomain.com
  ```

- [ ] Rate limiting is working (test by making many requests)

- [ ] CORS is configured correctly (test from different origin)

- [ ] Session cookies are secure (httpOnly, secure flags)

- [ ] No sensitive data exposed in responses or logs

### Monitoring & Logging

- [ ] Application logs are accessible

- [ ] Error tracking is configured (Sentry, LogRocket, etc.)

- [ ] Uptime monitoring is configured (UptimeRobot, Pingdom, etc.)

- [ ] Performance monitoring is configured (optional)

- [ ] Alerts are configured for critical issues
  - Application down
  - High error rate
  - High memory usage
  - Database connection failures

### DNS & Domain

- [ ] Custom domain is configured (if applicable)

- [ ] DNS records are correct
  ```bash
  dig yourdomain.com
  nslookup yourdomain.com
  ```

- [ ] Domain resolves to correct IP/hostname

- [ ] WWW subdomain redirects to main domain (or vice versa)

- [ ] SSL certificate covers all domains/subdomains

### Backup & Recovery

- [ ] Database backup is working

- [ ] Backup restoration procedure is documented

- [ ] Backup files are accessible and not corrupted

- [ ] Recovery time objective (RTO) is acceptable

### Documentation

- [ ] Deployment documentation is up to date

- [ ] Environment variables are documented

- [ ] API documentation is complete

- [ ] Troubleshooting guide is available

- [ ] Runbook for common operations is created

---

## Rollback Procedure

If something goes wrong, follow this procedure to rollback to the previous version.

### Immediate Actions

1. **Assess the Situation**
   - [ ] Identify the issue (check logs, monitoring, user reports)
   - [ ] Determine severity (critical, major, minor)
   - [ ] Decide if rollback is necessary

2. **Communicate**
   - [ ] Notify team members
   - [ ] Update status page (if applicable)
   - [ ] Prepare user communication (if needed)

### Application Rollback

#### Platform-Managed Deployments (Railway, Render, Vercel)

1. **Railway**
   - [ ] Go to deployment dashboard
   - [ ] Click on "Deployments" tab
   - [ ] Find previous successful deployment
   - [ ] Click "Redeploy" on that deployment
   - [ ] Wait for redeployment to complete
   - [ ] Verify application is working

2. **Render**
   - [ ] Go to service dashboard
   - [ ] Click on "Events" or "Deploys"
   - [ ] Find previous successful deployment
   - [ ] Click "Rollback" or manually deploy that commit
   - [ ] Wait for redeployment to complete
   - [ ] Verify application is working

3. **Vercel**
   - [ ] Go to project dashboard
   - [ ] Click on "Deployments"
   - [ ] Find previous successful deployment
   - [ ] Click "..." menu → "Promote to Production"
   - [ ] Verify application is working

#### VPS/Self-Hosted

1. **Using Git**
   ```bash
   # SSH into server
   ssh user@your-server
   
   # Navigate to application directory
   cd ~/portfolio
   
   # Find previous working commit
   git log --oneline
   
   # Checkout previous commit
   git checkout <previous-commit-hash>
   
   # Install dependencies (if package.json changed)
   npm install
   
   # Rebuild application
   npm run build
   
   # Restart application
   pm2 restart portfolio
   
   # Verify application is working
   pm2 status
   curl http://localhost:5000/api/health
   ```

2. **Using PM2 Ecosystem**
   ```bash
   # If you have multiple versions deployed
   pm2 delete portfolio
   pm2 start ecosystem.config.js --env production
   ```

### Database Rollback

**⚠️ WARNING**: Database rollbacks are risky. Only perform if absolutely necessary.

1. **Assess Database Changes**
   - [ ] Determine if database schema changed
   - [ ] Check if data was modified or deleted
   - [ ] Verify backup is available and recent

2. **Rollback Schema Changes**
   ```bash
   # If migrations were applied, you may need to manually revert
   # This depends on your migration strategy
   
   # Option 1: Restore from backup (safest)
   psql $DATABASE_URL < backup_before_deployment.sql
   
   # Option 2: Manual schema changes (if minor)
   psql $DATABASE_URL -c "ALTER TABLE projects DROP COLUMN new_column;"
   ```

3. **Restore Data (if needed)**
   ```bash
   # Full database restore
   # WARNING: This will overwrite all data!
   
   # Drop current database
   psql -c "DROP DATABASE portfolio;"
   
   # Recreate database
   psql -c "CREATE DATABASE portfolio;"
   
   # Restore from backup
   psql $DATABASE_URL < backup_before_deployment.sql
   ```

### Verification After Rollback

- [ ] Application is running

- [ ] Health check returns healthy status
  ```bash
  curl https://yourdomain.com/api/health
  ```

- [ ] Critical functionality works
  - Homepage loads
  - API endpoints respond
  - Authentication works
  - Database queries succeed

- [ ] No errors in logs

- [ ] Users can access the application

### Post-Rollback Actions

1. **Investigate Root Cause**
   - [ ] Review deployment logs
   - [ ] Check error logs
   - [ ] Identify what went wrong
   - [ ] Document the issue

2. **Fix the Issue**
   - [ ] Make necessary code changes
   - [ ] Test thoroughly in development
   - [ ] Run all tests
   - [ ] Verify fix resolves the issue

3. **Prepare for Redeployment**
   - [ ] Create new deployment plan
   - [ ] Schedule deployment window
   - [ ] Prepare rollback plan (again)
   - [ ] Communicate with team

4. **Update Documentation**
   - [ ] Document what went wrong
   - [ ] Update troubleshooting guide
   - [ ] Add preventive measures to checklist
   - [ ] Share lessons learned with team

### Rollback Prevention

To minimize the need for rollbacks:

- [ ] Always test thoroughly before deploying
- [ ] Use staging environment for final testing
- [ ] Deploy during low-traffic periods
- [ ] Monitor closely after deployment
- [ ] Have rollback plan ready before deploying
- [ ] Keep backups recent and tested
- [ ] Use feature flags for risky changes
- [ ] Deploy incrementally (canary deployments)

---

## Final Checklist

Before marking deployment as complete:

- [ ] All pre-deployment checks passed
- [ ] All security measures in place
- [ ] All configuration verified
- [ ] Database setup complete
- [ ] All post-deployment verifications passed
- [ ] Monitoring and alerts configured
- [ ] Backup and recovery tested
- [ ] Documentation updated
- [ ] Team notified of successful deployment
- [ ] Rollback procedure documented and ready

---

## Emergency Contacts

Document key contacts for production issues:

- **Hosting Platform Support**: [Platform support URL/email]
- **Database Provider Support**: [Database support URL/email]
- **DNS Provider Support**: [DNS support URL/email]
- **Team Lead**: [Name and contact]
- **On-Call Engineer**: [Name and contact]

---

## Additional Resources

- [Deployment Guides](../deployment/) - Platform-specific deployment instructions
- [Environment Variables](../configuration/environment-variables.md) - Complete environment variable reference
- [API Documentation](../api/) - API endpoint reference
- [Backup and Recovery](../operations/backup-recovery.md) - Detailed backup procedures
- [Troubleshooting Guide](../deployment/troubleshooting.md) - Common issues and solutions

---

**Last Updated**: 2024
**Version**: 1.0.0

---

## Notes

- This checklist should be reviewed and updated regularly
- Customize based on your specific deployment platform and requirements
- Keep a copy of completed checklists for audit purposes
- Use this as a template for future deployments

**Good luck with your deployment! 🚀**
