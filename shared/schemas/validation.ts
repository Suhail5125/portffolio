import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { projects, skills, testimonials, contactMessages, aboutInfo, users } from "../types/models";

// Helper function for URL validation
const validateUrl = (url: string): boolean => {
  if (!url) return true;
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

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
  isVisible: z.boolean().optional(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  read: true,
  starred: true,
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

// TypeScript types inferred from schemas
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type InsertAboutInfo = z.infer<typeof insertAboutInfoSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
