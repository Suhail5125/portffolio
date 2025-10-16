import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users, projects, skills, aboutInfo } from "@shared/schema";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Create admin user (username: admin, password: admin123)
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
      isAdmin: true,
    }).onConflictDoNothing();
    console.log("✅ Admin user created (username: admin, password: admin123)");

    // Add sample about info
    await db.insert(aboutInfo).values({
      id: "main",
      name: "Your Name",
      title: "Full Stack Developer & 3D Enthusiast",
      bio: "I'm a passionate developer specializing in creating immersive web experiences with cutting-edge technologies. My expertise lies in WebGL, Three.js, and modern web development frameworks.\n\nI love pushing the boundaries of what's possible on the web, combining beautiful design with powerful functionality.",
      email: "contact@example.com",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      twitterUrl: "https://twitter.com",
    }).onConflictDoNothing();
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
        featured: false,
        order: 3,
      },
    ];

    for (const project of sampleProjects) {
      await db.insert(projects).values(project);
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
      await db.insert(skills).values(skill);
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
  }
}

seed();
