import { z } from "zod";

// Schéma pour le formulaire d'encaissement
export const encaissementFormSchema = z.object({
  description: z.string().min(3, "La description est requise et doit contenir au moins 3 caractères."),
  amount: z.coerce.number().min(1, "Le montant doit être supérieur à zéro."), // Utilisation de coerce.number pour gérer les inputs texte
  paymentMethod: z.enum(["Espèces", "Carte Bancaire", "Virement", "Chèque"], {
    errorMap: () => ({ message: "Veuillez sélectionner une méthode de paiement valide." }),
  }),
  recordedBy: z.string().min(2, "Le nom de l'enregistreur est requis."),
  // Pour la date et l'heure, nous pourrions les générer automatiquement au moment de l'enregistrement,
  // ou les laisser comme champs optionnels si la caissière doit les ajuster.
  // Pour cet exemple, nous les générerons automatiquement dans le composant.
});

// Schéma pour le formulaire de décaissement
export const decaissementFormSchema = z.object({
  description: z.string().min(3, "La description est requise et doit contenir au moins 3 caractères."),
  amount: z.coerce.number().min(1, "Le montant doit être supérieur à zéro."),
  paymentMethod: z.enum(["Espèces", "Virement", "Chèque"], { // Généralement pas de "Carte Bancaire" pour décaissement direct de caisse
    errorMap: () => ({ message: "Veuillez sélectionner une méthode de paiement valide." }),
  }),
  recordedBy: z.string().min(2, "Le nom de l'enregistreur est requis."),
});

// Types dérivés des schémas
export type EncaissementFormData = z.infer<typeof encaissementFormSchema>;
export type DecaissementFormData = z.infer<typeof decaissementFormSchema>;