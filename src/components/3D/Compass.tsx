import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export function Compass() {
  const groupRef = useRef<THREE.Group>(null);

  // On fait tourner doucement la boussole pour voir les axes (optionnel)
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Axes X, Y, Z */}
      <mesh position={[1, 0, 0]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshBasicMaterial color="green" />
      </mesh>
      <mesh position={[0, 0, 1]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshBasicMaterial color="blue" />
      </mesh>

      {/* Lettres des axes */}
      <Html position={[1.3, 0, 0]}><div style={{ color: "red" }}>X</div></Html>
      <Html position={[0, 1.3, 0]}><div style={{ color: "green" }}>Y</div></Html>
      <Html position={[0, 0, 1.3]}><div style={{ color: "blue" }}>Z</div></Html>
    </group>
  );
}
