import "dotenv/config";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { users, projects, skills, aboutInfo } from "@shared/schema";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const sqlite = new Database("portfolio.db");
const db = drizzle(sqlite);

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Create admin user (username: admin, password: admin123)
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      id: randomUUID(),
      username: "admin",
      password: hashedPassword,
      isAdmin: true,
    });
    console.log("✅ Admin user created (username: admin, password: admin123)");

    // Add sample about info
    await db.insert(aboutInfo).values({
      id: "main",
      name: "Your Company Name",
      title: "Full Stack Development & 3D Solutions",
      bio: "We're a passionate team specializing in creating immersive web experiences with cutting-edge technologies. Our expertise lies in WebGL, Three.js, and modern web development frameworks.\n\nWe love pushing the boundaries of what's possible on the web, combining beautiful design with powerful functionality. From interactive 3D visualizations to complex data dashboards, we transform ideas into digital realities.\n\nOur approach focuses on performance optimization, user experience, and scalable architecture. We work with startups and enterprises to deliver solutions that not only look stunning but perform exceptionally across all devices and platforms.\n\nWith over 5 years of experience in the industry, we've successfully delivered 50+ projects ranging from e-commerce platforms to AI-powered applications. Our team stays ahead of technology trends, constantly learning and implementing the latest innovations in web development.\n\nWe believe in clean code, agile methodologies, and transparent communication throughout the development process. Every project is an opportunity to create something extraordinary that exceeds client expectations.\n\nOur portfolio includes award-winning websites, mobile applications, and enterprise solutions that have helped businesses increase their digital presence and revenue. We specialize in React, Node.js, Python, and cloud technologies like AWS and Docker.\n\nCollaboration is at the heart of everything we do. We work closely with designers, product managers, and stakeholders to ensure every detail aligns with the project vision and business objectives.",
      email: "contact@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      twitterUrl: "https://twitter.com",
      instagramUrl: "https://instagram.com",
      updatedAt: new Date(),
    });
    console.log("✅ About info created");

    // Add sample projects
    const sampleProjects = [
      {
        title: "3D Portfolio Website",
        description: "An immersive 3D portfolio showcasing projects with WebGL and Three.js",
        longDescription: "A cutting-edge portfolio website featuring advanced 3D visualizations, particle systems, and post-processing effects. Built with React Three Fiber and modern web technologies.",
        technologies: ["React", "Three.js", "TypeScript", "Tailwind CSS", "WebGL"],
        featured: true,
        order: 1,
      },
      {
        title: "Interactive Data Visualization",
        description: "Real-time data visualization dashboard with 3D charts and animations",
        longDescription: "An interactive dashboard for visualizing complex datasets in 3D space, with smooth animations and intuitive controls.",
        technologies: ["React", "D3.js", "Three.js", "Node.js"],
        featured: true,
        order: 2,
      },
      {
        title: "WebGL Game Engine",
        description: "Custom game engine built with WebGL and modern JavaScript",
        longDescription: "A lightweight game engine with physics simulation, particle systems, and efficient rendering pipeline.",
        technologies: ["WebGL", "JavaScript", "GLSL", "Physics Engine"],
        featured: true,
        order: 3,
      },
      {
        title: "E-Commerce Platform",
        description: "Full-stack e-commerce solution with real-time inventory",
        longDescription: "A modern e-commerce platform with payment integration, real-time inventory management, and seamless checkout experience.",
        technologies: ["Next.js", "PostgreSQL", "Stripe", "Redis", "TypeScript"],
        featured: true,
        order: 4,
      },
      {
        title: "AI Chat Application",
        description: "Real-time chat app with AI-powered smart replies",
        longDescription: "Intelligent chat application featuring AI-powered message suggestions, sentiment analysis, and natural language processing.",
        technologies: ["React", "Socket.io", "OpenAI", "Node.js", "MongoDB"],
        featured: true,
        order: 5,
      },
    ];

    for (const project of sampleProjects) {
      await db.insert(projects).values({
        ...project,
        id: randomUUID(),
        technologies: JSON.stringify(project.technologies),
        createdAt: new Date(),
      });
    }
    console.log(`✅ ${sampleProjects.length} sample projects created`);

    // Add sample skills
    const sampleSkills = [
      { name: "React", category: "Frontend" as const, proficiency: 95, order: 1 },
      { name: "Three.js", category: "3D/Graphics" as const, proficiency: 90, order: 2 },
      { name: "TypeScript", category: "Frontend" as const, proficiency: 90, order: 3 },
      { name: "Node.js", category: "Backend" as const, proficiency: 85, order: 4 },
      { name: "WebGL", category: "3D/Graphics" as const, proficiency: 85, order: 5 },
      { name: "GSAP", category: "Frontend" as const, proficiency: 80, order: 6 },
      { name: "PostgreSQL", category: "Backend" as const, proficiency: 80, order: 7 },
      { name: "Express", category: "Backend" as const, proficiency: 85, order: 8 },
      { name: "Tailwind CSS", category: "Frontend" as const, proficiency: 90, order: 9 },
      { name: "Blender", category: "3D/Graphics" as const, proficiency: 75, order: 10 },
      { name: "Git", category: "Tools" as const, proficiency: 90, order: 11 },
      { name: "Docker", category: "Tools" as const, proficiency: 75, order: 12 },
    ];

    for (const skill of sampleSkills) {
      await db.insert(skills).values({
        ...skill,
        id: randomUUID(),
      });
    }
    console.log(`✅ ${sampleSkills.length} sample skills created`);

    console.log("🎉 Database seeded successfully!");
    console.log("\n📝 Admin credentials:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("\n🚀 You can now start the server and login to the admin dashboard!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    sqlite.close();
  }
}

seed();
