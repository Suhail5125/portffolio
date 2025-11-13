# 🎨 Professional Portfolio Website

A modern, full-stack portfolio website with 3D animations, admin panel, and comprehensive content management system.

![Portfolio Preview](https://via.placeholder.com/1200x600/0ea5e9/ffffff?text=Portfolio+Website)

## ✨ Features

### **Frontend**
- 🎭 Beautiful 3D animated hero section
- 📱 Fully responsive design
- 🌙 Dark mode support
- ⚡ Smooth snap scrolling
- 🎨 Glassmorphism effects
- 🎬 Framer Motion animations
- 📊 Interactive project carousel
- 💼 Services & work process sections
- 📝 Contact form with validation
- 🎯 SEO optimized

### **Admin Panel**
- 🔐 Secure authentication
- 📁 Project management (CRUD)
- 🛠️ Skills management
- 📧 Message inbox
- 👤 About info editor
- 📊 Dashboard with statistics
- 🎨 Beautiful UI with animations

### **Technical**
- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS
- 🎭 Framer Motion
- 🔄 React Query
- 🛣️ Wouter routing
- 🗄️ PostgreSQL + Drizzle ORM
- 🚀 Express.js backend
- ✅ Zod validation
- 🎯 Error boundaries
- 📱 PWA ready

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL 14+ installed and running

### **Installation**

```bash
# Clone the repository
git clone <your-repo-url>
cd portffolio

# Install dependencies
npm install

# Create PostgreSQL database
createdb portfolio

# Setup environment variables
# Edit .env and set DATABASE_URL to your PostgreSQL connection string
# Example: DATABASE_URL=postgresql://username:password@localhost:5432/portfolio

# Push database schema
npm run db:push

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:5000` to see your portfolio!

---

## 📁 Project Structure

```
portffolio/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Layout components (navigation, footer, theme)
│   │   │   ├── sections/       # Page sections (hero, projects, skills, etc.)
│   │   │   ├── admin/          # Admin dashboard components
│   │   │   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   │   └── 3d/
│   │   │       ├── core/       # Main 3D components (scenes, geometries)
│   │   │       └── fallbacks/  # Fallback components for 3D scenes
│   │   ├── pages/              # Page components (home, admin, etc.)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions and helpers
│   │   ├── types/              # Frontend-specific TypeScript types
│   │   └── index.css           # Global styles
│   └── public/                 # Static assets
├── server/                      # Backend Express application
│   ├── middleware/
│   │   ├── auth.ts             # Authentication middleware (passport, session)
│   │   └── upload.ts           # File upload configuration (multer)
│   ├── routes/
│   │   ├── index.ts            # Route aggregator (registers all routes)
│   │   ├── auth.ts             # Authentication endpoints
│   │   ├── projects.ts         # Project CRUD operations
│   │   ├── skills.ts           # Skills CRUD and reordering
│   │   ├── testimonials.ts     # Testimonials CRUD
│   │   ├── contact.ts          # Contact message handling
│   │   └── about.ts            # About info management
│   ├── scripts/                # Database scripts and utilities
│   │   ├── migrate.ts          # Database migrations
│   │   ├── seed.ts             # Seed data
│   │   └── migrate-*.ts        # Migration utilities
│   ├── index.ts                # Server entry point
│   ├── storage.ts              # Database operations (Drizzle ORM)
│   └── vite.ts                 # Vite middleware configuration
├── shared/                      # Shared code between client and server
│   └── schema.ts               # Database schema and shared types
├── uploads/                     # Uploaded files directory
├── .env                        # Environment variables
├── drizzle.config.ts           # Drizzle ORM configuration
├── migrations/                 # Database migrations
└── package.json                # Project dependencies and scripts
```

### Directory Purpose

#### **Client Directories**

- **`components/layout/`** - Components that define the page structure and layout
  - Navigation bars, footers, theme providers, theme toggles
  - Used across multiple pages

- **`components/sections/`** - Self-contained page sections
  - Hero, projects, skills, services, about, testimonials, contact, work process
  - Each section is a complete feature with its own logic

- **`components/admin/`** - Admin dashboard specific components
  - Admin forms, tables, modals, and dashboard widgets
  - Only used in admin pages

- **`components/ui/`** - Reusable UI primitives (shadcn/ui)
  - Buttons, inputs, cards, dialogs, etc.
  - Generic components used throughout the app

- **`components/3d/core/`** - Main 3D rendering components
  - Three.js/React Three Fiber scenes and geometries
  - Particle systems, animated objects

- **`components/3d/fallbacks/`** - Fallback components for 3D scenes
  - Static alternatives when WebGL is unavailable
  - Lightweight versions for better performance

- **`pages/`** - Top-level page components
  - Each file represents a route in the application
  - Composes sections and layout components

- **`hooks/`** - Custom React hooks
  - Reusable stateful logic
  - API calls, form handling, etc.

- **`lib/`** - Utility functions and helpers
  - Pure functions, constants, configurations
  - No React-specific code

- **`types/`** - Frontend-specific TypeScript types
  - API response types, component prop types
  - Types not shared with the backend

#### **Server Directories**

- **`middleware/`** - Express middleware functions
  - Authentication, authorization, file uploads
  - Request processing before reaching routes

- **`routes/`** - API endpoint definitions
  - Each file handles a specific resource (projects, skills, etc.)
  - Organized by feature/domain

- **`scripts/`** - Database and utility scripts
  - Migrations, seeding, data transformations
  - Run independently from the main server

#### **Shared Directory**

- **`shared/`** - Code used by both client and server
  - Database schema definitions
  - Validation schemas (Zod)
  - Type definitions used across the stack

### Naming Conventions

#### **Files**
- **Components**: `kebab-case.tsx` (e.g., `hero-section.tsx`, `project-card.tsx`)
- **Pages**: `kebab-case.tsx` (e.g., `home.tsx`, `admin-login.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-projects.ts`, `use-auth.ts`)
- **Utilities**: `kebab-case.ts` (e.g., `format-date.ts`, `api-client.ts`)
- **Types**: `kebab-case.ts` or `PascalCase.ts` (e.g., `api.ts`, `Project.ts`)
- **Routes**: `kebab-case.ts` (e.g., `projects.ts`, `auth.ts`)
- **Middleware**: `kebab-case.ts` (e.g., `auth.ts`, `upload.ts`)

#### **Directories**
- **All lowercase with hyphens**: `kebab-case` (e.g., `components/`, `3d/`, `admin/`)

#### **Components**
- **React Components**: `PascalCase` (e.g., `HeroSection`, `ProjectCard`)
- **Component files**: `kebab-case.tsx` matching the component name

#### **Functions**
- **camelCase** for all functions (e.g., `getUserProjects`, `formatDate`)

#### **Constants**
- **UPPER_SNAKE_CASE** for true constants (e.g., `API_BASE_URL`, `MAX_FILE_SIZE`)
- **camelCase** for configuration objects (e.g., `dbConfig`, `authOptions`)

### Where to Place New Code

#### **Adding a New Page Section**
1. Create component in `client/src/components/sections/`
2. Import and use in `client/src/pages/home.tsx` or relevant page
3. Add any section-specific types to `client/src/types/`

#### **Adding a New Admin Feature**
1. Create component in `client/src/components/admin/`
2. Create page in `client/src/pages/admin/`
3. Add API route in `server/routes/` (create new file if needed)
4. Update `server/routes/index.ts` to register new routes
5. Add database schema to `shared/schema.ts` if needed

#### **Adding a New API Endpoint**
1. Add route handler to appropriate file in `server/routes/`
2. If it's a new resource, create a new route file (e.g., `server/routes/blog.ts`)
3. Register new route file in `server/routes/index.ts`
4. Add types to `shared/schema.ts` for shared types
5. Add frontend types to `client/src/types/api.ts`

#### **Adding a New Reusable Component**
1. **UI primitive**: Add to `client/src/components/ui/`
2. **Layout component**: Add to `client/src/components/layout/`
3. **Feature component**: Add to `client/src/components/` root or create new category

#### **Adding a New Hook**
1. Create in `client/src/hooks/use-feature-name.ts`
2. Export from the file
3. Import where needed

#### **Adding a New Utility Function**
1. Create in `client/src/lib/feature-name.ts`
2. Keep functions pure (no side effects)
3. Export individual functions

#### **Adding Middleware**
1. Create in `server/middleware/feature-name.ts`
2. Export middleware function
3. Import and use in route files or `server/index.ts`

#### **Adding a Database Migration**
1. Create script in `server/scripts/migrate-feature-name.ts`
2. Update `shared/schema.ts` with new schema
3. Run migration script
4. Update seed data in `server/scripts/seed.ts` if needed

### Architecture Principles

1. **Separation of Concerns**: Keep routes, middleware, and business logic separate
2. **Feature-Based Organization**: Group related code by feature/domain
3. **Shared Code**: Only put truly shared code in `shared/` directory
4. **Type Safety**: Use TypeScript types throughout, define in appropriate locations
5. **Reusability**: Extract common patterns into hooks, utilities, or components
6. **Scalability**: Structure allows easy addition of new features without refactoring

---

## 🔐 Admin Access

### **Default Credentials**
- **URL**: `http://localhost:5000/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change these credentials before deployment!

### **Admin Features**
- ✅ Manage projects (add, edit, delete)
- ✅ Manage skills by category
- ✅ View contact form submissions
- ✅ Update company information
- ✅ Upload images via URL
- ✅ Mark messages as read/unread

---

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server (frontend + backend)

# Database
npm run db:migrate       # Create database tables
npm run db:seed          # Populate with sample data

# Build
npm run build            # Build for production
npm start                # Start production server

# Type checking
npm run check            # Run TypeScript checks
```

---

## 🎨 Customization

### **1. Update Company Info**
Login to admin panel → About → Update all fields

### **2. Add Projects**
Admin Panel → Projects → Add Project
- Title, description, image URL
- Technologies used
- GitHub & live demo links
- Mark as featured

### **3. Add Skills**
Admin Panel → Skills → Add Skill
- Skill name & category
- Proficiency level (0-100%)
- Optional icon

### **4. Customize Colors**
Edit `client/src/index.css`:
```css
:root {
  --chart-1: 200 100% 50%;  /* Cyan */
  --chart-2: 300 100% 50%;  /* Magenta */
  --chart-3: 270 100% 50%;  /* Purple */
  --chart-4: 30 100% 50%;   /* Orange */
}
```

### **5. Update Meta Tags**
Edit `client/src/components/seo.tsx`:
```typescript
const defaultMeta = {
  title: "Your Company Name",
  description: "Your description",
  keywords: "your, keywords",
};
```

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### **Quick Deploy Options**
- **Vercel**: Best for frontend-only
- **Railway**: Full-stack deployment
- **Render**: Free tier available
- **VPS**: Full control (DigitalOcean, AWS, etc.)

---

## 📊 Database Schema

### **Tables**
- `projects` - Portfolio projects
- `skills` - Technical skills
- `contact_messages` - Form submissions
- `about_info` - Company information
- `users` - Admin users

See [FEATURES.md](./FEATURES.md) for complete schema details.

---

## 🛠️ Tech Stack

### **Frontend**
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Query
- Wouter
- Shadcn/ui
- Lucide Icons

### **Backend**
- Express.js
- TypeScript
- PostgreSQL
- Drizzle ORM
- Bcrypt.js
- Express Session
- Passport.js
- Multer
- Zod

---

## 📱 Features in Detail

### **Hero Section**
- 3D animated background
- Gradient text animations
- Multiple CTA buttons
- Social media links

### **Projects**
- Auto-rotating carousel
- Featured projects
- Technology tags
- External links

### **Skills**
- Infinite tech slider
- Grouped by categories
- Proficiency visualization
- Icon support

### **Services** (NEW)
- 6 service cards
- Hover animations
- Icon integration
- Detailed descriptions

### **Work Process** (NEW)
- 6-step workflow
- Visual connections
- Numbered steps
- Process descriptions

### **Contact**
- Form validation
- Success/error states
- Email integration ready
- Animated background

### **Footer**
- Animated orbs
- Grid pattern
- Contact information
- Availability status
- Social links

---

## 🔒 Security

- ✅ Password hashing with bcrypt
- ✅ Session-based authentication
- ✅ Input validation with Zod
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Environment variables

---

## 🎯 SEO Features

- ✅ Dynamic meta tags
- ✅ Open Graph support
- ✅ Twitter Cards
- ✅ Semantic HTML
- ✅ Sitemap ready
- ✅ Mobile-friendly
- ✅ Fast loading

---

## 🐛 Troubleshooting

### **Port already in use**
```bash
# Kill process on port 5000
npx kill-port 5000
```

### **Database issues**
```bash
# Reset and recreate database
npm run db:migrate
npm run db:seed
```

### **Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

---

## 📄 License

MIT License - feel free to use this project for your own portfolio!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

Having issues? Check out:
- [FEATURES.md](./FEATURES.md) - Complete feature list
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- GitHub Issues - Report bugs

---

## 🎉 Acknowledgments

- Shadcn/ui for beautiful components
- Framer Motion for animations
- Lucide for icons
- Tailwind CSS for styling

---

**Made with ❤️ using React, TypeScript, and modern web technologies**

---

## 📸 Screenshots

### Homepage
![Homepage](https://via.placeholder.com/800x600/0ea5e9/ffffff?text=Homepage)

### Admin Dashboard
![Admin](https://via.placeholder.com/800x600/0ea5e9/ffffff?text=Admin+Dashboard)

### Projects Section
![Projects](https://via.placeholder.com/800x600/0ea5e9/ffffff?text=Projects)

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: October 27, 2025
