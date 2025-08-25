/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Ceiling() {
  const [colorMap, normalMap, roughnessMap] = useTexture([
    "/textures/ceiling_diffuse.jpg",
    "/textures/ceiling_normal.jpg",
    "/textures/ceiling_roughness.jpg",
  ]);

  return (
    <mesh position={[0, 10, 0]} raycast={() => null} receiveShadow castShadow>
      {/* Largeur et profondeur similaires au plan, hauteur 1 */}
      <boxGeometry args={[40, 1, 40]} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        roughness={1}
      />
    </mesh>
  );
}
