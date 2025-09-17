// schemas/reservation.ts

import { ModeCheckin } from "@/lib/enum/ModeCheckin";
import { ModePaiment } from "@/lib/enum/ModePaiment";
import { ReservationStatut } from "@/lib/enum/ReservationStatus";
import { z } from "zod";


// Schéma pour un article
export const ArticleItemSchema = z.object({
  nom: z.string().min(1, "Le nom de l'article est requis."),
  quantite: z.number().int().min(1, "La quantité doit être d'au moins 1."),
  prix: z.number().min(0, "Le prix ne peut pas être négatif."),
  total: z.number().min(0),
});

// Schéma pour les arhee
export const arheeSchema = z.object({
  montant: z.number().min(0, "Le montant ne peut pas être négatif.").default(0),
  date_paiement: z.string().optional(),
  mode_paiement: z.nativeEnum(ModePaiment).optional(),
  commentaire: z.string().optional(),
});

// Schéma principal de la réservation
export const BookingManuelSchema = z.object({
  id: z.number(), // Pour les mises à jour, l'ID peut être fourni
  client_id: z.number().int().positive("L'id du client est requis"), // L'ID du client est géré séparément
  date_arrivee: z.string().min(1, "La date d'arrivée est requise."),
  date_depart: z.string().min(1, "La date de départ est requise."),
  duree: z.number().min(1, "La durée doit être d'au moins 1 nuit."),
  nbr_adultes: z.number().min(1, "Il doit y avoir au moins 1 adulte."),
  nbr_enfants: z.number().default(0),
  status: z.nativeEnum(ReservationStatut).default(ReservationStatut.EN_ATTENTE),
  chambre_id: z.number().int().positive("Veuillez sélectionner une chambre."),
  mode_checkin: z.nativeEnum(ModeCheckin).default(ModeCheckin.MANUELLE),
  code_checkin: z.string().optional(),
  
  articles: z.array(ArticleItemSchema).optional(),
  arhee: arheeSchema.optional(),
});

export type BookingFormInputs = z.infer<typeof BookingManuelSchema>;
export type BookingManuel = z.infer<typeof BookingManuelSchema>;

export const UpdateBookingStatutDataSchema = z.object({
  status: z.nativeEnum(ReservationStatut),
  personnel_id: z.number().int().positive("L'ID du personnel est requis pour la traçabilité."),
});
export type UpdateBookingStatutData = z.infer<typeof UpdateBookingStatutDataSchema>;
export const UpdateBookingDataSchema = z.object({
  date_arrivee: z.string().optional(),
  date_depart: z.string().optional(),
  duree: z.number().optional(),
  nbr_adultes: z.number().optional(),
  nbr_enfants: z.number().optional(),
  status: z.nativeEnum(ReservationStatut).optional(),
  chambre_id: z.number().optional(),
  mode_checkin: z.nativeEnum(ModeCheckin).optional(),
  code_checkin: z.string().optional(),
  articles: z.array(ArticleItemSchema).optional(),
  arhee: arheeSchema.optional(),
});

// Type TypeScript déduit pour la mise à jour partielle
export type UpdateBookingData = z.infer<typeof UpdateBookingDataSchema>;