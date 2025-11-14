# Deploying to Vercel + Backend Service

This guide covers deploying the portfolio application using a split deployment approach:
- **Frontend**: Deployed to Vercel (static React app)
- **Backend**: Deployed to a separate service (Railway, Render, or VPS)

This approach leverages Vercel's excellent frontend hosting while keeping the backend on a platform that better supports Node.js servers with databases.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment to Vercel](#frontend-deployment-to-vercel)
5. [Environment Variables](#environment-variables)
6. [Custom Domain Setup](#custom-domain-setup)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- GitHub account with repository access
- Vercel account (free tier available at [vercel.com](https://vercel.com))
- Backend hosting account (Railway, Render, or VPS)
- PostgreSQL database (can be on same service as backend)
- Node.js 18+ installed locally for testing

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└────────────┬────────────────────────────────────────────────┘
             │
             ├──────────────────┐
             │                  │
             ▼                  ▼
    ┌─────────────────┐  ┌─────────────────┐
    │     Vercel      │  │  Backend Host   │
    │   (Frontend)    │  │  (Railway/etc)  │
    │                 │  │                 │
    │  - Static HTML  │  │  - Express API  │
    │  - React SPA    │  │  - Auth/Session │
    │  - Assets       │──▶│  - Database     │
    │                 │  │                 │
    └─────────────────┘  └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   PostgreSQL    │
                         │    Database     │
                         └─────────────────┘
```

**Key Points**:
- Frontend makes API calls to backend URL
- Backend handles all data operations and authentication
- CORS must be configured to allow Vercel domain
- Sessions work across domains using secure cookies

## Backend Deployment

### Step 1: Choose and Deploy Backend

First, deploy your backend to one of these platforms:

**Option A: Railway** (Recommended)
- Follow the [Railway deployment guide](./railway.md)
- Note your backend URL (e.g., `https://your-app.up.railway.app`)

**Option B: Render**
- Follow the [Render deployment guide](./render.md)
- Note your backend URL (e.g., `https://your-app.onrender.com`)

**Option C: VPS**
- Follow the [VPS deployment guide](./vps.md)
- Note your backend URL (e.g., `https://api.yourdomain.com`)

### Step 2: Configure Backend for CORS

Your backend needs to accept requests from your Vercel domain. Update the `CORS_ORIGIN` environment variable on your backend service:

```bash
# During development (allows Vercel preview deployments)
CORS_ORIGIN=https://your-app.vercel.app,https://your-app-*.vercel.app

# For production (specific domain)
CORS_ORIGIN=https://your-domain.com
```

The backend's `server/middleware/security.ts` already handles CORS configuration based on this variable.

### Step 3: Test Backend Health

Verify your backend is running:

```bash
curl https://your-backend-url.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "database": {
    "connected": true,
    "responseTime": 15
  },
  "memory": {
    "used": 45000000,
    "total": 512000000,
    "percentage": 8.8
  }
}
```

## Frontend Deployment to Vercel

### Step 1: Prepare Repository

Ensure your repository has the correct build configuration:

1. **Verify `package.json` scripts**:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

2. **Check `vite.config.ts`** - should have proper build settings:
```typescript
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
});
```

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables

In Vercel project settings, add the following environment variable:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `https://your-backend-url.com` | Production, Preview, Development |

**Important**: 
- Use your actual backend URL from Step 1
- Include the protocol (`https://`)
- Do NOT include a trailing slash
- This variable is used by the frontend to make API calls

### Step 4: Update Frontend API Configuration

Ensure your frontend uses the environment variable for API calls. Check `client/src/lib/api.ts` or similar:

```typescript
// Use environment variable with fallback for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchProjects() {
  const response = await fetch(`${API_BASE_URL}/api/projects`);
  return response.json();
}
```

### Step 5: Deploy

1. Click **"Deploy"** in Vercel
2. Wait for build to complete (usually 1-2 minutes)
3. Vercel will provide a URL: `https://your-app.vercel.app`

### Step 6: Verify Deployment

Test your deployed application:

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Check browser console** for errors
3. **Test API connectivity**:
   - Open browser DevTools → Network tab
   - Navigate through the site
   - Verify API calls go to your backend URL
   - Check for CORS errors (should be none)

4. **Test authentication**:
   - Try logging into admin panel
   - Verify session persists across page refreshes

## Environment Variables

### Backend Environment Variables

Configure these on your backend hosting service:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Session
SESSION_SECRET=your-super-secret-session-key-min-32-chars

# Server
NODE_ENV=production
PORT=5000

# Security
CORS_ORIGIN=https://your-app.vercel.app,https://your-domain.com

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables (Vercel)

Configure these in Vercel project settings:

```bash
# API Connection
VITE_API_URL=https://your-backend-url.com
```

**Note**: Vite environment variables must be prefixed with `VITE_` to be exposed to the client.

## Custom Domain Setup

### Setting Up Custom Domain on Vercel

1. **Add Domain to Vercel**:
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `yourdomain.com`)
   - Follow DNS configuration instructions

2. **Configure DNS**:
   
   **Option A: Using Vercel Nameservers** (Recommended)
   - Point your domain's nameservers to Vercel
   - Vercel manages all DNS records
   - Automatic SSL certificate
   
   **Option B: Using CNAME Record**
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.21.21`
   - SSL certificate auto-provisioned

3. **Update Backend CORS**:
   ```bash
   CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
   ```

4. **Update Vercel Environment Variable**:
   - Keep `VITE_API_URL` pointing to backend
   - No changes needed unless backend domain changes

### Setting Up Custom Domain for Backend

If using a custom domain for your backend API:

1. **Configure on hosting platform**:
   - Railway: Project Settings → Domains
   - Render: Settings → Custom Domain
   - VPS: Configure Nginx/Apache

2. **Update DNS**:
   ```
   api.yourdomain.com → CNAME → your-backend-host.com
   ```

3. **Update Vercel environment variable**:
   ```bash
   VITE_API_URL=https://api.yourdomain.com
   ```

4. **Redeploy frontend** to pick up new API URL

## Monitoring

### Vercel Monitoring

Vercel provides built-in monitoring:

1. **Analytics**:
   - Go to Project → Analytics
   - View page views, unique visitors, top pages
   - Available on Pro plan

2. **Deployment Logs**:
   - Go to Deployments → Select deployment
   - View build logs and runtime logs
   - Check for build errors

3. **Performance**:
   - Vercel automatically monitors Core Web Vitals
   - View in Project → Speed Insights (Pro plan)

### Backend Monitoring

Monitor your backend service:

1. **Health Checks**:
   ```bash
   # Set up monitoring service (UptimeRobot, Pingdom)
   # Monitor: https://your-backend-url.com/api/health
   # Check interval: 5 minutes
   # Alert on: Status code != 200
   ```

2. **Application Logs**:
   - Railway: View logs in dashboard
   - Render: View logs in dashboard
   - VPS: Check PM2 logs (`pm2 logs`)

3. **Error Tracking** (Optional):
   ```bash
   # Install Sentry or similar
   npm install @sentry/node @sentry/react
   ```

### Setting Up Uptime Monitoring

1. **Create UptimeRobot account** (free)
2. **Add monitors**:
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://your-backend-url.com/api/health`
   - API: `https://your-backend-url.com/api/projects`
3. **Configure alerts** via email/SMS

## Troubleshooting

### CORS Errors

**Symptom**: Browser console shows CORS errors when making API calls

```
Access to fetch at 'https://backend.com/api/projects' from origin 
'https://your-app.vercel.app' has been blocked by CORS policy
```

**Solutions**:

1. **Check backend CORS_ORIGIN**:
   ```bash
   # Must include your Vercel domain
   CORS_ORIGIN=https://your-app.vercel.app
   ```

2. **Include preview deployments**:
   ```bash
   # Allow all Vercel preview URLs
   CORS_ORIGIN=https://your-app.vercel.app,https://your-app-*.vercel.app
   ```

3. **Verify CORS middleware** in `server/middleware/security.ts`:
   ```typescript
   app.use(cors({
     origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
     credentials: true
   }));
   ```

4. **Redeploy backend** after changing CORS_ORIGIN

### Authentication Not Working

**Symptom**: Login succeeds but session doesn't persist, or "Unauthorized" errors

**Solutions**:

1. **Check cookie settings** in backend:
   ```typescript
   // server/index.ts
   app.use(session({
     cookie: {
       secure: process.env.NODE_ENV === 'production', // Must be true in prod
       sameSite: 'none', // Required for cross-domain
       httpOnly: true,
       maxAge: 1000 * 60 * 60 * 24 * 7
     }
   }));
   ```

2. **Verify HTTPS**: Both frontend and backend must use HTTPS in production

3. **Check credentials in fetch**:
   ```typescript
   // Frontend API calls must include credentials
   fetch(`${API_URL}/api/auth/login`, {
     method: 'POST',
     credentials: 'include', // Important!
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ username, password })
   });
   ```

### API Calls Failing

**Symptom**: Network errors or wrong URLs in browser DevTools

**Solutions**:

1. **Verify VITE_API_URL** in Vercel:
   - Go to Project Settings → Environment Variables
   - Check value is correct (no trailing slash)
   - Redeploy if changed

2. **Check backend is running**:
   ```bash
   curl https://your-backend-url.com/api/health
   ```

3. **Verify environment variable usage**:
   ```typescript
   // Should use import.meta.env.VITE_API_URL
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```

4. **Clear Vercel build cache**:
   - Go to Deployments
   - Click "..." → Redeploy
   - Check "Clear cache and redeploy"

### Build Failures on Vercel

**Symptom**: Deployment fails during build step

**Solutions**:

1. **Check build logs** in Vercel deployment details

2. **Common issues**:
   ```bash
   # TypeScript errors
   npm run type-check  # Fix locally first
   
   # Missing dependencies
   npm install  # Ensure package-lock.json is committed
   
   # Build command wrong
   # Verify in vercel.json or project settings
   ```

3. **Test build locally**:
   ```bash
   npm run build
   npm run preview  # Test production build
   ```

4. **Check Node version**:
   ```json
   // package.json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

### Preview Deployments Not Working

**Symptom**: Preview deployments (from PRs) fail or don't connect to backend

**Solutions**:

1. **Update CORS to allow preview URLs**:
   ```bash
   CORS_ORIGIN=https://your-app-*.vercel.app
   ```

2. **Use same environment variables** for preview as production

3. **Check Vercel preview URL** format:
   - Usually: `https://your-app-git-branch-username.vercel.app`

### Database Connection Issues

**Symptom**: Backend health check fails, database errors in logs

**Solutions**:

1. **Verify DATABASE_URL** on backend service

2. **Check database is running**:
   ```bash
   # Test connection
   psql $DATABASE_URL -c "SELECT 1"
   ```

3. **Check connection limits**:
   - PostgreSQL has max connections
   - Use connection pooling
   - Check current connections: `SELECT count(*) FROM pg_stat_activity;`

4. **Verify SSL settings**:
   ```bash
   # Some hosts require SSL
   DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
   ```

### Slow Performance

**Symptom**: Application loads slowly, API calls take too long

**Solutions**:

1. **Check backend location**:
   - Deploy backend in same region as database
   - Use CDN for static assets (Vercel does this automatically)

2. **Optimize bundle size**:
   ```bash
   # Analyze bundle
   npm run build -- --mode analyze
   
   # Check for large dependencies
   npx vite-bundle-visualizer
   ```

3. **Enable compression** on backend:
   ```typescript
   import compression from 'compression';
   app.use(compression());
   ```

4. **Add caching**:
   ```typescript
   // Cache static API responses
   app.get('/api/projects', cacheMiddleware(300), getProjects);
   ```

### Environment Variables Not Working

**Symptom**: `undefined` values for environment variables

**Solutions**:

1. **Frontend variables must start with `VITE_`**:
   ```bash
   # ✅ Correct
   VITE_API_URL=https://api.example.com
   
   # ❌ Wrong (not exposed to client)
   API_URL=https://api.example.com
   ```

2. **Redeploy after adding variables**:
   - Vercel doesn't automatically redeploy
   - Click "Redeploy" after adding variables

3. **Check variable scope**:
   - Set for Production, Preview, and Development
   - Or set specifically per environment

4. **Verify in build logs**:
   ```typescript
   // Add temporary log during build
   console.log('Build-time API URL:', import.meta.env.VITE_API_URL);
   ```

## Best Practices

### Security

1. **Always use HTTPS** for both frontend and backend
2. **Set secure cookie options** in production
3. **Limit CORS origins** to specific domains (not wildcards)
4. **Use environment variables** for all secrets
5. **Enable rate limiting** on backend API
6. **Keep dependencies updated**: `npm audit fix`

### Performance

1. **Enable caching** for static assets
2. **Use code splitting** in Vite config
3. **Optimize images** before uploading
4. **Monitor bundle size**: Keep under 500KB initial load
5. **Use lazy loading** for routes and components

### Deployment Workflow

1. **Test locally** before deploying:
   ```bash
   npm run build
   npm run preview
   ```

2. **Use preview deployments** for testing:
   - Create PR → Vercel auto-deploys preview
   - Test preview URL before merging

3. **Monitor after deployment**:
   - Check health endpoints
   - Review error logs
   - Test critical user flows

4. **Keep staging environment**:
   - Use separate Vercel project for staging
   - Test changes before production

### Maintenance

1. **Regular backups** of database
2. **Monitor uptime** with external service
3. **Review logs** weekly for errors
4. **Update dependencies** monthly
5. **Test disaster recovery** procedure

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Railway Deployment Guide](./railway.md)
- [Render Deployment Guide](./render.md)
- [API Documentation](../api/README.md)

## Support

If you encounter issues not covered in this guide:

1. Check [GitHub Issues](https://github.com/your-repo/issues)
2. Review Vercel deployment logs
3. Check backend service logs
4. Test API endpoints directly with curl/Postman
5. Verify all environment variables are set correctly

---

**Next Steps**: After successful deployment, consider:
- Setting up monitoring and alerts
- Configuring custom domain
- Enabling analytics
- Setting up automated backups
- Implementing CI/CD for automated deployments
