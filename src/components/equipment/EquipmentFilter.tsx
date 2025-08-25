"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { XCircle} from 'lucide-react';


// Définition des types pour les filtres d'équipements
export interface EquipmentFilters {
  rechercheGenerale?: string;
  status?: "Fonctionnel" | "En Maintenance" | "Hors service" | "Tous";
}

interface FiltresEquipementsProps {
  onFilterChange: (filters: EquipmentFilters) => void;
}

const FiltresEquipements: React.FC<FiltresEquipementsProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<EquipmentFilters>({
    rechercheGenerale: '',
    status: 'Tous',
  });

  // Utilisez un ref pour stocker la valeur précédente de `filters`
  const previousFiltersRef = useRef<EquipmentFilters | null>(null);

  // Le useEffect s'exécutera à chaque fois que `filters` change
  useEffect(() => {
    // Vérifiez si `filters` a réellement changé
    if (JSON.stringify(filters) !== JSON.stringify(previousFiltersRef.current)) {
      onFilterChange(filters);
    }
    // Mettez à jour le ref avec la nouvelle valeur de `filters`
    previousFiltersRef.current = filters;
  }, [filters, onFilterChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      status: value as EquipmentFilters['status'],
    }));
  };

  const resetFilters = () => {
    const defaultFilters: EquipmentFilters = {
      rechercheGenerale: '',
      status: 'Tous',
    };
    setFilters(defaultFilters);
  };
  
  return (
    <div className="flex flex-wrap items-end gap-4 p-4 border rounded-md mb-6 bg-background">
      {/* Champ de recherche générale (nom, type, localisation) */}
      <div className="flex flex-col gap-2 min-w-[200px] flex-grow">
        <label htmlFor="rechercheGenerale" className="text-sm font-medium">Recherche (Nom, type, localisation...)</label>
        <Input
          id="rechercheGenerale"
          name="rechercheGenerale"
          placeholder="Rechercher par nom, type, localisation..."
          value={filters.rechercheGenerale || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
        <label htmlFor="status" className="text-sm font-medium">Statut de l&apos;équipement</label>
        <Select
          value={filters.status || 'Tous'}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="w-full" id="status">
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tous">Tous les statuts</SelectItem>
            <SelectItem value="Fonctionnel">Fonctionnel</SelectItem>
            <SelectItem value="En Maintenance">En Maintenance</SelectItem>
            <SelectItem value="Hors service">Hors service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full flex justify-between mt-4 md:mt-0">
        <div className="flex gap-2 mt-auto w-full sm:w-auto">
          <Button variant="outline" onClick={resetFilters} className="flex-grow">
            <XCircle className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>

        {/* */}
      </div>
    </div>
  );
};

export default FiltresEquipements;