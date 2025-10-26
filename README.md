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
- 🗄️ SQLite + Drizzle ORM
- 🚀 Express.js backend
- ✅ Zod validation
- 🎯 Error boundaries
- 📱 PWA ready

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ installed
- npm or yarn package manager

### **Installation**

```bash
# Clone the repository
git clone <your-repo-url>
cd portffolio

# Install dependencies
npm install

# Setup database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:5000` to see your portfolio!

---

## 📁 Project Structure

```
portffolio/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities
│   │   └── hooks/         # Custom hooks
│   └── public/            # Static assets
├── server/                # Backend Express app
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   ├── migrate.ts         # Database migrations
│   └── seed.ts            # Seed data
├── shared/                # Shared types & schemas
│   └── schema.ts          # Database schema
└── portfolio.db           # SQLite database
```

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
- Better-SQLite3
- Drizzle ORM
- Bcrypt.js
- Express Session
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

### **Database locked**
```bash
# Delete and recreate database
rm portfolio.db
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
