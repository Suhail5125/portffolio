import { describe, it, expect } from "vitest";
import request from "supertest";
import { createTestApp } from "../helpers/app";

describe("Health Check API", () => {
  it("should return health status with all required fields", async () => {
    const app = await createTestApp();
    
    const response = await request(app)
      .get("/api/health");
    
    // Should return either 200 (healthy) or 503 (unhealthy)
    expect([200, 503]).toContain(response.status);
    
    // Verify response structure
    expect(response.body).toHaveProperty("status");
    expect(["healthy", "unhealthy"]).toContain(response.body.status);
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("uptime");
    expect(typeof response.body.uptime).toBe("number");
    
    // Verify database health info
    expect(response.body).toHaveProperty("database");
    expect(response.body.database).toHaveProperty("connected");
    expect(typeof response.body.database.connected).toBe("boolean");
    expect(response.body.database).toHaveProperty("responseTime");
    expect(typeof response.body.database.responseTime).toBe("number");
    
    // Verify memory stats
    expect(response.body).toHaveProperty("memory");
    expect(response.body.memory).toHaveProperty("used");
    expect(response.body.memory).toHaveProperty("total");
    expect(response.body.memory).toHaveProperty("percentage");
    expect(typeof response.body.memory.used).toBe("number");
    expect(typeof response.body.memory.total).toBe("number");
    expect(typeof response.body.memory.percentage).toBe("number");
  });
  
  it("should return healthy status when database is connected", async () => {
    const app = await createTestApp();
    
    const response = await request(app)
      .get("/api/health");
    
    // With test database running, should be healthy
    if (response.body.database.connected) {
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("healthy");
    }
  });
  
  it("should cache health check results", async () => {
    const app = await createTestApp();
    
    // First request
    const response1 = await request(app)
      .get("/api/health");
    
    const timestamp1 = response1.body.timestamp;
    
    // Immediate second request (should be cached)
    const response2 = await request(app)
      .get("/api/health");
    
    const timestamp2 = response2.body.timestamp;
    
    // Timestamps should be the same due to caching
    expect(timestamp1).toBe(timestamp2);
  });
});
