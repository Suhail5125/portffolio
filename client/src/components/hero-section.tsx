import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Send, MessageCircle } from "lucide-react";
import { HeroScene } from "@/components/3d-fallback/hero-scene";
import { Suspense } from "react";

export function HeroSection() {
  const scrollToProjects = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFooter = () => {
    document.querySelector("#footer")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex-1 flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <Suspense
        fallback={
          <div className="absolute inset-0 bg-gradient-to-b from-background to-card" />
        }
      >
        <HeroScene />
      </Suspense>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass px-6 py-2 rounded-full border border-chart-1/30">
              <span className="text-sm font-medium text-muted-foreground">
                Welcome to our portfolio
              </span>
            </div>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
            <motion.span
              className="block gradient-text-cyan-magenta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Creative Developer
            </motion.span>
            <motion.span
              className="block mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              & 3D Enthusiast
            </motion.span>
          </h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            We craft immersive web experiences with cutting-edge technologies.
            Specializing in WebGL, Three.js, and modern web development.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Button
              size="lg"
              onClick={scrollToContact}
              data-testid="button-lets-work-together"
              className="relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Send className="h-5 w-5" />
                Let's Work Together
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-chart-1 to-chart-2"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToFooter}
              data-testid="button-get-in-touch"
              className="glass border-chart-1/30"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Get In Touch
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToProjects}
              data-testid="button-view-work"
              className="glass border-chart-1/30"
            >
              View My Work
            </Button>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-github"
              className="p-3 rounded-full glass border border-border/50 hover-elevate active-elevate-2 transition-all group"
            >
              <Github className="h-5 w-5 transition-colors group-hover:text-chart-1" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-linkedin"
              className="p-3 rounded-full glass border border-border/50 hover-elevate active-elevate-2 transition-all group"
            >
              <Linkedin className="h-5 w-5 transition-colors group-hover:text-chart-1" />
            </a>
            <a
              href="mailto:contact@example.com"
              data-testid="link-email"
              className="p-3 rounded-full glass border border-border/50 hover-elevate active-elevate-2 transition-all group"
            >
              <Mail className="h-5 w-5 transition-colors group-hover:text-chart-1" />
            </a>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
