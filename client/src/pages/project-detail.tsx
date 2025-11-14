import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@shared";

export default function ProjectDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const projectId = params.id;

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-chart-1 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Project not found</p>
          <Button onClick={() => setLocation("/")}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  const technologies = getTechnologies(project);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
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
        {Array.from({ length: 20 }).map((_, i) => {
          const symbols = ['<>', '{}', '[]', '/>', '()', '&&', '||', '=>'];
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

      {/* Content */}
      <div className="relative z-10">
        {/* Main Container with responsive padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="gap-2 hover:gap-3 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </motion.div>

          {/* Project Image with responsive heights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-8 sm:mb-12"
          >
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full glass flex items-center justify-center">
                <span className="text-6xl sm:text-7xl md:text-8xl font-display gradient-text-cyan-purple">
                  {project.title[0]}
                </span>
              </div>
            )}
          </motion.div>

          {/* Content Grid - stacks on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content - Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8"
            >
              {/* Title */}
              <div>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  <span className="gradient-text-cyan-purple">{project.title}</span>
                </h1>
                {project.featured && (
                  <Badge className="glass">
                    <Tag className="h-3 w-3 mr-1" />
                    Featured Project
                  </Badge>
                )}
              </div>

              {/* Description with minimum 14px font size */}
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">About This Project</h2>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {/* Technologies with proper wrapping */}
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Technologies Used</h2>
                <div className="flex flex-wrap gap-2">
                  {technologies.length > 0 ? (
                    technologies.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="glass text-xs sm:text-sm px-3 py-1"
                      >
                        {tech}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No technologies listed.</span>
                  )}
                </div>
              </div>

              {/* Action Buttons - full width on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4">
                {project.liveUrl && (
                  <Button
                    asChild
                    size="lg"
                    className="w-full gap-2"
                    style={{
                      background: "linear-gradient(135deg, rgba(0,255,255,0.2), rgba(255,0,255,0.2))",
                      boxShadow: "0 0 20px rgba(0,255,255,0.4)",
                    }}
                  >
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      View Live Demo
                    </a>
                  </Button>
                )}
                
                {project.githubUrl && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full gap-2 glass"
                  >
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      View Source Code
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Sidebar - Right Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Project Metadata with responsive layout */}
              <div className="glass rounded-xl p-4 sm:p-6 space-y-4">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4">Project Details</h3>
                
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6">
                  {/* Created Date */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg glass">
                      <Calendar className="h-4 w-4 text-chart-1" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-sm font-medium">
                        {new Date(project.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg glass">
                      <Tag className="h-4 w-4 text-chart-2" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-medium">
                        {project.liveUrl ? 'Live' : 'In Development'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="glass rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
