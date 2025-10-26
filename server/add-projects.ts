import "dotenv/config";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { projects } from "@shared/schema";
import { randomUUID } from "crypto";

const sqlite = new Database("portfolio.db");
const db = drizzle(sqlite);

async function addProjects() {
  console.log("🚀 Adding new projects...");

  try {
    const newProjects = [
      {
        title: "E-Commerce Platform",
        description: "Full-stack e-commerce solution with real-time inventory",
        longDescription: "A modern e-commerce platform with payment integration, real-time inventory management, and seamless checkout experience.",
        technologies: ["Next.js", "PostgreSQL", "Stripe", "Redis", "TypeScript"],
        featured: true,
        order: 4,
      },
      {
        title: "AI Chat Application",
        description: "Real-time chat app with AI-powered smart replies",
        longDescription: "Intelligent chat application featuring AI-powered message suggestions, sentiment analysis, and natural language processing.",
        technologies: ["React", "Socket.io", "OpenAI", "Node.js", "MongoDB"],
        featured: true,
        order: 5,
      },
    ];

    for (const project of newProjects) {
      await db.insert(projects).values({
        ...project,
        id: randomUUID(),
        technologies: JSON.stringify(project.technologies),
        createdAt: new Date(),
      });
    }
    
    console.log(`✅ ${newProjects.length} new projects added successfully!`);
  } catch (error) {
    console.error("❌ Error adding projects:", error);
    throw error;
  } finally {
    sqlite.close();
  }
}

addProjects();
