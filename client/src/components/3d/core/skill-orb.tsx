import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface SkillOrbProps {
  position: [number, number, number];
  name: string;
  color: string;
  proficiency: number;
}

export function SkillOrb({ position, name, color, proficiency }: SkillOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current && textRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
      
      // Rotate the orb
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      
      // Make text face camera
      textRef.current.lookAt(state.camera.position);
    }
  });

  const scale = 0.3 + (proficiency / 100) * 0.4;

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Text
        ref={textRef}
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {name}
      </Text>
    </group>
  );
}
