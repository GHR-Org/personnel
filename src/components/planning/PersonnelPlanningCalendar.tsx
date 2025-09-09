/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/planning/PersonnelPlanningCalendar.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { format, parseISO, isValid, startOfDay, endOfDay, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';

// Import des composants UI de Shadcn
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar } from '@/components/ui/calendar'; // Ceci est le composant Calendar de Shadcn UI (sélecteur de date)

// Import des icônes de Lucide React (notez que 'Calendar' n'est plus importé ici pour éviter le conflit)
import { CalendarIcon, User, PlusCircle, XCircle } from 'lucide-react';


// Import des types et des données
import { PlanningEvent, PlanningEventType, PlanningEventStatus } from '@/types/planning';
import FormulairePlanningEvent from './FormulairePlanningEvent';
import DetailsPlanningEvent from './DetailsPlanningEvent';
import { cn } from '@/lib/utils'; // Pour les classes conditionnelles

// Import et configuration de React Big Calendar
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'; // Renommage pour éviter le conflit
import moment from 'moment'; // Assurez-vous que 'moment' est bien installé (pnpm add moment)
import { Label } from '../ui/label';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css'; // Votre fichier CSS personnalisé pour le calendrier

// Configuration du localizer pour react-big-calendar avec moment.js
moment.locale('fr', {
  week: {
    dow: 1, // Lundi est le premier jour de la semaine
    doy: 4, // La première semaine de l'année contient le 4 janvier
  },
});
const localizer = momentLocalizer(moment);

// Interface pour les événements du calendrier Big Calendar
interface BigCalendarEvent {
  id: number; // L'ID de l'événement de planning (maintenant un number)
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: PlanningEvent; // Pour stocker l'objet PlanningEvent original
}

interface PersonnelPlanningCalendarProps {
  allPlanningEvents: PlanningEvent[]; // Tous les événements disponibles
  // Fonctions pour la gestion des événements (à implémenter dans la page parente)
  onAddEvent: (eventData: Omit<PlanningEvent, 'id' | 'status'>) => void;
  onUpdateEvent: (id: number, eventData: Omit<PlanningEvent, 'id' | 'status'>) => void; // ID est maintenant un number
  onDeleteEvent: (id: number) => void; // ID est maintenant un number
}

const PersonnelPlanningCalendar: React.FC<PersonnelPlanningCalendarProps> = ({
  allPlanningEvents,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent
}) => {
  const [filteredEvents, setFilteredEvents] = useState<PlanningEvent[]>(allPlanningEvents);
  const [eventTypeFilter, setEventTypeFilter] = useState<PlanningEventType | 'Tous'>('Tous');
  const [statusFilter, setStatusFilter] = useState<PlanningEventStatus | 'Tous'>('Tous');
  const [employeeFilter, setEmployeeFilter] = useState<string | 'Tous'>('Tous'); // Nouveau filtre par employé

  // Initialisation des dates de filtre à `undefined` pour ne pas filtrer par défaut
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined);
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(undefined);

  // États pour les modales
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null); // Changez le type en 'number | null'
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<number | null>(null); // Changez le type en 'number | null'


  // Liste unique des employés pour le filtre (reste basée sur personnel_id)
   const uniqueEmployees = useMemo(() => {
    const employees = new Set<string>();
    allPlanningEvents.forEach(event => {
      // Vérifiez si personnel_id est défini avant d'appeler toLocaleString()
      if (event.personnel_id !== undefined && event.personnel_id !== null) {
        employees.add(event.personnel_id.toLocaleString());
      }
    });
    return Array.from(employees).sort();
  }, [allPlanningEvents]);

  // Effet pour filtrer les événements chaque fois que les données ou les filtres changent
  useEffect(() => {
    let tempEvents = [...allPlanningEvents];

    if (eventTypeFilter !== 'Tous') {
      tempEvents = tempEvents.filter(event => event.type === eventTypeFilter);
    }

    if (statusFilter !== 'Tous') {
      tempEvents = tempEvents.filter(event => event.status === statusFilter);
    }

    if (employeeFilter !== 'Tous') {
      // Comparer avec le personnel_id sous forme de chaîne car le filtre est une chaîne
      tempEvents = tempEvents.filter(event =>
        // Vérifiez si personnel_id est défini avant d'appeler toLocaleString()
        event.personnel_id !== undefined && event.personnel_id !== null &&
        event.personnel_id.toLocaleString() === employeeFilter
      );
    }

    if (startDateFilter) {
      tempEvents = tempEvents.filter(event =>
        parseISO(event.dateFin) >= startOfDay(startDateFilter)
      );
    }

    if (endDateFilter) {
      tempEvents = tempEvents.filter(event =>
        parseISO(event.dateDebut) <= endOfDay(endDateFilter)
      );
    }

    setFilteredEvents(tempEvents);
  }, [allPlanningEvents, eventTypeFilter, statusFilter, employeeFilter, startDateFilter, endDateFilter]);

  // Convertir PlanningEvent en BigCalendarEvent (format attendu par react-big-calendar)
 const calendarEvents = useMemo(() => {
  return filteredEvents.map(event => {
    const startDate = parseISO(event.dateDebut);
    let endDate = parseISO(event.dateFin);

    // Déterminer si l'événement est sur toute la journée
    const isAllDay = event.dateDebut.length === 10 && event.dateFin.length === 10 && event.dateDebut === event.dateFin;
    if (isAllDay) {
      endDate = endOfDay(endDate); // Ajuste la fin à 23:59:59 du jour
    }

    // Assurez-vous que personnel_id est défini avant d'appeler toString()
    const personnelIdDisplay = event.personnel_id !== undefined && event.personnel_id !== null
      ? event.personnel_id.toString()
      : 'Inconnu'; // Ou une autre valeur par défaut, ex: '' ou 'N/A'

    return {
      id: event.id, // Utilise l'ID réel de l'événement
      title: `${personnelIdDisplay} - ${event.titre}`, // Utilise la valeur sécurisée
      start: startDate,
      end: endDate,
      allDay: isAllDay, // Passer cette propriété à BigCalendar
      resource: event, // Stocke l'objet PlanningEvent original pour un accès facile
    };
  });
}, [filteredEvents]);

  // Gérer la couleur des événements dans le calendrier
  const getEventPropGetter = useCallback((event: BigCalendarEvent) => {
    const originalEvent = event.resource;
    let backgroundColor = '#3174ad'; // Couleur par défaut

    if (originalEvent) {
      switch (originalEvent.type) {
        case PlanningEventType.ABSENCE: // Utiliser les enums directement
          backgroundColor = '#ff9800'; // Orange
          break;
        case PlanningEventType.FORMATION:
          backgroundColor = '#2196f3'; // Bleu
          break;
        case PlanningEventType.MISSION:
          backgroundColor = '#9c27b0'; // Violet
          break;
        case PlanningEventType.REUNION:
          backgroundColor = '#4caf50'; // Vert
          break;
        case PlanningEventType.TACHE:
          backgroundColor = '#607d8b'; // Gris-bleu
          break;
        default:
          backgroundColor = '#3174ad';
      }

      // Ajuster la couleur en fonction du statut
      if (originalEvent.status === PlanningEventStatus.EN_ATTENTE) { // Utiliser les enums
        backgroundColor = lightenColor(backgroundColor, 30); // Plus clair
      } else if (originalEvent.status === PlanningEventStatus.ANNULEE) {
        backgroundColor = '#bdbdbd'; // Gris
      }
    }

    return { style: { backgroundColor } };
  }, []);

  // Fonction utilitaire pour éclaircir une couleur hexadécimale
  const lightenColor = (hex: string, percent: number) => {
    const f = parseInt(hex.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent,
      R = f >> 16,
      G = (f >> 8) & 0x00ff,
      B = f & 0x0000ff;
    return (
      '#' +
      (
        0x1000000 +
        (Math.round((t - R) * p) + R) * 0x10000 +
        (Math.round((t - G) * p) + G) * 0x100 +
        (Math.round((t - B) * p) + B)
      )
        .toString(16)
        .slice(1)
    );
  };

  // Gestionnaires d'événements pour le calendrier
  const handleSelectEvent = (event: BigCalendarEvent) => {
    setSelectedEventId(event.id); // Utilise l'ID de l'événement
    setIsDetailsModalOpen(true);
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    // Permet d'ouvrir le formulaire d'ajout avec les dates pré-remplies
    setSelectedEventId(null); // Pour indiquer un ajout
    setIsAddEditModalOpen(true);
    // Optionnel: vous pourriez passer ces dates au FormulairePlanningEvent
    // pour pré-remplir les champs dateDebut et dateFin.
    // Cela nécessiterait d'ajouter des props à FormulairePlanningEvent pour les initialDates.
  };

  const handleAddEvent = () => {
    setSelectedEventId(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditEvent = (id: number) => { // ID est maintenant un number
    setSelectedEventId(id);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteRequest = (id: number) => { // ID est maintenant un number
    setEventToDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDeleteId !== null) { // Vérifiez que eventToDeleteId n'est pas null
      onDeleteEvent(eventToDeleteId);
      setEventToDeleteId(null);
      setIsDeleteConfirmOpen(false);
    }
  };

  // Trouver l'événement sélectionné pour l'édition ou les détails
  // Recherche maintenant par event.id
  const selectedPlanningEvent = selectedEventId !== null
    ? allPlanningEvents.find(e => e.id === selectedEventId)
    : undefined;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          Planning Interne du Personnel
        </CardTitle>
        <p className="text-sm text-muted-foreground">Visualisation et gestion des événements de planning de tous les employés.</p>
      </CardHeader>
      <CardContent>
        {/* Filtres */}
        <div className="flex flex-wrap items-end gap-4 p-4 border rounded-md mb-6 bg-background">
          {/* Filtre par employé */}
          <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
            <Label htmlFor="employeeFilter" className="text-sm font-medium">Employé</Label>
            <Select
              value={employeeFilter}
              onValueChange={(value) => setEmployeeFilter(value)}
            >
              <SelectTrigger className="w-full" id="employeeFilter">
                <SelectValue placeholder="Tous les employés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les employés</SelectItem>
                {uniqueEmployees.map(id => ( // Utilisez 'id' car ce sont des IDs de personnel
                  <SelectItem key={id} value={id}>{`Employé ${id}`}</SelectItem> // Affichez 'Employé ID' ou le vrai nom de l'employé si vous l'avez
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type d'événement */}
          <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
            <Label htmlFor="eventTypeFilter" className="text-sm font-medium">Type d&apos;événement</Label>
            <Select
              value={eventTypeFilter}
              onValueChange={(value) => setEventTypeFilter(value as PlanningEventType | 'Tous')}
            >
              <SelectTrigger className="w-full" id="eventTypeFilter">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les types</SelectItem>
                {Object.values(PlanningEventType).map(type => ( // Parcourez les valeurs de l'enum
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Statut */}
          <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
            <Label htmlFor="statusFilter" className="text-sm font-medium">Statut</Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as PlanningEventStatus | 'Tous')}
            >
              <SelectTrigger className="w-full" id="statusFilter">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                {Object.values(PlanningEventStatus).map(status => ( // Parcourez les valeurs de l'enum
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date de début de période (avec sélecteur de date Shadcn UI) */}
          <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
            <Label htmlFor="startDateFilter" className="text-sm font-medium">Du</Label>
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
                  {startDateFilter ? format(startDateFilter, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar // Utilise le Calendar de Shadcn UI
                  mode="single"
                  selected={startDateFilter}
                  onSelect={setStartDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date de fin de période (avec sélecteur de date Shadcn UI) */}
          <div className="flex flex-col gap-2 min-w-[180px] flex-grow">
            <Label htmlFor="endDateFilter" className="text-sm font-medium">Au</Label>
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
                  {endDateFilter ? format(endDateFilter, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar // Utilise le Calendar de Shadcn UI
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
              setEmployeeFilter('Tous');
              setStartDateFilter(undefined);
              setEndDateFilter(undefined);
            }}
            className="mt-auto"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <div className="w-full flex justify-end mt-4 md:mt-0">
            <Button onClick={handleAddEvent} className="sm:ml-auto">
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un événement
            </Button>
          </div>
        </div>

        {/* Calendrier principal (React Big Calendar) */}
        <div className="h-[700px] w-full"> {/* Hauteur fixe pour le calendrier */}
          <BigCalendar // Utilise le composant renommé BigCalendar de react-big-calendar
            localizer={localizer}
            events={calendarEvents} // Assurez-vous que calendarEvents est bien formé ici
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            selectable // Permet la sélection de plages horaires
            onSelectEvent={handleSelectEvent} // Gère le clic sur un événement existant
            onSelectSlot={handleSelectSlot} // Gère la sélection d'une plage horaire vide
            eventPropGetter={getEventPropGetter} // Personnalise l'affichage des événements
            messages={{ // Traduction des messages du calendrier
              next: 'Suivant',
              previous: 'Précédent',
              today: 'Aujourd\'hui',
              month: 'Mois',
              week: 'Semaine',
              day: 'Jour',
              agenda: 'Agenda',
              date: 'Date',
              time: 'Heure',
              event: 'Événement',
              noEventsInRange: 'Aucun événement dans cette période.',
            }}
            formats={{ // Personnalisation des formats de date/heure
              dateFormat: 'dd/MM',
              dayFormat: (date: Date, culture?: string, localizer?: any) =>
                localizer!.format(date, 'ddd DD/MM', culture),
              monthHeaderFormat: (date: Date, culture?: string, localizer?: any) =>
                localizer!.format(date, 'MMMM yyyy', culture),
              dayHeaderFormat: (date: Date, culture?: string, localizer?: any) =>
                localizer!.format(date, 'dddd DD MMMM', culture),
              agendaDateFormat: 'ddd DD MMM',
              agendaTimeFormat: 'HH:mm',
              agendaTimeRangeFormat: (range: { start: Date; end: Date; }, culture?: string, localizer?: any) =>
                localizer!.format(range.start, 'HH:mm', culture) +
                ' - ' +
                localizer!.format(range.end, 'HH:mm', culture),
            }}
          />
        </div>

        {/* Modale Ajouter/Modifier un événement */}
        <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedEventId !== null ? "Modifier l'événement" : "Ajouter un nouvel événement"}</DialogTitle>
            </DialogHeader>
            <FormulairePlanningEvent
              initialData={selectedPlanningEvent}
              onSave={(data) => {
                if (selectedEventId !== null) { // Vérifiez que selectedEventId n'est pas null
                  onUpdateEvent(selectedEventId, data);
                } else {
                  onAddEvent(data);
                }
                setIsAddEditModalOpen(false);
                setSelectedEventId(null);
              }}
              onCancel={() => setIsAddEditModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Modale Détails de l'événement */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Détails de l&apos;événement</DialogTitle>
            </DialogHeader>
            {selectedPlanningEvent && (
              <DetailsPlanningEvent
                event={selectedPlanningEvent}
                onEdit={() => {
                  setIsDetailsModalOpen(false);
                  handleEditEvent(selectedEventId!); // Utilisez ! car on sait qu'il n'est pas null ici
                }}
                onDelete={() => {
                  setIsDetailsModalOpen(false);
                  handleDeleteRequest(selectedEventId!); // Utilisez ! car on sait qu'il n'est pas null ici
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Modale Confirmation de suppression */}
        <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Elle supprimera définitivement cet événement de planning.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => { setEventToDeleteId(null); setIsDeleteConfirmOpen(false); }}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Supprimer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </CardContent>
    </Card>
  );
};

export default PersonnelPlanningCalendar;