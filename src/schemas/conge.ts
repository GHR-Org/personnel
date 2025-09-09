import z from "zod";
import { CongeType } from "@/types/conge";

export const CongeSchema = z.object({
  type: z.nativeEnum(CongeType), // 'Vacance', 'Maladie', 'RTT', etc.
  personnel_id: z.number().int().positive(),
  dateDebut: z.string().datetime(), // Le format ($date-time) est géré par la validation .datetime() de Zod
  dateDmd: z.string().datetime(),
  dateFin: z.string().datetime(),
  raison: z.string(), // Le backend attend une chaîne de caractères, même si elle est vide.
});

/**
 * Infère le type TypeScript à partir du schéma Zod.
 */
export type Conge = z.infer<typeof CongeSchema> & {
  fichierJoin?: File | null;
};