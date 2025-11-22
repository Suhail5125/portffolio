
import Database from "better-sqlite3";
const db = new Database("portfolio.db");

try {
    const users = db.prepare("SELECT count(*) as count FROM users").get();
    console.log("Users:", users);
    const projects = db.prepare("SELECT count(*) as count FROM projects").get();
    console.log("Projects:", projects);
} catch (e) {
    console.log("Error querying:", e.message);
}
