import "dotenv/config";

/**
 * Configuration Management System
 * 
 * This module centralizes all environment variable access and provides
 * typed configuration objects for different application areas.
 * All environment variables are validated at startup to fail fast.
 */

// ============================================
// Configuration Interfaces
// ============================================

export interface DatabaseConfig {
  url: string;
}

export interface ServerConfig {
  port: number;
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

export interface SessionConfig {
  secret: string;
  maxAge: number;
  checkPeriod: number;
}

export interface UploadConfig {
  maxFileSize: number;
  allowedTypes: RegExp;
  uploadDir: string;
}

export interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  session: SessionConfig;
  upload: UploadConfig;
}

// ============================================
// Environment Variable Validation
// ============================================

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please ensure ${key} is set in your .env file.\n` +
      `See .env.example for reference.`
    );
  }
  return value;
}

function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

function validateSessionSecret(secret: string): void {
  if (secret.length < 32) {
    throw new Error(
      `SESSION_SECRET must be at least 32 characters long for security.\n` +
      `Current length: ${secret.length}\n` +
      `Generate a secure secret with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
    );
  }
}

// ============================================
// Configuration Loading
// ============================================

function loadServerConfig(): ServerConfig {
  const nodeEnv = getOptionalEnv("NODE_ENV", "development");
  const port = parseInt(getOptionalEnv("PORT", "5000"), 10);

  if (isNaN(port)) {
    throw new Error(
      `PORT must be a valid number. Received: ${process.env.PORT}`
    );
  }

  return {
    port,
    nodeEnv,
    isDevelopment: nodeEnv === "development",
    isProduction: nodeEnv === "production",
  };
}

function loadDatabaseConfig(): DatabaseConfig {
  const url = getRequiredEnv("DATABASE_URL");

  // Basic validation of PostgreSQL connection string format
  if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
    throw new Error(
      `DATABASE_URL must be a valid PostgreSQL connection string.\n` +
      `Expected format: postgresql://[user]:[password]@[host]:[port]/[database]\n` +
      `Received: ${url.substring(0, 20)}...`
    );
  }

  return { url };
}

function loadSessionConfig(): SessionConfig {
  const secret = getRequiredEnv("SESSION_SECRET");
  validateSessionSecret(secret);

  return {
    secret,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    checkPeriod: 86400000, // 24 hours in milliseconds (for pruning expired sessions)
  };
}

function loadUploadConfig(): UploadConfig {
  // These are currently hardcoded but structured for future environment variable support
  // See .env.example for commented-out future configuration options
  return {
    maxFileSize: 5 * 1024 * 1024, // 5MB in bytes
    allowedTypes: /jpeg|jpg|png|gif|webp/, // Regex for allowed file extensions
    uploadDir: "uploads", // Relative to project root
  };
}

// ============================================
// Configuration Export
// ============================================

/**
 * Application configuration object
 * 
 * This object is created once at startup and validates all required
 * environment variables. If any required variables are missing or invalid,
 * the application will throw an error and refuse to start.
 * 
 * Usage:
 *   import { config } from './config';
 *   console.log(config.server.port);
 *   console.log(config.database.url);
 */
export const config: AppConfig = {
  server: loadServerConfig(),
  database: loadDatabaseConfig(),
  session: loadSessionConfig(),
  upload: loadUploadConfig(),
};

// Log configuration on startup (excluding sensitive values)
if (config.server.isDevelopment) {
  console.log("Configuration loaded successfully:");
  console.log(`  - Server: ${config.server.nodeEnv} mode on port ${config.server.port}`);
  console.log(`  - Database: Connected to ${config.database.url.split("@")[1] || "database"}`);
  console.log(`  - Session: Secret configured (${config.session.secret.length} chars)`);
  console.log(`  - Upload: Max size ${config.upload.maxFileSize / 1024 / 1024}MB`);
}
