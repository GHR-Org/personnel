/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MiniMapCamera } from "./MiniMapCamera";
import { ControlledOrbit } from "./ControlledOrbit";
import { useFurnitureStore } from "@/lib/stores/furniture-store";
import { motion, AnimatePresence } from "framer-motion";
import { RoomLoader } from "../skeleton/RoomLoader";
import { ScenePreviewContent } from "./ScenePreview";
import { PreviewModal } from "./PreviewModal";
import { Environment, useProgress } from "@react-three/drei"; // <-- Import de Environment

export default function RoomBuilderCanvas() {
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const furniture = useFurnitureStore((state) => state.furniture);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const loadFromStorage = useFurnitureStore((s) => s.loadFromDatabase);
  const { progress, loaded } = useProgress();

  const handleClick = (id: number) => {
    const item = furniture.find((f) => f.id === id);
    if (item) useFurnitureStore.getState().openDrawer(item);
  };

  // Attendre que tous les assets soient chargés
  useEffect(() => {
    if (loaded > 0 && progress === 100) {
      const timeout = setTimeout(() => setFullyLoaded(true), 300); // petite latence pour le fade
      return () => clearTimeout(timeout);
    }
  }, [progress, loaded]);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Sécurité : WebGL context lost
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const handleLost = (e: Event) => {
      // gestion d'erreur si l'affichage ne s'effectue pas
      e.preventDefault();
      console.warn("⚠️ WebGL context lost");
    };

    canvas.addEventListener("webglcontextlost", handleLost, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleLost);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <AnimatePresence mode="wait">
        {!fullyLoaded && (
          <motion.div
            key="loader"
            className="absolute inset-0 z-10 flex items-center justify-center bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <RoomLoader progress={progress} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key="canvas"
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: fullyLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Canvas
          camera={{ position: [10, 10, 10], fov: 50 }}
          gl={{
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
            antialias: true,
          }}
        >
          {/* Ajout du composant Environment ici */}
          <Environment preset="city" />

          <MiniMapCamera />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} />
          <ControlledOrbit />
          <ScenePreviewContent onClick={handleClick} selectedId={selectedId} />
        </Canvas>
      </motion.div>

      <PreviewModal />
    </div>
  );
}