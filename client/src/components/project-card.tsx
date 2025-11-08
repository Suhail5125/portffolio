import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect?: () => void;
}

export function ProjectCard({ project, index, onSelect }: ProjectCardProps) {
  // Ensure technologies is always an array
  const technologies = Array.isArray(project.technologies) 
    ? project.technologies 
    : typeof project.technologies === 'string' 
      ? JSON.parse(project.technologies)
      : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      data-testid={`card-project-${project.id}`}
    >
      <Card
        className="group overflow-hidden border-border/50 hover-elevate transition-all duration-300 h-full min-h-[360px] flex flex-col cursor-pointer"
        style={{
          transform: "perspective(1000px)",
        }}
        onClick={onSelect}
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onKeyDown={(event) => {
          if (!onSelect) return;

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect();
          }
        }}
      >
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-chart-1/20 to-chart-2/20">
          {project.imageUrl ? (
            <motion.img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              whileHover={{ scale: 1.1 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl font-display gradient-text-cyan-purple">
                {project.title[0]}
              </div>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick action buttons */}
          <motion.div
            className="absolute top-4 right-4 flex gap-2"
            initial={{ opacity: 0, y: -20 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-github-${project.id}`}
                onClick={(event) => event.stopPropagation()}
              >
                <Button size="icon" variant="secondary" className="glass">
                  <Github className="h-4 w-4" />
                </Button>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-demo-${project.id}`}
                onClick={(event) => event.stopPropagation()}
              >
                <Button size="icon" variant="secondary" className="glass">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
          </motion.div>
        </div>

        {/* Project Info */}
        <div className="p-4 flex flex-col flex-1">
          <h3
            className="font-display text-xl font-bold mb-2 group-hover:gradient-text-cyan-magenta transition-all"
            data-testid={`text-title-${project.id}`}
          >
            {project.title}
          </h3>
          <p
            className="text-muted-foreground text-sm mb-3 line-clamp-2 flex-1"
            data-testid={`text-description-${project.id}`}
          >
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {technologies.slice(0, 3).map((tech: string, i: number) => (
              <Badge
                key={i}
                variant="secondary"
                className="glass text-xs px-2 py-0.5"
                data-testid={`badge-tech-${project.id}-${i}`}
              >
                {tech}
              </Badge>
            ))}
            {technologies.length > 3 && (
              <Badge variant="secondary" className="glass text-xs px-2 py-0.5">
                +{technologies.length - 3}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-border/50">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                data-testid={`button-view-demo-${project.id}`}
                onClick={(event) => event.stopPropagation()}
              >
                <Button className="w-full" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Demo
                </Button>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                data-testid={`button-view-code-${project.id}`}
                onClick={(event) => event.stopPropagation()}
              >
                <Button variant="outline" className="w-full glass" size="sm">
                  <Github className="h-4 w-4 mr-2" />
                  Code
                </Button>
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
