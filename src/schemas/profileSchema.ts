// schemas/profileSchema.ts
import { z } from "zod";

export const profileSchema = z.object({
  // Prénom: string, non vide, min 2 caractères, max 50
  prenom: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(50, "Le prénom ne doit pas dépasser 50 caractères."),

  // Nom: string, non vide, min 2 caractères, max 50
  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(50, "Le nom ne doit pas dépasser 50 caractères."),

  // Téléphone: string, optionnel, format téléphone
  telephone: z
    .string()
    .regex(/^(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?){2,4}\d{1,4}$/, "Numéro de téléphone invalide.")
    .optional()
    .or(z.literal("")), // Permet la chaîne vide si optionnel

  // Email: string, format email, non vide, désactivé dans le formulaire mais utile pour le schéma complet
  email: z.string().email("Adresse email invalide."),

  // Poste: string, optionnel, max 100 caractères
  poste: z
    .string()
    .max(100, "Le poste ne doit pas dépasser 100 caractères.")
    .optional()
    .or(z.literal("")), // Permet la chaîne vide si optionnel
});

// Définissez le type TypeScript à partir du schéma Zod
export type ProfileFormValues = z.infer<typeof profileSchema>;