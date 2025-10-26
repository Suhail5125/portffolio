@echo off
echo Starting organized commits...
echo.

REM Commit 1: Schema updates
git add shared/schema.ts server/migrate.ts
git commit -m "feat: add phone and location fields to about schema"

REM Commit 2: Services section
git add client/src/components/services-section.tsx
git commit -m "feat: add services section with 6 service cards"

REM Commit 3: Work process section
git add client/src/components/work-process-section.tsx
git commit -m "feat: add work process section with 6-step workflow"

REM Commit 4: Tech slider
git add client/src/components/tech-slider.tsx
git commit -m "feat: add infinite tech slider component"

REM Commit 5: Navigation updates
git add client/src/components/navigation.tsx
git commit -m "feat: simplify navigation and add scroll behavior"

REM Commit 6: Hero section updates
git add client/src/components/hero-section.tsx
git commit -m "feat: update hero section with company perspective"

REM Commit 7: About section updates
git add client/src/components/about-section.tsx
git commit -m "feat: update about section to company perspective"

REM Commit 8: Projects section updates
git add client/src/components/projects-section.tsx client/src/components/project-card.tsx
git commit -m "feat: update projects section with company messaging"

REM Commit 9: Skills section updates
git add client/src/components/skills-section.tsx
git commit -m "feat: update skills section with company perspective"

REM Commit 10: Testimonials updates
git add client/src/components/testimonials-section.tsx
git commit -m "feat: update testimonials to reference team"

REM Commit 11: Contact section updates
git add client/src/components/contact-section.tsx
git commit -m "feat: update contact form with company messaging"

REM Commit 12: Footer updates
git add client/src/components/footer.tsx
git commit -m "feat: enhance footer with animations and company info"

REM Commit 13: Error boundary
git add client/src/components/error-boundary.tsx
git commit -m "feat: add global error boundary component"

REM Commit 14: SEO component
git add client/src/components/seo.tsx
git commit -m "feat: add SEO component with meta tags"

REM Commit 15: Page loader
git add client/src/components/page-loader.tsx
git commit -m "feat: add page loader component"

REM Commit 16: Enhanced 404 page
git add client/src/pages/not-found.tsx
git commit -m "feat: enhance 404 page with animations"

REM Commit 17: Admin projects page
git add client/src/pages/admin/projects.tsx
git commit -m "feat: add admin projects management page"

REM Commit 18: Admin skills page
git add client/src/pages/admin/skills.tsx
git commit -m "feat: add admin skills management page"

REM Commit 19: Admin messages page
git add client/src/pages/admin/messages.tsx
git commit -m "feat: add admin messages management page"

REM Commit 20: Admin about page
git add client/src/pages/admin/about.tsx
git commit -m "feat: add admin about info management page"

REM Commit 21: Home page updates
git add client/src/pages/home.tsx
git commit -m "feat: update home page with new sections and snap scroll"

REM Commit 22: App routing
git add client/src/App.tsx
git commit -m "feat: add admin routes and error boundary"

REM Commit 23: Styles
git add client/src/index.css
git commit -m "style: update global styles"

REM Commit 24: Server updates
git add server/index.ts server/storage.ts server/seed.ts server/add-projects.ts
git commit -m "feat: update server with new endpoints and seed data"

REM Commit 25: Package updates
git add package.json package-lock.json
git commit -m "chore: update dependencies"

REM Commit 26: Documentation
git add README.md FEATURES.md DEPLOYMENT.md CLEANUP.md
git commit -m "docs: add comprehensive documentation"

echo.
echo All commits completed!
echo.
echo Now push to remote with: git push
pause
