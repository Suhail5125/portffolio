# Deploying to Railway

This guide walks you through deploying the portfolio website to [Railway](https://railway.app), a modern deployment platform that offers seamless Git-based deployments, managed PostgreSQL databases, and automatic HTTPS with zero configuration.

## Prerequisites

Before you begin, ensure you have:

- ✅ A [Railway account](https://railway.app) (free tier available with $5 monthly credit)
- ✅ Your portfolio code in a GitHub repository
- ✅ GitHub account connected to Railway
- ✅ Basic familiarity with environment variables
- ✅ Your desired admin credentials ready

## Overview

Railway deployment involves:
1. Creating a new project
2. Adding a PostgreSQL database
3. Deploying the application from GitHub
4. Configuring environment variables
5. Running database migrations
6. Setting up custom domain (optional)

## Step 1: Create Railway Project

### 1.1 Sign Up / Log In

1. Visit [Railway](https://railway.app)
2. Click **Login** or **Start a New Project**
3. Sign in with your GitHub account
4. Authorize Railway to access your repositories

### 1.2 Create New Project

1. From the Railway dashboard, click **New Project**
2. You'll see several options for creating a project

## Step 2: Add PostgreSQL Database

### 2.1 Add Database Service

1. In your new project, click **+ New**
2. Select **Database**
3. Choose **Add PostgreSQL**
4. Railway will provision a PostgreSQL database (takes ~30 seconds)

### 2.2 View Database Credentials

1. Click on the PostgreSQL service card
2. Go to the **Variables** tab
3. You'll see several database-related variables:
   - `DATABASE_URL` - Full connection string (use this)
   - `PGHOST` - Database host
   - `PGPORT` - Database port (default: 5432)
   - `PGUSER` - Database user
   - `PGPASSWORD` - Database password
   - `PGDATABASE` - Database name

**Note**: Railway automatically generates these variables. You'll reference `DATABASE_URL` in your application.

### 2.3 Database Configuration

Railway's PostgreSQL includes:
- **Storage**: 1GB on free tier, expandable on paid plans
- **Backups**: Automatic daily backups
- **SSL**: Enabled by default
- **Connection Pooling**: Available via PgBouncer (optional)

## Step 3: Deploy Application

### 3.1 Deploy from GitHub

1. In your project, click **+ New**
2. Select **GitHub Repo**
3. Choose your portfolio repository from the list
4. Railway will automatically detect it's a Node.js application

### 3.2 Automatic Detection

Railway automatically detects:
- **Language**: Node.js (from `package.json`)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`
- **Port**: Automatically assigned via `PORT` environment variable

### 3.3 Initial Deployment

1. Railway will start building and deploying your application
2. Watch the deployment logs in real-time
3. First deployment typically takes 2-4 minutes

### 3.4 Monitor Build Process

In the deployment logs, you'll see:
- Installing dependencies (`npm install`)
- Building application (`npm run build`)
- Starting server (`npm run start`)

## Step 4: Configure Environment Variables

### 4.1 Access Variables Tab

1. Click on your application service (not the database)
2. Go to the **Variables** tab
3. You'll see two sections:
   - **Service Variables**: Variables specific to this service
   - **Shared Variables**: Variables shared across all services in the project

### 4.2 Add Required Variables

Click **+ New Variable** and add the following:

#### Required Variables

```bash
# Database (reference the PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Session Secret (generate a secure random string)
SESSION_SECRET=<your-secure-random-string-min-32-chars>

# Node Environment
NODE_ENV=production
```

**Important**: The `DATABASE_URL` uses Railway's variable reference syntax `${{Postgres.DATABASE_URL}}` which automatically links to your PostgreSQL service.

#### Optional Variables

```bash
# CORS Origin (your custom domain or Railway domain)
CORS_ORIGIN=https://your-app.up.railway.app

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info

# Session Configuration
SESSION_MAX_AGE=86400000

# File Uploads (if applicable)
UPLOAD_DIR=uploads
UPLOAD_MAX_FILE_SIZE=5242880
```

### 4.3 Generate Session Secret

Generate a cryptographically secure session secret:

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Using OpenSSL:**
```bash
openssl rand -hex 32
```

**Using Online Tool:**
Visit [randomkeygen.com](https://randomkeygen.com) and use a "Fort Knox Password"

### 4.4 Variable Reference Syntax

Railway supports referencing variables from other services:

```bash
# Reference database URL from Postgres service
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Reference custom variable from another service
API_KEY=${{Backend.API_KEY}}
```

### 4.5 Save and Redeploy

1. After adding all variables, Railway will automatically redeploy
2. Or click **Deploy** to manually trigger a redeployment
3. Wait for the new deployment to complete

## Step 5: Run Database Migrations

### 5.1 Access Service Shell

1. Click on your application service
2. Go to the **Deployments** tab
3. Click on the latest deployment
4. Click **View Logs** dropdown → **Shell**

Alternatively, use Railway CLI (see Step 10 for CLI setup).

### 5.2 Run Migrations

In the shell, execute:

```bash
npm run db:push
```

This will create all necessary database tables and schema.

### 5.3 Verify Tables Created

```bash
# Connect to database and list tables
psql $DATABASE_URL -c "\dt"
```

### 5.4 Seed Initial Data (Optional)

If you have a seed script:

```bash
npm run db:seed
```

Or manually create your admin user through the application.

## Step 6: Verify Deployment

### 6.1 Get Application URL

1. Click on your application service
2. Go to the **Settings** tab
3. Scroll to **Domains** section
4. You'll see your Railway-provided domain: `your-app.up.railway.app`

### 6.2 Test Health Endpoint

Visit your health check endpoint:
```
https://your-app.up.railway.app/api/health
```

Expected response:
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

### 6.3 Test Application

1. Visit your application URL
2. Navigate through the portfolio
3. Test the contact form
4. Log in to the admin panel
5. Verify all features work correctly

## Step 7: Custom Domain Setup (Optional)

### 7.1 Add Custom Domain

1. In your application service, go to **Settings**
2. Scroll to **Domains** section
3. Click **+ Custom Domain**
4. Enter your domain (e.g., `portfolio.yourdomain.com` or `yourdomain.com`)

### 7.2 Configure DNS

Add a CNAME record in your domain registrar's DNS settings:

**For subdomain (recommended):**
```
Type: CNAME
Name: portfolio (or www)
Value: your-app.up.railway.app
TTL: 3600
```

**For root domain:**

Railway provides specific instructions for root domains. You'll typically need to:
1. Add CNAME record for `www` subdomain
2. Set up a redirect from root to `www`

Or use a DNS provider that supports CNAME flattening (Cloudflare, etc.).

### 7.3 SSL Certificate

Railway automatically provisions SSL certificates for custom domains:
- Certificate is issued via Let's Encrypt
- Automatic renewal before expiration
- HTTPS is enforced automatically

### 7.4 Verify Domain

1. Wait for DNS propagation (5 minutes to 48 hours)
2. Railway will automatically verify the domain
3. Once verified, your site will be accessible via your custom domain with HTTPS

### 7.5 Update CORS Origin

Update the `CORS_ORIGIN` environment variable to your custom domain:

1. Go to **Variables** tab
2. Update `CORS_ORIGIN` to `https://yourdomain.com`
3. Railway will automatically redeploy

## Step 8: Monitoring and Logging

### 8.1 View Deployment Logs

1. Click on your application service
2. Go to **Deployments** tab
3. Click on any deployment to view its logs
4. Logs show:
   - Build process
   - Application startup
   - Runtime logs
   - Errors and warnings

### 8.2 Real-Time Logs

1. Click on your application service
2. The main view shows real-time logs
3. Filter logs by:
   - Service (app, database)
   - Log level (info, error, warn)
   - Time range

### 8.3 Monitor Metrics

1. Go to **Metrics** tab (available on paid plans)
2. View:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count
   - Response times

### 8.4 Resource Usage

1. Go to **Settings** tab
2. Scroll to **Resource Usage** section
3. View:
   - Current usage
   - Historical usage
   - Estimated monthly cost

### 8.5 Health Checks

Railway automatically monitors your application:
- Checks if the service is responding
- Restarts service if it crashes
- Sends notifications on failures (paid plans)

## Step 9: Continuous Deployment

### 9.1 Automatic Deployments

Railway automatically deploys when you push to your connected branch:

1. Make changes to your code
2. Commit and push to GitHub
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Railway detects the push
4. Automatically builds and deploys the new version
5. Zero-downtime deployment

### 9.2 Deployment Triggers

Configure deployment triggers:

1. Go to **Settings** tab
2. Scroll to **Deploy Triggers** section
3. Options:
   - **Watch Paths**: Only deploy when specific files change
   - **Ignore Paths**: Don't deploy when certain files change
   - **Branch**: Change which branch triggers deployments

### 9.3 Manual Deployments

To manually trigger a deployment:

1. Go to **Deployments** tab
2. Click **Deploy** button
3. Select:
   - **Latest Commit**: Deploy the latest code
   - **Specific Commit**: Choose a specific commit to deploy

### 9.4 Rollback Deployments

To rollback to a previous version:

1. Go to **Deployments** tab
2. Find the previous successful deployment
3. Click the **⋮** menu
4. Select **Redeploy**
5. Railway will deploy that version

### 9.5 Deployment Notifications

Set up notifications (paid plans):

1. Go to project **Settings**
2. Scroll to **Notifications** section
3. Add:
   - Email notifications
   - Slack webhook
   - Discord webhook
4. Configure events:
   - Deployment started
   - Deployment succeeded
   - Deployment failed
   - Service crashed

## Step 10: Railway CLI (Optional)

### 10.1 Install Railway CLI

**macOS/Linux:**
```bash
# Using Homebrew
brew install railway

# Or using npm
npm install -g @railway/cli
```

**Windows:**
```bash
# Using npm
npm install -g @railway/cli

# Or download from GitHub releases
```

### 10.2 Login to Railway

```bash
# Login via browser
railway login

# This will open a browser window for authentication
```

### 10.3 Link Project

```bash
# Navigate to your project directory
cd ~/portfolio

# Link to Railway project
railway link

# Select your project from the list
```

### 10.4 Useful CLI Commands

```bash
# View logs
railway logs

# Run commands in Railway environment
railway run npm run db:push

# Open shell in Railway environment
railway shell

# View environment variables
railway variables

# Deploy manually
railway up

# Check service status
railway status

# Open project in browser
railway open
```

### 10.5 Local Development with Railway

```bash
# Run local development with Railway environment variables
railway run npm run dev

# This loads all Railway environment variables locally
```

## Troubleshooting

### Build Failures

**Problem**: Build fails with "Module not found" errors

**Solution**:
```bash
# Ensure all dependencies are in package.json
npm install <missing-package> --save

# Commit and push
git add package.json package-lock.json
git commit -m "Add missing dependencies"
git push
```

**Problem**: TypeScript compilation errors

**Solution**:
```bash
# Run type check locally first
npm run check

# Fix all type errors before deploying
```

---

### Database Connection Issues

**Problem**: "Connection refused" or "Database not found"

**Solution**:
1. Verify `DATABASE_URL` is set correctly in Variables tab
2. Ensure you're using `${{Postgres.DATABASE_URL}}` syntax
3. Check that PostgreSQL service is running
4. Restart both services if needed

**Problem**: "Too many connections"

**Solution**:
```typescript
// Adjust connection pool in your database config
const pool = postgres(DATABASE_URL, {
  max: 10, // Adjust based on your plan
  idle_timeout: 20
});
```

Or enable PgBouncer for connection pooling:
1. Go to PostgreSQL service
2. Settings → Enable PgBouncer
3. Use the PgBouncer connection string

---

### Application Crashes

**Problem**: Service keeps restarting

**Solution**:
1. Check deployment logs for error messages
2. Verify all environment variables are set
3. Ensure `SESSION_SECRET` is configured
4. Check memory usage (free tier has 512MB limit)
5. Review application code for runtime errors

**Problem**: "Port already in use"

**Solution**:
```typescript
// Ensure you're using Railway's PORT variable
const PORT = process.env.PORT || 3000;
```

Railway automatically assigns a port via the `PORT` environment variable.

---

### Performance Issues

**Problem**: Slow response times

**Solution**:
1. Enable database connection pooling
2. Add caching for static assets
3. Optimize database queries
4. Consider upgrading to paid plan for better resources
5. Check if service is sleeping (free tier)

**Problem**: Service sleeps (Free tier)

**Solution**:
- Free tier services may sleep after inactivity
- Upgrade to Hobby plan ($5/month) for always-on service
- Or use a service like UptimeRobot to ping every 5 minutes

---

### Environment Variable Issues

**Problem**: Application can't read environment variables

**Solution**:
1. Verify variables are set in Variables tab
2. Check for typos in variable names
3. Ensure proper variable reference syntax: `${{Service.VARIABLE}}`
4. Redeploy after adding variables
5. Check logs for specific error messages

**Problem**: Database URL not working

**Solution**:
```bash
# Ensure you're using the reference syntax
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Not the literal string
```

---

### Migration Issues

**Problem**: Migrations fail to run

**Solution**:
```bash
# Access shell via Railway CLI
railway shell

# Run migrations manually
npm run db:push

# Check database connection
psql $DATABASE_URL -c "SELECT 1"

# Verify migrations folder exists
ls -la server/migrations
```

---

### Deployment Stuck

**Problem**: Deployment is stuck or taking too long

**Solution**:
1. Check Railway status page: [status.railway.app](https://status.railway.app)
2. Cancel deployment and retry
3. Check build logs for hanging processes
4. Ensure no long-running commands in build script
5. Contact Railway support if issue persists

---

### SSL/HTTPS Issues

**Problem**: Custom domain not getting SSL certificate

**Solution**:
1. Verify DNS is configured correctly
   ```bash
   dig your-domain.com
   nslookup your-domain.com
   ```
2. Wait up to 24 hours for DNS propagation
3. Ensure CNAME points to Railway domain
4. Check domain verification status in Railway dashboard
5. Remove and re-add domain if needed

---

## Best Practices

### Security

1. **Never commit secrets**: Use Railway's environment variables for all sensitive data
2. **Rotate secrets**: Change `SESSION_SECRET` periodically
3. **Use variable references**: Link services using `${{Service.VARIABLE}}` syntax
4. **Enable HTTPS only**: Railway provides this automatically
5. **Set secure headers**: Already configured in the application
6. **Review access logs**: Monitor for suspicious activity

### Performance

1. **Use connection pooling**: Configure appropriate pool size for your database
2. **Enable caching**: Cache static assets and API responses
3. **Optimize builds**: Remove unused dependencies
4. **Monitor metrics**: Watch CPU and memory usage
5. **Choose right region**: Deploy close to your users (paid plans)
6. **Use PgBouncer**: Enable for better database connection management

### Reliability

1. **Enable health checks**: Use `/api/health` endpoint
2. **Set up monitoring**: Configure alerts for downtime (paid plans)
3. **Regular backups**: Railway backs up databases automatically
4. **Test before deploying**: Run tests locally first
5. **Use staging environment**: Create separate Railway project for testing
6. **Monitor logs**: Regularly check for errors and warnings

### Cost Optimization

1. **Start with free tier**: Test with $5 monthly credit
2. **Monitor usage**: Track resource consumption in dashboard
3. **Optimize resources**: Reduce memory usage where possible
4. **Clean up unused services**: Delete test projects
5. **Use shared databases**: Share PostgreSQL across multiple apps if appropriate
6. **Upgrade strategically**: Only upgrade when you need more resources

### Development Workflow

1. **Use Railway CLI**: Faster development with local environment
2. **Link services properly**: Use variable references for service communication
3. **Test migrations locally**: Run `db:push` locally before deploying
4. **Use feature branches**: Test changes before merging to main
5. **Monitor deployments**: Watch logs during deployment
6. **Document environment variables**: Keep `.env.example` up to date

## Backup and Recovery

### Database Backups

Railway automatically backs up PostgreSQL databases:
- **Free tier**: Daily backups, 7-day retention
- **Paid tiers**: Daily backups, 14-day retention
- **Pro tier**: Continuous backups, point-in-time recovery

### Manual Backup

Create a manual backup using Railway CLI:

```bash
# Connect to database and create backup
railway run pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Or using psql directly
psql $DATABASE_URL -c "\copy (SELECT * FROM projects) TO 'projects_backup.csv' CSV HEADER"
```

### Restore from Backup

```bash
# Restore from SQL backup
railway run psql $DATABASE_URL < backup.sql

# Or use Railway dashboard to restore from automatic backup
```

### Access Backups via Dashboard

1. Go to PostgreSQL service
2. Click **Backups** tab (paid plans)
3. View available backups
4. Click **Restore** to restore from a specific backup

## Scaling

### Vertical Scaling

Upgrade your service plan for more resources:

1. Go to project **Settings**
2. Scroll to **Plan** section
3. Choose a higher tier:
   - **Free**: $5 monthly credit, 512MB RAM, shared CPU
   - **Hobby**: $5/month, 512MB RAM, shared CPU, always-on
   - **Pro**: $20/month, 8GB RAM, dedicated CPU, priority support

### Horizontal Scaling

For high traffic (Pro plans):
1. Deploy multiple instances of your application
2. Use Railway's load balancing (automatic)
3. Configure auto-scaling based on metrics
4. Use Redis for session storage across instances

### Database Scaling

Upgrade database plan:
1. Go to PostgreSQL service → **Settings**
2. Scroll to **Plan** section
3. Choose higher tier for:
   - More storage
   - Better performance
   - More connections
   - Longer backup retention
   - Point-in-time recovery

### Regional Deployment

Deploy to multiple regions (Pro plans):
1. Create separate Railway projects per region
2. Use a global load balancer (Cloudflare, AWS Route53)
3. Replicate database across regions
4. Configure DNS for geo-routing

## Railway vs Other Platforms

### Railway vs Render

**Railway Advantages:**
- Simpler setup and configuration
- Better developer experience
- Faster deployments
- Built-in service linking
- More generous free tier ($5 credit)

**Render Advantages:**
- More mature platform
- Better documentation
- More deployment options
- Longer free tier uptime (750 hours/month)

### Railway vs Vercel

**Railway Advantages:**
- Full-stack deployment (backend + database)
- PostgreSQL included
- Better for Node.js backends
- Simpler environment variable management

**Vercel Advantages:**
- Optimized for Next.js and frontend
- Better edge network
- More generous bandwidth
- Better for static sites

### Railway vs Heroku

**Railway Advantages:**
- Modern developer experience
- Faster deployments
- Better pricing
- No sleep on free tier (with credit)
- Better CLI

**Heroku Advantages:**
- More mature ecosystem
- More add-ons available
- Better enterprise support
- More deployment options

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Blog](https://blog.railway.app)
- [Railway Discord Community](https://discord.gg/railway)
- [Railway Status Page](https://status.railway.app)
- [Railway CLI GitHub](https://github.com/railwayapp/cli)
- [Railway Templates](https://railway.app/templates)

## Support

If you encounter issues:

1. Check [Railway Status Page](https://status.railway.app)
2. Review deployment logs in dashboard
3. Search [Railway Discord](https://discord.gg/railway)
4. Check [Railway Documentation](https://docs.railway.app)
5. Contact Railway support (faster response on paid plans)

## Next Steps

After successful deployment:
1. ✅ Set up monitoring and alerts (paid plans)
2. ✅ Configure custom domain
3. ✅ Verify automated backups
4. ✅ Review security settings
5. ✅ Test all functionality
6. ✅ Set up staging environment
7. ✅ Share your portfolio with the world!

---

**Congratulations!** Your portfolio is now live on Railway. 🎉
