// components/settings/notifications/NotificationForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"; // Pour les notifications

// Importez votre schéma Zod et son type
import { notificationSchema, NotificationFormValues } from "@/schemas/notificationSchema";

// Imports des composants UI
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Composant Switch de Shadcn UI
import { Separator } from "@/components/ui/separator";

export function NotificationForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch, // Permet de surveiller les valeurs des champs
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      // Valeurs par défaut (à charger depuis votre API en réalité)
      email_enabled: true,
      email_marketing: true,
      email_security_alerts: true,
      email_activity_updates: false,
      push_enabled: true,
      push_new_messages: true,
      push_mentions: true,
      push_feature_updates: false,
    },
  });

  // Surveille l'état des toggles principaux pour activer/désactiver les sous-options
  const emailEnabled = watch("email_enabled");
  const pushEnabled = watch("push_enabled");

  const onSubmit = async (data: NotificationFormValues) => {
    // Simule une soumission asynchrone
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Préférences de notification sauvegardées :", data);

    // Ici, vous enverriez `data` à votre API
    // Exemple : const response = await fetch('/api/user/notifications', { method: 'PUT', body: JSON.stringify(data) });

    if (true /* Remplacez par le succès de votre API */) {
      toast.success("Préférences enregistrées !", {
        description: "Vos paramètres de notification ont été mis à jour.",
      });
    } else {
      toast.error("Erreur de sauvegarde.", {
        description: "Une erreur est survenue lors de l'enregistrement de vos préférences.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Notifications par E-mail</h3>
        <p className="text-sm text-muted-foreground">
          Contrôlez les types de notifications que vous recevez par e-mail.
        </p>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email_enabled">Activer les notifications par e-mail</Label>
            <Switch
              id="email_enabled"
              {...register("email_enabled")}
              checked={emailEnabled} // Important pour que le Switch reflète l'état de RHF
            />
          </div>
          <div className="flex items-center justify-between pl-6"> {/* Indentation pour les sous-options */}
            <Label htmlFor="email_marketing" className={!emailEnabled ? "opacity-50" : ""}>
              E-mails marketing
            </Label>
            <Switch
              id="email_marketing"
              {...register("email_marketing")}
              disabled={!emailEnabled} // Désactive si les e-mails sont globalement désactivés
            />
          </div>
          <div className="flex items-center justify-between pl-6">
            <Label htmlFor="email_security_alerts" className={!emailEnabled ? "opacity-50" : ""}>
              Alertes de sécurité
            </Label>
            <Switch
              id="email_security_alerts"
              {...register("email_security_alerts")}
              disabled={!emailEnabled}
            />
          </div>
          <div className="flex items-center justify-between pl-6">
            <Label htmlFor="email_activity_updates" className={!emailEnabled ? "opacity-50" : ""}>
              Mises à jour d'activité
            </Label>
            <Switch
              id="email_activity_updates"
              {...register("email_activity_updates")}
              disabled={!emailEnabled}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Notifications Push</h3>
        <p className="text-sm text-muted-foreground">
          Recevez des notifications directement sur votre appareil.
        </p>
        <Separator className="my-4" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="push_enabled">Activer les notifications push</Label>
            <Switch
              id="push_enabled"
              {...register("push_enabled")}
              checked={pushEnabled}
            />
          </div>
          <div className="flex items-center justify-between pl-6">
            <Label htmlFor="push_new_messages" className={!pushEnabled ? "opacity-50" : ""}>
              Nouveaux messages
            </Label>
            <Switch
              id="push_new_messages"
              {...register("push_new_messages")}
              disabled={!pushEnabled}
            />
          </div>
          <div className="flex items-center justify-between pl-6">
            <Label htmlFor="push_mentions" className={!pushEnabled ? "opacity-50" : ""}>
              Mentions
            </Label>
            <Switch
              id="push_mentions"
              {...register("push_mentions")}
              disabled={!pushEnabled}
            />
          </div>
          <div className="flex items-center justify-between pl-6">
            <Label htmlFor="push_feature_updates" className={!pushEnabled ? "opacity-50" : ""}>
              Mises à jour de fonctionnalités
            </Label>
            <Switch
              id="push_feature_updates"
              {...register("push_feature_updates")}
              disabled={!pushEnabled}
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sauvegarde en cours..." : "Sauvegarder les préférences"}
      </Button>
    </form>
  );
}