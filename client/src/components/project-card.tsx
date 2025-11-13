import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@shared";
import { useState, useRef } from "react";

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect?: () => void;
}

export function ProjectCard({ project, index, onSelect }: ProjectCardProps) {
  // Ensure technologies is always an array
  const technologies = Array.isArray(project.technologies) 
    ? project.technologies 
    : typeof project.technologies === 'string' 
      ? JSON.parse(project.technologies)
      : [];

  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 300,
    damping: 30
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 300,
    damping: 30
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseXPos = (e.clientX - centerX) / (rect.width / 2);
    const mouseYPos = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.8, rotateX: 20, rotateY: -20, z: -100 }}
      whileInView={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0, z: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 80
      }}
      style={{ 
        transformStyle: "preserve-3d",
        perspective: "1000px",
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        scale: isHovered ? 1.08 : 1,
        y: isHovered ? -25 : 0,
        zIndex: isHovered ? 999 : 1,
        position: "relative",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-testid={`card-project-${project.id}`}
    >
      <Card
        className="group relative overflow-hidden border-0 h-[460px] flex flex-col cursor-pointer"
        onClick={onSelect}
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onKeyDown={(event) => {
          if (!onSelect) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect();
          }
        }}
        style={{
          background: "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(10,10,30,0.95) 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Holographic Border Effect */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: "linear-gradient(45deg, hsl(var(--chart-1)), hsl(var(--chart-2)), hsl(var(--chart-3)), hsl(var(--chart-4)), hsl(var(--chart-1)))",
            backgroundSize: "400% 400%",
            padding: "2px",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          animate={{
            backgroundPosition: isHovered 
              ? ["0% 50%", "100% 50%", "0% 50%"]
              : ["0% 50%", "50% 50%", "0% 50%"],
          }}
          transition={{
            duration: isHovered ? 2 : 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Holographic Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, transparent 0%, rgba(0,255,255,0.1) 25%, transparent 50%, rgba(255,0,255,0.1) 75%, transparent 100%)",
            backgroundSize: "200% 200%",
            opacity: isHovered ? 0.6 : 0.3,
          }}
          animate={{
            backgroundPosition: isHovered
              ? ["0% 0%", "100% 100%", "0% 0%"]
              : ["0% 0%", "50% 50%", "0% 0%"],
          }}
          transition={{
            duration: isHovered ? 4 : 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Scan Lines */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.3) 2px, rgba(0,255,255,0.3) 4px)",
            opacity: isHovered ? 0.2 : 0.1,
          }}
          animate={isHovered ? {
            y: [0, 20, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Glowing Corners */}
        <motion.div 
          className="absolute top-0 left-0 blur-2xl rounded-full"
          style={{
            width: isHovered ? 100 : 80,
            height: isHovered ? 100 : 80,
            background: isHovered 
              ? "radial-gradient(circle, rgba(0,255,255,0.6), transparent)"
              : "radial-gradient(circle, rgba(0,255,255,0.2), transparent)",
          }}
          animate={isHovered ? {
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 blur-2xl rounded-full"
          style={{
            width: isHovered ? 100 : 80,
            height: isHovered ? 100 : 80,
            background: isHovered 
              ? "radial-gradient(circle, rgba(255,0,255,0.6), transparent)"
              : "radial-gradient(circle, rgba(255,0,255,0.2), transparent)",
          }}
          animate={isHovered ? {
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Particle Effects on Hover */}
        {isHovered && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: i % 2 === 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -30],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}

        {/* Content Container */}
        <div className="relative z-20 flex flex-col h-full">
          {/* Project Image with 3D Effect */}
          <div className="relative h-48 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{ scale: 1.15, rotateZ: 2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {project.imageUrl ? (
                <>
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    style={{ filter: "brightness(0.8) contrast(1.2)" }}
                  />
                  {/* Holographic Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-chart-1/30 via-transparent to-chart-2/30 mix-blend-overlay" />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-chart-2/10 to-chart-3/10" />
                  <motion.div 
                    className="text-8xl font-display relative z-10"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--chart-1)), hsl(var(--chart-2)), hsl(var(--chart-3)))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "0 0 30px rgba(0,255,255,0.5)",
                    }}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotateY: [0, 10, 0, -10, 0]
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {project.title[0]}
                  </motion.div>
                </div>
              )}
            </motion.div>
            
            {/* Cyber Grid Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(0,255,255,0.3) 25%, rgba(0,255,255,0.3) 26%, transparent 27%, transparent 74%, rgba(0,255,255,0.3) 75%, rgba(0,255,255,0.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0,255,255,0.3) 25%, rgba(0,255,255,0.3) 26%, transparent 27%, transparent 74%, rgba(0,255,255,0.3) 75%, rgba(0,255,255,0.3) 76%, transparent 77%, transparent)",
                backgroundSize: "50px 50px",
              }}
            />
            
            {/* Floating Action Buttons */}
            <motion.div
              className="absolute top-3 right-3 flex gap-2"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-github-${project.id}`}
                  onClick={(event) => event.stopPropagation()}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button 
                    size="icon" 
                    className="bg-black/50 backdrop-blur-xl border border-chart-1/50 hover:border-chart-1 hover:bg-chart-1/20 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                  >
                    <Github className="h-4 w-4 text-chart-1" />
                  </Button>
                </motion.a>
              )}
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-demo-${project.id}`}
                  onClick={(event) => event.stopPropagation()}
                  whileHover={{ scale: 1.2, rotate: -360 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button 
                    size="icon" 
                    className="bg-black/50 backdrop-blur-xl border border-chart-2/50 hover:border-chart-2 hover:bg-chart-2/20 shadow-[0_0_15px_rgba(255,0,255,0.3)]"
                  >
                    <ExternalLink className="h-4 w-4 text-chart-2" />
                  </Button>
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* Project Info */}
          <motion.div 
            className="px-5 pt-5 pb-4 flex flex-col flex-1"
            animate={isHovered ? {
              backgroundColor: ["rgba(0,0,0,0)", "rgba(0,20,40,0.3)", "rgba(0,0,0,0)"],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            {/* Title with Glitch Effect */}
            <motion.h3
              className="font-display text-xl font-bold mb-3 relative h-[28px] overflow-hidden"
              data-testid={`text-title-${project.id}`}
              style={{
                background: "linear-gradient(90deg, hsl(var(--chart-1)), hsl(var(--chart-2)))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={isHovered ? {
                textShadow: [
                  "0 0 20px rgba(0,255,255,0.5)",
                  "0 0 30px rgba(0,255,255,0.8)",
                  "0 0 20px rgba(0,255,255,0.5)",
                ],
                x: [0, 2, -2, 0],
              } : {
                textShadow: "0 0 20px rgba(0,255,255,0.5)",
              }}
              transition={{
                duration: 0.3,
                repeat: isHovered ? Infinity : 0,
                repeatDelay: 2,
              }}
            >
              <span className="line-clamp-1">{project.title}</span>
            </motion.h3>
            
            <motion.p
              className="text-gray-400 text-sm mb-4 line-clamp-3 h-[60px]"
              data-testid={`text-description-${project.id}`}
              style={{ textShadow: "0 0 10px rgba(255,255,255,0.1)" }}
              animate={isHovered ? {
                color: ["rgb(156, 163, 175)", "rgb(200, 200, 200)", "rgb(156, 163, 175)"],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              {project.description}
            </motion.p>

            {/* Tech Stack - Always Visible with 3D Effect */}
            <div className="mb-3">
              <motion.div 
                className="text-xs mb-2 font-mono uppercase tracking-wider"
                style={{ color: "hsl(var(--chart-1))" }}
                animate={isHovered ? {
                  textShadow: [
                    "0 0 5px rgba(0,255,255,0.5)",
                    "0 0 10px rgba(0,255,255,0.8)",
                    "0 0 5px rgba(0,255,255,0.5)",
                  ],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                Tech Stack
              </motion.div>
              <div className="flex gap-2 overflow-hidden">
                {technologies.slice(0, 3).map((tech: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotateX: -90 }}
                    whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ 
                      delay: i * 0.05,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      rotateZ: 5,
                      y: -2
                    }}
                    data-testid={`badge-tech-${project.id}-${i}`}
                  >
                    <Badge
                      className="relative px-3 py-1 text-xs font-mono border-0 whitespace-nowrap"
                      style={{
                        background: "linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1))",
                        boxShadow: "0 0 10px rgba(0,255,255,0.3), inset 0 0 10px rgba(255,0,255,0.2)",
                        color: "hsl(var(--chart-1))",
                      }}
                    >
                      <span className="relative z-10">{tech}</span>
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
                        }}
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    </Badge>
                  </motion.div>
                ))}
                {technologies.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotateX: -90 }}
                    whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ 
                      delay: 0.15,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      rotateZ: 5,
                      y: -2
                    }}
                  >
                    <Badge
                      className="relative px-3 py-1 text-xs font-mono border-0 whitespace-nowrap"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,0,255,0.15), rgba(0,255,255,0.15))",
                        boxShadow: "0 0 10px rgba(255,0,255,0.3), inset 0 0 10px rgba(0,255,255,0.2)",
                        color: "hsl(var(--chart-2))",
                      }}
                    >
                      <span className="relative z-10">+{technologies.length - 3}</span>
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Holographic CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isHovered ? {
                y: [0, -3, 0],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Button 
                className="w-full relative overflow-hidden border-0 font-mono uppercase tracking-wider"
                size="sm"
                style={{
                  background: isHovered 
                    ? "linear-gradient(135deg, rgba(0,255,255,0.3), rgba(255,0,255,0.3))"
                    : "linear-gradient(135deg, rgba(0,255,255,0.2), rgba(255,0,255,0.2))",
                  boxShadow: isHovered
                    ? "0 0 30px rgba(0,255,255,0.6), inset 0 0 30px rgba(255,0,255,0.3)"
                    : "0 0 20px rgba(0,255,255,0.4), inset 0 0 20px rgba(255,0,255,0.2)",
                  color: "hsl(var(--chart-1))",
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: isHovered ? 1 : 2,
                    repeat: Infinity,
                  }}
                />
                <motion.span 
                  className="relative z-10 flex items-center justify-center gap-2"
                  animate={isHovered ? {
                    letterSpacing: ["0.05em", "0.1em", "0.05em"],
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <span>Access Project</span>
                  <motion.div
                    animate={{ 
                      x: isHovered ? [0, 5, 0] : [0, 3, 0],
                      rotate: isHovered ? [0, 10, 0] : 0,
                    }}
                    transition={{ 
                      duration: isHovered ? 0.8 : 1,
                      repeat: Infinity 
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </motion.div>
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Holographic Shine Sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.3), rgba(255,0,255,0.3), transparent)",
          }}
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      </Card>
    </motion.div>
  );
}
