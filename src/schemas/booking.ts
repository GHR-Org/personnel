// schemas/booking.ts
import { z } from "zod";

export const bookingFormSchema = z.object({
  date_arrivee: z.string().min(1, "Date d'arrivée requise"),
  date_depart: z.string().min(1, "Date de départ requise"),
  duree: z.coerce.number().min(1, "Durée requise"),
  statut: z.string().min(1, "Statut requis"),
  nb_personnes: z.coerce.number().min(1, "Nombre de personnes requis"),
  client_id: z.number().optional(), // Sera généré pour l'exemple
  chambre_id: z.coerce.number().min(1, "Chambre requise"),
  etablissement_id: z.coerce.number().min(1, "Établissement requis"),
  mode_checkin: z.string().optional(),
  code_checkin: z.string().nullable().optional(),
  
  // NOUVEAU: Ajoutez le nom du client ici
  clientName: z.string().min(1, "Nom du client requis").optional(), 
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;