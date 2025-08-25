// components/room/SceneObjects.tsx
import { FurnitureObject } from "./FurnitureObject";
import { Floor } from "./Floor";
import { Wall } from "./Wall";
import { Ceiling } from "./Ceiling";
import { useFurnitureStore } from "@/lib/stores/furniture-store";

export function SceneObjects({ showLabelsOnly = false }: { showLabelsOnly?: boolean }) {
  const furniture = useFurnitureStore((state) => state.furniture);

  return (
    <>
      {/* Sol réaliste avec texture */}
      <Floor />
      <Ceiling />
      {/* Mur du fond */}
      <Wall position={[0, 2.5, -20]} rotation={[0, 0, 0]} />

      {/* Mur de devant */}
      <Wall position={[0, 2.5, 20]} rotation={[0, Math.PI, 0]} />

      {/* Mur gauche */}
      <Wall position={[-20, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* Mur droite */}
      <Wall position={[20, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
      {/* Meubles */}
      {furniture.map((item) => (
        <FurnitureObject key={item.id} item={item} showLabelsOnly={showLabelsOnly} />
      ))}
    </>
  );
}
