import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Github, Linkedin, Twitter, Mail, Briefcase, Users, Award, Code2, Zap, Brain, Cpu, Database } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AboutInfo } from "@shared/schema";

interface AboutSectionProps {
  aboutInfo: AboutInfo | null;
  isLoading: boolean;
}

export function AboutSection({ aboutInfo, isLoading }: AboutSectionProps) {
  if (isLoading) {
    return (
      <section className="min-h-screen pt-20 pb-12 relative flex items-center snap-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-12 w-64 mx-auto mb-16" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!aboutInfo) {
    return (
      <section className="min-h-screen pt-20 pb-12 relative flex items-center snap-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="glass p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="font-display text-2xl font-bold mb-2">About Info Not Available</h3>
            <p className="text-muted-foreground">Information will be added soon!</p>
          </Card>
        </div>
      </section>
    );
  }

  const stats = [
    { icon: Briefcase, label: "Projects", value: `${aboutInfo.completedProjects}+`, color: "chart-1" },
    { icon: Users, label: "Clients", value: `${aboutInfo.totalClients}+`, color: "chart-2" },
    { icon: Award, label: "Years", value: `${aboutInfo.yearsExperience}+`, color: "chart-3" },
    { icon: Code2, label: "Technologies", value: `${aboutInfo.technologiesCount}+`, color: "chart-4" },
  ];



  return (
    <section id="about" className="min-h-screen py-16 relative snap-start overflow-hidden">
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

      <div className="max-w-full mx-auto px-6 relative z-10">
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
            <span className="gradient-text-cyan-purple">About Us</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover the minds behind the innovation
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

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel - Profile */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="relative" style={{ minHeight: '500px' }}>
              {/* Glowing Border Effect */}
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 rounded-lg blur opacity-30"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              />
              
              {/* Terminal Window */}
              <div className="relative bg-black/90 border border-chart-1/40 rounded-lg overflow-hidden backdrop-blur-sm h-full">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-chart-1/20 to-chart-2/20 border-b border-chart-1/30">
                  <div className="flex items-center gap-2">
                    <motion.div className="w-3 h-3 rounded-full bg-red-500" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.div className="w-3 h-3 rounded-full bg-yellow-500" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
                    <motion.div className="w-3 h-3 rounded-full bg-green-500" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-chart-1 font-mono">profile.exe</span>
                    <motion.div 
                      className="w-2 h-2 bg-chart-1 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                </div>
                
                {/* Terminal Content */}
                <div className="p-6 flex flex-col h-full">
                  {/* Avatar Section */}
                  <div className="text-center mb-6">
                    <motion.div
                      className="relative inline-block mb-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      {/* Rotating Rings */}
                      <motion.div
                        className="absolute -inset-3 border-2 border-chart-1/30 rounded-full"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div
                        className="absolute -inset-2 border border-chart-2/40 rounded-full"
                        animate={{ rotate: [360, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                      />
                      
                      {/* Scanning Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-chart-1/20 to-transparent rounded-full"
                        animate={{ 
                          y: ['-100%', '100%'],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      <Avatar className="h-28 w-28 border-2 border-chart-1/50 relative z-10">
                        <AvatarImage src={aboutInfo.avatarUrl || undefined} alt={aboutInfo.name} />
                        <AvatarFallback className="text-2xl font-mono bg-gradient-to-br from-chart-1/30 to-chart-2/30 text-chart-1">
                          {aboutInfo.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    

                  </div>
                  
                  {/* Terminal Commands */}
                  <div className="space-y-3 font-mono text-sm flex-1">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-chart-1">❯</span> 
                      <span className="text-green-400">whoami</span>
                      <motion.span 
                        className="w-2 h-4 bg-chart-1 inline-block"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="text-white pl-4 border-l-2 border-chart-1/30"
                      data-testid="text-about-name"
                    >
                      {aboutInfo.name}
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="flex items-center gap-2 mt-4"
                    >
                      <span className="text-chart-1">❯</span> 
                      <span className="text-green-400">cat role.txt</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 }}
                      className="text-chart-2 pl-4 border-l-2 border-chart-2/30"
                      data-testid="text-about-title"
                    >
                      {aboutInfo.title}
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 }}
                      className="flex items-center gap-2 mt-4"
                    >
                      <span className="text-chart-1">❯</span> 
                      <span className="text-green-400">ls -la ./social</span>
                    </motion.div>
                    
                    {/* Social Links */}
                    <motion.div 
                      className="grid grid-cols-2 gap-2 mt-4 pl-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      {[
                        { url: aboutInfo.githubUrl, icon: Github, name: "github", testId: "link-about-github" },
                        { url: aboutInfo.linkedinUrl, icon: Linkedin, name: "linkedin", testId: "link-about-linkedin" },
                        { url: aboutInfo.twitterUrl, icon: Twitter, name: "twitter", testId: "link-about-twitter" },
                        { url: aboutInfo.email, icon: Mail, name: "email", testId: "link-about-email", href: `mailto:${aboutInfo.email}` },
                      ].map(({ url, icon: Icon, name, testId, href }, index) => 
                        url && (
                          <motion.a
                            key={name}
                            href={href || url}
                            target={href ? undefined : "_blank"}
                            rel={href ? undefined : "noopener noreferrer"}
                            data-testid={testId}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05, backgroundColor: 'hsl(var(--chart-1) / 0.2)' }}
                            transition={{ delay: 1.7 + index * 0.1 }}
                            className="flex items-center gap-2 p-2 border border-chart-1/30 rounded text-xs bg-chart-1/5 hover:border-chart-1/50 transition-all"
                          >
                            <Icon className="h-3 w-3 text-chart-1" />
                            <span className="text-chart-1">{name}</span>
                          </motion.a>
                        )
                      )}
                    </motion.div>
                    
                  </div>
                  
                  {/* Bottom Section */}
                  <div className="mt-auto pt-4 border-t border-chart-1/20">
                    {aboutInfo.resumeUrl && (
                      <motion.a
                        href={aboutInfo.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="button-download-resume"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px hsl(var(--chart-1) / 0.3)' }}
                        transition={{ delay: 2 }}
                        className="block"
                      >
                        <Button className="w-full bg-gradient-to-r from-chart-1/20 to-chart-2/20 border border-chart-1/50 text-chart-1 hover:from-chart-1/30 hover:to-chart-2/30 font-mono text-xs relative overflow-hidden group">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-chart-1/10 to-chart-2/10 opacity-0 group-hover:opacity-100"
                            transition={{ duration: 0.3 }}
                          />
                          <div className="flex items-center justify-center gap-2 relative z-10">
                            <Download className="h-3 w-3" />
                            <span>./download_resume.sh</span>
                          </div>
                        </Button>
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Center Panel - Bio */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-6"
          >
            <div className="relative" style={{ minHeight: '500px' }}>
              {/* Animated Border */}
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-chart-2 via-chart-3 to-chart-4 rounded-lg blur opacity-20"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              />
              
              <div className="relative bg-gradient-to-br from-card/60 to-card/30 border border-chart-2/40 rounded-lg p-6 backdrop-blur-sm flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <motion.h3
                    className="font-display text-xl font-bold text-chart-2 flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      className="w-3 h-3 bg-chart-2 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    SYSTEM_INFO.md
                  </motion.h3>
                  <motion.div
                    className="text-xs font-mono text-chart-2/60"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {new Date().toISOString().split('T')[0]}
                  </motion.div>
                </div>
                
                {/* Bio Content */}
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="bg-black/20 border border-chart-2/20 rounded p-3 font-mono text-xs max-h-70 overflow-y-auto">
                    <motion.div
                      className="text-chart-2/80 mb-1"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      ```markdown
                    </motion.div>
                    <motion.p 
                      className="text-muted-foreground leading-relaxed whitespace-pre-line" 
                      data-testid="text-about-bio"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                    >
                      {aboutInfo.bio}
                    </motion.p>
                    <motion.div
                      className="text-chart-2/80 mt-1"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                    >
                      ```
                    </motion.div>
                  </div>
                </motion.div>
              
                {/* System Status & Activity Log - Same Line */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* System Status Panel */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <motion.div
                        className="w-3 h-3 bg-chart-3 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                      <h4 className="font-display text-sm font-bold text-chart-3">SYSTEM_STATUS.log</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "CPU", value: 78, color: "chart-1" },
                        { label: "Memory", value: 65, color: "chart-2" },
                        { label: "Network", value: 92, color: "chart-3" },
                        { label: "Storage", value: 45, color: "chart-4" },
                      ].map((metric, index) => (
                        <motion.div
                          key={metric.label}
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + index * 0.1 }}
                          className="bg-black/20 border border-chart-3/20 rounded p-2"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-xs text-white">{metric.label}</span>
                            <span className={`font-mono text-xs text-${metric.color} bg-${metric.color}/10 px-1 py-0.5 rounded`}>{metric.value}%</span>
                          </div>
                          <div className="h-1.5 bg-muted/20 rounded-full overflow-hidden relative">
                            <motion.div
                              className={`h-full bg-gradient-to-r from-${metric.color} to-${metric.color}/60 rounded-full relative`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${metric.value}%` }}
                              transition={{ duration: 1.5, delay: 1.4 + index * 0.2 }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-white/20 rounded-full"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 2 + index * 0.3 }}
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recent Activity Log */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div
                        className="w-3 h-3 bg-chart-4 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                      <h4 className="font-display text-sm font-bold text-chart-4">ACTIVITY.log</h4>
                    </div>
                    
                    <div className="bg-black/20 border border-chart-4/20 rounded p-2 max-h-32 overflow-y-auto">
                      <div className="space-y-1 font-mono text-xs">
                        {[
                          { time: "12:34", action: "Deployed v2.1.0 to production", status: "success" },
                          { time: "11:22", action: "Security scan completed", status: "success" },
                          { time: "10:15", action: "Database backup created", status: "info" },
                          { time: "09:45", action: "SSL certificate renewed", status: "success" },
                          { time: "08:30", action: "Performance optimization", status: "info" },
                        ].map((log, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.8 + index * 0.1 }}
                            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
                          >
                            <span className="text-chart-4">{log.time}</span>
                            <motion.div
                              className={`w-1 h-1 rounded-full ${
                                log.status === 'success' ? 'bg-green-400' : 'bg-blue-400'
                              }`}
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                            />
                            <span className="truncate">{log.action}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Panel - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="space-y-3 h-full">
              {/* Stats Header */}
              <motion.div
                className="bg-gradient-to-r from-chart-4/20 to-chart-1/20 border border-chart-4/30 rounded-lg p-3 backdrop-blur-sm"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-chart-4">METRICS.log</span>
                  <motion.div
                    className="flex gap-1"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-4 bg-chart-4 rounded-full"
                        animate={{ scaleY: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Stats Cards */}
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                  whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    rotateY: 2,
                    boxShadow: `0 10px 30px hsl(var(--${stat.color}) / 0.3)`
                  }}
                  transition={{ delay: 0.7 + index * 0.1, type: 'spring', stiffness: 200 }}
                  className="relative group"
                  style={{ perspective: '1000px' }}
                >
                  {/* Glowing Border */}
                  <motion.div
                    className={`absolute -inset-0.5 bg-gradient-to-r from-${stat.color} to-${stat.color}/50 rounded-lg blur opacity-0 group-hover:opacity-30`}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <div className={`relative bg-gradient-to-br from-${stat.color}/15 to-${stat.color}/5 border border-${stat.color}/40 rounded-lg p-4 backdrop-blur-sm overflow-hidden`}>
                    {/* Scanning Line */}
                    <motion.div
                      className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-${stat.color} to-transparent opacity-0 group-hover:opacity-100`}
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                          </motion.div>
                          <span className="font-mono text-xs text-muted-foreground uppercase">{stat.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.div 
                            className="font-display text-xl font-bold text-white"
                            whileHover={{ scale: 1.1 }}
                          >
                            {stat.value}
                          </motion.div>
                          <motion.div
                            className={`w-2 h-2 bg-${stat.color} rounded-full`}
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}