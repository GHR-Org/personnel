"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Calendar, Shield, Briefcase } from "lucide-react";

export const personnelSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  telephone: z.string().min(8, "Le téléphone doit contenir au moins 8 caractères"),
  email: z.string().email("Email invalide"),
  mot_de_passe: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(["Receptionniste", "Technicien", "Manager", "RH", "Caissier", "Directeur"]),
  poste: z.string().optional(),
  date_embauche: z.string().min(1, "Date d'embauche requise"),
  statut_compte: z.enum(["active", "inactive", "suspended"]).default("active")
});

type PersonnelFormData = z.infer<typeof personnelSchema>;

interface PersonnelFormProps {
  onSubmit: (data: PersonnelFormData) => void;
  initialData?: unknown;
}

export function PersonnelForm({ onSubmit, initialData }: PersonnelFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<PersonnelFormData>({
    resolver: zodResolver(personnelSchema),
    defaultValues: initialData || {
      role: "Receptionniste",
      statut_compte: "active"
    }
  });

  const watchedRole = watch("role");

  React.useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key as keyof PersonnelFormData, (initialData as PersonnelFormData)[key]);
      });
    }
  }, [initialData, setValue]);

  // const getRoleIcon = (role: string) => {
  //   switch (role) {
  //     case "Receptionniste":
  //       return <User className="h-4 w-4 text-blue-500" />;
  //     case "Technicien":
  //       return <Shield className="h-4 w-4 text-green-500" />;
  //     case "Manager":
  //       return <Briefcase className="h-4 w-4 text-purple-500" />;
  //     case "RH":
  //       return <User className="h-4 w-4 text-orange-500" />;
  //     case "Caissier":
  //       return <User className="h-4 w-4 text-red-500" />;
  //     case "Directeur":
  //       return <Shield className="h-4 w-4 text-indigo-500" />;
  //     default:
  //       return <User className="h-4 w-4 text-gray-500" />;
  //   }
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Informations personnelles */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Informations personnelles</h3>
              <p className="text-sm text-gray-600">Détails du membre du personnel</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="nom" className="text-sm font-semibold text-gray-700">
                Nom *
              </Label>
              <Input
                id="nom"
                {...register("nom")}
                placeholder="Ex: Rakoto"
                className={`transition-all duration-200 ${
                  errors.nom 
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-400"
                }`}
              />
              {errors.nom && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.nom.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="prenom" className="text-sm font-semibold text-gray-700">
                Prénom *
              </Label>
              <Input
                id="prenom"
                {...register("prenom")}
                placeholder="Ex: Jean"
                className={`transition-all duration-200 ${
                  errors.prenom 
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-400"
                }`}
              />
              {errors.prenom && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.prenom.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Contact</h3>
              <p className="text-sm text-gray-600">Informations de contact</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="jean.rakoto@personnel.mg"
                className={`transition-all duration-200 ${
                  errors.email 
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:border-green-500 focus:ring-green-200 hover:border-gray-400"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="telephone" className="text-sm font-semibold text-gray-700">
                Téléphone *
              </Label>
              <Input
                id="telephone"
                type="tel"
                {...register("telephone")}
                placeholder="+261 34 12 345 67"
                className={`transition-all duration-200 ${
                  errors.telephone 
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:border-green-500 focus:ring-green-200 hover:border-gray-400"
                }`}
              />
              {errors.telephone && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.telephone.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rôle et fonction */}
      <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Rôle et fonction</h3>
              <p className="text-sm text-gray-600">Affectation et responsabilités</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="role" className="text-sm font-semibold text-gray-700">
                Rôle *
              </Label>
              <Select
                value={watchedRole}
                onValueChange={(value) => setValue("role", value as "RH")}
              >
                <SelectTrigger className={`transition-all duration-200 ${
                  errors.role 
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:border-purple-500 focus:ring-purple-200 hover:border-gray-400"
                }`}>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Receptionniste" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    Réceptionniste
                  </SelectItem>
                  <SelectItem value="Technicien" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    Technicien
                  </SelectItem>
                  <SelectItem value="Manager" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-500" />
                    Manager
                  </SelectItem>
                  <SelectItem value="RH" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-500" />
                    RH
                  </SelectItem>
                  <SelectItem value="Caissier" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-red-500" />
                    Caissier
                  </SelectItem>
                  <SelectItem value="Directeur" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-500" />
                    Directeur
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="poste" className="text-sm font-semibold text-gray-700">
                Poste spécifique
              </Label>
              <Input
                id="poste"
                {...register("poste")}
                placeholder="Ex: Réceptionniste de nuit, Manager de restaurant..."
                className="transition-all duration-200 border-gray-300 focus:border-purple-500 focus:ring-purple-200 hover:border-gray-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations professionnelles */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Informations professionnelles</h3>
              <p className="text-sm text-gray-600">Détails de carrière</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="date_embauche" className="text-sm font-semibold text-gray-700">
                Date d&apos;embauche *
              </Label>
              <Input
                id="date_embauche"
                type="date"
                {...register("date_embauche")}
                className={`transition-all duration-200 ${
                  errors.date_embauche 
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-200 hover:border-gray-400"
                }`}
              />
              {errors.date_embauche && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.date_embauche.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="statut_compte" className="text-sm font-semibold text-gray-700">
                Statut du compte *
              </Label>
              <Select
                defaultValue="active"
                onValueChange={(value) => setValue("statut_compte", value as "active")}
              >
                <SelectTrigger className="transition-all duration-200 border-gray-300 focus:border-orange-500 focus:ring-orange-200 hover:border-gray-400">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active" className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Actif
                  </SelectItem>
                  <SelectItem value="inactive" className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    Inactif
                  </SelectItem>
                  <SelectItem value="suspended" className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Suspendu
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50 to-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Sécurité</h3>
              <p className="text-sm text-gray-600">Accès au système</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="mot_de_passe" className="text-sm font-semibold text-gray-700">
              Mot de passe *
            </Label>
            <Input
              id="mot_de_passe"
              type="password"
              {...register("mot_de_passe")}
              placeholder="Mot de passe sécurisé"
              className={`transition-all duration-200 ${
                errors.mot_de_passe 
                  ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                  : "border-gray-300 focus:border-red-500 focus:ring-red-200 hover:border-gray-400"
              }`}
            />
            {errors.mot_de_passe && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.mot_de_passe.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Le mot de passe doit contenir au moins 6 caractères
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Enregistrement...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {initialData ? "Modifier" : "Créer"} le personnel
            </div>
          )}
        </Button>
      </div>
    </form>
  );
} 