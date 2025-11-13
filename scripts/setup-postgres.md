# Complete PostgreSQL Setup Guide

## Current Status
✅ PostgreSQL dependencies installed (`pg`, `@types/pg`, `connect-pg-simple`)
✅ Code migrated to PostgreSQL
✅ Schema updated for PostgreSQL
⏳ PostgreSQL database needs to be set up

---

## Choose Your Setup Method

### 🔷 Option 1: Local PostgreSQL Installation (Best for Development)

#### Step 1: Download and Install
1. Visit: https://www.postgresql.org/download/windows/
2. Download PostgreSQL 14 or higher
3. Run the installer (postgresql-14.x-windows-x64.exe)

#### Step 2: Installation Settings
- **Password**: Set a password for the `postgres` superuser (REMEMBER THIS!)
- **Port**: Keep default `5432`
- **Locale**: Keep default
- **Components**: Install all (PostgreSQL Server, pgAdmin 4, Command Line Tools)

#### Step 3: Verify Installation
Open a new Command Prompt or PowerShell:
```bash
psql --version
# Should show: psql (PostgreSQL) 14.x
```

#### Step 4: Create Database
```bash
# Option A: Using createdb command
createdb -U postgres portfolio

# Option B: Using psql
psql -U postgres
# Then in psql:
CREATE DATABASE portfolio;
\q
```

#### Step 5: Update .env File
Edit your `.env` file:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/portfolio
```
Replace `YOUR_PASSWORD` with the password you set during installation.

#### Step 6: Initialize Database
```bash
npm run db:push
npm run db:seed
```

---

### 🐳 Option 2: Docker PostgreSQL (Quick & Clean)

#### Step 1: Install Docker Desktop
1. Download from: https://www.docker.com/products/docker-desktop/
2. Install Docker Desktop for Windows
3. Start Docker Desktop

#### Step 2: Run PostgreSQL Container
```bash
docker run --name portfolio-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=portfolio \
  -p 5432:5432 \
  -d postgres:14
```

#### Step 3: Verify Container is Running
```bash
docker ps
# Should show portfolio-postgres container
```

#### Step 4: Update .env File
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio
```

#### Step 5: Initialize Database
```bash
npm run db:push
npm run db:seed
```

#### Docker Management Commands
```bash
# Stop container
docker stop portfolio-postgres

# Start container
docker start portfolio-postgres

# Remove container
docker rm -f portfolio-postgres

# View logs
docker logs portfolio-postgres
```

---

### ☁️ Option 3: Cloud Database (No Local Install)

#### 🟢 Neon (Recommended - Serverless PostgreSQL)

1. **Sign Up**
   - Visit: https://neon.tech
   - Sign up with GitHub or email (FREE)

2. **Create Project**
   - Click "Create Project"
   - Name: `portfolio`
   - Region: Choose closest to you
   - PostgreSQL version: 14 or higher

3. **Get Connection String**
   - Go to Dashboard → Connection Details
   - Copy the connection string
   - It looks like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/portfolio?sslmode=require`

4. **Update .env**
   ```env
   DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/portfolio?sslmode=require
   ```

5. **Initialize Database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

#### 🟣 Supabase (PostgreSQL + Extras)

1. **Sign Up**
   - Visit: https://supabase.com
   - Sign up (FREE tier available)

2. **Create Project**
   - Click "New Project"
   - Name: `portfolio`
   - Database Password: Set a strong password
   - Region: Choose closest

3. **Get Connection String**
   - Go to Settings → Database
   - Copy "Connection string" (URI format)
   - Replace `[YOUR-PASSWORD]` with your actual password

4. **Update .env**
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
   ```

5. **Initialize Database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

#### 🚂 Railway (Full Platform)

1. **Sign Up**
   - Visit: https://railway.app
   - Sign up with GitHub

2. **Create Project**
   - Click "New Project"
   - Select "Provision PostgreSQL"

3. **Get Connection String**
   - Click on PostgreSQL service
   - Go to "Connect" tab
   - Copy "Postgres Connection URL"

4. **Update .env**
   ```env
   DATABASE_URL=postgresql://postgres:pass@containers-us-west-xxx.railway.app:7432/railway
   ```

5. **Initialize Database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

---

## After Setup - Common Commands

### Initialize Database
```bash
# Push schema to database (creates tables)
npm run db:push

# Seed with sample data
npm run db:seed
```

### Start Development Server
```bash
npm run dev
```

### Access Admin Panel
- URL: http://localhost:5000/admin/login
- Username: `admin`
- Password: `admin123`

---

## Troubleshooting

### "Connection refused" Error
**Problem**: Can't connect to PostgreSQL
**Solutions**:
- Ensure PostgreSQL service is running (Windows Services)
- Check if port 5432 is available: `netstat -an | findstr 5432`
- Verify DATABASE_URL in .env is correct

### "Database does not exist" Error
**Problem**: Database not created
**Solution**:
```bash
createdb -U postgres portfolio
```

### "Password authentication failed" Error
**Problem**: Wrong password in DATABASE_URL
**Solution**: Update .env with correct password

### "npm run db:push" Fails
**Problem**: Can't connect to database
**Solutions**:
1. Verify DATABASE_URL is correct
2. Test connection: `psql "postgresql://user:pass@host:5432/portfolio"`
3. Check PostgreSQL is running

### Port 5432 Already in Use
**Problem**: Another service using port 5432
**Solutions**:
- Stop other PostgreSQL instances
- Or change port in DATABASE_URL and PostgreSQL config

---

## Verification Checklist

After setup, verify everything works:

- [ ] PostgreSQL is installed/running
- [ ] Database `portfolio` exists
- [ ] .env has correct DATABASE_URL
- [ ] `npm install` completed successfully
- [ ] `npm run db:push` completed without errors
- [ ] `npm run db:seed` completed without errors
- [ ] `npm run dev` starts server
- [ ] Can access http://localhost:5000
- [ ] Can login to admin panel

---

## Next Steps After Setup

1. **Test the Application**
   ```bash
   npm run dev
   ```
   Visit: http://localhost:5000

2. **Login to Admin**
   - URL: http://localhost:5000/admin/login
   - Username: `admin`
   - Password: `admin123`

3. **Add Your Content**
   - Update About info
   - Add your projects
   - Add your skills
   - Customize testimonials

4. **Change Admin Password**
   - For security, change the default admin password

---

## Production Deployment

When ready to deploy:

1. **Choose a hosting platform** (Vercel, Railway, Render, etc.)
2. **Set up PostgreSQL** (use cloud option from above)
3. **Set environment variables** on hosting platform
4. **Deploy application**
5. **Run migrations** on production database

See `POSTGRESQL_MIGRATION_GUIDE.md` for more details.

---

## Need Help?

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Drizzle ORM Docs: https://orm.drizzle.team/
- Node-Postgres Docs: https://node-postgres.com/

**Common Issues**: Check `POSTGRESQL_MIGRATION_GUIDE.md` for detailed troubleshooting.
