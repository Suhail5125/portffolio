import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Send, ArrowDown, Sparkles, Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import type { AboutInfo } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroSectionProps {
  aboutInfo: AboutInfo | null;
  isLoading: boolean;
}

export function HeroSection({ aboutInfo, isLoading }: HeroSectionProps) {
  const [currentRole, setCurrentRole] = useState(0);
  
  const roles = aboutInfo?.title ? [aboutInfo.title] : [
    "Creative Developer",
    "3D Enthusiast", 
    "UI/UX Designer",
    "Full-Stack Engineer"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Animated Background */}
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

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32 text-center">
        {isLoading ? (
          // Loading state skeleton
          <div className="space-y-8">
            <motion.div className="mx-auto max-w-md" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <div className="h-8 bg-muted rounded-full w-48 mx-auto mb-4" />
              <div className="h-24 bg-muted rounded-xl w-full" />
            </motion.div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded-full w-3/4 mx-auto" />
              <div className="h-4 bg-muted rounded-full w-1/2 mx-auto" />
            </div>
            <div className="flex justify-center gap-4">
              <div className="h-12 w-32 bg-muted rounded-full" />
              <div className="h-12 w-32 bg-muted rounded-full" />
            </div>
          </div>
        ) : !aboutInfo ? (
          // No data state
          <div className="text-center">
            <motion.div
              className="inline-block mb-6 px-6 py-3 rounded-full border border-chart-1/30"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm font-medium text-muted-foreground">
                Content Coming Soon
              </span>
            </motion.div>
            <h1 className="font-display text-4xl font-bold mb-4">
              Welcome
            </h1>
            <p className="text-muted-foreground">
              The content for this section will be available shortly.
            </p>
          </div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-block mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass px-6 py-3 rounded-full border border-chart-1/30 relative overflow-hidden group">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-chart-1/10 to-chart-2/10"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-sm font-medium text-muted-foreground relative z-10 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-chart-1" />
                Welcome to CodebySRS
              </span>
            </div>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8">
            <motion.span
              className="block gradient-text-cyan-magenta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.span
                key={currentRole}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {roles[currentRole]}
              </motion.span>
            </motion.span>
            <motion.span
              className="block mt-2 text-foreground/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Crafting Digital Experiences
            </motion.span>
          </h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {aboutInfo?.bio || 'Transforming ideas into stunning digital realities with modern web technologies, 3D graphics, and innovative user experiences that captivate and engage.'}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={scrollToContact}
                data-testid="button-lets-work-together"
                className="relative overflow-hidden group bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-2 hover:to-chart-1 transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Let's Work Together
                </span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToProjects}
                data-testid="button-view-work"
                className="glass border-chart-1/30 hover:border-chart-1/60 px-8 py-4 text-lg font-semibold group"
              >
                <span className="flex items-center gap-2">
                  View My Work
                  <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            {aboutInfo && [
              ...(aboutInfo.githubUrl ? [{ icon: Github, href: aboutInfo.githubUrl, label: "GitHub" }] : []),
              ...(aboutInfo.linkedinUrl ? [{ icon: Linkedin, href: aboutInfo.linkedinUrl, label: "LinkedIn" }] : []),
              ...(aboutInfo.instagramUrl ? [{ icon: Instagram, href: aboutInfo.instagramUrl, label: "Instagram" }] : []),
              ...(aboutInfo.email ? [{ icon: Mail, href: `mailto:${aboutInfo.email}`, label: "Email" }] : []),
            ].map(({ icon: Icon, href, label }, index) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-${label.toLowerCase()}`}
                className="p-4 rounded-full glass border border-border/50 hover-elevate active-elevate-2 transition-all group relative overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-chart-1/20 to-chart-2/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
                <Icon className="h-6 w-6 transition-colors group-hover:text-chart-1 relative z-10" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
        )}
      </div>
    </section>
  );
}
