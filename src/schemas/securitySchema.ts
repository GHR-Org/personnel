// schemas/securitySchema.ts
import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis."),
    newPassword: z
      .string()
      .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères.")
      .regex(/[a-z]/, "Le nouveau mot de passe doit contenir au moins une minuscule.")
      .regex(/[A-Z]/, "Le nouveau mot de passe doit contenir au moins une majuscule.")
      .regex(/[0-9]/, "Le nouveau mot de passe doit contenir au moins un chiffre.")
      .regex(/[^a-zA-Z0-9]/, "Le nouveau mot de passe doit contenir au moins un caractère spécial."),
    confirmNewPassword: z.string().min(1, "La confirmation du mot de passe est requise."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Les nouveaux mots de passe ne correspondent pas.",
    path: ["confirmNewPassword"], // L'erreur sera attachée au champ de confirmation
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;