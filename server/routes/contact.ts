import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../middleware/auth";
import { insertContactMessageSchema } from "@shared";
import { fromError } from "zod-validation-error";

export function registerContactRoutes(app: Express) {
  // Public routes - Submit contact message
  app.post("/api/contact", async (req, res) => {
    try {
      const validated = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validated);
      res.status(201).json(message);
    } catch (error: any) {
      const validationError = fromError(error);
      res.status(400).json({ error: validationError.toString() });
    }
  });

  // Protected routes - Get all contact messages (admin only)
  app.get("/api/contact/messages", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Protected routes - Mark message as read (admin only)
  app.put("/api/contact/messages/:id/read", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.markMessageAsRead(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json({ message: "Message marked as read" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Protected routes - Toggle message starred status (admin only)
  app.put("/api/contact/messages/:id/starred", isAuthenticated, async (req, res) => {
    try {
      const { starred } = req.body;
      const success = await storage.toggleMessageStarred(req.params.id, starred);
      if (!success) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json({ message: starred ? "Message starred" : "Message unstarred" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Protected routes - Delete contact message (admin only)
  app.delete("/api/contact/messages/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteContactMessage(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json({ message: "Message deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
