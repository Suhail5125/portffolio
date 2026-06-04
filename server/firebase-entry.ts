/**
 * Firebase Cloud Functions Entry Point
 * 
 * This wraps the existing Express application as a Firebase Cloud Function.
 * Firebase Hosting routes /api/** requests to this function,
 * while serving the React frontend as static files.
 */

// CRITICAL: Load environment variables FIRST before any other imports
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading .env from multiple locations (functions dir has .env file)
const envPaths = [
  path.join(__dirname, "..", ".env.production"),
  path.join(__dirname, "..", ".env"),
  path.join(__dirname, "../..", ".env"), // Root directory
];

console.log('Attempting to load environment from:', envPaths);

let envLoaded = false;
for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    console.log('Successfully loaded environment from:', envPath);
    envLoaded = true;
    break;
  } else {
    console.log('Failed to load from:', envPath, result.error.message);
  }
}

if (!envLoaded) {
  console.warn('No .env file loaded, using environment variables from deployment');
}

console.log('Environment check:', {
  hasDbUrl: !!process.env.DATABASE_URL,
  dbUrlPreview: process.env.DATABASE_URL?.substring(0, 30) + '...',
  hasSessionSecret: !!process.env.SESSION_SECRET,
  storageType: process.env.STORAGE_TYPE,
  nodeEnv: process.env.NODE_ENV || 'not set',
  corsOrigin: process.env.CORS_ORIGIN
});

// Ensure production environment
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

import { onRequest } from "firebase-functions/v2/https";
import express, { type Request, Response, NextFunction } from "express";
import { config } from "./config";
import { setupAuth } from "./middleware/auth";
import { setupSecurity } from "./middleware/security";
import { registerAllRoutes } from "./routes/index";
import { logger } from "./logger";

// Log configuration at startup
logger.info('Firebase Function starting', {
  config: {
    database: {
      hasUrl: !!config.database.url,
      urlPreview: config.database.url?.substring(0, 30) + '...',
      storageType: config.database.storageType
    },
    server: {
      nodeEnv: config.server.nodeEnv,
      isProduction: config.server.isProduction
    },
    security: {
      corsOrigin: config.security.corsOrigin
    }
  }
});

// Create Express app (same setup as server/index.ts but without listen())
const app = express();

// Trust Firebase/Google Cloud proxy so rate limiting uses real client IPs
app.set('trust proxy', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      logger.info(logLine);
    }
  });

  next();
});

// Setup security middleware (CORS, headers, rate limiting)
setupSecurity(app);

// Setup authentication middleware
setupAuth(app);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Register all API routes
registerAllRoutes(app);

// Error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error('Request error', {
    method: req.method,
    path: req.path,
    status,
    message: err.message,
    stack: err.stack,
    user: req.user ? (req.user as any).id : 'anonymous'
  });

  res.status(status).json({ message });
});

// Export the Express app as a Firebase Cloud Function (Gen 2)
export const api = onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 60,
    memory: "512MiB", // Increased memory for better performance
  },
  (req, res) => {
    // Log initialization status on first request
    if (!global.appInitialized) {
      logger.info('Firebase Function initialized', {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        storageType: process.env.STORAGE_TYPE,
      });
      global.appInitialized = true;
    }
    
    return app(req, res);
  }
);
