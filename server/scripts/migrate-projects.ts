// @ts-nocheck - Legacy SQLite migration script (COMPLETED - kept for historical reference)
/**
 * Projects Table Schema Migration (ONE-OFF)
 * 
 * PURPOSE: Removes deprecated columns from the projects table.
 * This is a ONE-OFF migration script that was used to clean up the schema.
 * 
 * MIGRATION DETAILS:
 *   - Removes: long_description column (consolidated into description)
 *   - Removes: demo_url column (replaced with live_url)
 *   - Preserves all other columns and data
 * 
 * USAGE:
 *   tsx server/scripts/migrate-projects.ts
 * 
 * WHEN IT WAS RUN:
 *   - During repository cleanup phase
 *   - To simplify the projects table schema
 *   - After consolidating project description fields
 * 
 * STATUS: COMPLETED
 *   This migration has been applied to the database.
 *   It is kept for historical reference and documentation.
 *   DO NOT run again unless you need to revert and reapply.
 * 
 * NOTES:
 *   - Uses SQLite-specific syntax (CREATE TABLE ... AS SELECT)
 *   - Safely checks for column existence before attempting migration
 *   - Data is preserved during the table restructure
 *   - This script is for SQLite databases only
 */

import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, "..", "portfolio.db"));

try {
  console.log("Starting database migration...");

  // Check if columns exist before dropping them
  const tableInfo = db.prepare("PRAGMA table_info(projects)").all() as any[];
  const hasLongDescription = tableInfo.some(col => col.name === 'long_description');
  const hasDemoUrl = tableInfo.some(col => col.name === 'demo_url');

  if (hasLongDescription || hasDemoUrl) {
    console.log("Updating projects table structure...");
    
    // Create new table with updated structure
    db.exec(`
      CREATE TABLE projects_new (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        github_url TEXT,
        technologies TEXT NOT NULL,
        featured INTEGER DEFAULT 0 NOT NULL,
        "order" INTEGER DEFAULT 0 NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);

    // Copy data from old table to new table
    db.exec(`
      INSERT INTO projects_new (id, title, description, image_url, github_url, technologies, featured, "order", created_at)
      SELECT id, title, description, image_url, github_url, technologies, featured, "order", created_at
      FROM projects;
    `);

    // Drop old table and rename new table
    db.exec(`
      DROP TABLE projects;
      ALTER TABLE projects_new RENAME TO projects;
    `);

    console.log("Projects table updated successfully!");
  } else {
    console.log("Projects table is already up to date.");
  }

  console.log("Migration completed successfully!");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
} finally {
  db.close();
}