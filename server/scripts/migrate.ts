// @ts-nocheck - Legacy SQLite script (kept for historical reference)
/**
 * Database Schema Migration and Setup Script
 * 
 * PURPOSE: Creates all database tables and ensures the schema is up to date.
 * This is a REUSABLE script that can be run multiple times safely.
 * 
 * USAGE:
 *   npm run db:migrate
 *   or
 *   tsx server/scripts/migrate.ts
 * 
 * WHAT IT DOES:
 *   - Creates all required tables if they don't exist:
 *     * projects - Portfolio projects with technologies and metadata
 *     * skills - Technical skills with categories and proficiency levels
 *     * testimonials - Client testimonials and reviews
 *     * contact_messages - Contact form submissions
 *     * about_info - About page information and social links
 *     * users - Admin user accounts
 *   - Adds missing columns to existing tables (safe to run multiple times)
 *   - Ensures schema is compatible with current application code
 * 
 * WHEN TO USE:
 *   - Initial database setup for new environments
 *   - After pulling schema changes from version control
 *   - When setting up development, staging, or production databases
 *   - To verify database schema is current
 * 
 * SAFETY:
 *   - Uses CREATE TABLE IF NOT EXISTS (won't overwrite existing tables)
 *   - Checks for column existence before adding new columns
 *   - Does not delete or modify existing data
 *   - Safe to run multiple times (idempotent)
 * 
 * NOTES:
 *   - This script is for SQLite databases only
 *   - For PostgreSQL, use Drizzle Kit migrations instead
 *   - Run this before seed.ts for initial setup
 *   - Does not populate data (use seed.ts for that)
 */

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sql } from "drizzle-orm";

const sqlite = new Database("portfolio.db");
const db = drizzle(sqlite);

// Create tables
console.log("Creating database tables...");

// Projects table
db.run(sql`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    image_url TEXT,
    demo_url TEXT,
    github_url TEXT,
    technologies TEXT NOT NULL,
    featured INTEGER DEFAULT 0 NOT NULL,
    "order" INTEGER DEFAULT 0 NOT NULL,
    created_at INTEGER NOT NULL
  )
`);

// Skills table
db.run(sql`
  CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    proficiency INTEGER NOT NULL,
    icon TEXT,
    "order" INTEGER DEFAULT 0 NOT NULL
  )
`);

// Testimonials table
db.run(sql`
  CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 NOT NULL,
    avatar_url TEXT,
    "order" INTEGER DEFAULT 0 NOT NULL,
    created_at INTEGER NOT NULL
  )
`);

// Contact messages table
db.run(sql`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    project_type TEXT,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0 NOT NULL,
    created_at INTEGER NOT NULL
  )
`);

// Add project_type column if missing
const messageColumns = sqlite.prepare("PRAGMA table_info('contact_messages')").all();
const hasProjectType = messageColumns.some((row: any) => row.name === 'project_type');
if (!hasProjectType) {
  console.log('Adding project_type column to contact_messages...');
  sqlite.prepare('ALTER TABLE contact_messages ADD COLUMN project_type TEXT').run();
}

// About info table
db.run(sql`
  CREATE TABLE IF NOT EXISTS about_info (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT NOT NULL,
    avatar_url TEXT,
    resume_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    updated_at INTEGER NOT NULL
  )
`);

const aboutColumns = sqlite.prepare("PRAGMA table_info('about_info')").all();
const hasColumn = (column: string) => aboutColumns.some((row: any) => row.name === column);
const addColumnIfMissing = (column: string, definition: string) => {
  if (!hasColumn(column)) {
    console.log(`Adding column ${column} to about_info...`);
    sqlite.prepare(`ALTER TABLE about_info ADD COLUMN ${column} ${definition}`).run();
  }
};

addColumnIfMissing("resume_url", "TEXT");
addColumnIfMissing("github_url", "TEXT");
addColumnIfMissing("linkedin_url", "TEXT");
addColumnIfMissing("twitter_url", "TEXT");
addColumnIfMissing("instagram_url", "TEXT");
addColumnIfMissing("email", "TEXT");
addColumnIfMissing("phone", "TEXT");
addColumnIfMissing("location", "TEXT");
addColumnIfMissing("available_for_work", "INTEGER DEFAULT 1");
addColumnIfMissing("response_time", "TEXT DEFAULT '24 hours'");
addColumnIfMissing("working_hours", "TEXT DEFAULT '9 AM - 6 PM EST'");
addColumnIfMissing("completed_projects", "INTEGER DEFAULT 0");
addColumnIfMissing("total_clients", "INTEGER DEFAULT 0");
addColumnIfMissing("years_experience", "INTEGER DEFAULT 0");
addColumnIfMissing("technologies_count", "INTEGER DEFAULT 0");

// Users table
db.run(sql`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 1 NOT NULL
  )
`);

console.log("✅ Database tables created successfully!");
sqlite.close();
