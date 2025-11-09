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