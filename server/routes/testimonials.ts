import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../middleware/auth";
import { insertTestimonialSchema } from "@shared";
import { fromError } from "zod-validation-error";

export function registerTestimonialRoutes(app: Express) {
  // Public routes - Get all testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const allTestimonials = await storage.getAllTestimonials();
      res.json(allTestimonials);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Protected routes - Create testimonial (admin only)
  app.post("/api/testimonials", isAuthenticated, async (req, res) => {
    try {
      const validated = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validated);
      res.status(201).json(testimonial);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.toString() });
    }
  });

  // Protected routes - Update testimonial (admin only)
  app.put("/api/testimonials/:id", isAuthenticated, async (req, res) => {
    try {
      const validated = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(req.params.id, validated);
      if (!testimonial) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.toString() });
    }
  });

  // Protected routes - Delete testimonial (admin only)
  app.delete("/api/testimonials/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteTestimonial(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json({ message: "Testimonial deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
