import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import type { Testimonial as TestimonialRecord } from "@shared/schema";

interface DisplayTestimonial {
  id: string | number;
  name: string;
  role?: string | null;
  company?: string | null;
  content: string;
  rating: number;
  avatarUrl?: string | null;
}

const fallbackTestimonials: DisplayTestimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO, TechStart",
    company: "TechStart Inc.",
    content: "Exceptional work! The team delivered beyond our expectations with innovative solutions and flawless execution.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    company: "Digital Solutions",
    content: "Professional, creative, and reliable. They transformed our vision into a stunning digital experience.",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "Growth Labs",
    content: "Outstanding quality and attention to detail. The project was completed on time and exceeded all requirements.",
    rating: 5
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Founder",
    company: "InnovateCorp",
    content: "Incredible team with amazing skills. They brought our complex ideas to life with elegant simplicity.",
    rating: 5
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "CTO",
    company: "FutureTech",
    content: "Top-notch development and design. The collaboration was smooth and the results were phenomenal.",
    rating: 5
  },
  {
    id: 6,
    name: "James Miller",
    role: "Creative Director",
    company: "Design Studio",
    content: "Exceptional creativity and technical expertise. They delivered a product that truly stands out.",
    rating: 5
  }
];

const getInitials = (value: string) => {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("") || "?";
};

interface TestimonialsSectionProps {
  testimonials?: TestimonialRecord[];
  isLoading?: boolean;
}

export function TestimonialsSection({ testimonials = [], isLoading = false }: TestimonialsSectionProps) {
  const MAX_DISPLAY = 20;
  const visibleTestimonials = testimonials.filter((item) => item.isVisible);
  const sourceTestimonials = (visibleTestimonials.length > 0 ? visibleTestimonials : testimonials)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, MAX_DISPLAY);

  const dataset: DisplayTestimonial[] =
    sourceTestimonials.length > 0
      ? sourceTestimonials.map((item) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          company: item.company,
          content: item.content,
          rating: item.rating ?? 5,
          avatarUrl: item.avatarUrl || null,
        }))
      : fallbackTestimonials;

  const displayTestimonials = isLoading && testimonials.length === 0 ? fallbackTestimonials : dataset;
  const duplicatedTestimonials = [...displayTestimonials, ...displayTestimonials, ...displayTestimonials];
  const reversedTestimonials = [...duplicatedTestimonials].reverse();
  const [isPaused, setIsPaused] = React.useState(false);

  return (
    <section id="testimonials" className="h-screen relative overflow-hidden flex items-center">
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
      
      <div className="relative z-10 w-full">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
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
            <span className="gradient-text-cyan-purple">Client Testimonials</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            What our clients say about working with us
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

        {/* Infinite Scrolling Testimonials */}
        <div className="relative">
          {/* Top Row - Left to Right */}
          <div className="mb-8 overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: isPaused ? undefined : [0, -1920]
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard key={`top-${index}`} testimonial={testimonial} />
              ))}
            </motion.div>
          </div>

          {/* Bottom Row - Right to Left */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: isPaused ? undefined : [-1920, 0]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {reversedTestimonials.map((testimonial, index) => (
                <TestimonialCard key={`bottom-${index}`} testimonial={testimonial} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: DisplayTestimonial }) {
  const rating = Math.min(5, Math.max(1, Math.round(testimonial.rating)));
  return (
    <motion.div
      className="relative flex-shrink-0 w-80 p-6 glass rounded-2xl backdrop-blur-xl overflow-hidden"
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 opacity-20">
        <Quote className="h-8 w-8 text-chart-1" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${index < rating ? "fill-chart-1 text-chart-1" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        
        {/* Testimonial Text */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          "{testimonial.content}"
        </p>
        
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chart-1/20 to-chart-2/20 border border-chart-1/30 flex items-center justify-center overflow-hidden relative">
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-chart-1">
              {getInitials(testimonial.name)}
            </span>
            {testimonial.avatarUrl && (
              <img
                src={testimonial.avatarUrl}
                alt={testimonial.name}
                className="w-full h-full object-cover relative z-10"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-sm">{testimonial.name}</h4>
            {testimonial.role && <p className="text-xs text-muted-foreground">{testimonial.role}</p>}
            {testimonial.company && <p className="text-xs text-chart-1">{testimonial.company}</p>}
          </div>
        </div>
      </div>
      
      {/* Holographic Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-transparent to-chart-2/10"
        animate={{
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}