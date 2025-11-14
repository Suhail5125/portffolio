import React from "react";
import { motion, PanInfo } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonial as TestimonialRecord } from "@shared";

interface DisplayTestimonial {
  id: string | number;
  name: string;
  role?: string | null;
  company?: string | null;
  content: string;
  rating: number;
  avatarUrl?: string | null;
}



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

export function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
  const MAX_DISPLAY = 20;
  const visibleTestimonials = testimonials.filter((item) => item.isVisible);
  const sourceTestimonials = (visibleTestimonials.length > 0 ? visibleTestimonials : testimonials)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, MAX_DISPLAY);

  const dataset: DisplayTestimonial[] = sourceTestimonials.map((item) => ({
    id: item.id,
    name: item.name,
    role: item.role,
    company: item.company,
    content: item.content,
    rating: item.rating ?? 5,
    avatarUrl: item.avatarUrl || null,
  }));

  const displayTestimonials = dataset;
  
  // Mobile carousel state
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Detect mobile viewport
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Navigation handlers
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayTestimonials.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === displayTestimonials.length - 1 ? 0 : prev + 1));
  };
  
  // Swipe gesture handling
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      handlePrevious();
    } else if (info.offset.x < -swipeThreshold) {
      handleNext();
    }
  };

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
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="gradient-text-cyan-purple">Client Testimonials</span>
          </motion.h2>
          <motion.p 
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 text-center"
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

        {/* Testimonials Display or Empty State */}
        {displayTestimonials.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative mb-8"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 1, delay: 0.2 }}
            >
              <motion.div
                className="absolute inset-0 bg-chart-1/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Quote className="h-20 w-20 text-chart-1 relative z-10" />
            </motion.div>
            
            <motion.h3
              className="font-display text-2xl font-bold mb-3 gradient-text-cyan-magenta"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              No Testimonials Yet
            </motion.h3>
            
            <motion.p
              className="text-muted-foreground text-center max-w-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              We're building amazing relationships with our clients. Check back soon to see what they have to say!
            </motion.p>
          </motion.div>
        ) : isMobile ? (
          // Mobile: Single testimonial with swipe navigation
          <div className="relative max-w-full mx-auto px-4">
            <div className="overflow-hidden">
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="cursor-grab active:cursor-grabbing"
              >
                <TestimonialCard testimonial={displayTestimonials[currentIndex]} isMobile={true} />
              </motion.div>
            </div>
            
            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={handlePrevious}
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-full glass backdrop-blur-xl flex items-center justify-center hover:bg-chart-1/20 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {/* Dots indicator */}
              <div className="flex gap-2">
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex ? 'w-8 bg-chart-1' : 'w-2 bg-muted-foreground/30'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={handleNext}
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-full glass backdrop-blur-xl flex items-center justify-center hover:bg-chart-1/20 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          // Desktop: Grid layout with all testimonials
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {displayTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TestimonialCard testimonial={testimonial} isMobile={false} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, isMobile }: { testimonial: DisplayTestimonial; isMobile: boolean }) {
  const rating = Math.min(5, Math.max(1, Math.round(testimonial.rating)));
  return (
    <motion.div
      className={`relative flex-shrink-0 ${
        isMobile ? 'w-full' : 'w-full sm:w-[400px] md:w-[450px] lg:w-[500px]'
      } p-6 glass rounded-xl backdrop-blur-xl overflow-hidden`}
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
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
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