// src/schemas/Commande.ts

import { z } from "zod";

export const ArticleCommandeSchema = z.object({
  // Le nom de l'article doit être une chaîne non vide
  nom: z.string().min(1, { message: "Le nom de l'article est requis." }),
  // Le prix doit être un nombre positif
  prix: z.number().positive({ message: "Le prix doit être un nombre positif." }),
  // La quantité doit être un nombre entier positif
  quantite: z.number().int().positive({ message: "La quantité doit être un entier positif." }),
  // Le total est calculé, mais nous le validons pour la cohérence
  total: z.number().positive({ message: "Le total doit être un nombre positif." }),
});

export const CommandeSchema = z.object({
  // Chaque commande doit avoir une liste d'articles
  articles: z.array(ArticleCommandeSchema).min(1, {
    message: "Vous devez ajouter au moins un article à la commande.",
  }),
  // On pourrait ajouter d'autres champs ici, comme l'ID de la table, la date, etc.
  table_id: z.number().optional(),
});