# PostgreSQL Migration Guide

This application has been migrated from SQLite to PostgreSQL.

## Prerequisites

1. **Install PostgreSQL** (version 14 or higher)
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql@14`
   - Linux: `sudo apt-get install postgresql-14`

2. **Start PostgreSQL service**
   - Windows: PostgreSQL service should start automatically
   - Mac: `brew services start postgresql@14`
   - Linux: `sudo systemctl start postgresql`

## Setup Instructions

### 1. Create Database

```bash
# Using psql command line
createdb portfolio

# Or using psql
psql -U postgres
CREATE DATABASE portfolio;
\q
```

### 2. Configure Environment Variables

Update your `.env` file with your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio
```

Replace `username` and `password` with your PostgreSQL credentials.

### 3. Install Dependencies

```bash
npm install
```

This will install the new PostgreSQL dependencies:
- `pg` - PostgreSQL client for Node.js
- `@types/pg` - TypeScript types
- `connect-pg-simple` - PostgreSQL session store

### 4. Push Database Schema

```bash
npm run db:push
```

This command uses Drizzle Kit to create all tables in your PostgreSQL database.

### 5. Seed Database

```bash
npm run db:seed
```

This will populate your database with:
- Admin user (username: `admin`, password: `admin123`)
- Sample projects
- Sample skills
- Sample about info

### 6. Start Development Server

```bash
npm run dev
```

## Migration from SQLite

If you have existing data in SQLite (`portfolio.db`), you'll need to manually migrate it:

### Option 1: Manual Export/Import

1. Export data from SQLite:
```bash
sqlite3 portfolio.db .dump > data.sql
```

2. Convert SQLite SQL to PostgreSQL format (manual editing required)
3. Import to PostgreSQL:
```bash
psql -U postgres -d portfolio < data.sql
```

### Option 2: Use a Migration Tool

Tools like `pgloader` can automate the migration:

```bash
pgloader sqlite://portfolio.db postgresql://localhost/portfolio
```

## Key Differences

### Data Types

| SQLite | PostgreSQL |
|--------|-----------|
| `TEXT` | `TEXT` or `VARCHAR` |
| `INTEGER` (for booleans) | `BOOLEAN` |
| `INTEGER` (for timestamps) | `TIMESTAMP` |
| `TEXT` (for UUIDs) | `UUID` |

### ID Generation

- **SQLite**: Used `randomUUID()` from Node.js crypto
- **PostgreSQL**: Uses native `UUID` type with `defaultRandom()`

### Boolean Values

- **SQLite**: Stored as `0` (false) or `1` (true)
- **PostgreSQL**: Native `BOOLEAN` type with `true`/`false`

### Timestamps

- **SQLite**: Stored as Unix timestamps (integers)
- **PostgreSQL**: Native `TIMESTAMP` type with `defaultNow()`

## Production Deployment

### Hosted PostgreSQL Options

1. **Neon** (https://neon.tech) - Serverless PostgreSQL
   - Free tier available
   - Automatic scaling
   - Great for serverless deployments

2. **Supabase** (https://supabase.com) - PostgreSQL with extras
   - Free tier available
   - Includes auth, storage, and real-time features

3. **Railway** (https://railway.app) - Full-stack platform
   - PostgreSQL included
   - Easy deployment

4. **Heroku Postgres** - Managed PostgreSQL
   - Free tier available (limited)
   - Easy integration

5. **AWS RDS** - Enterprise-grade
   - Highly scalable
   - More expensive

### Connection String Format

```
postgresql://username:password@host:port/database?sslmode=require
```

For production, always use SSL:
```
postgresql://user:pass@host:5432/db?sslmode=require
```

## Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Ensure PostgreSQL is running:
```bash
# Check status
pg_ctl status

# Start PostgreSQL
pg_ctl start
```

### Authentication Failed

```
Error: password authentication failed for user "postgres"
```

**Solution**: Reset PostgreSQL password or update `.env` with correct credentials.

### Database Does Not Exist

```
Error: database "portfolio" does not exist
```

**Solution**: Create the database:
```bash
createdb portfolio
```

### Permission Denied

```
Error: permission denied for table projects
```

**Solution**: Grant permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE portfolio TO your_username;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
```

## Performance Tips

1. **Connection Pooling**: Already configured in `server/storage.ts`
2. **Indexes**: Add indexes for frequently queried columns
3. **Query Optimization**: Use `EXPLAIN ANALYZE` to optimize slow queries
4. **Connection Limits**: Configure `max` in pool options based on your needs

## Backup and Restore

### Backup

```bash
pg_dump -U postgres portfolio > backup.sql
```

### Restore

```bash
psql -U postgres portfolio < backup.sql
```

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle ORM PostgreSQL Guide](https://orm.drizzle.team/docs/get-started-postgresql)
- [Node-Postgres Documentation](https://node-postgres.com/)
