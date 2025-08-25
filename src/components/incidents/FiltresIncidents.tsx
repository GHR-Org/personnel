// src/components/incidents/FiltresIncidents.tsx

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { XCircle } from 'lucide-react';

export interface IncidentFilters {
  rechercheGenerale?: string; // ID, nom de l'équipement, description
  statut?: "Ouvert" | "En cours" | "Fermé" | "Tous";
}

interface FiltresIncidentsProps {
  onFilterChange: (filters: IncidentFilters) => void;
}

const FiltresIncidents: React.FC<FiltresIncidentsProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<IncidentFilters>({
    rechercheGenerale: '',
    statut: 'Tous',
  });
  const previousFiltersRef = useRef<IncidentFilters | null>(null);

  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(previousFiltersRef.current)) {
      onFilterChange(filters);
    }
    previousFiltersRef.current = filters;
  }, [filters, onFilterChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFilters(prevFilters => ({ ...prevFilters, statut: value as IncidentFilters['statut'] }));
  };

  const resetFilters = () => {
    const defaultFilters: IncidentFilters = {
      rechercheGenerale: '',
      statut: 'Tous',
    };
    setFilters(defaultFilters);
  };
  
  return (
    <div className="flex flex-wrap items-end gap-4 p-4 border rounded-md mb-6 bg-background">
      {/* Champs de filtre */}
      <div className="flex flex-col gap-2 min-w-[200px] flex-grow">
        <label htmlFor="rechercheGenerale" className="text-sm font-medium">Recherche (ID, équipement...)</label>
        <Input
          id="rechercheGenerale"
          name="rechercheGenerale"
          placeholder="Rechercher par ID ou nom d'équipement..."
          value={filters.rechercheGenerale || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
        <label htmlFor="statut" className="text-sm font-medium">Statut de l&apos;incident</label>
        <Select value={filters.statut || 'Tous'} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full" id="statut">
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tous">Tous les statuts</SelectItem>
            <SelectItem value="Ouvert">Ouvert</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Fermé">Fermé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 mt-auto w-full sm:w-auto">
        <Button variant="outline" onClick={resetFilters} className="flex-grow">
          <XCircle className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};

export default FiltresIncidents;