import { z } from "zod"

// Statuts possibles d’un rapport
export enum RapportStatut {
  BROUILLON = "brouillon",
  PUBLIE = "publié",
  APPRUVE = "approuvé",
  REJETE = "rejeté",
  ARCHIVE = "archivé",
}

// Schéma Zod du rapport
export const rapportSchema = z.object({
  id: z.string().min(1, "L'id est requis"),
  auteur: z.string().min(1, "L'auteur est requis"),
  role: z.string().optional(),
  contenu: z.string().min(1, "Le contenu est requis"),
  dateCreation: z.preprocess(
    (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
    z.date({ invalid_type_error: "dateCreation doit être une date valide" })
  ),
  dateModification: z
    .preprocess(
      (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : undefined),
      z.date().optional()
    )
    .optional(),
  statut: z.nativeEnum(RapportStatut).optional(),
})

// Type complet d’un rapport, dérivé du schéma
export type Rapport = z.infer<typeof rapportSchema>

// Type simplifié pour le formulaire (pas d’id, ni de dates générées automatiquement)


// Schéma pour le formulaire uniquement (sans id, dates)
export const rapportFormSchema = rapportSchema.omit({
  id: true,
  dateCreation: true,
  dateModification: true,
})

export type RapportFormData = z.infer<typeof rapportFormSchema>
