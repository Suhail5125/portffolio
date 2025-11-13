import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Heart, Phone, MapPin, Clock, Zap, Instagram } from "lucide-react";
import type { AboutInfo } from "@shared";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface FooterProps {
  aboutInfo?: AboutInfo | null;
}

export function Footer({ aboutInfo }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  console.log('Footer aboutInfo:', aboutInfo); // Debug log

  return (
    <footer id="footer" className="relative py-12 border-t border-border overflow-hidden snap-start">
      {/* Animated Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--chart-1)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--chart-1)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-chart-1/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-chart-2/10 rounded-full blur-3xl"
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.6, 0.4, 0.6],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-chart-3/8 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-1/4 right-1/3 w-[350px] h-[350px] bg-chart-4/8 rounded-full blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center md:items-start"
          >
            <h3 className="font-display text-2xl font-bold gradient-text-cyan-magenta mb-4 text-center md:text-left">
              {aboutInfo?.name || "CodebySRS"}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed text-center md:text-left">
              {aboutInfo?.title || "We craft immersive web experiences with cutting-edge 3D technologies and modern web development solutions."}
            </p>
          </motion.div>

          {/* Get In Touch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center md:items-start"
          >
            <h4 className="font-semibold mb-4 text-center md:text-left">Get In Touch</h4>
            <div className="space-y-3 w-full">
              {aboutInfo?.email && (
                <motion.a
                  href={`mailto:${aboutInfo.email}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-chart-1 transition-all text-sm group"
                  data-testid="link-footer-email"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="p-2 rounded-lg glass border border-border/50 group-hover:border-chart-1/50 group-hover:bg-chart-1/10 transition-all">
                    <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <span>{aboutInfo.email}</span>
                </motion.a>
              )}
              {aboutInfo?.phone && (
                <motion.a
                  href={`tel:${aboutInfo.phone}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-chart-1 transition-all text-sm group"
                  data-testid="link-footer-phone"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="p-2 rounded-lg glass border border-border/50 group-hover:border-chart-1/50 group-hover:bg-chart-1/10 transition-all">
                    <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <span>{aboutInfo.phone}</span>
                </motion.a>
              )}
              {aboutInfo?.location && (
                <motion.div 
                  className="flex items-center gap-3 text-muted-foreground text-sm group"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="p-2 rounded-lg glass border border-border/50 group-hover:border-chart-1/50 group-hover:bg-chart-1/10 transition-all">
                    <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <span>{aboutInfo.location}</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Follow Me */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center md:items-start"
          >
            <h4 className="font-semibold mb-4 text-center md:text-left">Follow Us</h4>
            <div className="flex gap-3 justify-center md:justify-start">
              {[
                ...(aboutInfo?.githubUrl ? [{ icon: Github, href: aboutInfo.githubUrl, name: "github" }] : []),
                ...(aboutInfo?.linkedinUrl ? [{ icon: Linkedin, href: aboutInfo.linkedinUrl, name: "linkedin" }] : []),
                ...(aboutInfo?.twitterUrl ? [{ icon: Twitter, href: aboutInfo.twitterUrl, name: "twitter" }] : []),
                ...(aboutInfo?.instagramUrl ? [{ icon: Instagram, href: aboutInfo.instagramUrl, name: "instagram" }] : []),
              ].map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-footer-${social.name}`}
                  className="p-3 rounded-full glass border border-border/50 hover-elevate active-elevate-2 transition-all group relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.3 + index * 0.1,
                    type: "spring",
                    stiffness: 200 
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-chart-1/20 to-chart-2/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <social.icon className="h-5 w-5 transition-colors group-hover:text-chart-1 relative z-10" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Availability Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center md:items-start"
          >
                          <div className="glass rounded-xl border border-border/50 p-6 w-[120%] -ml-[20%] hover-elevate transition-all relative overflow-hidden">
                {/* Animated gradient orbs */}
                <motion.div
                  className="absolute -top-10 -left-10 w-32 h-32 bg-chart-1/20 rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute -bottom-10 -right-10 w-32 h-32 bg-chart-2/20 rounded-full blur-2xl"
                  animate={{
                    scale: [1.3, 1, 1.3],
                    opacity: [0.5, 0.3, 0.5],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
                
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <motion.div
                    className={`w-2 h-2 ${aboutInfo?.availableForWork ? 'bg-green-500' : 'bg-red-500'} rounded-full`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="font-semibold text-sm">{aboutInfo?.availableForWork ? 'Available for Work' : 'Currently Unavailable'}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  {aboutInfo?.availableForWork ? "We're currently accepting new client projects and would love to hear about your business needs." : "Currently not available for new projects."}
                </p>
                {aboutInfo && (
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {aboutInfo.responseTime && (
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-chart-1" />
                        <span>Response Time: {aboutInfo.responseTime}</span>
                      </div>
                    )}
                    {aboutInfo.workingHours && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-chart-2" />
                        <span>Working Hours: {aboutInfo.workingHours}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="pt-6 border-t border-border/80"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              className="flex items-center gap-2"
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span>© {currentYear} {aboutInfo?.name || "CodebySRS"}. Made with</span>
                <motion.span
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-block"
                >
                  <Heart className="h-4 w-4 text-chart-2 fill-current" />
                </motion.span>
                <span>and modern web technologies</span>
              </p>
            </motion.div>
            
            <motion.div
              className="flex items-center gap-4 text-xs text-muted-foreground/70"
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <span>All rights reserved</span>
              <span>•</span>
              <Link href="/privacy-policy" className="hover:text-muted-foreground transition-colors cursor-pointer">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms-of-service" className="hover:text-muted-foreground transition-colors cursor-pointer">
                Terms of Service
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
