/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useRef } from "react";
import { Html, useGLTF, useProgress } from "@react-three/drei";
import { Mesh } from "three";
import { useFurnitureStore, defaultScaleMap } from "@/lib/stores/furniture-store"; // <-- nouveau store fusionné
import { FurnitureItem } from "@/types/table";

interface FurnitureObjectProps {
  item: FurnitureItem;
  showLabelsOnly?: boolean;
}

export function FurnitureObject({ item, showLabelsOnly = false }: FurnitureObjectProps) {
  const meshRef = useRef<Mesh>(null);
   const { progress, active, errors } = useProgress();

  // Utilisation sélective du store centralisé
  const selected = useFurnitureStore((state) => state.selected);
  const setSelected = useFurnitureStore((state) => state.setSelected);

  // Chargement du modèle GLTF selon le type
  const model = useGLTF(`/models/${item.type}.glb`);

  // Clone la scène avec mise à l’échelle, et marque les objets comme cliquables
  const clonedScene = useMemo(() => {
    const clone = model.scene.clone(true);

    const scale = defaultScaleMap[item.type] ?? 1;
    clone.scale.set(scale, scale, scale);

    clone.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
      ;(child as any).userData.clickable = true;
    });

    return clone;
  }, [model, item.type]);

  return (
    <group position={item.position} rotation={item.rotation}>
      {/* Affichage du loading tant que le modèle charge */}
      {progress < 100 ? (
        <Html center>
          <div className="loading-indicator">
            Chargement {progress.toFixed(0)}%
          </div>
        </Html>
      ) : (
        
      
      <primitive
        object={clonedScene}
        onClick={(e: { stopPropagation: () => void; }) => {
          e.stopPropagation();
          console.log("Clic sur meuble ID:", item.id);
          setSelected(item.id);
        }}
      />
      )}
      {item.name && !showLabelsOnly && (
        <Html center distanceFactor={10}>
          <div
            style={{
              background: "rgba(255,255,255,0.8)",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#000",
              fontWeight: "bold",
              userSelect: "none",
              textAlign : "center"
            }}
          >
            {item.name}
          </div>
        </Html>
      )}
      {/* Surlignage quand sélectionné */}
      {selected === item.id && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      )}
      
    </group>
  );
}
