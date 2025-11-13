import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Skill } from "@shared";
import { Skeleton } from "@/components/ui/skeleton";
import { Code2, Sparkles, Wrench, Layers } from "lucide-react";
import { TechSlider } from "@/components/tech-slider";
import { useState, useEffect } from "react";

interface SkillsSectionProps {
  skills: Skill[];
  isLoading: boolean;
}

const categoryIcons: Record<string, any> = {
  "Frontend": Code2,
  "Backend": Layers,
  "3D/Graphics": Sparkles,
  "Tools": Wrench,
  "Other": Code2,
};

const categoryColors: Record<string, string> = {
  "Frontend": "from-chart-1 to-chart-2",
  "Backend": "from-chart-2 to-chart-3",
  "3D/Graphics": "from-chart-3 to-chart-4",
  "Tools": "from-chart-4 to-chart-1",
  "Other": "from-chart-1 to-chart-3",
};

export function SkillsSection({ skills, isLoading }: SkillsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Frontend');
  
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
  
  const categories = Object.keys(groupedSkills).length > 0 ? Object.keys(groupedSkills) : ['Frontend', 'Backend', '3D/Graphics', 'Tools'];
  const currentSkills = groupedSkills[selectedCategory] || [];

  // Auto-rotate categories
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedCategory(prev => {
        const currentIndex = categories.indexOf(prev);
        const nextIndex = (currentIndex + 1) % categories.length;
        return categories[nextIndex];
      });
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, [categories]);

  return (
    <section id="skills" className="h-screen relative overflow-hidden">
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
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8">
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
            <span className="gradient-text-cyan-purple">Skills & Expertise</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Cutting-edge technologies powering digital innovation
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Perfect Curved Flow */}
          <div className="relative h-96 flex items-center justify-center -ml-8">
            {/* Perfect S-Curve Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 350 400" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.9" />
                  <stop offset="25%" stopColor="hsl(var(--chart-2))" stopOpacity="0.7" />
                  <stop offset="75%" stopColor="hsl(var(--chart-3))" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity="0.9" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/> 
                  </feMerge>
                </filter>
              </defs>
              
              {/* Main S-Curve through all categories */}
              <motion.path
                d="M32 48 Q120 80 260 112 Q320 140 72 248 Q30 290 288 360"
                stroke="url(#pathGradient)"
                strokeWidth="5"
                fill="none"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 3.5, ease: "easeInOut" }}
              />
              
              {/* Enhanced Flowing Particles */}
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.circle
                  key={`particle-${i}`}
                  r="4"
                  fill={`hsl(var(--chart-${(i % 4) + 1}))`}
                  opacity="0.9"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    offsetDistance: ['0%', '100%']
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                  style={{
                    offsetPath: "path('M32 48 Q120 80 260 112 Q320 140 72 248 Q30 290 288 360')"
                  }}
                />
              ))}
            </svg>
            
            {/* Category Buttons positioned on curve */}
            <div className="relative z-10 w-full h-full">
              {categories.map((category, index) => {
                const Icon = categoryIcons[category] || Code2;
                const isSelected = selectedCategory === category;
                
                // Exact positions on the S-curve
                const positions = [
                  { x: '12%', y: '0%' },   // Frontend - start of curve
                  { x: '60%', y: '20%' },  // Backend - peak of curve
                  { x: '20%', y: '54%' },  // 3D/Graphics - valley of curve
                  { x: '64%', y: '76%' }   // Tools - end of curve
                ];
                
                const pos = positions[index] || { x: '50%', y: '50%' };
                
                return (
                  <motion.div
                    key={category}
                    className="absolute"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ opacity: 0, scale: 0.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  >

                    {/* Category Button */}
                    <motion.button
                      className="relative group"
                      onClick={() => setSelectedCategory(category)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}

                    >
                      {/* Main Button */}
                      <motion.div
                        className={`w-28 h-28 rounded-3xl border-4 transition-all duration-500 glass backdrop-blur-xl relative overflow-hidden ${
                          isSelected 
                            ? 'border-chart-1 bg-chart-1/20 shadow-2xl' 
                            : 'border-chart-1/50 hover:border-chart-1/80 bg-background/15'
                        }`}
                        animate={{
                          boxShadow: isSelected 
                            ? '0 0 40px hsl(var(--chart-1) / 0.5), 0 0 80px hsl(var(--chart-1) / 0.3)' 
                            : '0 0 0px hsl(var(--chart-1) / 0)'
                        }}
                      >
                        {/* Inner Content */}
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3">
                          <Icon className={`h-8 w-8 transition-all duration-300 ${
                            isSelected ? 'text-chart-1' : 'text-muted-foreground group-hover:text-chart-1'
                          }`} />
                          <span className={`text-sm font-bold transition-all duration-300 text-center leading-tight ${
                            isSelected ? 'text-chart-1' : 'text-muted-foreground group-hover:text-chart-1'
                          }`}>
                            {category.includes('/') ? category.split('/')[0] : category}
                          </span>
                        </div>
                        
                        {/* Active Indicator */}
                        {isSelected && (
                          <>
                            <motion.div
                              className="absolute -inset-3 rounded-3xl border-3 border-chart-1/40"
                              animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.4, 0.1, 0.4]
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            <motion.div
                              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-chart-1/10 to-chart-2/10"
                              animate={{
                                opacity: [0.3, 0.6, 0.3]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          </>
                        )}
                      </motion.div>
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
            

          </div>
          
          {/* Right Side - Content */}
          <div className="flex flex-col items-center justify-center">

            
            {/* Compact Category Card */}
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-md"
            >
              {/* Card Background with Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-transparent to-chart-2/10 rounded-2xl blur-lg" />
              
              {/* Main Card */}
              <div className="relative glass rounded-2xl border-2 border-chart-1/30 p-6 backdrop-blur-xl overflow-hidden">
                {/* Card Header */}
                <div className="relative z-10 flex items-center justify-center gap-3 mb-4">
                  {(() => {
                    const Icon = categoryIcons[selectedCategory] || Code2;
                    return (
                      <motion.div
                        className="p-2 rounded-xl bg-gradient-to-br from-chart-1/20 to-chart-2/20 border border-chart-1/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Icon className="h-6 w-6 text-chart-1" />
                      </motion.div>
                    );
                  })()}
                  <h3 className="font-display text-2xl font-bold text-center">{selectedCategory}</h3>
                </div>
                
                {/* Skills List - Single Column */}
                {currentSkills.length > 0 ? (
                  <div className="relative z-10 space-y-3">
                    {currentSkills.slice(0, 4).map((skill, index) => {
                      const colorClass = categoryColors[selectedCategory] || categoryColors.Other;
                      return (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="p-3 rounded-xl bg-background/30 border border-chart-1/20"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">{skill.name}</span>
                            <span className="text-xs font-bold text-chart-1">
                              {skill.proficiency}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${colorClass} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.proficiency}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="relative z-10 flex items-center justify-center h-20">
                    <div className="text-muted-foreground text-center">
                      <Code2 className="h-8 w-8 mx-auto mb-1 opacity-50" />
                      <p className="text-sm">No skills in {selectedCategory}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Full Width Tech Slider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute bottom-8 w-full"
      >
        <TechSlider />
      </motion.div>
    </section>
  );
}