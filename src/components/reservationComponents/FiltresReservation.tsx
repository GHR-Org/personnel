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
import { fr } from 'date-fns/locale'; // Importez la locale française pour date-fns

import { ReservationStatut } from '@/lib/enum/ReservationStatus'; // Assurez-vous que ce chemin est correct

// Définition de l'interface pour les critères de filtre de réservation
export interface ReservationFilters {
  rechercheGenerale?: string; // Peut inclure nom, prénom, email, etc.
  statut?: ReservationStatut | 'Tous'; // Utilisez ReservationStatut
  dateArriveePeriode?: Date; // Filtre par date d'arrivée
  dateDepartPeriode?: Date;  // Filtre par date de départ
  // Ajout d'autres filtres spécifiques aux réservations si nécessaire
  // typeChambre?: string | 'Tous';
  // sourceReservation?: 'Site Web' | 'Booking.com' | 'Expedia' | 'Autre' | 'Tous';
}

interface FiltresReservationsProps {
  onFilterChange: (filters: ReservationFilters) => void;
  onAddReservation: () => void; // Callback pour déclencher l'ajout d'une réservation
}

const FiltresReservations: React.FC<FiltresReservationsProps> = ({ onFilterChange, onAddReservation }) => {
  const [filters, setFilters] = useState<ReservationFilters>({
    rechercheGenerale: '',
    statut: 'Tous',
    dateArriveePeriode: undefined,
    dateDepartPeriode: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: keyof ReservationFilters, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      // Si la valeur est 'Tous', définissez la propriété sur undefined pour ne pas filtrer sur cette valeur
      [name]: value === 'Tous' ? undefined : value as ReservationStatut, // Cast pour s'assurer du type
    }));
  };

  const handleDateArriveeChange = (date?: Date) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      dateArriveePeriode: date,
    }));
  };

  const handleDateDepartChange = (date?: Date) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      dateDepartPeriode: date,
    }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    const defaultFilters: ReservationFilters = {
      rechercheGenerale: '',
      statut: 'Tous',
      dateArriveePeriode: undefined,
      dateDepartPeriode: undefined,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 border rounded-md mb-6 bg-background">
      {/* Champ de recherche générale (nom, prénom, email client) */}
      <div className="flex flex-col gap-2 min-w-[200px] flex-grow">
        <label htmlFor="rechercheGenerale" className="text-sm font-medium">Recherche (Client, Email...)</label>
        <Input
          id="rechercheGenerale"
          name="rechercheGenerale"
          placeholder="Rechercher par client ou email..."
          value={filters.rechercheGenerale || ''}
          onChange={handleChange}
        />
      </div>

      {/* Select pour le statut de la réservation */}
      <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
        <label htmlFor="statut" className="text-sm font-medium">Statut de la réservation</label>
        <Select
          value={filters.statut || 'Tous'}
          onValueChange={(value) => handleSelectChange('statut', value)}
        >
          <SelectTrigger className="w-full" id="statut">
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tous">Tous les statuts</SelectItem>
            {Object.values(ReservationStatut).map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')} {/* Formatage du statut */}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sélection de date d'arrivée */}
      <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
        <label htmlFor="dateArriveePeriode" className="text-sm font-medium">Date d&apos;arrivée</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !filters.dateArriveePeriode && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateArriveePeriode ? format(filters.dateArriveePeriode, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateArriveePeriode}
              onSelect={handleDateArriveeChange}
              initialFocus
              locale={fr} // Passez la locale au calendrier
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Sélection de date de départ */}
      <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
        <label htmlFor="dateDepartPeriode" className="text-sm font-medium">Date de départ</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !filters.dateDepartPeriode && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateDepartPeriode ? format(filters.dateDepartPeriode, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateDepartPeriode}
              onSelect={handleDateDepartChange}
              initialFocus
              locale={fr} // Passez la locale au calendrier
            />
          </PopoverContent>
        </Popover>
      </div>

      
      <div className="w-full flex justify-between mt-4 md:mt-0">
        {/* Boutons d'action */}
      <div className="flex gap-2 mt-auto w-full sm:w-auto">
        <Button onClick={applyFilters} className="flex-grow">Appliquer les filtres</Button>
        <Button variant="outline" onClick={resetFilters} className="flex-grow">
          <XCircle className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
        <Button onClick={onAddReservation} className="sm:ml-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter une réservation
        </Button>
      </div>
    </div>
  );
};

export default FiltresReservations;