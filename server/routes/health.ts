import type { Express, Request, Response } from "express";
import { config } from "../config";
import pg from "pg";

const { Pool } = pg;

// Create a separate pool for health checks
const healthCheckPool = new Pool({
  connectionString: config.database.url,
  max: 1, // Only need one connection for health checks
});

// Cache for health check results
interface HealthCheckCache {
  result: any;
  timestamp: number;
}

let healthCheckCache: HealthCheckCache | null = null;
const CACHE_DURATION = 10000; // 10 seconds in milliseconds

// Track server start time for uptime calculation
const serverStartTime = Date.now();

/**
 * Health check response interface
 */
interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  database: {
    connected: boolean;
    responseTime: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

/**
 * Performs a database connectivity check and measures response time
 */
async function checkDatabaseHealth(): Promise<{ connected: boolean; responseTime: number }> {
  const startTime = Date.now();
  
  try {
    // Simple query to check database connectivity
    await healthCheckPool.query("SELECT 1");
    const responseTime = Date.now() - startTime;
    
    return {
      connected: true,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error("Database health check failed:", error);
    
    return {
      connected: false,
      responseTime,
    };
  }
}

/**
 * Gets memory usage statistics
 */
function getMemoryStats(): { used: number; total: number; percentage: number } {
  const memUsage = process.memoryUsage();
  const totalMemory = memUsage.heapTotal;
  const usedMemory = memUsage.heapUsed;
  const percentage = Math.round((usedMemory / totalMemory) * 100);
  
  return {
    used: usedMemory,
    total: totalMemory,
    percentage,
  };
}

/**
 * Calculates server uptime in seconds
 */
function getUptime(): number {
  return Math.floor((Date.now() - serverStartTime) / 1000);
}

/**
 * Health check endpoint handler
 */
async function healthCheckHandler(req: Request, res: Response): Promise<void> {
  const now = Date.now();
  
  // Check if we have a valid cached result
  if (healthCheckCache && (now - healthCheckCache.timestamp) < CACHE_DURATION) {
    res.status(healthCheckCache.result.status === "healthy" ? 200 : 503)
      .json(healthCheckCache.result);
    return;
  }
  
  // Perform health checks
  const databaseHealth = await checkDatabaseHealth();
  const memoryStats = getMemoryStats();
  const uptime = getUptime();
  
  const isHealthy = databaseHealth.connected;
  
  const healthCheckResult: HealthCheckResponse = {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    uptime,
    database: databaseHealth,
    memory: memoryStats,
  };
  
  // Cache the result
  healthCheckCache = {
    result: healthCheckResult,
    timestamp: now,
  };
  
  // Return appropriate status code
  const statusCode = isHealthy ? 200 : 503;
  res.status(statusCode).json(healthCheckResult);
}

/**
 * Registers health check routes
 */
export function registerHealthRoutes(app: Express): void {
  app.get("/api/health", healthCheckHandler);
}
