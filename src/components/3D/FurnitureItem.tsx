import { FurnitureType } from "@/types/table";
import { useGLTF } from "@react-three/drei";
import React from "react";

interface Props {
  position: [number, number, number];
  type: FurnitureType // Ajoute d'autres types si nécessaire
}

export function FurnitureItem({ position, type }: Props) {
  // Charge le modèle glTF en fonction du type
  const gltf = useGLTF(`/models/${type}.glb`); // Assure-toi d'avoir ces fichiers dans /public/models/

  return (
    <primitive
      object={gltf.scene}
      position={position}
      scale={type === "table" ? 1 : 0.8} // ajuste l'échelle selon le modèle
      castShadow
      receiveShadow
    />
  );
}
