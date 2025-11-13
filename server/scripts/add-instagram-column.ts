// @ts-nocheck - Legacy SQLite migration script (COMPLETED - kept for historical reference)
/**
 * Add Instagram URL Column Migration (ONE-OFF)
 * 
 * PURPOSE: Adds instagram_url column to the about_info table.
 * This is a ONE-OFF migration script that was used to extend social media links.
 * 
 * MIGRATION DETAILS:
 *   - Adds: instagram_url TEXT column to about_info table
 *   - Allows NULL values (optional field)
 * 
 * USAGE:
 *   tsx server/scripts/add-instagram-column.ts
 * 
 * WHEN IT WAS RUN:
 *   - When Instagram social link feature was added
 *   - To expand social media integration options
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

const sqlite = new Database("portfolio.db");

try {
  console.log("Adding instagram_url column to about_info table...");
  
  // Check if column exists
  const columns = sqlite.prepare("PRAGMA table_info('about_info')").all();
  const hasInstagram = columns.some((col: any) => col.name === 'instagram_url');
  
  if (!hasInstagram) {
    sqlite.prepare("ALTER TABLE about_info ADD COLUMN instagram_url TEXT").run();
    console.log("✅ instagram_url column added successfully!");
  } else {
    console.log("✅ instagram_url column already exists!");
  }
  
  sqlite.close();
} catch (error) {
  console.error("❌ Error:", error);
  sqlite.close();
}
