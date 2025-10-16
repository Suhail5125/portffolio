import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { SkillOrb } from "./skill-orb";
import type { Skill } from "@shared/schema";
import { Suspense } from "react";

interface SkillsSceneProps {
  skills: Skill[];
}

export function SkillsScene({ skills }: SkillsSceneProps) {
  // Arrange skills in orbital pattern
  const getOrbPosition = (index: number, total: number): [number, number, number] => {
    const radius = 4;
    const angle = (index / total) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(angle * 2) * 1.5;
    return [x, y, z];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Frontend":
        return "#00d9ff";
      case "Backend":
        return "#ff00ff";
      case "3D/Graphics":
        return "#a855f7";
      case "Tools":
        return "#22c55e";
      default:
        return "#f59e0b";
    }
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
          
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00d9ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />

          {/* Skills as 3D orbs */}
          {skills.map((skill, index) => (
            <SkillOrb
              key={skill.id}
              position={getOrbPosition(index, skills.length)}
              name={skill.name}
              color={getCategoryColor(skill.category)}
              proficiency={skill.proficiency}
            />
          ))}

          {/* Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
            maxDistance={15}
            minDistance={5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
