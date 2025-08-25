/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SceneObjects } from "@/components/3D/SceneObjects";
import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { ControlledOrbit } from "./ControlledOrbit";
import { MiniMapCamera } from "./MiniMapCamera";
import { MiniCompass } from "./MiniCompas";
import { MiniCompassOverlay } from "./MiniCompassOverlay";
import { useFurnitureStore } from "@/lib/stores/furniture-store";
import { FurnitureType } from "@/types/table";

function DropHandler() {
  const { camera, gl } = useThree();
  const addFurniture = useFurnitureStore((state) => state.addFurniture);

  const loadFromStorage = useFurnitureStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    // Ici, e est un DragEvent natif du DOM (window.DragEvent)
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();

      // Pour accéder à dataTransfer, il faut caster le type du target correctement
      const dt = e.dataTransfer;
      if (!dt) return;

      const type = dt.getData("furniture-type") as FurnitureType;
      if (!type) return;

      const bounds = (e.target as HTMLElement).getBoundingClientRect();
      const x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      const y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

      // Projection dans la scène 3D
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectPoint);

      if (intersectPoint) {
        addFurniture({
          type,
          position: [intersectPoint.x, 0, intersectPoint.z],
        });
      }
    };

    const handleDragOver = (e: DragEvent) => e.preventDefault();

    const dom = gl.domElement;
    dom.addEventListener("drop", handleDrop);
    dom.addEventListener("dragover", handleDragOver);

    return () => {
      dom.removeEventListener("drop", handleDrop);
      dom.removeEventListener("dragover", handleDragOver);
    };
  }, [camera, gl, addFurniture]);

  return null;
}

export default function RoomBuilderCanvas() {
  return (
      <div className="w-full h-full">
      <Canvas
        className="w-full h-full"
        camera={{ position: [10, 10, 10], fov: 50 }}
        gl={{ toneMappingExposure: 1.5 }}
      >
        <MiniMapCamera />
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} />
        <ControlledOrbit />
        <SceneObjects />
        <DropHandler />
        
        <SceneObjects />
        
      </Canvas>
      {/* <MiniCompassOverlay /> */}
    </div>
        

    
  );
}
