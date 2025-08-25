// types/booking.ts ou schemas/reservation.ts

import { z } from "zod";
import { ArrhesSchema, ArticleItemSchema, BookingManuelSchema } from "@/schemas/reservation";

export type BookingFormInputs = z.infer<typeof BookingManuelSchema>;

// Types pour les sous-objets pour plus de clarté
export type ArticleItem = z.infer<typeof ArticleItemSchema>;
export type Arrhes = z.infer<typeof ArrhesSchema>;

export const BookingEventSchema = BookingManuelSchema.extend({
  first_name: z.string(),
  last_name: z.string(),
  // Ajout d'autres champs si nécessaire
});

export type BookingEvent = z.infer<typeof BookingEventSchema>;