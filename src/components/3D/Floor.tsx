// components/room/Floor.tsx
"use client"

import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Floor() {
  const [colorMap, normalMap, roughnessMap] = useTexture([
    "/textures/floor_diffuse.jpg",
    "/textures/floor_normal.jpg",
    "/textures/floor_roughness.jpg",
  ]);

  // Répétition pour couvrir tout le sol
  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;

  colorMap.repeat.set(4, 4);
  normalMap.repeat.set(4, 4);
  roughnessMap.repeat.set(4, 4);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
       <planeGeometry args={[40, 40]} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        roughness={1}
      />
    </mesh>
  );
}
