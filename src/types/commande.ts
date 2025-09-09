// src/types/Commande.ts

import { z } from "zod";
import { CommandeSchema } from "@/schemas/commande";

// Type pour les articles dans une commande, en se basant sur le schéma
// Nous ajoutons 'id' car useFieldArray l'utilise
export type ArticleCommandeItem = z.infer<typeof CommandeSchema>["articles"][number] & {
  id?: string;
};

// Type de l'objet de commande complet, basé sur le schéma
export type Commande = z.infer<typeof CommandeSchema>;

export type StatutCommande = "En cours" | "Livrée" | "Annulée";

