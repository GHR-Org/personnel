// src/components/conges/FiltresConges.tsx

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { CalendarIcon, XCircle, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

// Définition de l'interface pour les critères de filtre
export interface CongeFilters {
  nomEmploye?: string;
  typeConge?: 'Vacances' | 'Maladie' | 'RTT' | 'Congé Parental' | 'Formation' | 'Autre' | 'Tous';
  statut?: 'En attente' | 'Approuvé' | 'Refusé' | 'Annulé' | 'Tous';
  dateDebutPeriode?: Date;
  dateFinPeriode?: Date;
}

interface FiltresCongesProps {
  onFilterChange: (filters: CongeFilters) => void;
  // AJOUTER CETTE LIGNE
  onAddConge: () => void; // Callback pour déclencher l'ajout d'un congé
}

// MODIFIER ICI : DÉSTRUCTUREZ onAddConge des props
const FiltresConges: React.FC<FiltresCongesProps> = ({ onFilterChange, onAddConge }) => {
  const [filters, setFilters] = useState<CongeFilters>({
    nomEmploye: '',
    typeConge: 'Tous',
    statut: 'Tous',
    dateDebutPeriode: undefined,
    dateFinPeriode: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: keyof CongeFilters, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value === 'Tous' ? undefined : value,
    }));
  };

  const handleDateDebutChange = (date?: Date) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      dateDebutPeriode: date,
    }));
  };

  const handleDateFinChange = (date?: Date) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      dateFinPeriode: date,
    }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    const defaultFilters: CongeFilters = {
      nomEmploye: '',
      typeConge: 'Tous',
      statut: 'Tous',
      dateDebutPeriode: undefined,
      dateFinPeriode: undefined,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  // SUPPRIMER LA FONCTION onAddConge LOCALE QUI LEVE L'ERREUR
  // function onAddConge(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
  //   throw new Error('Function not implemented.');
  // }
  // La prop `onAddConge` est maintenant utilisée directement.

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 border rounded-md mb-6 bg-background">
      {/* Champ de recherche par employé */}
      <div className="flex flex-col gap-2 min-w-[200px] flex-grow">
        <label htmlFor="nomEmploye" className="text-sm font-medium">Nom de l&apos;employé</label>
        <Input
          id="nomEmploye"
          name="nomEmploye"
          placeholder="Rechercher par nom..."
          value={filters.nomEmploye || ''}
          onChange={handleChange}
        />
      </div>

      {/* Select pour le type de congé */}
      <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
        <label htmlFor="typeConge" className="text-sm font-medium">Type de congé</label>
        <Select
          value={filters.typeConge || 'Tous'}
          onValueChange={(value) => handleSelectChange('typeConge', value)}
        >
          <SelectTrigger className="w-full" id="typeConge">
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tous">Tous les types</SelectItem>
            <SelectItem value="Vacances">Vacances</SelectItem>
            <SelectItem value="Maladie">Maladie</SelectItem>
            <SelectItem value="RTT">RTT</SelectItem>
            <SelectItem value="Congé Parental">Congé Parental</SelectItem>
            <SelectItem value="Formation">Formation</SelectItem>
            <SelectItem value="Autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Select pour le statut */}
      <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
        <label htmlFor="statut" className="text-sm font-medium">Statut</label>
        <Select
          value={filters.statut || 'Tous'}
          onValueChange={(value) => handleSelectChange('statut', value)}
        >
          <SelectTrigger className="w-full" id="statut">
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tous">Tous les statuts</SelectItem>
            <SelectItem value="En attente">En attente</SelectItem>
            <SelectItem value="Approuvé">Approuvé</SelectItem>
            <SelectItem value="Refusé">Refusé</SelectItem>
            <SelectItem value="Annulé">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sélection de date de début */}
      <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
        <label htmlFor="dateDebutPeriode" className="text-sm font-medium">Période (début)</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !filters.dateDebutPeriode && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateDebutPeriode ? format(filters.dateDebutPeriode, "PPP") : <span>Sélectionner une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateDebutPeriode}
              onSelect={handleDateDebutChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Sélection de date de fin */}
      <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
        <label htmlFor="dateFinPeriode" className="text-sm font-medium">Période (fin)</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !filters.dateFinPeriode && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateFinPeriode ? format(filters.dateFinPeriode, "PPP") : <span>Sélectionner une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateFinPeriode}
              onSelect={handleDateFinChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2 mt-auto w-full sm:w-auto">
        <Button onClick={applyFilters} className="flex-grow">Appliquer les filtres</Button>
        <Button variant="outline" onClick={resetFilters} className="flex-grow">
          <XCircle className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
      <div className="w-full flex justify-end mt-4 md:mt-0">
        <Button onClick={onAddConge} className="sm:ml-auto"> {/* Maintenant, onAddConge est une prop */}
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter un congé
        </Button>
      </div>
    </div>
  );
};

export default FiltresConges;