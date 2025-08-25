/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGLTF } from "@react-three/drei";
import { FurnitureType } from "@/types/table";

export function useFurnitureInstances(): Record<FurnitureType, any> {
  const chaise = useGLTF("/models/chaise.glb");
  const table = useGLTF("/models/table.glb");
  const couple = useGLTF("/models/couple.glb");
  const caisse = useGLTF("/models/caisse.glb");
  const family = useGLTF("/models/family.glb");
  const exterieur = useGLTF("/models/exterieur.glb");

  return {
    chaise,
    table,
    couple,
    caisse,
    family,
    exterieur,
  };
}
