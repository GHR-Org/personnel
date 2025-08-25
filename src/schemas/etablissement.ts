import { z } from "zod";

// --- Schéma pour les données d'Etablissement (utilisé pour la validation des entrées) ---
export const etablissementSchema = z.object({
  nom: z.string().min(1, "Le nom de l'établissement est requis."),
  adresse: z.string().min(1, "L'adresse est requise."),
  ville: z.string().min(1, "La ville est requise."),
  pays: z.string().min(1, "Le pays est requis."),
  code_postal: z.string().min(1, "Le code postal est requis."),
  telephone: z.string().min(1, "Le numéro de téléphone est requis.").regex(/^\+?[0-9\s-()]{7,20}$/, "Format de téléphone invalide."), // Exemple de regex pour téléphone
  email: z.string().email("L'email doit être une adresse email valide."),
  site_web: z.string().url("Le site web doit être une URL valide.").optional().or(z.literal("")), // Optionnel ou chaîne vide
  description: z.string().min(10, "La description doit contenir au moins 10 caractères."),
  type_: z.enum(["Hotelerie", "Restauration", "Hotelerie et Restauration"], {
    errorMap: () => ({ message: "Type d'établissement invalide. Choisissez parmi Hotelerie, Restauration, Hotelerie et Restauration." }),
  }),
  // Le mot_de_passe est requis à la création, mais sera souvent omis/non modifiable à la mise à jour
  mot_de_passe: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères.").optional(), // Souvent requis à la création, facultatif à la maj
  logo: z.string().url("L'URL du logo doit être une URL valide.").optional().or(z.literal("")), // Optionnel ou chaîne vide
  statut: z.enum(["Inactive", "Activer"], {
    errorMap: () => ({ message: "Statut invalide. Choisissez parmi Inactive ou Activer." }),
  }),
});

// Type déduit pour les données de formulaire ou de création (sans l'ID)
export type EtablissementFormData = z.infer<typeof etablissementSchema>;

// --- Schéma pour l'Etablissement tel que reçu de l'API (avec l'ID et autres champs générés) ---
export const etablissementApiSchema = etablissementSchema.extend({
  id: z.string().uuid("L'ID doit être un UUID valide."), // L'ID est maintenant une chaîne (UUID)
  // Vous pourriez ajouter ici des champs comme `createdAt`, `updatedAt` si votre API les renvoie
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Type déduit pour l'objet Etablissement complet de l'API
export type EtablissementAPI = z.infer<typeof etablissementApiSchema>;