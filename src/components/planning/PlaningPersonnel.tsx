// src/components/planning/PersonnelPlanning.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { CalendarIcon, User, Search, Filter, PlusCircle, Clock, XCircle } from 'lucide-react';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

import { PlanningEvent, PlanningEventType, PlanningEventStatus } from '@/types/planning';

interface PersonnelPlanningProps {
  // Simule l'ID de l'employé actuellement connecté
  currentEmployeeId: string;
  allPlanningEvents: PlanningEvent[]; // Tous les événements disponibles
}

const PersonnelPlanning: React.FC<PersonnelPlanningProps> = ({ currentEmployeeId, allPlanningEvents }) => {
  const [filteredEvents, setFilteredEvents] = useState<PlanningEvent[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState<PlanningEventType | 'Tous'>('Tous');
  const [statusFilter, setStatusFilter] = useState<PlanningEventStatus | 'Tous'>('Tous');
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined);
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(undefined);

  // Filtrer les événements pour l'employé actuel
  const employeeEvents = useMemo(() => {
    return allPlanningEvents.filter(event => event.employeId === currentEmployeeId);
  }, [allPlanningEvents, currentEmployeeId]);

  useEffect(() => {
    let tempEvents = [...employeeEvents]; // Copie pour la mutation

    if (eventTypeFilter !== 'Tous') {
      tempEvents = tempEvents.filter(event => event.type === eventTypeFilter);
    }

    if (statusFilter !== 'Tous') {
      tempEvents = tempEvents.filter(event => event.status === statusFilter);
    }

    if (startDateFilter) {
      tempEvents = tempEvents.filter(event =>
        parseISO(event.dateFin) >= startDateFilter // L'événement se termine après ou le jour du début du filtre
      );
    }

    if (endDateFilter) {
      tempEvents = tempEvents.filter(event =>
        parseISO(event.dateDebut) <= endDateFilter // L'événement commence avant ou le jour de la fin du filtre
      );
    }

    // Trier par date de début (du plus ancien au plus récent)
    tempEvents.sort((a, b) => parseISO(a.dateDebut).getTime() - parseISO(b.dateDebut).getTime());

    setFilteredEvents(tempEvents);
  }, [employeeEvents, eventTypeFilter, statusFilter, startDateFilter, endDateFilter]);

  const getStatusBadgeVariant = (status: PlanningEventStatus) => {
    switch (status) {
      case 'Confirmé': return 'default';
      case 'En attente': return 'secondary';
      case 'Annulé': return 'outline';
      case 'Terminé': return 'success'; // Peut-être une autre variante pour terminé
      default: return 'secondary';
    }
  };

  const getEventTypeIcon = (type: PlanningEventType) => {
    switch (type) {
      case 'Absence': return <User className="h-4 w-4 text-orange-500" />;
      case 'Formation': return <Search className="h-4 w-4 text-blue-500" />;
      case 'Mission': return <Filter className="h-4 w-4 text-purple-500" />; // Icône temporaire, pourrait être plus spécifique
      case 'Réunion': return <PlusCircle className="h-4 w-4 text-green-500" />; // Icône temporaire
      case 'Tâche': return <CalendarIcon className="h-4 w-4 text-gray-500" />; // Icône temporaire
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Planning Personnel
        </CardTitle>
        <p className="text-sm text-muted-foreground">Visualisez vos absences, formations, missions et autres événements.</p>
      </CardHeader>
      <CardContent>
        {/* Filtres */}
        <div className="flex flex-wrap items-end gap-4 p-4 border rounded-md mb-6 bg-background">
          {/* Type d'événement */}
          <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
            <label htmlFor="eventTypeFilter" className="text-sm font-medium">Type d'événement</label>
            <Select
              value={eventTypeFilter}
              onValueChange={(value) => setEventTypeFilter(value as PlanningEventType | 'Tous')}
            >
              <SelectTrigger className="w-full" id="eventTypeFilter">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les types</SelectItem>
                <SelectItem value="Absence">Absence</SelectItem>
                <SelectItem value="Formation">Formation</SelectItem>
                <SelectItem value="Mission">Mission</SelectItem>
                <SelectItem value="Réunion">Réunion</SelectItem>
                <SelectItem value="Tâche">Tâche</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statut */}
          <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
            <label htmlFor="statusFilter" className="text-sm font-medium">Statut</label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as PlanningEventStatus | 'Tous')}
            >
              <SelectTrigger className="w-full" id="statusFilter">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                <SelectItem value="Confirmé">Confirmé</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Annulé">Annulé</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date de début de période */}
          <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
            <label htmlFor="startDateFilter" className="text-sm font-medium">Du</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDateFilter ? format(startDateFilter, "PPP") : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDateFilter}
                  onSelect={setStartDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date de fin de période */}
          <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
            <label htmlFor="endDateFilter" className="text-sm font-medium">Au</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDateFilter ? format(endDateFilter, "PPP") : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDateFilter}
                  onSelect={setEndDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Bouton de réinitialisation des filtres */}
          <Button
            variant="outline"
            onClick={() => {
              setEventTypeFilter('Tous');
              setStatusFilter('Tous');
              setStartDateFilter(undefined);
              setEndDateFilter(undefined);
            }}
            className="mt-auto"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>

        {/* Liste des événements */}
        <div className="space-y-4 mt-6">
          {filteredEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun événement de planning trouvé pour vous avec les filtres actuels.</p>
          ) : (
            filteredEvents.map(event => (
              <div key={event.id} className="border rounded-md p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors">
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  event.status === 'Confirmé' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                  event.status === 'En attente' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                  event.status === 'Annulé' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {getEventTypeIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-base truncate">{event.title}</h4>
                    <Badge variant={getStatusBadgeVariant(event.status)} className="ml-2 flex-shrink-0">
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Du {format(parseISO(event.dateDebut), 'dd MMM yyyy', { locale: fr })} au {format(parseISO(event.dateFin), 'dd MMM yyyy', { locale: fr })}
                    {event.location && ` - ${event.location}`}
                  </p>
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonnelPlanning;