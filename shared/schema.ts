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

// Testimonials table for client feedback
export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role"),
  company: text("company"),
  content: text("content").notNull(),
  rating: integer("rating").default(5).notNull(),
  avatarUrl: text("avatar_url"),
  order: integer("order").default(0).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
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
  instagramUrl: text("instagram_url"),
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

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(2).max(100),
  role: z.string().max(100).optional().or(z.literal("")),
  company: z.string().max(100).optional().or(z.literal("")),
  content: z.string().min(10).max(1000),
  rating: z.number().min(1).max(5),
  avatarUrl: z.string().optional().or(z.literal("")),
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

const validateUrl = (url: string): boolean => {
  if (!url) return true;
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

export const insertAboutInfoSchema = createInsertSchema(aboutInfo).omit({
  id: true,
  updatedAt: true,
}).extend({
  email: z.string().email().optional().or(z.literal("")),
  avatarUrl: z.string().refine(validateUrl, "Invalid URL format").optional().or(z.literal("")),
  resumeUrl: z.string().refine(validateUrl, "Invalid URL format").optional().or(z.literal("")),
  githubUrl: z.string().refine(validateUrl, "Invalid URL format").optional().or(z.literal("")),
  linkedinUrl: z.string().refine(validateUrl, "Invalid URL format").optional().or(z.literal("")),
  twitterUrl: z.string().refine(validateUrl, "Invalid URL format").optional().or(z.literal("")),
  instagramUrl: z.string().refine(validateUrl, "Invalid URL format").optional().or(z.literal("")),
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

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type AboutInfo = typeof aboutInfo.$inferSelect;
export type InsertAboutInfo = z.infer<typeof insertAboutInfoSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
