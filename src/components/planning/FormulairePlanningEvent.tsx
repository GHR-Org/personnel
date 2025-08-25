// src/components/planning/FormulairePlanningEvent.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { PlanningEvent, PlanningEventType } from '@/types/planning';
import { fr } from 'date-fns/locale';

interface FormulairePlanningEventProps {
  initialData?: PlanningEvent;
  onSave: (event: Omit<PlanningEvent, 'id' | 'status'>) => void;
  onCancel: () => void;
}

const FormulairePlanningEvent: React.FC<FormulairePlanningEventProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<PlanningEvent, 'id' | 'status'>>({
    employeId: initialData?.employeId || '',
    nomEmploye: initialData?.nomEmploye || '',
    type: initialData?.type || 'Absence',
    title: initialData?.title || '',
    description: initialData?.description || '',
    dateDebut: initialData?.dateDebut || '',
    dateFin: initialData?.dateFin || '',
    location: initialData?.location || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        employeId: initialData.employeId,
        nomEmploye: initialData.nomEmploye,
        type: initialData.type,
        title: initialData.title,
        description: initialData.description || '',
        dateDebut: initialData.dateDebut,
        dateFin: initialData.dateFin,
        location: initialData.location || '',
      });
    } else {
      setFormData({
        employeId: '',
        nomEmploye: '',
        type: 'Absence',
        title: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        location: '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.employeId) newErrors.employeId = "L'ID employé est requis.";
    if (!formData.nomEmploye) newErrors.nomEmploye = "Le nom de l'employé est requis.";
    if (!formData.type) newErrors.type = "Le type d'événement est requis.";
    if (!formData.title) newErrors.title = "Le titre est requis.";
    if (!formData.dateDebut) newErrors.dateDebut = "La date de début est requise.";
    if (!formData.dateFin) newErrors.dateFin = "La date de fin est requise.";
    if (formData.dateDebut && formData.dateFin && parseISO(formData.dateDebut) > parseISO(formData.dateFin)) {
      newErrors.dateFin = "La date de fin ne peut pas être antérieure à la date de début.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Omit<PlanningEvent, 'id' | 'status'>, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleDateChange = (name: 'dateDebut' | 'dateFin', date?: Date) => {
    // Si l'événement est sur une journée complète, on peut ne pas inclure l'heure
    // Si l'événement a une heure, on utilise le format ISO complet
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
    setFormData(prev => ({ ...prev, [name]: formattedDate }));
  };

  const handleTimeChange = (name: 'dateDebut' | 'dateFin', timeString: string) => {
    const datePart = formData[name].split('T')[0];
    setFormData(prev => ({ ...prev, [name]: `${datePart}T${timeString}:00` }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Employe ID */}
        <div className="space-y-2">
          <Label htmlFor="employeId">ID Employé</Label>
          <Input id="employeId" name="employeId" value={formData.employeId} onChange={handleChange} />
          {errors.employeId && <p className="text-red-500 text-sm">{errors.employeId}</p>}
        </div>

        {/* Nom Employé */}
        <div className="space-y-2">
          <Label htmlFor="nomEmploye">Nom de l'employé</Label>
          <Input id="nomEmploye" name="nomEmploye" value={formData.nomEmploye} onChange={handleChange} />
          {errors.nomEmploye && <p className="text-red-500 text-sm">{errors.nomEmploye}</p>}
        </div>

        {/* Type d'événement */}
        <div className="space-y-2">
          <Label htmlFor="type">Type d'événement</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger className="w-full" id="type">
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Absence">Absence</SelectItem>
              <SelectItem value="Formation">Formation</SelectItem>
              <SelectItem value="Mission">Mission</SelectItem>
              <SelectItem value="Réunion">Réunion</SelectItem>
              <SelectItem value="Tâche">Tâche</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
        </div>

        {/* Titre */}
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        {/* Date de début */}
        <div className="space-y-2">
          <Label htmlFor="dateDebut">Date de début</Label>
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
                {formData.dateDebut ? format(parseISO(formData.dateDebut), "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.dateDebut ? parseISO(formData.dateDebut) : undefined}
                onSelect={(date) => handleDateChange('dateDebut', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dateDebut && <p className="text-red-500 text-sm">{errors.dateDebut}</p>}
          {/* Champ pour l'heure de début si nécessaire */}
          <Input
            type="time"
            value={formData.dateDebut.includes('T') ? formData.dateDebut.split('T')[1].substring(0, 5) : ''}
            onChange={(e) => handleTimeChange('dateDebut', e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Date de fin */}
        <div className="space-y-2">
          <Label htmlFor="dateFin">Date de fin</Label>
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
                {formData.dateFin ? format(parseISO(formData.dateFin), "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.dateFin ? parseISO(formData.dateFin) : undefined}
                onSelect={(date) => handleDateChange('dateFin', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dateFin && <p className="text-red-500 text-sm">{errors.dateFin}</p>}
          {/* Champ pour l'heure de fin si nécessaire */}
          <Input
            type="time"
            value={formData.dateFin.includes('T') ? formData.dateFin.split('T')[1].substring(0, 5) : ''}
            onChange={(e) => handleTimeChange('dateFin', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Décrivez l'événement..." />
      </div>

      {/* Lieu */}
      <div className="space-y-2">
        <Label htmlFor="location">Lieu</Label>
        <Input id="location" name="location" value={formData.location || ''} onChange={handleChange} placeholder="Lieu de l'événement..." />
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
};

export default FormulairePlanningEvent;