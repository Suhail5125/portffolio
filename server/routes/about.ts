import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../middleware/auth";
import { uploadResume } from "../middleware/upload";
import { insertAboutInfoSchema } from "@shared";
import { fromError } from "zod-validation-error";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function registerAboutRoutes(app: Express) {
  // Public routes - Get about info
  app.get("/api/about", async (req, res) => {
    try {
      const info = await storage.getAboutInfo();
      res.json(info ?? null);
    } catch (error: any) {
      console.error('Error fetching about info:', error); // Debug log
      res.status(500).json({ error: error.message });
    }
  });

  // Protected routes - Update about info (admin only)
  app.put("/api/about", isAuthenticated, async (req, res) => {
    try {
      console.log('Updating about info with data:', JSON.stringify(req.body, null, 2));
      const validated = insertAboutInfoSchema.parse(req.body);
      console.log('Validated about data successfully');
      const info = await storage.updateAboutInfo(validated);
      res.json(info);
    } catch (error: any) {
      console.error('About update error:', error);
      const validationError = fromError(error);
      console.error('Formatted error:', validationError.toString());
      res.status(400).json({ error: validationError.toString() });
    }
  });

  // Resume upload endpoint - Disabled on Firebase (use data URLs instead)
  app.post("/api/upload/resume", isAuthenticated, (req, res) => {
    res.status(501).json({ 
      error: "File uploads are not supported on Firebase. Please use the URL field or paste base64 data URL instead." 
    });
  });

  // Delete resume endpoint
  app.delete("/api/resume", isAuthenticated, async (req, res) => {
    try {
      const { resumeUrl } = req.body;
      
      if (!resumeUrl) {
        return res.status(400).json({ error: "Resume URL is required" });
      }

      // Just clear the URL from database (no file deletion needed for data URLs)
      const aboutInfo = await storage.getAboutInfo();
      if (aboutInfo) {
        await storage.updateAboutInfo({ ...aboutInfo, resumeUrl: "" });
      }

      res.json({ message: "Resume deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
