
"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { cn } from '@/lib/utils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { IconEdit, IconX, IconLogin2, IconLogout2, IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';
import { ReservationStatut } from "@/lib/enum/ReservationStatus";
import type { BookingEvent } from "@/schemas/reservation";
import type { View } from 'react-big-calendar';
// L'import de useEtablissementId n'est plus nécessaire ici
// import "@/styles/calendar.css"; 
import "@/styles/calendar.css";


moment.locale('fr');
const localizer = momentLocalizer(moment);

const reservationStatusStyle: Record<ReservationStatut, string> = {
  [ReservationStatut.PREVUE]: 'bg-blue-400 hover:bg-blue-500 text-white',
  [ReservationStatut.CONFIRMEE]: 'bg-green-400 hover:bg-green-500 text-white',
  [ReservationStatut.ARRIVEE]: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  [ReservationStatut.TERMINEE]: 'bg-gray-600 hover:bg-gray-700 text-white',
  [ReservationStatut.ANNULEE]: 'bg-red-500 hover:bg-red-600 text-white line-through',
  [ReservationStatut.NON_RENSEIGNE]: 'bg-purple-400 hover:bg-purple-500 text-white',
  [ReservationStatut.EN_ATTENTE]: 'bg-slate-400 hover:bg-slate-500 text-white',
};

interface RoomTableProps {
  rooms: { id: number; name: string }[];
  reservations: BookingEvent[];
  openDetailsDrawer: (reservation: BookingEvent) => void;
  isDetailsDrawerOpen: boolean;
  openEditReservationModal: (reservation: BookingEvent) => void;
  handleCloseReservationSheet: () => void;
  handleCheckInClient: (id: string) => void;
  openArrhesModal: (reservation: BookingEvent) => void;
  handleCancelReservation: (id: string) => void;
  handleCheckoutReservation: (id: string) => void;
  handleRequestCleaning: (roomId: string) => void;
  openReportIncidentModal: (reservation: BookingEvent) => void;
  handleDeleteReservation: (id: string) => void;
  onSelectSlot: (data: { date_arrivee: string; date_depart: string; chambre_id: number; }) => void;
  reservationToView: BookingEvent | null;
  onSendConfirmation: (reservationId: string) => Promise<void>;
  onBookingUpdated: (updatedReservation: BookingEvent) => void;
}

const RoomTable: React.FC<RoomTableProps> = ({
  rooms = [],
  reservations = [],
  openDetailsDrawer,
  openEditReservationModal,
  handleCheckInClient,
  openArrhesModal,
  handleCancelReservation,
  handleCheckoutReservation,
  handleRequestCleaning,
  openReportIncidentModal,
  handleDeleteReservation,
  onSelectSlot,
}) => {
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState<Date>(new Date());

  const events = useMemo(() => {
    return reservations.map(reservation => {
      const departureDate = moment(reservation.date_depart);
      const clientName = (reservation.first_name || 'N/A') + ' ' + (reservation.last_name ? reservation.last_name.charAt(0) + '.' : '');
      return {
        id: reservation.id,
        title: clientName.trim(),
        start: moment(reservation.date_arrivee).toDate(),
        end: departureDate.add(1, 'day').toDate(),
        resourceId: reservation.chambre_id,
        reservation: reservation,
        allDay: true,
      };
    });
  }, [reservations]);

  const roomResources = useMemo(() => {
    return rooms.map(room => ({
      resourceId: room.id,
      resourceTitle: room.name,
    }));
  }, [rooms]);

  const Event = useCallback(({ event }: { event: { reservation: BookingEvent, title: string } }) => {
    const reservation = event.reservation;
    return (
      <ContextMenu key={`reservation-${reservation.id}-grid`}>
        <ContextMenuTrigger asChild>
          <button
            className={cn(
              `p-1 rounded-md text-xs font-medium overflow-hidden whitespace-nowrap text-ellipsis flex items-center justify-center cursor-pointer shadow-sm z-20`,
              reservationStatusStyle[reservation.status] ||
              "bg-gray-400 hover:bg-gray-500 text-white"
            )}
            onClick={() => openDetailsDrawer(reservation)}
          >
            {event.title}
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => openEditReservationModal(reservation)}>
            <IconEdit className="mr-2 h-4 w-4" /> Modifier la fiche réservation
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => handleCheckInClient(reservation.id)}
            disabled={reservation.status === ReservationStatut.ARRIVEE}
          >
            <IconLogin2 className="mr-2 h-4 w-4" /> Faire arriver le client
          </ContextMenuItem>
          <ContextMenuItem onClick={() => openArrhesModal(reservation)}>
            Voir les arrhes
          </ContextMenuItem>
          <ContextMenuItem onClick={() => openDetailsDrawer(reservation)}>
            Détails de la réservation
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => handleCancelReservation(reservation.id)}
            disabled={
              reservation.status === ReservationStatut.ANNULEE ||
              reservation.status === ReservationStatut.TERMINEE
            }
          >
            <IconX className="mr-2 h-4 w-4" /> Annulation
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => handleCheckoutReservation(reservation.id)}
            disabled={
              reservation.status !== ReservationStatut.ARRIVEE
            }
          >
            <IconLogout2 className="mr-2 h-4 w-4" /> Dégagement automatique
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => handleRequestCleaning(reservation.chambre_id.toString())}
          >
            Demander nettoyage
          </ContextMenuItem>
          <ContextMenuItem onClick={() => openReportIncidentModal(reservation)}>
            Rapport & Incidents
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => toast.info("Fonctionnalité 'Imprimer' à implémenter.")}
          >
            Imprimer
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => handleDeleteReservation(reservation.id)}
            className="text-red-600 focus:bg-red-50 focus:text-red-600"
          >
            <IconTrash className="mr-2 h-4 w-4" /> Supprimer la réservation
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }, [
    openDetailsDrawer,
    openEditReservationModal,
    handleCheckInClient,
    openArrhesModal,
    handleCancelReservation,
    handleCheckoutReservation,
    handleRequestCleaning,
    openReportIncidentModal,
    handleDeleteReservation,
  ]);

  const handleSelectSlot = useCallback(
    ({ start, end, resourceId }: { start: Date; end: Date; resourceId?: number | string }) => {
      if (onSelectSlot && typeof resourceId === 'number') {
        const formattedStartDate = moment(start).format('YYYY-MM-DD');
        const formattedEndDate = moment(end).subtract(1, 'day').format('YYYY-MM-DD');

        onSelectSlot({
          date_arrivee: formattedStartDate,
          date_depart: formattedEndDate,
          chambre_id: resourceId,
        });
      } else {
        toast.info("Veuillez sélectionner une chambre pour ajouter une réservation.");
      }
    },
    [onSelectSlot]
  );

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);
  
  // Suppression de toute la logique de chargement ici
  // Elle est maintenant gérée par le composant parent et le système Next.js/Suspense

  return (
    <div style={{ height: '80vh' }}>
      <Calendar
        localizer={localizer}
        events={events}
        resources={roomResources}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
        view={view}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
        defaultView="week"
        views={['week', 'month', 'day', 'agenda']}
        onSelectSlot={handleSelectSlot}
        selectable
        components={{
          event: Event,
        }}
        messages={{
          allDay: 'Toute la journée',
          previous: 'Précédent',
          next: 'Suivant',
          today: 'Aujourd\'hui',
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
          agenda: 'Agenda',
          date: 'Date',
          time: 'Heure',
          event: 'Événement',
          noEventsInRange: 'Pas d\'événements dans cette plage.',
          showMore: total => `+ ${total} de plus`,
        }}
        culture="fr"
      />
    </div>
  );
};

export default RoomTable;