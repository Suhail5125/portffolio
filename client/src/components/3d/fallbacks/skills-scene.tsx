import { motion } from "framer-motion";
import type { Skill } from "@shared";

interface SkillsSceneProps {
  skills: Skill[];
}

export function SkillsScene({ skills }: SkillsSceneProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Frontend":
        return "hsl(var(--chart-1))";
      case "Backend":
        return "hsl(var(--chart-2))";
      case "3D/Graphics":
        return "hsl(var(--chart-3))";
      case "Tools":
        return "hsl(var(--chart-4))";
      default:
        return "hsl(var(--chart-5))";
    }
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden bg-gradient-to-br from-background via-card/50 to-background flex items-center justify-center relative">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--chart-1)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--chart-1)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Skills arranged in circular pattern */}
      <div className="relative w-full h-full flex items-center justify-center p-12">
        {skills.map((skill, index) => {
          const angle = (index / skills.length) * 2 * Math.PI;
          const radius = 180;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const size = 40 + (skill.proficiency / 100) * 40;

          return (
            <motion.div
              key={skill.id}
              className="absolute flex flex-col items-center gap-2"
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              <motion.div
                className="rounded-full flex items-center justify-center font-bold text-white shadow-lg"
                style={{
                  width: size,
                  height: size,
                  background: getCategoryColor(skill.category),
                  boxShadow: `0 0 20px ${getCategoryColor(skill.category)}`,
                }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
              >
                {skill.name.substring(0, 2)}
              </motion.div>
              <span className="text-xs font-medium whitespace-nowrap bg-card/80 px-2 py-1 rounded backdrop-blur-sm">
                {skill.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
