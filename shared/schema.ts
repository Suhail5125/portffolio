import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Projects table for portfolio showcases
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  technologies: text("technologies").notNull(), // JSON stringified array
  featured: integer("featured", { mode: "boolean" }).default(false).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

// Skills table for skill visualization
export const skills = sqliteTable("skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g., "Frontend", "Backend", "3D/Graphics", "Tools"
  proficiency: integer("proficiency").notNull(), // 1-100
  icon: text("icon"), // Icon name from lucide-react
  order: integer("order").default(0).notNull(),
});

// Contact messages from the contact form
export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  projectType: text("project_type"),
  message: text("message").notNull(),
  read: integer("read", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

// About info (single record)
export const aboutInfo = sqliteTable("about_info", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url"),
  resumeUrl: text("resume_url"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  availableForWork: integer("available_for_work", { mode: "boolean" }).default(true),
  responseTime: text("response_time").default("24 hours"),
  workingHours: text("working_hours").default("9 AM - 6 PM EST"),
  // Metrics
  completedProjects: integer("completed_projects").default(0),
  totalClients: integer("total_clients").default(0),
  yearsExperience: integer("years_experience").default(0),
  technologiesCount: integer("technologies_count").default(0),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

// Admin users for content management
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(true).notNull(),
});

// Zod schemas for validation
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
}).extend({
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  imageUrl: z.string().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
}).extend({
  proficiency: z.number().min(1).max(100),
  category: z.enum(["Frontend", "Backend", "3D/Graphics", "Tools", "Other"]),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  read: true,
  createdAt: true,
}).extend({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  subject: z.string()
    .min(1, "Subject is required")
    .max(200, "Subject must be less than 200 characters"),
  projectType: z.string().min(1, "Project type is required"),
});

export const insertAboutInfoSchema = createInsertSchema(aboutInfo).omit({
  id: true,
  updatedAt: true,
}).extend({
  email: z.string().email().optional().or(z.literal("")),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  resumeUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  responseTime: z.string().optional(),
  workingHours: z.string().optional(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isAdmin: true,
}).pick({
  username: true,
  password: true,
});

// TypeScript types
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type AboutInfo = typeof aboutInfo.$inferSelect;
export type InsertAboutInfo = z.infer<typeof insertAboutInfoSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
