export enum TableStatus{
    OCCUPE = "Occupé",
    LIBRE = "Libre",
    RESERVEE = "Reservé",
    NETTOYAGE = "Nettoyage",
    HORS_SERVICE = "Hors-service"
}

export type FurnitureType =
  | "chaise"
  | "table"
  | "couple"
  | "caisse"
  | "family"
  | "exterieur";

  export interface FurnitureData {
  id: number;
  name?: string;
  type: FurnitureType;
  position: [number, number, number];
  rotation?: [number, number, number];
  status: TableStatus;
}

export interface FurnitureItem {
  id: number;
  type: FurnitureType;
  position: [number, number, number];
  rotation: [number, number, number] | undefined;
  name?: string;
  status: TableStatus;
}

export interface FurnitureApiPostData {
  id?: number; // L'ID peut être optionnel lors de la création
  nom: string;
  type: FurnitureType;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  status: TableStatus;
  client_id: number;
  etablissement_id: number;
}

export interface FurnitureApiData {
  id: number;
  nom: string;
  type: FurnitureType;
  // Les propriétés de position et de rotation sont plates
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  status: TableStatus;
  client_id: number;
  etablissement_id: number;
}