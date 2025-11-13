import Database from "better-sqlite3";

const db = new Database("./portfolio.db");

// Get all messages
console.log("=== All Messages ===");
const messages = db.prepare("SELECT id, name, email, read, starred FROM contact_messages").all();
console.log(messages);

// If there are messages, try to star the first one
if (messages.length > 0) {
  const firstMessage = messages[0] as any;
  console.log("\n=== Toggling starred for first message ===");
  console.log("Before:", firstMessage);
  
  const newStarred = firstMessage.starred ? 0 : 1;
  db.prepare("UPDATE contact_messages SET starred = ? WHERE id = ?").run(newStarred, firstMessage.id);
  
  const updated = db.prepare("SELECT id, name, email, read, starred FROM contact_messages WHERE id = ?").get(firstMessage.id);
  console.log("After:", updated);
}

db.close();
