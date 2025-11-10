import {
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type Skill,
  type InsertSkill,
  type ContactMessage,
  type InsertContactMessage,
  type AboutInfo,
  type InsertAboutInfo,
  type Testimonial,
  type InsertTestimonial,
  users,
  projects,
  skills,
  contactMessages,
  aboutInfo,
  testimonials,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

// Initialize database connection with SQLite
const sqlite = new Database("portfolio.db");
const db = drizzle(sqlite);

// Helper functions for JSON serialization (SQLite doesn't support arrays)
function serializeProject(project: InsertProject): any {
  return {
    ...project,
    technologies: JSON.stringify(project.technologies),
  };
}

function deserializeProject(project: any): Project {
  return {
    ...project,
    technologies: JSON.parse(project.technologies),
  };
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Skill methods
  getAllSkills(): Promise<Skill[]>;
  getSkill(id: string): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: string): Promise<boolean>;

  // Testimonial methods
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;

  // Contact message methods
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: string): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: string): Promise<boolean>;
  deleteContactMessage(id: string): Promise<boolean>;

  // About info methods
  getAboutInfo(): Promise<AboutInfo | undefined>;
  updateAboutInfo(info: InsertAboutInfo): Promise<AboutInfo>;
}

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      ...insertUser,
      id: randomUUID(),
    }).returning();
    return result[0];
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    const results = await db.select().from(projects).orderBy(projects.order);
    return results.map(deserializeProject);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0] ? deserializeProject(result[0]) : undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const serialized = serializeProject(project);
    const result = await db.insert(projects).values({
      ...serialized,
      id: randomUUID(),
      createdAt: new Date(),
    }).returning();
    return deserializeProject(result[0]);
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const serialized = project.technologies 
      ? { ...project, technologies: JSON.stringify(project.technologies) }
      : project;
    const result = await db
      .update(projects)
      .set(serialized as any)
      .where(eq(projects.id, id))
      .returning();
    return result[0] ? deserializeProject(result[0]) : undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  // Skill methods
  async getAllSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(skills.order);
  }

  async getSkill(id: string): Promise<Skill | undefined> {
    const result = await db.select().from(skills).where(eq(skills.id, id));
    return result[0];
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const result = await db.insert(skills).values({
      ...skill,
      id: randomUUID(),
    }).returning();
    return result[0];
  }

  async updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const result = await db
      .update(skills)
      .set(skill)
      .where(eq(skills.id, id))
      .returning();
    return result[0];
  }

  async deleteSkill(id: string): Promise<boolean> {
    const result = await db.delete(skills).where(eq(skills.id, id)).returning();
    return result.length > 0;
  }

  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(testimonials.order);
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const result = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return result[0];
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values({
      ...testimonial,
      id: randomUUID(),
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async updateTestimonial(id: string, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const result = await db
      .update(testimonials)
      .set(testimonial as any)
      .where(eq(testimonials.id, id))
      .returning();
    return result[0];
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    return result.length > 0;
  }

  // Contact message methods
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(contactMessages.createdAt);
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    const result = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return result[0];
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values({
      ...message,
      id: randomUUID(),
      createdAt: new Date(),
    }).returning();
    return result[0];
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const result = await db
      .update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return result.length > 0;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id)).returning();
    return result.length > 0;
  }

  // About info methods
  async getAboutInfo(): Promise<AboutInfo | undefined> {
    const result = await db.select().from(aboutInfo);
    return result[0];
  }

  async updateAboutInfo(info: InsertAboutInfo): Promise<AboutInfo> {
    const existing = await this.getAboutInfo();
    
    if (existing) {
      const result = await db
        .update(aboutInfo)
        .set({ ...info, updatedAt: new Date() })
        .where(eq(aboutInfo.id, "main"))
        .returning();
      return result[0];
    } else {
      const result = await db
        .insert(aboutInfo)
        .values({ ...info, id: "main", updatedAt: new Date() })
        .returning();
      return result[0];
    }
  }
}

export const storage = new DbStorage();
