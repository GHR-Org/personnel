// src/components/caisse/ReservationDetailsCard.tsx

"use client";

import React, { useState, useEffect, JSX } from 'react'; // 👈 On importe useState et useEffect
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingManuel } from "@/schemas/reservation";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
// Note: On retire useQuery

import { getClientById } from '@/func/api/clients/apiclient';
import { Client } from '@/types/client';

interface ReservationDetailsCardProps {
  reservation: BookingManuel | null;
}

export function ReservationDetailsCard({ reservation }: ReservationDetailsCardProps) {
  
  // 1. Définition des états locaux pour le client et le chargement
  const [client, setClient] = useState<Client | null>(null);
  const [isClientLoading, setIsClientLoading] = useState(false);
  const [isClientError, setIsClientError] = useState(false);

  const clientId = reservation?.client_id; // On récupère l'ID du client si la réservation existe

  // 2. Lancement de l'appel API via useEffect
  useEffect(() => {
    // Si la réservation change, on réinitialise l'état du client
    setClient(null);
    setIsClientError(false);

    if (clientId) {
      setIsClientLoading(true);
      
      const fetchClient = async () => {
        try {
          // 🚀 Lancement de l'appel API
          const clientData = await getClientById(clientId);
          setClient(clientData);
          setIsClientError(false);
        } catch (error) {
          console.error("Erreur lors du chargement du client:", error);
          setIsClientError(true);
          setClient(null);
        } finally {
          setIsClientLoading(false);
        }
      };

      fetchClient();
    }
  }, [clientId]); 

  // 3. Gestion du cas où aucune réservation n'est sélectionnée (Rendu précoce)
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
  
  // 4. Détermination de l'affichage du client
  let clientDisplay: JSX.Element;

  if (isClientLoading) {
    clientDisplay = (
      <span className="text-muted-foreground italic animate-pulse">
        Chargement du client...
      </span>
    );
  } else if (isClientError) {
    clientDisplay = <span className="text-destructive">Erreur de chargement du client.</span>;
  } else if (client) {
    // Si les données client sont chargées, on utilise ses vrais détails
    clientDisplay = (
      <p>
        <span className="font-semibold">Client:</span> {client.first_name} {client.last_name}
      </p>
    );
  } else {
      // Cas où clientId est valide, mais la requête n'a pas trouvé de client
      clientDisplay = <span className="text-destructive">Client non trouvé (ID: {clientId}).</span>;
  }
  
  // 5. Rendu final
  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader>
        <CardTitle>Réservation # {reservation.id || 'N/A'}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        <div>
          {/* 🎯 On affiche le résultat de l'état asynchrone */}
          {clientDisplay} 
          <p><span className="font-semibold">Chambre:</span> {reservation.chambre_id}</p>
          <p><span className="font-semibold">Statut:</span> {reservation.status}</p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Arrivée:</span> 
            {reservation.date_arrivee ? format(new Date(reservation.date_arrivee), 'PPP', { locale: fr }) : 'N/A'}
          </p>
          <p>
            <span className="font-semibold">Départ:</span> 
            {reservation.date_depart ? format(new Date(reservation.date_depart), 'PPP', { locale: fr }) : 'N/A'}
          </p>
          <p><span className="font-semibold">Adultes/Enfants:</span> {reservation.nbr_adultes}/{reservation.nbr_enfants}</p>
        </div>
      </CardContent>
    </Card>
  );
}