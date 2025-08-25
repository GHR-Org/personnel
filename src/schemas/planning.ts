import z from "zod";
import { PlanningEventStatus, PlanningEventType } from "@/types/planning";

export const planningEventSchema = z.object({
  personnel_id: z.number(),
  type: z.nativeEnum(PlanningEventType),
  titre: z.string().min(1, "Le titre de l'événement est requis."),
  description: z.string().optional(),
  dateDebut: z.string().optional(),
  dateFin: z.string().optional(), // Optionnel pour les événements avec des heures spécifiques
  status: z.nativeEnum(PlanningEventStatus),
  responsable_id: z.number().int(),
});

export type PlanningEventFormData = z.infer<typeof planningEventSchema>;


