// src/components/conges/FormulaireConge.tsx

import React, { useState, useEffect } from 'react';
import { Conge } from '@/types/conge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'; // Import du Label
import { Textarea } from '@/components/ui/textarea'; // Pour la raison
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; // Pour la gestion des classes

interface FormulaireCongeProps {
  initialData?: Conge; // Optionnel pour la modification
  onSave: (conge: Omit<Conge, 'id' | 'dateDemande' | 'statut'>) => void; // OnSave sans l'ID et dateDemande générés
  onCancel: () => void;
}

const FormulaireConge: React.FC<FormulaireCongeProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Conge, 'id' | 'dateDemande' | 'statut'>>({
    employeId: initialData?.employeId || '',
    nomEmploye: initialData?.nomEmploye || '',
    typeConge: initialData?.typeConge || 'Vacances', // Valeur par défaut
    dateDebut: initialData?.dateDebut || '',
    dateFin: initialData?.dateFin || '',
    dureeJoursOuvres: initialData?.dureeJoursOuvres || 0,
    raison: initialData?.raison || '',
    commentaireManager: initialData?.commentaireManager || '',
    fichiersJoints: initialData?.fichiersJoints || [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({}); // Pour la validation

  // Mettre à jour le formulaire si les données initiales changent (par ex. pour l'édition)
  useEffect(() => {
    if (initialData) {
      setFormData({
        employeId: initialData.employeId,
        nomEmploye: initialData.nomEmploye,
        typeConge: initialData.typeConge,
        dateDebut: initialData.dateDebut,
        dateFin: initialData.dateFin,
        dureeJoursOuvres: initialData.dureeJoursOuvres,
        raison: initialData.raison || '',
        commentaireManager: initialData.commentaireManager || '',
        fichiersJoints: initialData.fichiersJoints || [],
      });
    } else {
      // Réinitialiser le formulaire pour un nouvel ajout
      setFormData({
        employeId: '',
        nomEmploye: '',
        typeConge: 'Vacances',
        dateDebut: '',
        dateFin: '',
        dureeJoursOuvres: 0,
        raison: '',
        commentaireManager: '',
        fichiersJoints: [],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Efface l'erreur quand le champ est modifié
  };

  const handleSelectChange = (name: keyof Omit<Conge, 'id' | 'dateDemande' | 'statut'>, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as any })); // Type assertion car SelectValue est string
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (name: 'dateDebut' | 'dateFin', date?: Date) => {
    setFormData(prev => ({ ...prev, [name]: date ? format(date, 'yyyy-MM-dd') : '' }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation basique
    if (!formData.nomEmploye.trim()) newErrors.nomEmploye = "Le nom de l'employé est requis.";
    if (!formData.typeConge) newErrors.typeConge = "Le type de congé est requis.";
    if (!formData.dateDebut) newErrors.dateDebut = "La date de début est requise.";
    if (!formData.dateFin) newErrors.dateFin = "La date de fin est requise.";
    if (formData.dateDebut && formData.dateFin && new Date(formData.dateDebut) > new Date(formData.dateFin)) {
      newErrors.dateFin = "La date de fin ne peut pas être antérieure à la date de début.";
    }
    if (formData.dureeJoursOuvres <= 0) newErrors.dureeJoursOuvres = "La durée doit être supérieure à 0.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="nomEmploye">Nom de l'employé</Label>
        <Input
          id="nomEmploye"
          name="nomEmploye"
          value={formData.nomEmploye}
          onChange={handleChange}
          required
        />
        {errors.nomEmploye && <p className="text-red-500 text-sm">{errors.nomEmploye}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="employeId">ID Employé (simulé)</Label>
        <Input
          id="employeId"
          name="employeId"
          value={formData.employeId}
          onChange={handleChange}
          required
        />
        {errors.employeId && <p className="text-red-500 text-sm">{errors.employeId}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="typeConge">Type de Congé</Label>
        <Select
          value={formData.typeConge}
          onValueChange={(value) => handleSelectChange('typeConge', value)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Vacances">Vacances</SelectItem>
            <SelectItem value="Maladie">Maladie</SelectItem>
            <SelectItem value="RTT">RTT</SelectItem>
            <SelectItem value="Congé Parental">Congé Parental</SelectItem>
            <SelectItem value="Formation">Formation</SelectItem>
            <SelectItem value="Autre">Autre</SelectItem>
          </SelectContent>
        </Select>
        {errors.typeConge && <p className="text-red-500 text-sm">{errors.typeConge}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateDebut">Date de Début</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.dateDebut && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.dateDebut ? format(new Date(formData.dateDebut), "PPP") : <span>Sélectionner une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.dateDebut ? new Date(formData.dateDebut) : undefined}
              onSelect={(date) => handleDateChange('dateDebut', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.dateDebut && <p className="text-red-500 text-sm">{errors.dateDebut}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateFin">Date de Fin</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.dateFin && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.dateFin ? format(new Date(formData.dateFin), "PPP") : <span>Sélectionner une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.dateFin ? new Date(formData.dateFin) : undefined}
              onSelect={(date) => handleDateChange('dateFin', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.dateFin && <p className="text-red-500 text-sm">{errors.dateFin}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dureeJoursOuvres">Durée (Jours Ouvrés)</Label>
        <Input
          id="dureeJoursOuvres"
          name="dureeJoursOuvres"
          type="number"
          value={formData.dureeJoursOuvres}
          onChange={handleChange}
          required
          min="1"
        />
        {errors.dureeJoursOuvres && <p className="text-red-500 text-sm">{errors.dureeJoursOuvres}</p>}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="raison">Raison / Description</Label>
        <Textarea
          id="raison"
          name="raison"
          value={formData.raison}
          onChange={handleChange}
          placeholder="Détails de la demande (optionnel)"
        />
      </div>

      {initialData && ( // Commentaire manager n'apparaît qu'en modification
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="commentaireManager">Commentaire du Manager</Label>
          <Textarea
            id="commentaireManager"
            name="commentaireManager"
            value={formData.commentaireManager}
            onChange={handleChange}
            placeholder="Ajouter un commentaire (pour les managers)"
          />
        </div>
      )}

      <div className="md:col-span-2 flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
};

export default FormulaireConge;