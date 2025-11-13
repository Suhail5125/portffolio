// @ts-nocheck - Legacy SQLite script (kept for historical reference)
/**
 * Add Sample Projects Script
 * 
 * PURPOSE: Adds specific sample projects to the database.
 * This is a SEMI-REUSABLE script that can be modified to add different projects.
 * 
 * USAGE:
 *   tsx server/scripts/add-projects.ts
 * 
 * WHAT IT DOES:
 *   - Inserts 2 additional sample projects:
 *     * E-Commerce Platform
 *     * AI Chat Application
 *   - Assigns appropriate technologies and metadata
 *   - Sets featured status and display order
 * 
 * WHEN TO USE:
 *   - Adding new sample projects to existing database
 *   - Populating database with specific project examples
 *   - Testing project display and filtering features
 *   - Demonstrating portfolio capabilities
 * 
 * CUSTOMIZATION:
 *   - Modify the newProjects array to add different projects
 *   - Change technologies, descriptions, and metadata as needed
 *   - Adjust order values to control display sequence
 * 
 * NOTES:
 *   - This script is for SQLite databases only
 *   - Will fail if projects with duplicate IDs exist
 *   - Consider using seed.ts for comprehensive data setup
 *   - Can be run multiple times with different project data
 */

import "dotenv/config";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { projects } from "@shared";
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
