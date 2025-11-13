import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
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

const getStepActivities = (stepNumber: string) => {
  const activities: Record<string, string[]> = {
    '01': ['Stakeholder interviews', 'Market research & analysis', 'Competitor benchmarking', 'Requirements gathering'],
    '02': ['Technical feasibility study', 'Resource planning', 'Timeline estimation', 'Risk assessment'],
    '03': ['Wireframing & mockups', 'User experience design', 'Interactive prototyping', 'Design system creation'],
    '04': ['Frontend development', 'Backend architecture', 'Database design', 'API integration'],
    '05': ['Unit & integration testing', 'Cross-browser testing', 'Performance optimization', 'Security auditing'],
    '06': ['Production deployment', 'Performance monitoring', 'User training', 'Ongoing support']
  };
  return activities[stepNumber] || [];
};

const getStepDeliverables = (stepNumber: string) => {
  const deliverables: Record<string, string[]> = {
    '01': ['Project Brief', 'User Personas', 'Market Analysis', 'Requirements Doc'],
    '02': ['Project Roadmap', 'Technical Specs', 'Resource Plan', 'Timeline'],
    '03': ['Design System', 'Prototypes', 'UI/UX Designs', 'Style Guide'],
    '04': ['Source Code', 'Documentation', 'API Endpoints', 'Database Schema'],
    '05': ['Test Reports', 'Bug Fixes', 'Performance Metrics', 'Security Audit'],
    '06': ['Live Website', 'Deployment Guide', 'Training Materials', 'Support Plan']
  };
  return deliverables[stepNumber] || [];
};

export function WorkProcessSection() {
  const [selectedStep, setSelectedStep] = useState<string>('01');
  
  // Auto-rotate steps
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedStep(prev => {
        const currentIndex = processSteps.findIndex(step => step.number === prev);
        const nextIndex = (currentIndex + 1) % processSteps.length;
        return processSteps[nextIndex].number;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  const currentStep = processSteps.find(step => step.number === selectedStep) || processSteps[0];
  const currentIndex = processSteps.findIndex(step => step.number === selectedStep);

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
            className="font-display text-4xl md:text-5xl font-bold mb-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="gradient-text-cyan-purple">Our Work Process</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Process Timeline */}
          <div className="relative h-96 flex items-center justify-center -ml-8">
            {/* Process Flow Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 350 400" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="processGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.9" />
                  <stop offset="20%" stopColor="hsl(var(--chart-2))" stopOpacity="0.7" />
                  <stop offset="40%" stopColor="hsl(var(--chart-3))" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="hsl(var(--chart-4))" stopOpacity="0.7" />
                  <stop offset="80%" stopColor="hsl(var(--chart-1))" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity="0.9" />
                </linearGradient>
                <filter id="processGlow">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/> 
                  </feMerge>
                </filter>
              </defs>
              
              {/* Main Process Flow through all steps */}
              <motion.path
                d="M32 8 Q120 40 260 72 Q320 100 72 140 Q30 180 288 220 Q320 250 72 290 Q30 320 288 340"
                stroke="url(#processGradient)"
                strokeWidth="5"
                fill="none"
                filter="url(#processGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 4, ease: "easeInOut" }}
              />
              
              {/* Flowing Data Particles */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.circle
                  key={`process-particle-${i}`}
                  r="3"
                  fill={`hsl(var(--chart-${(i % 4) + 1}))`}
                  opacity="0.8"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    offsetDistance: ['0%', '100%']
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                  style={{
                    offsetPath: "path('M32 8 Q120 40 260 72 Q320 100 72 140 Q30 180 288 220 Q320 250 72 290 Q30 320 288 340')"
                  }}
                />
              ))}
            </svg>
            
            {/* Process Step Buttons positioned on curve */}
            <div className="relative z-10 w-full h-full">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                const isSelected = selectedStep === step.number;
                
                // Positions along the process flow curve (moved up by 10%)
                const positions = [
                  { x: '16%', y: '-6%' },   // Discovery
                  { x: '62%', y: '10%' },   // Planning
                  { x: '22%', y: '28%' },   // Design
                  { x: '64%', y: '48%' },   // Development
                  { x: '24%', y: '66%' },   // Testing
                  { x: '64%', y: '76%' }    // Launch
                ];
                
                const pos = positions[index] || { x: '50%', y: '50%' };
                
                return (
                  <motion.div
                    key={step.number}
                    className="absolute flex flex-col items-center"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      transform: 'translate(-50%, -60%)'
                    }}
                    initial={{ opacity: 0, scale: 0.2, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.2,
                      type: "spring",
                      stiffness: 100
                    }}
                  >

                    
                    {/* Process Step Button */}
                    <motion.button
                      className="relative group"
                      onClick={() => setSelectedStep(step.number)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {/* Main Button */}
                      <motion.div
                        className={`w-20 h-20 rounded-2xl border-3 transition-all duration-500 glass backdrop-blur-xl relative overflow-hidden ${
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
                        animate={{
                          boxShadow: isSelected 
                            ? '0 0 40px hsl(var(--chart-1) / 0.5), 0 0 80px hsl(var(--chart-1) / 0.3)' 
                            : '0 0 0px hsl(var(--chart-1) / 0)'
                        }}
                      >
                        {/* Inner Content */}
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
                          <Icon className={`h-5 w-5 transition-colors ${
                            isSelected ? 'text-chart-1' : 'text-muted-foreground group-hover:text-chart-1'
                          }`} />
                          <span className={`text-xs font-bold transition-colors text-center leading-tight ${
                            isSelected ? 'text-chart-1' : 'text-muted-foreground group-hover:text-chart-1'
                          }`}>
                            CHAPTER {step.number}
                          </span>
                        </div>
                        
                        {/* Active Indicator */}
                        {isSelected && (
                          <>
                            <motion.div
                              className="absolute -inset-3 rounded-2xl border-3 border-chart-1/40"
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
                              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-chart-1/10 to-chart-2/10"
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
          
          {/* Right Side - Static Card with Scrolling Content */}
          <div className="flex flex-col items-center justify-center">
            {/* Static Card Container */}
            <div className="relative w-full max-w-md">
              {/* Static Card Background with Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-transparent to-chart-2/10 rounded-2xl blur-lg" />
              
              {/* Static Main Card */}
              <div className="relative glass rounded-2xl border-2 border-chart-1/30 p-6 backdrop-blur-xl overflow-hidden h-[30rem]">
                {/* Scrolling Content Container */}
                <div className="relative overflow-hidden">
                  {/* Page Content */}
                  <motion.div
                    key={selectedStep}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ 
                      duration: 1.2,
                      ease: "easeInOut"
                    }}
                    className="relative z-10"
                  >
                    {/* Book Chapter Header */}
                    <div className="text-center mb-6">
                      {/* Chapter and Title on Single Line */}
                      <h3 className="font-display text-xl font-bold mb-4 leading-tight">
                        <span className="text-chart-1">CHAPTER {currentStep.number}:</span>{' '}
                        <span className="text-foreground">{currentStep.title}</span>
                      </h3>
                      
                      {/* Chapter Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 text-justify">
                        {currentStep.description}
                      </p>
                      
                      {/* Decorative Line */}
                      <div className="flex items-center justify-center mb-6">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-chart-1/50" />
                        <div className="h-1 w-1 rounded-full bg-chart-1 mx-3" />
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-chart-1/50" />
                      </div>
                    </div>
                    
                    {/* Key Activities */}
                    <div className="mb-6">
                      <h5 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-chart-1" />
                        Key Activities
                      </h5>
                      <div className="space-y-2">
                        {getStepActivities(currentStep.number).slice(0, 3).map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="flex items-center gap-3 p-2 rounded-lg bg-background/20 border border-chart-1/10"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-chart-1/60 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{activity}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div>
                      <h5 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-chart-2" />
                        Deliverables
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {getStepDeliverables(currentStep.number).slice(0, 4).map((deliverable, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="text-xs font-medium bg-chart-2/10 text-chart-2 px-3 py-1.5 rounded-full border border-chart-2/20"
                          >
                            {deliverable}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Static Holographic Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-transparent to-chart-2/10 pointer-events-none"
                  animate={{
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
