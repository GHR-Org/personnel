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
  id: string;
  name?: string;
  type: FurnitureType;
  position: [number, number, number];
  rotation?: [number, number, number];
  status: TableStatus;
}

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  position: [number, number, number];
  rotation: [number, number, number];
  name?: string;
  status: TableStatus;
}
