import type { Express } from "express";
import passport from "passport";
import { authRateLimiter } from "../middleware/security";

export function registerAuthRoutes(app: Express) {
  // Login endpoint with rate limiting
  app.post("/api/auth/login", authRateLimiter, passport.authenticate("local"), (req, res) => {
    res.json({ message: "Login successful", user: req.user });
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logout successful" });
    });
  });

  // Get current user session
  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // Debug endpoint to check session
  app.get("/api/auth/debug", (req, res) => {
    res.json({
      isAuthenticated: req.isAuthenticated(),
      sessionID: req.sessionID,
      hasSession: !!req.session,
      user: req.user || null,
    });
  });
}
