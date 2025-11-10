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
