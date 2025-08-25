import { z } from "zod";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// Pour réutiliser le statut et autres si besoin

// Schéma pour un élément de paiement (similaire aux articles mais pour le paiement)
export const paiementItemSchema = z.object({
  mode: z.enum(["Espèces", "Carte Bancaire", "Virement", "Chèque", "Autre"]),
  montant: z.number().min(0.01, "Le montant du paiement doit être positif."),
  datePaiement: z.date().default(() => new Date()), // Date du paiement
  reference: z.string().optional().or(z.literal("")), // Numéro de transaction, référence chèque, etc.
});

// Schéma pour les données d'une transaction de caisse
export const caisseTransactionSchema = z.object({
  reservationId: z.string().min(1, "L'ID de la réservation est requis."),
  // Les détails de la réservation peuvent être passés ou récupérés
  // Pour l'affichage, vous pourriez avoir un objet plus détaillé ici si nécessaire
  // reservationDetails: BookingFormSchema.partial().optional(), // Ou un sous-ensemble

  montantTotalDu: z.number().min(0, "Le montant total dû ne peut être négatif."),
  montantDejaPaye: z.number().min(0, "Le montant déjà payé ne peut être négatif.").default(0),

  // Liste des paiements effectués pour cette transaction
  paiements: z.array(paiementItemSchema).default([]),

  // Status de la caisse (e.g., "Ouverte", "Fermée", "En attente de paiement")
  statutCaisse: z.enum(["Ouverte", "Soldée", "Partiellement Payée", "Annulée"]).default("Ouverte"),

  dateTransaction: z.date().default(() => new Date()), // Date de la clôture/transaction
  notes: z.string().optional().or(z.literal("")),
});

export type PaiementItem = z.infer<typeof paiementItemSchema>;
export type CaisseTransactionFormData = z.infer<typeof caisseTransactionSchema>;