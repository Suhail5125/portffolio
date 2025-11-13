# 3D Futuristic Portfolio Website

## Project Overview
An immersive 3D portfolio website built with React Three Fiber, featuring advanced WebGL effects, particle systems, and a cyberpunk-inspired futuristic design. The portfolio includes project showcases, interactive skill visualizations, and a full admin dashboard for content management.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Three Fiber** & **@react-three/drei** - 3D scenes and components
- **@react-three/postprocessing** - Visual effects (bloom, chromatic aberration)
- **Three.js** - WebGL 3D library
- **Framer Motion** - Smooth animations and transitions
- **GSAP** - Advanced animation timeline
- **Tailwind CSS** - Utility-first styling with custom design tokens
- **Shadcn UI** - High-quality component library
- **Wouter** - Lightweight routing
- **React Query** - Data fetching and state management
- **React Hook Form** + **Zod** - Form validation

### Backend
- **Express.js** - RESTful API server
- **PostgreSQL** with **Drizzle ORM** - Database and migrations
- **Passport.js** - Authentication
- **Express Session** - Session management

## Architecture

### Design System
- **Dark Mode Primary**: Deep navy background (220 25% 8%) with neon cyan/magenta accents
- **Light Mode**: Ultra light gray with blue tint for professional daytime viewing
- **Typography**: 
  - Display: Rajdhani/Orbitron for futuristic headings
  - Body: Inter for readability
  - Mono: JetBrains Mono for code
- **Effects**: 
  - Glassmorphism with backdrop blur
  - Neon glow effects (cyan, magenta, purple)
  - 3D particle systems
  - Post-processing (bloom, chromatic aberration)

### Database Schema
- **projects**: Portfolio project showcases with images, links, and tech stacks
- **skills**: Skills with categories and proficiency levels for 3D visualization
- **contactMessages**: Contact form submissions
- **aboutInfo**: Personal bio, avatar, resume, and social links
- **users**: Admin authentication

### Features
1. **3D Hero Section**: Animated geometry with particle field background
2. **Project Showcase**: Glassmorphic cards with 3D tilt effects
3. **Skills Visualization**: Interactive 3D orbital arrangement of skills
4. **About Section**: Animated timeline with profile information
5. **Contact Form**: Futuristic styling with particle burst on success
6. **Admin Dashboard**: Full CRUD for projects, skills, messages, and about info
7. **Theme Toggle**: Seamless dark/light mode switching
8. **Responsive Design**: Optimized layouts for all screen sizes

## Development Guidelines

### Component Structure
- Components are modular and reusable
- 3D components separated in `/components/3d/` directory
- Pages in `/pages/` directory
- Shared types and schemas in `/shared/schema.ts`

### Styling Conventions
- Use Tailwind utility classes for styling
- Follow design_guidelines.md for spacing, colors, and effects
- Custom utilities: `glass`, `glow-cyan`, `gradient-text-*`, `hover-elevate`
- Consistent spacing: p-4, p-8, py-12, py-24 for sections

### API Routes
All routes prefixed with `/api`:
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project (admin)
- `GET /api/skills` - List all skills
- `POST /api/skills` - Create skill (admin)
- `GET /api/about` - Get about info
- `PUT /api/about` - Update about info (admin)
- `POST /api/contact` - Submit contact message
- `GET /api/contact/messages` - Get all messages (admin)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

## Recent Changes
- **2024**: Initial project setup with full schema definition
- Created all frontend components with 3D effects and animations
- Implemented futuristic design system with glassmorphism and neon effects
- Set up admin dashboard structure

## Next Steps
- Implement backend API routes and database integration
- Connect frontend to backend with React Query
- Add admin pages for project/skill/message management
- Test all features and optimize 3D performance
