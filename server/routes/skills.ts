import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../middleware/auth";
import { insertSkillSchema } from "@shared";
import { fromError } from "zod-validation-error";
import { z } from "zod";

const reorderSkillsSchema = z.object({
  skills: z.array(z.object({
    id: z.string(),
    category: z.string(),
    order: z.number().int(),
  })).min(1),
});

export function registerSkillRoutes(app: Express) {
  // Public routes - Get all skills
  app.get("/api/skills", async (req, res) => {
    try {
      const allSkills = await storage.getAllSkills();
      res.json(allSkills);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Protected routes - Create skill (admin only)
  app.post("/api/skills", isAuthenticated, async (req, res) => {
    try {
      const validated = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validated);
      res.status(201).json(skill);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.toString() });
    }
  });

  // Protected routes - Update skill (admin only)
  app.put("/api/skills/:id", isAuthenticated, async (req, res) => {
    try {
      const validated = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(req.params.id, validated);
      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.json(skill);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.toString() });
    }
  });

  // Protected routes - Delete skill (admin only)
  app.delete("/api/skills/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteSkill(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.json({ message: "Skill deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Protected routes - Reorder skills (admin only)
  app.post("/api/skills/reorder", isAuthenticated, async (req, res) => {
    try {
      const validated = reorderSkillsSchema.parse(req.body);
      await storage.reorderSkills(validated.skills);
      res.json({ message: "Skill order updated" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: error.message });
    }
  });
}
