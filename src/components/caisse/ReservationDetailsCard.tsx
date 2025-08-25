// src/components/caisse/ReservationDetailsCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingFormData } from "@/schemas/reservation";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReservationDetailsCardProps {
  reservation: BookingFormData | null;
}

export function ReservationDetailsCard({ reservation }: ReservationDetailsCardProps) {
  if (!reservation) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Détails de la réservation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucune réservation sélectionnée.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader>
        <CardTitle>Réservation # {reservation.id || 'N/A'}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        <div>
          <p><span className="font-semibold">Client:</span> {reservation.civilite} {reservation.prenom} {reservation.nom}</p>
          <p><span className="font-semibold">Chambre:</span> {reservation.chambreDesireeId}</p>
          <p><span className="font-semibold">Statut:</span> {reservation.statut}</p>
        </div>
        <div>
          <p><span className="font-semibold">Arrivée:</span> {reservation.dateArrivee ? format(new Date(reservation.dateArrivee), 'PPP', { locale: fr }) : 'N/A'}</p>
          <p><span className="font-semibold">Départ:</span> {reservation.dateDepart ? format(new Date(reservation.dateDepart), 'PPP', { locale: fr }) : 'N/A'}</p>
          <p><span className="font-semibold">Adultes/Enfants:</span> {reservation.nbAdultes}/{reservation.nbEnfants}</p>
        </div>
        {/* Ajoutez d'autres détails pertinents de la réservation ici */}
      </CardContent>
    </Card>
  );
}