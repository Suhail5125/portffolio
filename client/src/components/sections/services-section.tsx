import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Code2, Palette, Smartphone, Rocket, Globe, Zap } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Custom web applications built with modern technologies like React, Next.js, and Node.js for optimal performance and scalability. We specialize in creating responsive, fast-loading websites that deliver exceptional user experiences across all devices and platforms.",
    color: "text-chart-1",
    gradient: "from-chart-1/20 to-chart-1/5",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces designed with user experience in mind. We create designs that engage and convert visitors into customers. Our design process focuses on user research, wireframing, prototyping, and creating pixel-perfect designs.",
    color: "text-chart-2",
    gradient: "from-chart-2/20 to-chart-2/5",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Responsive mobile applications that work seamlessly across all devices and platforms. From native iOS and Android apps to cross-platform solutions using React Native and Flutter, we build mobile experiences that users love and engage with daily.",
    color: "text-chart-3",
    gradient: "from-chart-3/20 to-chart-3/5",
  },
  {
    icon: Globe,
    title: "3D Web Experiences",
    description: "Immersive 3D visualizations and interactive experiences using WebGL, Three.js, and modern graphics technologies. We create stunning 3D websites, product configurators, virtual showrooms, and interactive animations that captivate your audience.",
    color: "text-chart-4",
    gradient: "from-chart-4/20 to-chart-4/5",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Speed up your existing applications with expert optimization techniques for better user experience and SEO rankings. We analyze, optimize, and enhance your website's performance through code splitting, lazy loading, and caching strategies.",
    color: "text-chart-1",
    gradient: "from-chart-1/20 to-chart-1/5",
  },
  {
    icon: Rocket,
    title: "Consulting & Strategy",
    description: "Technical consulting and strategic planning to help you make the right technology decisions for your business growth. We provide architecture reviews, technology audits, scalability planning, and strategic roadmaps for digital transformation.",
    color: "text-chart-2",
    gradient: "from-chart-2/20 to-chart-2/5",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="min-h-screen relative overflow-hidden flex items-center pt-0 pb-20 md:py-20">
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
        <motion.div
          className="text-center mb-8 md:mb-12"
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
            <span className="gradient-text-cyan-purple">Our Services</span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Comprehensive solutions to bring your digital vision to life
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

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 md:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -15, rotateY: 5 }}
              className="group"
            >
              <Card className="p-4 glass border-chart-1/20 hover:border-chart-1/50 transition-all h-full relative overflow-hidden backdrop-blur-xl">
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-chart-1/5 via-transparent to-chart-2/5"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `conic-gradient(from 0deg, hsl(var(--chart-1)), hsl(var(--chart-2)), hsl(var(--chart-3)), hsl(var(--chart-4)), hsl(var(--chart-1)))`,
                    padding: '1px',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full bg-background/95 rounded-xl" />
                </motion.div>

                <div className="relative z-20 h-full flex flex-col">
                  {/* Header: Icon + Title */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <motion.div
                        className={`flex p-3 rounded-xl glass border border-chart-1/30 ${service.color}`}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        animate={{
                          boxShadow: ['0 0 12px hsl(var(--chart-1) / 0.2)', '0 0 24px hsl(var(--chart-1) / 0.4)', '0 0 12px hsl(var(--chart-1) / 0.2)'],
                        }}
                        transition={{
                          boxShadow: { duration: 2, repeat: Infinity },
                          scale: { duration: 0.2 },
                          rotate: { duration: 0.2 }
                        }}
                      >
                        <service.icon className="h-6 w-6" />
                      </motion.div>

                      {/* Floating Orb */}
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-chart-1/60"
                        animate={{
                          scale: [0.5, 1.2, 0.5],
                          opacity: [0.4, 0.9, 0.4],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold group-hover:text-chart-1 transition-colors leading-tight">
                        {service.title}
                      </h3>
                      <motion.div
                        className="h-0.5 bg-gradient-to-r from-chart-1 to-chart-2 rounded-full mt-1"
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
