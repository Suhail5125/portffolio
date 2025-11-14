import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, FileSearch, Palette, Code, TestTube, Rocket } from "lucide-react";

const processSteps = [
  {
    number: "01",
    icon: Lightbulb,
    title: "Discovery & Planning",
    description: "We start by understanding your business goals, target audience, and project requirements to create a comprehensive strategy.",
    color: "text-chart-1",
    gradient: "from-chart-1 to-chart-2",
    duration: "1-2 weeks",
  },
  {
    number: "02",
    icon: FileSearch,
    title: "Research & Analysis",
    description: "Deep dive into market research, competitor analysis, and user behavior to inform our design and development decisions.",
    color: "text-chart-2",
    gradient: "from-chart-2 to-chart-3",
    duration: "1 week",
  },
  {
    number: "03",
    icon: Palette,
    title: "Design & Prototype",
    description: "Create stunning visual designs and interactive prototypes that bring your vision to life before development begins.",
    color: "text-chart-3",
    gradient: "from-chart-3 to-chart-4",
    duration: "2-3 weeks",
  },
  {
    number: "04",
    icon: Code,
    title: "Development",
    description: "Build your solution using cutting-edge technologies and best practices, ensuring scalability and performance.",
    color: "text-chart-4",
    gradient: "from-chart-4 to-chart-1",
    duration: "4-6 weeks",
  },
  {
    number: "05",
    icon: TestTube,
    title: "Testing & QA",
    description: "Rigorous testing across devices and browsers to ensure everything works flawlessly before launch.",
    color: "text-chart-1",
    gradient: "from-chart-1 to-chart-2",
    duration: "1-2 weeks",
  },
  {
    number: "06",
    icon: Rocket,
    title: "Launch & Support",
    description: "Deploy your project to production and provide ongoing support and maintenance to ensure continued success.",
    color: "text-chart-2",
    gradient: "from-chart-2 to-chart-3",
    duration: "1 week",
  },
];

export function WorkProcessSection() {
  const [selectedStep, setSelectedStep] = useState<string>('01');

  return (
    <section id="process" className="h-screen relative overflow-hidden flex items-center">
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
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="gradient-text-cyan-purple">Our Work Process</span>
          </motion.h2>
          <motion.p 
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From concept to launch - our systematic approach to digital excellence
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

        {/* Category Bubbles - Horizontal Scroll */}
        <motion.div 
          className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scrollbar-hide mb-8 justify-center sm:justify-start"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const isSelected = selectedStep === step.number;
            
            return (
              <motion.button
                key={step.number}
                className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 transition-all duration-500 glass backdrop-blur-xl relative overflow-hidden snap-center ${
                  isSelected 
                    ? 'border-chart-1 bg-chart-1/20 shadow-2xl' 
                    : 'border-chart-1/50 hover:border-chart-1/80 bg-background/15'
                }`}
                style={{
                  background: isSelected ? `linear-gradient(135deg, 
                    hsl(var(--chart-${(index % 4) + 1}) / 0.25) 0%, 
                    hsl(var(--chart-${((index + 1) % 4) + 1}) / 0.15) 100%)` :
                    `linear-gradient(135deg, 
                    hsl(var(--chart-${(index % 4) + 1}) / 0.15) 0%, 
                    hsl(var(--chart-${((index + 1) % 4) + 1}) / 0.1) 100%)`
                }}
                onClick={(e) => {
                  setSelectedStep(step.number);
                  e.currentTarget.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest', 
                    inline: 'center' 
                  });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                  <Icon className={`h-6 w-6 sm:h-7 sm:w-7 transition-colors ${
                    isSelected ? 'text-chart-1' : 'text-muted-foreground group-hover:text-chart-1'
                  }`} />
                  <span className={`text-xs font-bold transition-colors text-center leading-tight ${
                    isSelected ? 'text-chart-1' : 'text-muted-foreground group-hover:text-chart-1'
                  }`}>
                    {step.number}
                  </span>
                </div>
                
                {/* Active Indicator */}
                {isSelected && (
                  <>
                    <motion.div
                      className="absolute -inset-2 rounded-full border-3 border-chart-1/40"
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
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-chart-1/10 to-chart-2/10"
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
              </motion.button>
            );
          })}
        </motion.div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <motion.div
                key={step.number}
                className="glass rounded-xl border border-border/50 p-4 sm:p-5 md:p-6 hover-elevate transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex flex-col h-full">
                  {/* Step Number */}
                  <div className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-3 text-center sm:text-left ${step.color}`}>
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="p-2.5 sm:p-3 rounded-lg mb-3 sm:mb-4 bg-gradient-to-br from-chart-1/10 to-chart-2/10 w-fit">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-chart-1" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-center sm:text-left">
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-center sm:text-left">
                    {step.description}
                  </p>
                  
                  {/* Duration */}
                  <div className="mt-auto pt-4">
                    <span className="text-xs font-medium text-chart-1 bg-chart-1/10 px-3 py-1.5 rounded-full border border-chart-1/20">
                      {step.duration}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
