// src/components/planning/DetailsPlanningEvent.tsx
"use client";

import React from 'react';
import { PlanningEvent } from '@/types/planning';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Trash2 } from 'lucide-react';

interface DetailsPlanningEventProps {
  event: PlanningEvent;
  onEdit: () => void;
  onDelete: () => void;
}

const DetailsPlanningEvent: React.FC<DetailsPlanningEventProps> = ({ event, onEdit, onDelete }) => {
  const getStatusBadgeVariant = (status: PlanningEvent['status']) => {
    switch (status) {
      case 'Confirmé': return 'default';
      case 'En attente': return 'secondary';
      case 'Annulé': return 'outline';
      case 'Terminé': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <p className="font-medium">ID Événement:</p>
        <p>{event.id}</p>

        <p className="font-medium">Employé:</p>
        <p>{event.nomEmploye} (ID: {event.employeId})</p>

        <p className="font-medium">Type d'événement:</p>
        <p>{event.type}</p>

        <p className="font-medium">Statut:</p>
        <Badge variant={getStatusBadgeVariant(event.status)}>{event.status}</Badge>

        <p className="font-medium">Titre:</p>
        <p className="col-span-2">{event.title}</p>

        <p className="font-medium">Date de début:</p>
        <p>{format(parseISO(event.dateDebut), 'PPP HH:mm', { locale: fr })}</p>

        <p className="font-medium">Date de fin:</p>
        <p>{format(parseISO(event.dateFin), 'PPP HH:mm', { locale: fr })}</p>

        {event.location && (
          <>
            <p className="font-medium">Lieu:</p>
            <p className="col-span-2">{event.location}</p>
          </>
        )}

        {event.description && (
          <>
            <p className="font-medium">Description:</p>
            <p className="col-span-2 italic text-muted-foreground">{event.description}</p>
          </>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" /> Modifier
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" /> Supprimer
        </Button>
      </div>
    </div>
  );
};

export default DetailsPlanningEvent;