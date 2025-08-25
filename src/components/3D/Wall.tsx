import { useTexture } from "@react-three/drei";

interface WallProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function Wall({ position, rotation = [0, 0, 0] }: WallProps) {
  const [colorMap, normalMap, roughnessMap] = useTexture([
    "/textures/wall_diffuse.jpg",
    "/textures/wall_normal.jpg",
    "/textures/wall_roughness.jpg",
  ]);

  return (
    <mesh position={position} rotation={rotation} receiveShadow castShadow>
      <boxGeometry args={[40, 15, 1]} /> {/* Largeur 40, hauteur 10, épaisseur 1 */}
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        roughness={1}
      />
    </mesh>
  );
}
