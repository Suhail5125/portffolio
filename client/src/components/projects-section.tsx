import { motion } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

interface ProjectsSectionProps {
  projects: Project[];
  isLoading: boolean;
}

export function ProjectsSection({ projects, isLoading }: ProjectsSectionProps) {
  const displayProjects = projects.slice(0, 5);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
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

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    const autoplay = setInterval(() => {
      api.scrollNext();
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(autoplay);
  }, [api]);

  return (
    <section id="projects" className="min-h-screen pt-16 pb-16 relative flex items-center snap-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-cyan-purple">Featured Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of our recent work combining creativity with cutting-edge technology
          </p>
          <motion.div
            className="h-1 w-24 mx-auto mt-6 bg-gradient-to-r from-chart-1 to-chart-2 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="glass rounded-lg border border-border/50 p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="font-display text-2xl font-bold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground">
                Check back soon for exciting projects!
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {displayProjects.map((project, index) => (
                  <CarouselItem key={project.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <ProjectCard
                      project={project}
                      index={index}
                      onSelect={() => handleProjectSelect(project)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current
                      ? "w-8 bg-chart-1"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
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

                  {selectedProject.longDescription && (
                    <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                      {selectedProject.longDescription}
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
                    {selectedProject.demoUrl && (
                      <Button asChild size="lg">
                        <a
                          href={selectedProject.demoUrl}
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
                          <Github className="h-4 w-4 mr-2" />
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
