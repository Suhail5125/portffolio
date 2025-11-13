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
