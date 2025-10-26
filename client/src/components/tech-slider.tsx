import { motion } from "framer-motion";
import { useState } from "react";

const technologies = [
  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "AWS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
  { name: "React Native", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "GraphQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "Three.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" },
  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Redis", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
];

// Duplicate the array for seamless infinite scroll
const duplicatedTechs = [...technologies, ...technologies];

export function TechSlider() {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const handleClick = (techName: string) => {
    setSelectedTech(techName);
    setTimeout(() => setSelectedTech(null), 2000); // Hide after 2 seconds
  };

  return (
    <div className="relative w-full overflow-hidden py-2 h-[80px]">
      <motion.div
        className="flex gap-8 absolute left-0"
        style={{ width: 'max-content' }}
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
          {duplicatedTechs.map((tech, index) => (
            <button
              key={`${tech.name}-${index}`}
              onClick={() => handleClick(tech.name)}
              className="flex flex-col items-center justify-center w-[80px] h-[80px] group relative cursor-pointer"
            >
              <img 
                src={tech.logo} 
                alt={tech.name}
                className={`w-16 h-16 object-contain group-hover:scale-125 transition-transform duration-300 drop-shadow-lg ${
                  tech.name === 'Three.js' || tech.name === 'Next.js' ? 'dark:filter dark:invert' : ''
                }`}
              />
              {selectedTech === tech.name && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-10 whitespace-nowrap text-sm font-medium text-chart-1 bg-background/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-chart-1/30"
                >
                  {tech.name}
                </motion.div>
              )}
            </button>
          ))}
      </motion.div>
    </div>
  );
}
