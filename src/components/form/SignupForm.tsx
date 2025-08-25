/* eslint-disable @next/next/no-img-element */
"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { testPasswordHashing } from "@/lib/password-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Building, MapPin, Mail, Phone, Globe, Settings, Lock } from "lucide-react";
import { toast } from "sonner";
import { etablissementAPI } from "@/lib/func/api/etablissement";

const etablissementSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  ville: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  pays: z.string().min(2, "Le pays doit contenir au moins 2 caractères"),
  code_postal: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email("Email invalide"),
  site_web: z.string().url("URL invalide").optional().or(z.literal("")),
  type_: z.enum(["Hotelerie", "Restauration", "Hotelerie et Restauration"], { required_error: "Type requis" }),
  mot_de_passe: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
  logo: z.string().optional(),
}).refine((data) => data.mot_de_passe === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Les mots de passe ne correspondent pas",
}).refine((data) => {
  // Validation conditionnelle pour site_web
  if (data.site_web && data.site_web.trim() !== "") {
    try {
      new URL(data.site_web);
      return true;
    } catch {
      return false;
    }
  }
  return true;
}, {
  path: ["site_web"],
  message: "URL invalide"
});

type EtablissementFormData = z.infer<typeof etablissementSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Test de la fonction de hachage au chargement du composant
  useEffect(() => {
    testPasswordHashing();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<EtablissementFormData>({
    resolver: zodResolver(etablissementSchema),
    defaultValues: {
      type_: "Hotelerie",
      nom: "",
      adresse: "",
      ville: "",
      pays: "",
      code_postal: "",
      telephone: "",
      email: "",
      site_web: "",
      mot_de_passe: "",
      confirmPassword: "",
      logo: "",
    }
  });

  const watchedType = watch("type_");

  const onSubmit = async (data: EtablissementFormData) => {
    setIsLoading(true);
    try {
      // Nettoyer les données pour correspondre au schéma backend
      const etabData = {
        nom: data.nom,
        adresse: data.adresse,
        ville: data.ville,
        pays: data.pays,
        code_postal: data.code_postal || null,
        telephone: data.telephone || null,
        email: data.email,
        site_web: data.site_web && data.site_web.trim() !== "" ? data.site_web : null,
        description: null, // Champ optionnel, envoyé comme null
        type_: data.type_,
        mot_de_passe: data.mot_de_passe,
        logo: data.logo && data.logo.trim() !== "" ? data.logo : null,
        statut: "Inactive" // Statut explicite pour correspondre au backend
      };
      
      console.log("Données envoyées au backend:", etabData);
      console.log("🔐 Le mot de passe sera automatiquement hashé avant l'envoi au serveur");
      console.log("📋 Type d'établissement:", etabData.type_);
      console.log("📧 Email:", etabData.email);
      console.log("🌐 Site web:", etabData.site_web);
      console.log("📝 Description:", etabData.description);
      
      await etablissementAPI.create(etabData);
      toast.success("Inscription réussie! Votre compte sera activé par le super admin. Mot de passe sécurisé.");
      router.push("/login");
    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      
      // Améliorer l'affichage de l'erreur
      let errorMessage = "Erreur lors de l'inscription";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.detail) {
        errorMessage = error.detail;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"space-y-6 max-w-2xl mx-auto " + (className || "") } {...props}>
      {/* Informations de base */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Informations de base</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'établissement *</Label>
              <Input id="nom" {...register("nom")}
                placeholder="Nom de l'établissement"
                className={errors.nom ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.nom && <p className="text-sm text-red-500">{errors.nom.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type_">Type d'établissement *</Label>
              <Select
                value={watchedType}
                onValueChange={(value) => setValue("type_", value as any)}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.type_ ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hotelerie">Hôtellerie</SelectItem>
                  <SelectItem value="Restauration">Restauration</SelectItem>
                  <SelectItem value="Hotelerie et Restauration">Hôtellerie & Restauration</SelectItem>
                </SelectContent>
              </Select>
              {errors.type_ && <p className="text-sm text-red-500">{errors.type_.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Adresse */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Adresse</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse complète *</Label>
              <Textarea
                id="adresse"
                {...register("adresse")}
                placeholder="Adresse complète de l'établissement"
                rows={3}
                className={errors.adresse ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.adresse && <p className="text-sm text-red-500">{errors.adresse.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ville">Ville *</Label>
                <Input
                  id="ville"
                  {...register("ville")}
                  placeholder="Ville"
                  className={errors.ville ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.ville && <p className="text-sm text-red-500">{errors.ville.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pays">Pays *</Label>
                <Input
                  id="pays"
                  {...register("pays")}
                  placeholder="Pays"
                  className={errors.pays ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.pays && <p className="text-sm text-red-500">{errors.pays.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="code_postal">Code postal</Label>
                <Input
                  id="code_postal"
                  {...register("code_postal")}
                  placeholder="Code postal"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Contact */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Contact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="email@exemple.com"
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                {...register("telephone")}
                placeholder="+261 XX XX XXX XX"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="site_web">Site web</Label>
            <Input
              id="site_web"
              type="url"
              {...register("site_web")}
              placeholder="https://www.exemple.com"
              className={errors.site_web ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.site_web && <p className="text-sm text-red-500">{errors.site_web.message}</p>}
          </div>
        </CardContent>
      </Card>
      {/* Mot de passe */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Sécurité</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mot_de_passe">Mot de passe *</Label>
              <Input
                id="mot_de_passe"
                type="password"
                {...register("mot_de_passe")}
                placeholder="••••••••"
                className={errors.mot_de_passe ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.mot_de_passe && <p className="text-sm text-red-500">{errors.mot_de_passe.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className={errors.confirmPassword ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Logo (optionnel) */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Logo (optionnel)</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">URL du logo</Label>
            <Input
              id="logo"
              {...register("logo")}
              placeholder="https://..."
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>
      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isLoading ? "Création en cours..." : "Créer l'établissement"}
        </Button>
      </div>
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Déjà un compte ? </span>
        <a href="/login" className="underline-offset-2 hover:underline">
          Se connecter
        </a>
      </div>
    </form>
  );
}