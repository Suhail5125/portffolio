# Database Scripts Documentation

This directory contains database migration and setup scripts for the portfolio application.

## Script Categories

### Reusable Scripts

These scripts can be run multiple times safely and are used for regular database operations:

#### `migrate.ts` - Schema Setup
- **Purpose**: Creates all database tables and ensures schema is current
- **Usage**: `tsx server/scripts/migrate.ts`
- **When to use**: Initial setup, after schema changes, verifying database structure
- **Safety**: Idempotent - safe to run multiple times
- **Database**: SQLite only

#### `seed.ts` - Data Seeding
- **Purpose**: Populates database with sample data for development/testing
- **Usage**: `tsx server/scripts/seed.ts`
- **When to use**: New environment setup, resetting to clean state, demo environments
- **Prerequisites**: Run `migrate.ts` first, empty tables recommended
- **Database**: PostgreSQL (uses DATABASE_URL from .env)
- **Sample Data**:
  - Admin user (username: admin, password: admin123)
  - 5 sample projects
  - 12 sample skills
  - Sample about/bio information

#### `add-projects.ts` - Add Sample Projects
- **Purpose**: Adds specific sample projects to existing database
- **Usage**: `tsx server/scripts/add-projects.ts`
- **When to use**: Adding more sample projects, testing project features
- **Customization**: Modify the `newProjects` array to add different projects
- **Database**: SQLite only

---

### One-Off Migration Scripts

These scripts were used to modify the database schema during development. They have been completed and are kept for historical reference.

#### `migrate-projects.ts` ✅ COMPLETED
- **Purpose**: Removed deprecated columns (long_description, demo_url) from projects table
- **Status**: Applied - DO NOT run again
- **Database**: SQLite only

#### `add-live-url.ts` ✅ COMPLETED
- **Purpose**: Added live_url column to projects table
- **Status**: Applied - Column now in main schema
- **Database**: SQLite only

#### `add-instagram-column.ts` ✅ COMPLETED
- **Purpose**: Added instagram_url column to about_info table
- **Status**: Applied - Column now in main schema
- **Database**: SQLite only

#### `migrate-starred.ts` ✅ COMPLETED
- **Purpose**: Added starred column to contact_messages table
- **Status**: Applied - Column now in main schema
- **Database**: SQLite only

---

## Quick Start Guide

### Setting Up a New Database

1. **Create the schema**:
   ```bash
   tsx server/scripts/migrate.ts
   ```

2. **Seed with sample data**:
   ```bash
   tsx server/scripts/seed.ts
   ```

3. **Login to admin dashboard**:
   - Username: `admin`
   - Password: `admin123`

### Resetting Database

To reset your database to a clean state:

1. Delete the database file (SQLite) or drop all tables (PostgreSQL)
2. Run `migrate.ts` to recreate schema
3. Run `seed.ts` to populate with sample data

---

## Database Support

- **SQLite**: Used for local development
  - Scripts: `migrate.ts`, `add-projects.ts`, and all one-off migrations
  - Database file: `portfolio.db` in project root

- **PostgreSQL**: Used for production
  - Scripts: `seed.ts`
  - Connection: Uses `DATABASE_URL` environment variable
  - For schema migrations, use Drizzle Kit instead of migrate.ts

---

## Notes

- All one-off migrations are now incorporated into `migrate.ts`
- One-off scripts are kept for documentation and historical reference
- Always backup your database before running migration scripts
- Test scripts in development environment before running in production
- For production PostgreSQL, use Drizzle Kit for schema migrations
