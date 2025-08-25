/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/MenuItem.ts

export type MenuItemType = "FastFood" | "Boisson" | "Dessert" | "Entrée" | "Autre";

export interface MenuItem {
  id: number;
  libelle: string;
  description?: string;
  image_url?: any; // Ou `string` si toujours une URL, ou `File | string` si parfois un File
  type: MenuItemType; 
  ingredients?: string[]; 
  prix: number;
  disponible: boolean;
  tags?: string[]; 
  calories?: number; // Rendu optionnel pour correspondre au schéma transformé
  prep_minute?: number; // Rendu optionnel
  note?: number; // Rendu optionnel
  etablissement_id: number;
  // Si votre API renvoie aussi ces champs, ajoutez-les ici :
  created_at?: string;
  updated_at?: string;
}