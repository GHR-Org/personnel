import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const menuItemSchema = z.object({
  libelle: z.string().min(1, "Le nom du plat est requis"),
  description: z.string().optional(),
  etablissement_id: z.number(), // Cet ID sera probablement défini par le composant parent, pas par l'utilisateur du formulaire
  image_url: z
    .any()
    .refine((value) => {
      if (!value) return true;
      if (typeof value === 'string') return true;
      if (value instanceof File) return value.size <= MAX_FILE_SIZE;
      return false;
    }, `La taille de l'image doit être inférieure à ${MAX_FILE_SIZE / (1024 * 1024)}MB.`)
    .refine((value) => {
      if (!value || typeof value === 'string') return true;
      if (value instanceof File) return ACCEPTED_IMAGE_TYPES.includes(value.type);
      return false;
    }, "Seuls les formats .jpg, .jpeg, .png et .webp sont acceptés.")
    .nullable()
    .optional(),
  
  type: z.enum(["FastFood", "Boisson", "Dessert", "Entrée", "Autre"]),
  
  // Rendre 'ingredients' et 'tags' optionnels en entrée, mais toujours des tableaux en sortie
  ingredients: z.array(z.string()).optional().default([]).optional(), 
  tags: z.array(z.string()).optional().default([]).optional(),
  
  prix: z.number().min(0, "Le prix doit être positif"),
  disponible: z.boolean(),
  
  // Rendre 'calories', 'prep_minute', 'note' optionnels et gérer null/0 comme undefined
  calories: z.number().int().min(0).optional().nullable().transform(e => ( e === 0) ? undefined : e),
  prep_minute: z.number().int().min(0).optional().nullable().transform(e => ( e === 0) ? undefined : e),
  note: z.number().int().min(1, "La note doit être entre 1 et 5").max(5, "La note doit être entre 1 et 5").optional().nullable().transform(e => (e === 0) ? undefined : e),
  livrable: z.boolean(),
});

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;