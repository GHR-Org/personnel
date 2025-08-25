// components/settings/profile/ProfileForm.tsx
"use client";

// Imports de React Hook Form et Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"; // Pour les notifications

// Importez votre schéma Zod et son type
import { profileSchema, ProfileFormValues } from "@/schemas/profileSchema";

// Imports des composants UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Pour afficher les messages d'erreur de validation
// Créez ce composant si vous ne l'avez pas déjà
const FormMessage = ({ message }: { message?: string }) => {
  return message ? (
    <p className="text-sm font-medium text-destructive mt-1">{message}</p>
  ) : null;
};

export function ProfileForm() {
  // Initialisation de React Hook Form
  const {
    register, // Fonction pour lier les inputs au formulaire
    handleSubmit, // Fonction pour gérer la soumission du formulaire
    formState: { errors, isSubmitting }, // État du formulaire (erreurs, soumission en cours)
    reset, // Fonction pour réinitialiser le formulaire
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema), // Lie le schéma Zod
    defaultValues: {
      // Définissez les valeurs par défaut basées sur les données de l'utilisateur
      // Pour un cas réel, ces données viendraient de votre API
      prenom: "John",
      nom: "Doe",
      telephone: "0755555555",
      email: "user@example.com", // Souvent désactivé pour la modification
      poste: "Développeur",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    // Simule une soumission asynchrone
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Données du formulaire soumises (validées par Zod):", data);

    // Ici, vous enverriez `data` à votre API
    // Exemple : const response = await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(data) });

    if (true /* Remplacez par le succès de votre API */) {
      toast.success("Profil mis à jour !", {
        description: "Vos informations de profil ont été enregistrées avec succès.",
      });
      // Optionnel: reset(data) pour s'assurer que le formulaire reflète les dernières données sauvegardées
      // ou si vous voulez réinitialiser complètement après une soumission réussie.
    } else {
      toast.error("Erreur de mise à jour.", {
        description: "Une erreur est survenue lors de l'enregistrement de votre profil.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Informations Publiques</h3>
        <p className="text-sm text-muted-foreground">
          Ces informations seront visibles par les autres utilisateurs.
        </p>
        <Separator className="my-4" />
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prenom" className="text-right">
              Prénom
            </Label>
            <Input
              id="prenom"
              {...register("prenom")} // Lie l'input au champ 'prenom' du schéma
              className="col-span-3"
            />
            <FormMessage message={errors.prenom?.message} /> {/* Affiche l'erreur */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nom" className="text-right">
              Nom
            </Label>
            <Input
              id="nom"
              {...register("nom")} // Lie l'input au champ 'nom' du schéma
              className="col-span-3"
            />
            <FormMessage message={errors.nom?.message} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telephone" className="text-right">
              Téléphone
            </Label>
            <Input
              id="telephone"
              type="tel" // Utilisez 'tel' pour le type de l'input
              {...register("telephone")}
              className="col-span-3"
            />
            <FormMessage message={errors.telephone?.message} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="col-span-3"
              disabled // L'email est souvent désactivé pour la modification directe
            />
            {/* Pas besoin de message d'erreur si désactivé */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="poste" className="text-right">
              Poste
            </Label>
            <Input
              id="poste"
              {...register("poste")}
              className="col-span-3"
            />
            <FormMessage message={errors.poste?.message} />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sauvegarde en cours..." : "Mettre à jour le profil"}
      </Button>
    </form>
  );
}