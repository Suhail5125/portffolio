// @ts-nocheck - Legacy SQLite migration script (COMPLETED - kept for historical reference)
/**
 * Add Starred Column Migration (ONE-OFF)
 * 
 * PURPOSE: Adds starred column to contact_messages table for message flagging.
 * This is a ONE-OFF migration script that was used to implement message starring feature.
 * 
 * MIGRATION DETAILS:
 *   - Adds: starred INTEGER column to contact_messages table
 *   - Default value: 0 (not starred)
 *   - NOT NULL constraint
 *   - Allows admins to flag important messages
 * 
 * USAGE:
 *   tsx server/scripts/migrate-starred.ts
 * 
 * WHEN IT WAS RUN:
 *   - When starred messages feature was implemented
 *   - To allow admins to mark important contact messages
 *   - Part of contact message management enhancement
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
 *   - Uses INTEGER for boolean (SQLite convention: 0=false, 1=true)
 */

import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "..", "portfolio.db");
const db = new Database(dbPath);

console.log("Adding starred column to contact_messages table...");

try {
  // Check if column already exists
  const tableInfo = db.prepare("PRAGMA table_info(contact_messages)").all() as Array<{ name: string }>;
  const hasStarred = tableInfo.some(col => col.name === "starred");

  if (hasStarred) {
    console.log("✓ Column 'starred' already exists");
  } else {
    // Add the starred column
    db.prepare(`
      ALTER TABLE contact_messages 
      ADD COLUMN starred INTEGER DEFAULT 0 NOT NULL
    `).run();
    console.log("✓ Successfully added 'starred' column");
  }

  console.log("Migration completed successfully!");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
} finally {
  db.close();
}
