import React from "react";
import { FurniturePreviewItem } from "@/components/3D/FurniturePreviewItem";
import { Floor } from "./Floor";
import { Ceiling } from "./Ceiling";
import { Wall } from "./Wall";
import { useFurnitureStore } from "@/lib/stores/furniture-store";

interface Props {
  onClick: (id: string) => void;
  selectedId?: string;
}

export function ScenePreviewContent({ onClick, selectedId }: Props) {
  const furniture = useFurnitureStore((state) => state.furniture);

  return (
    <>
      <Floor />
      <Ceiling />
      <Wall position={[0, 2.5, -20]} rotation={[0, 0, 0]} />
      <Wall position={[0, 2.5, 20]} rotation={[0, Math.PI, 0]} />
      <Wall position={[-20, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[20, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} />

      {furniture.map((item) => (
        <FurniturePreviewItem
          key={item.id}
          {...item}
          onClick={onClick}
          selectedId={selectedId}
        />
      ))}
    </>
  );
}
