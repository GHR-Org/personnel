/* eslint-disable @typescript-eslint/no-unused-vars */
// components/3D/RoomPreloader.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { ScenePreviewContent } from "./ScenePreview"; // Assurez-vous d'importer les composants qui chargent les assets
import { useFurnitureStore } from "@/lib/stores/furniture-store"; // Si nécessaire pour initialiser le store de meubles pour le chargement

// Ce composant est responsable de lancer le chargement des assets 3D
// et de remonter la progression au parent. Il ne rend rien de visible.
export function RoomPreloader({ onProgressChange }: { onProgressChange: (p: number) => void }) {
  const { progress } = useProgress();
  const loadFromStorage = useFurnitureStore((s) => s.loadFromStorage);

  useEffect(() => {
    // Remonte la progression au composant parent (loading.tsx)
    onProgressChange(progress);
  }, [progress, onProgressChange]);

  useEffect(() => {
    // Charger les données du store, qui peuvent déclencher le chargement des modèles
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    // Le Canvas doit être présent pour que useProgress fonctionne,
    // mais il peut être caché ou de taille minimale.
    <Canvas style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}>
      {/* Les composants qui chargent réellement les assets 3D */}
      {/* Ils doivent être ici pour que useProgress puisse les détecter */}
      <ScenePreviewContent onClick={function (id: string): void {
              throw new Error("Function not implemented.");
          } } /> 
      {/* Ajoutez ici d'autres composants de scène qui chargent des assets, si besoin.
          Par exemple, si MiniMapCamera ou ControlledOrbit chargent des assets complexes. */}
    </Canvas>
  );
}