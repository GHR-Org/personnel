// components/settings/security/ChangePasswordForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Importez votre schéma Zod et son type
import { changePasswordSchema, ChangePasswordFormValues } from "@/schemas/securitySchema";

// Imports des composants UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Composant pour afficher les messages d'erreur de validation
const FormMessage = ({ message }: { message?: string }) => {
  return message ? (
    <p className="text-sm font-medium text-destructive mt-1">{message}</p>
  ) : null;
};

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // Permet de réinitialiser le formulaire après soumission
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    // Simule une soumission asynchrone à l'API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Tentative de changement de mot de passe avec les données :", data);

    // Dans un cas réel, vous enverriez ces données à votre API backend.
    // L'API vérifierait le mot de passe actuel et mettrait à jour le nouveau.
    const success = true; // Simule un succès de l'API

    if (success) {
      toast.success("Mot de passe mis à jour !", {
        description: "Votre mot de passe a été changé avec succès.",
      });
      reset(); // Réinitialise tous les champs du formulaire après succès
    } else {
      // Pour une erreur réelle, l'API renverrait un message spécifique.
      // Par exemple, si le mot de passe actuel est incorrect.
      toast.error("Échec de la mise à jour du mot de passe.", {
        description: "Veuillez vérifier votre mot de passe actuel et réessayer.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Changer le mot de passe</h3>
        <p className="text-sm text-muted-foreground">
          Mettez à jour votre mot de passe pour maintenir la sécurité de votre compte.
        </p>
        <Separator className="my-4" />
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentPassword" className="text-right">
              Mot de passe actuel
            </Label>
            <Input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
              className="col-span-3"
            />
            <FormMessage message={errors.currentPassword?.message} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">
              Nouveau mot de passe
            </Label>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword")}
              className="col-span-3"
            />
            <FormMessage message={errors.newPassword?.message} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmNewPassword" className="text-right">
              Confirmer nouveau mot de passe
            </Label>
            <Input
              id="confirmNewPassword"
              type="password"
              {...register("confirmNewPassword")}
              className="col-span-3"
            />
            <FormMessage message={errors.confirmNewPassword?.message} />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Changement en cours..." : "Changer le mot de passe"}
      </Button>
    </form>
  );
}