// schemas/notificationSchema.ts
import { z } from "zod";

export const notificationSchema = z.object({
  // Notifications par e-mail
  email_enabled: z.boolean(), // Activer/désactiver toutes les notifications par e-mail
  email_marketing: z.boolean(), // E-mails marketing
  email_security_alerts: z.boolean(), // Alertes de sécurité par e-mail
  email_activity_updates: z.boolean(), // Mises à jour d'activité par e-mail

  // Notifications push (si applicable pour votre app)
  push_enabled: z.boolean(), // Activer/désactiver toutes les notifications push
  push_new_messages: z.boolean(), // Nouveaux messages
  push_mentions: z.boolean(), // Mentions
  push_feature_updates: z.boolean(), // Mises à jour de fonctionnalités
});

// Définissez le type TypeScript à partir du schéma Zod
export type NotificationFormValues = z.infer<typeof notificationSchema>;