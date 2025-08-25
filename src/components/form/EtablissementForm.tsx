"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Building, MapPin, Mail, Phone, Globe, Settings, Hotel, Utensils, Star } from "lucide-react";

const etablissementSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  ville: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  pays: z.string().min(2, "Le pays doit contenir au moins 2 caractères"),
  code_postal: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email("Email invalide"),
  site_web: z.string().url("URL invalide").optional().or(z.literal("")),
  type_: z.enum(["HOTELERIE", "RESTAURATION", "HOTELERIE_RESTAURATION"]),
  statut: z.enum(["Activer", "Inactive"])
});

type EtablissementFormData = z.infer<typeof etablissementSchema>;

interface EtablissementFormProps {
  onSubmit: (data: EtablissementFormData) => void;
  initialData?: any;
}

export function EtablissementForm({ onSubmit, initialData }: EtablissementFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<EtablissementFormData>({
    resolver: zodResolver(etablissementSchema),
    defaultValues: initialData || {
      type_: "HOTELERIE",
      statut: "Activer"
    }
  });

  const watchedType = watch("type_");

  React.useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key as keyof EtablissementFormData, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "HOTELERIE":
        return <Hotel className="h-4 w-4 text-blue-500" />;
      case "RESTAURATION":
        return <Utensils className="h-4 w-4 text-orange-500" />;
      case "HOTELERIE_RESTAURATION":
        return <Star className="h-4 w-4 text-purple-500" />;
      default:
        return <Building className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Informations de base */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Informations de base</h3>
              <p className="text-sm text-gray-600">Détails principaux de l'établissement</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="nom" className="text-sm font-semibold text-gray-700">
                Nom de l'établissement *
              </Label>
              <Input
                id="nom"
                {...register("nom")}
                placeholder="Ex: Hotel Tana Palace"
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
              <Label htmlFor="type_" className="text-sm font-semibold text-gray-700">
                Type d'établissement *
              </Label>
              <Select
                value={watchedType}
                onValueChange={(value) => setValue("type_", value as any)}
              >
                <SelectTrigger className={`transition-all duration-200 ${
                  errors.type_ 
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-400"
                }`}>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOTELERIE" className="flex items-center gap-2">
                    <Hotel className="h-4 w-4 text-blue-500" />
                    Hôtellerie
                  </SelectItem>
                  <SelectItem value="RESTAURATION" className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-orange-500" />
                    Restauration
                  </SelectItem>
                  <SelectItem value="HOTELERIE_RESTAURATION" className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-purple-500" />
                    Hôtellerie & Restauration
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type_ && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.type_.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adresse */}
      <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Adresse</h3>
              <p className="text-sm text-gray-600">Localisation de l'établissement</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="adresse" className="text-sm font-semibold text-gray-700">
                Adresse complète *
              </Label>
              <Textarea
                id="adresse"
                {...register("adresse")}
                placeholder="Ex: 123 Avenue de l'Indépendance, Analakely"
                rows={3}
                className={`transition-all duration-200 resize-none ${
                  errors.adresse 
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:border-green-500 focus:ring-green-200 hover:border-gray-400"
                }`}
              />
              {errors.adresse && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.adresse.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <Label htmlFor="ville" className="text-sm font-semibold text-gray-700">
                  Ville *
                </Label>
                <Input
                  id="ville"
                  {...register("ville")}
                  placeholder="Ex: Antananarivo"
                  className={`transition-all duration-200 ${
                    errors.ville 
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                      : "border-gray-300 focus:border-green-500 focus:ring-green-200 hover:border-gray-400"
                  }`}
                />
                {errors.ville && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.ville.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="pays" className="text-sm font-semibold text-gray-700">
                  Pays *
                </Label>
                <Input
                  id="pays"
                  {...register("pays")}
                  placeholder="Ex: Madagascar"
                  className={`transition-all duration-200 ${
                    errors.pays 
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                      : "border-gray-300 focus:border-green-500 focus:ring-green-200 hover:border-gray-400"
                  }`}
                />
                {errors.pays && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.pays.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="code_postal" className="text-sm font-semibold text-gray-700">
                  Code postal
                </Label>
                <Input
                  id="code_postal"
                  {...register("code_postal")}
                  placeholder="Ex: 101"
                  className="transition-all duration-200 border-gray-300 focus:border-green-500 focus:ring-green-200 hover:border-gray-400"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="h-6 w-6 text-purple-600" />
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
                placeholder="contact@etablissement.mg"
                className={`transition-all duration-200 ${
                  errors.email 
                    ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:border-purple-500 focus:ring-purple-200 hover:border-gray-400"
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
                Téléphone
              </Label>
              <Input
                id="telephone"
                type="tel"
                {...register("telephone")}
                placeholder="+261 34 12 345 67"
                className="transition-all duration-200 border-gray-300 focus:border-purple-500 focus:ring-purple-200 hover:border-gray-400"
              />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Label htmlFor="site_web" className="text-sm font-semibold text-gray-700">
              Site web
            </Label>
            <Input
              id="site_web"
              type="url"
              {...register("site_web")}
              placeholder="https://www.etablissement.mg"
              className={`transition-all duration-200 ${
                errors.site_web 
                  ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                  : "border-gray-300 focus:border-purple-500 focus:ring-purple-200 hover:border-gray-400"
              }`}
            />
            {errors.site_web && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.site_web.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Settings className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Configuration</h3>
              <p className="text-sm text-gray-600">Paramètres de l'établissement</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="statut" className="text-sm font-semibold text-gray-700">
              Statut *
            </Label>
            <Select
              defaultValue="Activer"
              onValueChange={(value) => setValue("statut", value as any)}
            >
              <SelectTrigger className="transition-all duration-200 border-gray-300 focus:border-orange-500 focus:ring-orange-200 hover:border-gray-400">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activer" className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Actif
                </SelectItem>
                <SelectItem value="Inactive" className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Inactif
                </SelectItem>
              </SelectContent>
            </Select>
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
              <Building className="h-4 w-4" />
              {initialData ? "Modifier" : "Créer"} l'établissement
            </div>
          )}
        </Button>
      </div>
    </form>
  );
} 