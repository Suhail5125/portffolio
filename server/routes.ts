import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { setupAuth } from "./middleware/auth";
import { registerAllRoutes } from "./routes/index";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  setupAuth(app);

  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // Register all API routes
  registerAllRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
