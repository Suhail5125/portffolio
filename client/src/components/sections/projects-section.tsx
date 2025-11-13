import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@shared";
import { Skeleton } from "@/components/ui/skeleton";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface ProjectsSectionProps {
  projects: Project[];
  isLoading: boolean;
}

export function ProjectsSection({ projects, isLoading }: ProjectsSectionProps) {
  const featuredProjects = projects.filter((project) => project.featured);
  const displayProjects = (featuredProjects.length > 0 ? featuredProjects : projects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Auto-scroll effect
  useEffect(() => {
    if (displayProjects.length === 0 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayProjects.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [displayProjects.length, isPaused]);
  
  // Get 3 visible cards
  const getVisibleProjects = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % displayProjects.length;
      visible.push(displayProjects[index]);
    }
    return visible;
  };

  const handleProjectSelect = (project: Project) => {
    // Navigate to project detail page (coming soon page for now)
    window.location.href = `/projects/${project.id}`;
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);

    if (!open) {
      setSelectedProject(null);
    }
  };

  const getTechnologies = (project: Project) => {
    const value = project.technologies as unknown;

    if (Array.isArray(value)) {
      return value as string[];
    }

    if (typeof value === "string") {
      try {
        return JSON.parse(value) as string[];
      } catch {
        return [];
      }
    }

    return [];
  };

  const selectedTechnologies = selectedProject ? getTechnologies(selectedProject) : [];

  return (
    <section id="projects" className="min-h-screen py-20 relative flex items-center" style={{ overflow: 'visible' }}>
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card/20 to-background" />
        
        {/* Matrix-style Grid */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--chart-1)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--chart-1)) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }} />
        </div>
        
        {/* Floating Code Symbols */}
        {Array.from({ length: 30 }).map((_, i) => {
          const symbols = ['<>', '{}', '[]', '/>', '()', '&&', '||', '=>', 'fn', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'try', 'catch', 'class', 'import', 'export', 'async', 'await', 'return', 'null', 'true', 'false', '===', '!==', '++', '--', '+=', '-=', '*=', '/=', '??', '?.', '...', 'new', 'this', 'super', 'extends', 'implements'];
          return (
            <motion.div
              key={i}
              className="absolute font-mono font-bold"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 16}px`,
                color: `hsl(var(--chart-${(i % 4) + 1}))`,
                opacity: 0.1,
              }}
              animate={{
                y: [0, -30, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            >
              {symbols[i % symbols.length]}
            </motion.div>
          );
        })}
      </div>
      
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="font-display text-4xl md:text-5xl font-bold mb-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="gradient-text-cyan-purple">Featured Projects</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Innovation meets design in our latest creations
          </motion.p>
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div 
              className="h-px w-16 bg-gradient-to-r from-transparent to-chart-1"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
            <div className="h-1.5 w-1.5 rounded-full bg-chart-1 mx-3" />
            <motion.div 
              className="h-px w-16 bg-gradient-to-l from-transparent to-chart-1"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
          </motion.div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass rounded-lg border border-border/50 p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="font-display text-2xl font-bold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground">
                Check back soon for exciting projects!
              </p>
            </div>
          </div>
        ) : (
          <div className="relative w-full overflow-visible pb-20" style={{ paddingTop: '0px' }}>
            <motion.div 
              className="relative max-w-[1280px] mx-auto px-2"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative flex gap-4 overflow-x-hidden" style={{ overflowY: 'visible' }}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {getVisibleProjects().map((project, index) => (
                    <motion.div
                      key={`${project.id}-${(currentIndex + index) % displayProjects.length}`}
                      layout
                      initial={{ x: 404, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -404, opacity: 0 }}
                      transition={{ 
                        duration: 0.6,
                        ease: "easeInOut",
                        layout: { duration: 0.6 }
                      }}
                      className="flex-shrink-0"
                      style={{ width: "380px", marginTop: '0', paddingTop: '0' }}
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                    >
                      <ProjectCard
                        project={project}
                        index={index}
                        onSelect={() => handleProjectSelect(project)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Control Dots */}
              <motion.div 
                className="flex items-center justify-center gap-3 mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {displayProjects.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsPaused(true);
                      setTimeout(() => setIsPaused(false), 5000);
                    }}
                    className="relative group"
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      className="w-2.5 h-2.5 rounded-full cursor-pointer transition-all"
                      style={{
                        background: currentIndex === index 
                          ? "linear-gradient(135deg, hsl(var(--chart-1)), hsl(var(--chart-2)))"
                          : "rgba(255,255,255,0.2)",
                        boxShadow: currentIndex === index 
                          ? "0 0 15px rgba(0,255,255,0.6), 0 0 30px rgba(255,0,255,0.4)"
                          : "none",
                      }}
                      animate={currentIndex === index ? {
                        scale: [1, 1.2, 1],
                      } : {}}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                    {/* Hover ring effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2"
                      style={{
                        borderColor: "hsl(var(--chart-1))",
                        opacity: 0,
                      }}
                      whileHover={{
                        opacity: 0.6,
                        scale: 1.8,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="w-screen h-screen max-w-none p-0 sm:rounded-none overflow-hidden [&>button]:hidden">
          {selectedProject && (
            <div className="relative flex h-full flex-col bg-background">
              <div className="relative h-[40vh] w-full bg-muted">
                {selectedProject.imageUrl ? (
                  <img
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-6xl font-display gradient-text-cyan-purple">
                      {selectedProject.title[0]}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12">
                <div className="mx-auto flex max-w-5xl flex-col gap-10">
                  <DialogHeader className="space-y-4 text-left">
                    <DialogTitle className="text-4xl font-display font-bold">
                      {selectedProject.title}
                    </DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground">
                      {selectedProject.description}
                    </DialogDescription>
                  </DialogHeader>

                  {selectedProject.description && (
                    <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                      {selectedProject.description}
                    </p>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTechnologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="glass text-xs px-3 py-1">
                          {tech}
                        </Badge>
                      ))}
                      {selectedTechnologies.length === 0 && (
                        <span className="text-sm text-muted-foreground">No technologies listed.</span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {selectedProject.liveUrl && (
                      <Button asChild size="lg">
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Live Project
                        </a>
                      </Button>
                    )}
                    {selectedProject.githubUrl && (
                      <Button variant="outline" asChild size="lg" className="glass">
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaGithub className="h-4 w-4 mr-2" />
                          View Source Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
