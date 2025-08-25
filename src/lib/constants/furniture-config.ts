import { FurnitureType } from "../stores/room-store";

// lib/constants/furniture-config.ts
export interface FurnitureConfig {
  scale: number;
  rotation?: [number, number, number]; // si tu veux aussi gérer ça
}

export const furnitureConfigMap: Record<FurnitureType, FurnitureConfig> = {
  chaise: { scale: 1.2 },
  table: { scale: 1.4 },
  couple: { scale: 0.002 },
  caisse: { scale: 0.6 },
  family: { scale: 1.4 },
  exterieur: { scale: 1 },
};

export const defaultScaleMap: Record<string, number> = {
  chaise: 1.2,
  table: 1.4,
  couple: 0.002,
  caisse: 0.6,
  family: 1.4,
  exterieur: 1.2,
};

