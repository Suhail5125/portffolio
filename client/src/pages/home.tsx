import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { ServicesSection } from "@/components/services-section";
import { WorkProcessSection } from "@/components/work-process-section";
import { AboutSection } from "@/components/about-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Project, Skill, AboutInfo, InsertContactMessage, Testimonial } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { FloatingNavbar } from "@/components/floating-navbar";

export default function Home() {
  const { toast } = useToast();

  // Fetch projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Fetch skills
  const { data: skills = [], isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  // Fetch about info
  const { data: aboutInfo, isLoading: aboutLoading } = useQuery<AboutInfo>({
    queryKey: ["/api/about"],
  });

  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  // Contact form mutation
  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      // No toast notification - success is shown in the form itself
    },
    onError: (error: Error) => {
      // Silent error - form will handle display
      console.error("Failed to send message:", error);
    },
  });

  const handleContactSubmit = async (data: InsertContactMessage) => {
    await contactMutation.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <SEO />
      <ScrollIndicator />
      <FloatingNavbar />
      

      
      <main>
        {/* Hero Section */}
        <div id="hero" className="relative min-h-screen">
          <div className="absolute top-0 left-0 right-0 z-20">
            <Navigation />
          </div>
          <HeroSection aboutInfo={aboutInfo || null} isLoading={aboutLoading} />
        </div>

        <div id="projects">
          <ProjectsSection projects={projects} isLoading={projectsLoading} />
        </div>

        <div id="skills">
          <SkillsSection skills={skills} isLoading={skillsLoading} />
        </div>

        <div>
          <ServicesSection />
        </div>

        <div>
          <WorkProcessSection />
        </div>

        <div id="about">
          <AboutSection aboutInfo={aboutInfo || null} isLoading={aboutLoading} />
        </div>

        <div>
          <TestimonialsSection testimonials={testimonials} isLoading={testimonialsLoading} />
        </div>

        <div id="contact">
          <ContactSection
            onSubmit={handleContactSubmit}
            isSubmitting={contactMutation.isPending}
          />
        </div>

        <div>
          <Footer aboutInfo={aboutInfo || null} />
        </div>
      </main>
    </div>
  );
}
