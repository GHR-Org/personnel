import { z } from "zod";
import { Sexe } from "@/lib/enum/Civilite";

export const ClientSchema = z.object({
  id: z.number().int().positive().optional(),
  Sexe: z.nativeEnum(Sexe).default(Sexe.HOMME),
  first_name: z.string().min(1, "Le nom est requis."),
  last_name: z.string().min(1, "Le prénom est requis."),
  adresse: z.string().default("Non renseigné"),
  ville: z.string().default("Non renseigné"),
  pays: z.string().default("Non renseigné"),
  phone: z.string().default("Non renseigné"),
  email: z.string().email("L'adresse e-mail n'est pas valide.").default("Non renseigné"),
  password: z.string().default("12345678"), 
  account_status: z.enum(["active", "inactive"]).default("active"),
});
export type ClientFormInputs = z.infer<typeof ClientSchema>;