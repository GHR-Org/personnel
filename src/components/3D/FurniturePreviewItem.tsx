/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Html, useGLTF, useCursor } from "@react-three/drei";
import * as THREE from "three";
import { TableStatus } from "@/types/table";

interface Props {
  id: string;
  name?: string;
  type: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  onClick?: (id: string) => void;
  selectedId?: string;
  status : TableStatus
}

// Définition des échelles par type (exemple)
const defaultScaleMap: Record<string, number> = {
  chaise: 1.2,
  table: 1.4,
  couple: 0.0035,
  caisse: 0.6,
  family: 0.02,
  exterieur: 1.8,
};
const getStatusStyles = (status: TableStatus) => {
  switch (status) {
    case TableStatus.OCCUPE:
      return {
        background: "#ef4444", // Rouge pour Occupé
        color: "#fff",
      };
    case TableStatus.LIBRE:
      return {
        background: "#22c55e", // Vert pour Libre
        color: "#fff",
      };
    case TableStatus.RESERVEE:
      return {
        background: "#f97316", // Orange pour Réservé
        color: "#fff",
      };
    case TableStatus.NETTOYAGE:
      return {
        background: "#3b82f6", // Bleu pour Nettoyage
        color: "#fff",
      };
    case TableStatus.HORS_SERVICE:
      return {
        background: "#6b7280", // Gris pour Hors-service
        color: "#fff",
      };
    default:
      return {
        background: "rgba(255,255,255,0.8)", // Style par défaut
        color: "#000",
      };
  }
};

export function FurniturePreviewItem({ id, name, type, position, rotation = [0, 0, 0], onClick, selectedId, status }: Props) {
  const gltf = useGLTF(`/models/${type}.glb`);
  const [hovered, setHovered] = useState(false);
  
  
  
  useCursor(hovered);

  // Cloner la scène une fois et appliquer échelle + ombres + clickable
  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const scale = defaultScaleMap[type];
    clone.scale.set(scale, scale, scale);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        (child as any).userData.clickable = true;
      }
    });
    return clone;
  }, [gltf, type]);
   const statusStyles = getStatusStyles(status);

  return (
    <group position={position} rotation={rotation}>
      <primitive
        object={clonedScene}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e: { stopPropagation: () => void; }) => {
          e.stopPropagation();
          onClick?.(id);
        }}
      />
      {name && (
        <Html center distanceFactor={10} zIndexRange={[0, 0]}>
          <div
            style={{
              ...statusStyles,
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "18px",
              color: "#000",
              fontWeight: "bold",
              pointerEvents: "none",
              width: "max-content",
              zIndex : "0"
            }}
          >
            {name}
          </div>
        </Html>
      )}
      {selectedId === id && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      )}
    </group>
  );
}
