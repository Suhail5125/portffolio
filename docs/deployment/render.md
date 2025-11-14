# Deploying to Render

This guide walks you through deploying the portfolio website to [Render](https://render.com), a modern cloud platform that offers seamless deployment with automatic SSL, continuous deployment, and managed PostgreSQL databases.

## Prerequisites

Before you begin, ensure you have:

- ✅ A [Render account](https://render.com) (free tier available)
- ✅ Your portfolio code in a GitHub repository
- ✅ GitHub account connected to Render
- ✅ Basic familiarity with environment variables
- ✅ Your desired admin credentials ready

## Overview

Render deployment involves:
1. Creating a PostgreSQL database
2. Creating a web service for the application
3. Configuring environment variables
4. Running database migrations
5. Setting up custom domain (optional)

## Step 1: Create a PostgreSQL Database

### 1.1 Navigate to Databases

1. Log in to your [Render Dashboard](https://dashboard.render.com)
2. Click **New +** in the top right
3. Select **PostgreSQL**

### 1.2 Configure Database

Fill in the database details:

- **Name**: `portfolio-db` (or your preferred name)
- **Database**: `portfolio` (database name)
- **User**: `portfolio_user` (will be auto-generated)
- **Region**: Choose the region closest to your users
- **PostgreSQL Version**: 14 or later
- **Plan**: Free (or paid for production)

### 1.3 Create Database

1. Click **Create Database**
2. Wait for the database to be provisioned (1-2 minutes)
3. Once ready, you'll see the database dashboard

### 1.4 Save Connection Details

On the database dashboard, you'll find:
- **Internal Database URL**: Use this for your web service (faster, free internal networking)
- **External Database URL**: Use this for local connections

Copy the **Internal Database URL** - you'll need it for the web service configuration.

Example format:
```
postgresql://portfolio_user:password@dpg-xxxxx-a.oregon-postgres.render.com/portfolio
```

## Step 2: Create Web Service

### 2.1 Navigate to Services

1. From the Render Dashboard, click **New +**
2. Select **Web Service**

### 2.2 Connect Repository

1. Click **Connect a repository**
2. If this is your first time, authorize Render to access your GitHub account
3. Select your portfolio repository from the list
4. Click **Connect**

### 2.3 Configure Web Service

Fill in the service details:

**Basic Settings:**
- **Name**: `portfolio` (or your preferred name)
- **Region**: Same region as your database
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave blank (unless your code is in a subdirectory)
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
- **Start Command**:
  ```bash
  npm run start
  ```

**Plan:**
- Select **Free** (or paid plan for production)
- Note: Free tier has limitations (spins down after inactivity, 750 hours/month)

### 2.4 Advanced Settings (Optional)

Click **Advanced** to configure:
- **Auto-Deploy**: Yes (recommended - deploys on every push to main)
- **Health Check Path**: `/api/health`

## Step 3: Configure Environment Variables

### 3.1 Add Environment Variables

In the web service configuration, scroll to **Environment Variables** section and add:

#### Required Variables

```bash
# Database
DATABASE_URL=<your-internal-database-url>

# Session Secret (generate a random string)
SESSION_SECRET=<generate-random-32-char-string>

# Node Environment
NODE_ENV=production

# Server Port (Render provides this automatically)
PORT=10000
```

#### Optional Variables

```bash
# CORS Origin (your custom domain or Render URL)
CORS_ORIGIN=https://your-portfolio.onrender.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### 3.2 Generate Session Secret

Generate a secure random string for `SESSION_SECRET`:

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

### 3.3 Set Database URL

Replace `<your-internal-database-url>` with the Internal Database URL you copied in Step 1.4.

**Important**: Use the **Internal Database URL** for better performance and no bandwidth charges.

## Step 4: Deploy Application

### 4.1 Create Service

1. Review all settings
2. Click **Create Web Service**
3. Render will start building and deploying your application

### 4.2 Monitor Deployment

Watch the deployment logs in real-time:
- Build process (installing dependencies, compiling TypeScript, building frontend)
- Deploy process (starting the server)

First deployment typically takes 3-5 minutes.

### 4.3 Verify Deployment

Once deployed, you'll see:
- ✅ **Status**: Live
- 🌐 **URL**: `https://your-service-name.onrender.com`

## Step 5: Run Database Migrations

### 5.1 Access Shell

1. In your web service dashboard, click **Shell** in the left sidebar
2. This opens a terminal connected to your running service

### 5.2 Run Migrations

Execute the migration command:

```bash
npm run db:push
```

This will create all necessary database tables and schema.

### 5.3 Seed Initial Data (Optional)

If you have a seed script, run it:

```bash
npm run db:seed
```

Or manually create your admin user through the application.

## Step 6: Verify Application

### 6.1 Test Health Endpoint

Visit your health check endpoint:
```
https://your-service-name.onrender.com/api/health
```

You should see:
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

### 6.2 Test Application

1. Visit your application URL
2. Navigate through the portfolio
3. Test the contact form
4. Log in to the admin panel
5. Verify all features work correctly

## Step 7: Custom Domain Setup (Optional)

### 7.1 Add Custom Domain

1. In your web service dashboard, click **Settings**
2. Scroll to **Custom Domain** section
3. Click **Add Custom Domain**
4. Enter your domain (e.g., `portfolio.yourdomain.com`)

### 7.2 Configure DNS

Add a CNAME record in your domain registrar's DNS settings:

**For subdomain (recommended):**
```
Type: CNAME
Name: portfolio (or www)
Value: your-service-name.onrender.com
TTL: 3600
```

**For root domain:**
```
Type: A
Name: @
Value: <Render's IP address - shown in dashboard>
TTL: 3600
```

### 7.3 Verify Domain

1. Wait for DNS propagation (5 minutes to 48 hours)
2. Render will automatically provision an SSL certificate
3. Once verified, your site will be accessible via your custom domain with HTTPS

### 7.4 Update CORS Origin

Update the `CORS_ORIGIN` environment variable to your custom domain:
```bash
CORS_ORIGIN=https://portfolio.yourdomain.com
```

## Step 8: Monitoring and Logging

### 8.1 View Logs

Access application logs:
1. Go to your web service dashboard
2. Click **Logs** in the left sidebar
3. View real-time logs or filter by time range

**Log Types:**
- Build logs: Compilation and build process
- Deploy logs: Application startup
- Runtime logs: Application errors and info

### 8.2 Monitor Metrics

View service metrics:
1. Click **Metrics** in the left sidebar
2. Monitor:
   - CPU usage
   - Memory usage
   - Request count
   - Response times
   - Bandwidth usage

### 8.3 Set Up Alerts (Paid Plans)

For paid plans, configure alerts:
1. Go to **Settings** → **Alerts**
2. Set up notifications for:
   - Service down
   - High CPU usage
   - High memory usage
   - Failed deployments

### 8.4 Health Checks

Render automatically monitors your health check endpoint:
- Path: `/api/health`
- Frequency: Every 30 seconds
- If health check fails, Render will restart the service

## Step 9: Continuous Deployment

### 9.1 Automatic Deployments

With Auto-Deploy enabled (recommended):
1. Push changes to your main branch
2. Render automatically detects the push
3. Builds and deploys the new version
4. Zero-downtime deployment

### 9.2 Manual Deployments

To manually trigger a deployment:
1. Go to your web service dashboard
2. Click **Manual Deploy** → **Deploy latest commit**
3. Or select a specific commit to deploy

### 9.3 Deployment Notifications

Configure notifications:
1. Go to **Settings** → **Notifications**
2. Add email or Slack webhook
3. Get notified on:
   - Successful deployments
   - Failed deployments
   - Service issues

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

### Database Connection Issues

**Problem**: "Connection refused" or "Database not found"

**Solution**:
1. Verify `DATABASE_URL` is set correctly
2. Use the **Internal Database URL** (not external)
3. Ensure database is in the same region as web service
4. Check database status in Render dashboard

**Problem**: "Too many connections"

**Solution**:
```typescript
// Adjust connection pool in your database config
const pool = postgres(DATABASE_URL, {
  max: 10, // Reduce for free tier
  idle_timeout: 20
});
```

### Application Crashes

**Problem**: Service keeps restarting

**Solution**:
1. Check logs for error messages
2. Verify all environment variables are set
3. Ensure `SESSION_SECRET` is configured
4. Check memory usage (free tier has 512MB limit)

**Problem**: "Port already in use"

**Solution**:
```typescript
// Ensure you're using Render's PORT variable
const PORT = process.env.PORT || 3000;
```

### Performance Issues

**Problem**: Slow response times

**Solution**:
1. Enable database connection pooling
2. Add caching for static assets
3. Optimize database queries
4. Consider upgrading to paid plan for better resources

**Problem**: Service spins down (Free tier)

**Solution**:
- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Upgrade to paid plan for always-on service
- Or use a service like UptimeRobot to ping every 14 minutes

### SSL/HTTPS Issues

**Problem**: SSL certificate not provisioning

**Solution**:
1. Verify DNS is configured correctly
2. Wait up to 24 hours for DNS propagation
3. Ensure CNAME points to correct Render URL
4. Check domain verification status in dashboard

### Environment Variable Issues

**Problem**: Application can't read environment variables

**Solution**:
1. Verify variables are set in Render dashboard (not .env file)
2. Restart service after adding variables
3. Check for typos in variable names
4. Ensure no quotes around values in Render UI

### Migration Issues

**Problem**: Migrations fail to run

**Solution**:
```bash
# Access shell and run manually
npm run db:push

# Check database connection
psql $DATABASE_URL -c "SELECT 1"

# Verify migrations folder exists
ls -la server/migrations
```

## Best Practices

### Security

1. **Never commit secrets**: Use environment variables for all sensitive data
2. **Rotate secrets**: Change `SESSION_SECRET` periodically
3. **Use Internal Database URL**: Faster and more secure
4. **Enable HTTPS only**: Render provides this automatically
5. **Set secure headers**: Already configured in the application

### Performance

1. **Use connection pooling**: Configure appropriate pool size
2. **Enable caching**: Cache static assets and API responses
3. **Optimize builds**: Remove unused dependencies
4. **Monitor metrics**: Watch CPU and memory usage
5. **Choose right region**: Deploy close to your users

### Reliability

1. **Enable health checks**: Use `/api/health` endpoint
2. **Set up monitoring**: Configure alerts for downtime
3. **Regular backups**: Render backs up databases automatically
4. **Test before deploying**: Run tests locally first
5. **Use staging environment**: Test changes before production

### Cost Optimization

1. **Start with free tier**: Test before committing to paid plans
2. **Monitor usage**: Track bandwidth and compute hours
3. **Optimize resources**: Reduce memory usage where possible
4. **Use internal networking**: Free between Render services
5. **Clean up unused services**: Delete test deployments

## Backup and Recovery

### Database Backups

Render automatically backs up PostgreSQL databases:
- **Free tier**: Daily backups, 7-day retention
- **Paid tiers**: Continuous backups, point-in-time recovery

### Manual Backup

To create a manual backup:

```bash
# From your local machine
pg_dump $DATABASE_URL > backup.sql

# Or from Render shell
pg_dump $DATABASE_URL > /tmp/backup.sql
```

### Restore from Backup

```bash
# From local machine
psql $DATABASE_URL < backup.sql

# Or use Render's dashboard to restore from automatic backup
```

## Scaling

### Vertical Scaling

Upgrade your service plan for more resources:
1. Go to **Settings** → **Plan**
2. Choose a higher tier:
   - **Starter**: $7/month - 512MB RAM, always on
   - **Standard**: $25/month - 2GB RAM, better performance
   - **Pro**: $85/month - 4GB RAM, high performance

### Horizontal Scaling

For high traffic:
1. Enable **Auto-Scaling** (Pro plans and above)
2. Configure min/max instances
3. Set scaling triggers (CPU, memory, request count)

### Database Scaling

Upgrade database plan:
1. Go to database dashboard → **Settings** → **Plan**
2. Choose higher tier for:
   - More storage
   - Better performance
   - More connections
   - Longer backup retention

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Status Page](https://status.render.com)
- [Render Community Forum](https://community.render.com)
- [Render Blog](https://render.com/blog)
- [PostgreSQL on Render](https://render.com/docs/databases)

## Support

If you encounter issues:
1. Check the [Render Status Page](https://status.render.com)
2. Search the [Community Forum](https://community.render.com)
3. Review application logs in dashboard
4. Contact Render support (paid plans get priority)

## Next Steps

After successful deployment:
1. ✅ Set up monitoring and alerts
2. ✅ Configure custom domain
3. ✅ Set up automated backups
4. ✅ Review security settings
5. ✅ Test all functionality
6. ✅ Share your portfolio with the world!

---

**Congratulations!** Your portfolio is now live on Render. 🎉
