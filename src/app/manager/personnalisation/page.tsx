
"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect } from "react";
import { FurniturePanel } from "@/components/3D/FurniturePanel";
import * as THREE from "three";
import { FurnitureInfoPanel } from "@/components/3D/SelectedFurnitureInfo";
import { useFurnitureStore } from "@/lib/stores/furniture-store";


const RoomBuilderCanvas = dynamic(() => import("@/components/3D/RoomBuilderCanvas"), {
  ssr: false,
});

export default function PersonalisationPage() {
  const addFurniture = useFurnitureStore((state) => state.addFurniture);
  const loadFromStorage = useFurnitureStore((state) => state.loadFromDatabase);
  const furniture = useFurnitureStore((state) => state.furniture);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);
  console.log("Furniture list", furniture);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // indispensable pour autoriser le drop
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("furniture-type") as "chaise" | "table" | "caisse";
      if (!type) return;

      const canvas = document.querySelector("canvas");
      const camera = window.__three_camera as THREE.PerspectiveCamera; // exposé depuis RoomBuilderCanvas
      const renderer = window.__three_renderer as THREE.WebGLRenderer;

      if (!canvas || !camera || !renderer) return;

      const bounds = canvas.getBoundingClientRect();
      const x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      const y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectPoint);

      if (intersectPoint) {
        addFurniture({
          type,
          position: [intersectPoint.x, 0, intersectPoint.z],
          name: "TABLE N°X",
        });
      }
    },
    [addFurniture]
  );

  return (
    <div className="flex h-screen">
      {/* Panneau latéral avec les meubles */}
      <div className="w-1/5 bg-muted border-r p-4">
        <FurniturePanel />
      </div>

      {/* Zone de drop contenant le canvas */}
      <div className="flex-1 relative" onDragOver={handleDragOver} onDrop={handleDrop}>
        <Suspense fallback={<div>Chargement du canvas...</div>}>
          <RoomBuilderCanvas />
        </Suspense>
      </div>
      <div className="w-64 bg-muted border-l p-4 overflow-auto">
        <FurnitureInfoPanel />
      </div>
    </div>
  );
}


