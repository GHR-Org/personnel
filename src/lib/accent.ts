// lib/accents.ts

export type AccentColor = {
  id: string;
  name: string;
  colors: { [key: string]: string }; // Variables CSS et leurs valeurs
};

// Définissez vos différentes options de couleurs d'accentuation
export const accentColors: AccentColor[] = [
  {
    id: "blue",
    name: "Bleu",
    colors: {
      "--accent": "222.2 47.4% 11.2%", // Base HSL (noir très foncé)
      "--accent-foreground": "210 20% 98%", // Texte clair
      // Pour les tons clairs/sombres de l'accentuation principale
      "--accent-base": "220 80% 50%", // Un bleu vif
      "--accent-lighter": "220 80% 60%", // Un bleu plus clair
      "--accent-darker": "220 80% 40%", // Un bleu plus foncé
    },
  },
  {
    id: "green",
    name: "Vert",
    colors: {
      "--accent": "150 60% 20%",
      "--accent-foreground": "150 100% 98%",
      "--accent-base": "150 80% 40%",
      "--accent-lighter": "150 80% 50%",
      "--accent-darker": "150 80% 30%",
    },
  },
  {
    id: "purple",
    name: "Violet",
    colors: {
      "--accent": "270 60% 20%",
      "--accent-foreground": "270 100% 98%",
      "--accent-base": "270 80% 50%",
      "--accent-lighter": "270 80% 60%",
      "--accent-darker": "270 80% 40%",
    },
  },
  // Ajoutez d'autres couleurs ici si vous le souhaitez
  {
    id: "orange",
    name: "Orange",
    colors: {
      "--accent": "30 80% 20%",
      "--accent-foreground": "30 100% 98%",
      "--accent-base": "30 80% 50%",
      "--accent-lighter": "30 80% 60%",
      "--accent-darker": "30 80% 40%",
    },
  },
];