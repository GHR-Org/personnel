// src/components/interventions/InterventionCalendar.tsx
"use client";

import { Intervention, useAppStore } from '@/lib/stores/maintenance_store';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "@/styles/calendar.css";

const locales = {
    'fr': fr,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface InterventionCalendarProps {
    interventions: Intervention[];
    onEventClick: (interventionId: string) => void;
}

export function InterventionCalendar({ interventions, onEventClick }: InterventionCalendarProps) {
    const incidents = useAppStore(state => state.incidents);

    const events = useMemo(() => {
        return interventions.map(intervention => {
            const incident = incidents.find(inc => inc.id === intervention.incident_Id);
            const equipmentName = incident?.equipement_id ? `Éq-${incident.equipement_id}` : 'Inconnu';
            
            const scheduledDate = new Date(intervention.scheduledDate);
            
            return {
                id: intervention.id,
                // Le titre est maintenant basé uniquement sur le statut et l'équipement
                title: `${intervention.status}: ${equipmentName}`,
                start: scheduledDate,
                end: scheduledDate,
                allDay: true,
                status: intervention.status,
            };
        });
    }, [interventions, incidents]);

    // Définition de la personnalisation des événements
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventPropGetter = (event: any) => {
        let backgroundColor;
        switch (event.status) {
            case 'Planifiée':
                backgroundColor = '#3b82f6'; // Bleu
                break;
            case 'En cours':
                backgroundColor = '#f59e0b'; // Jaune
                break;
            case 'Terminée':
                backgroundColor = '#10b981'; // Vert
                break;
            case 'Annulée':
                backgroundColor = '#ef4444'; // Rouge
                break;
            default:
                backgroundColor = '#9ca3af'; // Gris
        }
        return { style: { backgroundColor } };
    };

    return (
        <div className="h-[600px]">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                messages={{
                    next: "Suivant",
                    previous: "Précédent",
                    today: "Aujourd'hui",
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour",
                    date: "Date",
                    time: "Heure",
                    event: "Événement"
                }}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                eventPropGetter={eventPropGetter}
                onSelectEvent={(event) => onEventClick(event.id as string)}
            />
        </div>
    );
}