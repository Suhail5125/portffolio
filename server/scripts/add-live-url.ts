// @ts-nocheck - Legacy SQLite migration script (COMPLETED - kept for historical reference)
/**
 * Add Live URL Column Migration (ONE-OFF)
 * 
 * PURPOSE: Adds live_url column to the projects table for deployed project links.
 * This is a ONE-OFF migration script that was used to add live demo functionality.
 * 
 * MIGRATION DETAILS:
 *   - Adds: live_url TEXT column to projects table
 *   - Allows NULL values (not all projects have live demos)
 *   - Replaces the deprecated demo_url column
 * 
 * USAGE:
 *   tsx server/scripts/add-live-url.ts
 * 
 * WHEN IT WAS RUN:
 *   - When live project demo feature was implemented
 *   - To allow linking to deployed/hosted versions of projects
 * 
 * STATUS: COMPLETED
 *   This migration has been applied to the database.
 *   The column now exists in the schema.
 *   DO NOT run again unless recreating the database from scratch.
 * 
 * NOTES:
 *   - Safely checks for column existence before adding
 *   - Safe to run multiple times (idempotent)
 *   - This script is for SQLite databases only
 *   - Column is now part of the main schema in migrate.ts
 */

import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, "..", "portfolio.db"));

try {
  console.log("Adding live_url column to projects table...");

  // Check if column already exists
  const tableInfo = db.prepare("PRAGMA table_info(projects)").all() as any[];
  const hasLiveUrl = tableInfo.some(col => col.name === 'live_url');

  if (!hasLiveUrl) {
    db.exec(`ALTER TABLE projects ADD COLUMN live_url TEXT;`);
    console.log("live_url column added successfully!");
  } else {
    console.log("live_url column already exists.");
  }

  console.log("Migration completed successfully!");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
} finally {
  db.close();
}