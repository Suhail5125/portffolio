import type { Express } from "express";
import { registerAuthRoutes } from "./auth";
import { registerProjectRoutes } from "./projects";
import { registerSkillRoutes } from "./skills";
import { registerTestimonialRoutes } from "./testimonials";
import { registerContactRoutes } from "./contact";
import { registerAboutRoutes } from "./about";

export function registerAllRoutes(app: Express) {
  // Register all route modules
  registerAuthRoutes(app);
  registerProjectRoutes(app);
  registerSkillRoutes(app);
  registerTestimonialRoutes(app);
  registerContactRoutes(app);
  registerAboutRoutes(app);
}
