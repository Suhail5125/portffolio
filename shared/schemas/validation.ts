import { z } from "zod";

// ─── Project Schema ────────────────────────────────────────────
// Matches: projects table (omitting id, createdAt which are auto-generated)
export const insertProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  liveUrl: z.string().nullable().optional(),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  // Case Study fields
  overview: z.string().nullable().optional(),
  challenge: z.string().nullable().optional(),
  solution: z.string().nullable().optional(),
  results: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  client: z.string().nullable().optional(),
  year: z.number().int().nullable().optional(),
  gallery: z.array(z.string()).nullable().optional(),
});

// ─── Skill Schema ──────────────────────────────────────────────
// Matches: skills table (omitting id which is auto-generated)
export const insertSkillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  proficiency: z.number().min(1).max(100),
  icon: z.string().nullable().optional(),
  order: z.number().int().default(0),
});

// ─── Testimonial Schema ────────────────────────────────────────
// Matches: testimonials table (omitting id, createdAt which are auto-generated)
export const insertTestimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  content: z.string().min(10, "Content must be at least 10 characters").max(1000),
  rating: z.number().min(1).max(5).default(5),
  avatarUrl: z.string().nullable().optional(),
  isVisible: z.boolean().default(false),
  order: z.number().int().default(0),
});

// ─── Contact Message Schema ────────────────────────────────────
// Matches: contactMessages table (omitting id, read, starred, createdAt)
export const insertContactMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().nullable().optional(),
  projectType: z.string().nullable().optional(),
  message: z.string().min(1, "Message is required").max(500),
});

// ─── About Info Schema ─────────────────────────────────────────
// Matches: aboutInfo table (omitting id, updatedAt which are auto-generated)
export const insertAboutInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().min(1, "Bio is required"),
  avatarUrl: z.string().optional().nullable().transform(val => val || null),
  resumeUrl: z.string().optional().nullable().transform(val => val || null),
  githubUrl: z.string().optional().nullable().transform(val => val || null),
  linkedinUrl: z.string().optional().nullable().transform(val => val || null),
  twitterUrl: z.string().optional().nullable().transform(val => val || null),
  instagramUrl: z.string().optional().nullable().transform(val => val || null),
  email: z.string().optional().nullable().transform(val => val || null),
  phone: z.string().optional().nullable().transform(val => val || null),
  location: z.string().optional().nullable().transform(val => val || null),
  availableForWork: z.boolean().optional().nullable(),
  responseTime: z.string().optional().nullable().transform(val => val || null),
  workingHours: z.string().optional().nullable().transform(val => val || null),
  completedProjects: z.number().int().optional().nullable(),
  totalClients: z.number().int().optional().nullable(),
  yearsExperience: z.number().int().optional().nullable(),
  technologiesCount: z.number().int().optional().nullable(),
});

// ─── Experience Schema ─────────────────────────────────────────
// Matches: experience table (omitting id, createdAt which are auto-generated)
export const insertExperienceSchema = z.object({
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  type: z.enum(["JOB", "FREELANCE"]),
  startYear: z.number().int().min(1900).max(2100),
  endYear: z.number().int().min(1900).max(2100).nullable().optional(),
  description: z.string().min(1, "Description is required"),
  order: z.number().int().optional().default(0),
});

// ─── User Schema ───────────────────────────────────────────────
// Matches: users table (only username and password for login/registration)
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// TypeScript types inferred from schemas
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type InsertAboutInfo = z.infer<typeof insertAboutInfoSchema>;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
