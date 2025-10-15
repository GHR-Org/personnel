"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bed, 
  DollarSign, 
  Tag, 
  Camera, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

export interface ChambreFormData {
  numero: string;
  categorie: string;
  tarif: string; // Le backend attend un Decimal (string)
  description: string;
  photo_url: string;
}

interface ChambreFormProps {
  onSubmit: (data: ChambreFormData) => void;
  onCancel: () => void;
  initialData?: ChambreFormData;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

const CATEGORIES = [
  { value: "Standard", label: "Standard", description: "Chambre standard confortable" },
  { value: "Deluxe", label: "Deluxe", description: "Chambre de luxe avec équipements premium" },
  { value: "Suite", label: "Suite", description: "Suite spacieuse avec salon séparé" },
  { value: "Familiale", label: "Familiale", description: "Chambre adaptée aux familles" }
];

export default function ChambreForm({ 
  onSubmit, 
  onCancel, 
  initialData,
  loading = false,
  submitLabel = "Créer",
  cancelLabel = "Annuler"
}: ChambreFormProps) {
  const [formData, setFormData] = useState<ChambreFormData>(
    initialData || {
      numero: "",
      categorie: "Standard",
      tarif: "0",
      description: "",
      photo_url: ""
    }
  );

  const [errors, setErrors] = useState<Partial<ChambreFormData>>({});
  const [isValid, setIsValid] = useState(false);

  // Validation en temps réel
  useEffect(() => {
    const newErrors: Partial<ChambreFormData> = {};
    
    if (!formData.numero.trim()) {
      newErrors.numero = "Le numéro de chambre est requis";
    } else if (formData.numero.length < 2) {
      newErrors.numero = "Le numéro doit contenir au moins 2 caractères";
    }
    
    if (!formData.categorie) {
      newErrors.categorie = "La catégorie est requise";
    }
    
    const tarifNum = parseFloat(formData.tarif);
    if (isNaN(tarifNum) || tarifNum <= 0) {
      newErrors.tarif = "Le tarif doit être supérieur à 0";
    } else if (tarifNum > 1000000) {
      newErrors.tarif = "Le tarif semble trop élevé";
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = "La description ne peut pas dépasser 500 caractères";
    }
    
    if (formData.photo_url && !isValidUrl(formData.photo_url)) {
      newErrors.photo_url = "L'URL de la photo n'est pas valide";
    }
    
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0 && formData.numero.trim() !== "");
  }, [formData]);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ChambreFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSelectedCategory = () => {
    return CATEGORIES.find(cat => cat.value === formData.categorie);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5" />
            Informations de base
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Numéro de chambre *
              </Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => handleInputChange('numero', e.target.value)}
                placeholder="Ex: 101, A1, Suite-201"
                className={errors.numero ? "border-red-500" : ""}
                disabled={loading}
              />
              {errors.numero && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.numero}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categorie" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Catégorie *
              </Label>
              <Select 
                value={formData.categorie} 
                onValueChange={(value) => handleInputChange('categorie', value)}
                disabled={loading}
              >
                <SelectTrigger className={errors.categorie ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categorie && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.categorie}
                </p>
              )}
            </div>
          </div>

          {/* Description de la catégorie sélectionnée */}
          {getSelectedCategory() && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <Info className="h-4 w-4 inline mr-1" />
                <strong>{getSelectedCategory()?.label}</strong> : {getSelectedCategory()?.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tarification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tarification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tarif" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Tarif par nuit (Ar) *
            </Label>
            <Input
              id="tarif"
              type="number"
              value={formData.tarif}
              onChange={(e) => handleInputChange('tarif', e.target.value)}
              placeholder="50000"
              min="0"
              step="1000"
              className={errors.tarif ? "border-red-500" : ""}
              disabled={loading}
            />
            {parseFloat(formData.tarif) > 0 && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {formatCurrency(parseFloat(formData.tarif))} par nuit
              </p>
            )}
            {errors.tarif && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.tarif}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description et détails */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Description et détails
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">
              Description de la chambre
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez les équipements, la vue, les commodités..."
              rows={4}
              maxLength={500}
              disabled={loading}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Optionnel</span>
              <span>{formData.description.length}/500</span>
            </div>
            {errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photo de la chambre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo_url">
              URL de la photo
            </Label>
            <Input
              id="photo_url"
              value={formData.photo_url}
              onChange={(e) => handleInputChange('photo_url', e.target.value)}
              placeholder="https://example.com/photo.jpg"
              type="url"
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Optionnel - Lien vers une image de la chambre
            </p>
            {errors.photo_url && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.photo_url}
              </p>
            )}
          </div>

          {/* Aperçu de la photo */}
          {formData.photo_url && isValidUrl(formData.photo_url) && (
            <div className="space-y-2">
              <Label>Aperçu de la photo</Label>
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.photo_url}
                  alt="Aperçu de la chambre"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <Camera className="h-12 w-12" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résumé */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Résumé de la chambre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Numéro:</span>
            <Badge variant="outline">{formData.numero || "Non défini"}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Catégorie:</span>
            <Badge variant="outline">{getSelectedCategory()?.label || "Non définie"}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Tarif:</span>
            <span className="font-semibold text-green-600">
              {parseFloat(formData.tarif) > 0 ? formatCurrency(parseFloat(formData.tarif)) : "Non défini"}
            </span>
          </div>
          {formData.description && (
            <div className="pt-2 border-t">
              <span className="font-medium block mb-1">Description:</span>
              <p className="text-sm text-gray-600 line-clamp-2">{formData.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button 
          type="submit" 
          disabled={!isValid || loading}
          className="min-w-24"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              En cours...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>

      {/* Indicateur de validation */}
      {!isValid && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Veuillez corriger les erreurs ci-dessus avant de continuer
          </p>
        </div>
      )}
    </form>
  );
}
