// lib/font-sizes.ts

export type FontSizeOption = {
  id: string;
  name: string;
  value: string; // La valeur de la taille de police en rem, px, etc.
};

export const fontSizes: FontSizeOption[] = [
  {
    id: "small",
    name: "Petite",
    value: "0.875rem", // 14px
  },
  {
    id: "medium",
    name: "Moyenne",
    value: "1rem", // 16px (taille de base par défaut)
  },
  {
    id: "large",
    name: "Grande",
    value: "1.125rem", // 18px
  },
  {
    id: "extra-large",
    name: "Très Grande",
    value: "1.25rem", // 20px
  },
];