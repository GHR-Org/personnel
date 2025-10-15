// src/components/caisse/ClientNameCell.tsx

import React from 'react';
import { useQuery } from '@tanstack/react-query'; // 
import { getClientById } from '@/func/api/clients/apiclient';

interface ClientNameCellProps {
  clientId: number;
}

export const ClientNameCell: React.FC<ClientNameCellProps> = ({ clientId }) => {
  // Utilisez useQuery pour gérer l'appel API de manière asynchrone
  const { data: client, isLoading, isError } = useQuery({
    queryKey: ['client', clientId], // Clé unique pour le cache
    queryFn: () => getClientById(clientId),
    // Optionnel : ne pas refetcher si les données sont fraîches pour éviter la surcharge
    staleTime: 5 * 60 * 1000, 
  });

  if (isLoading) {
    return <span className="text-muted-foreground animate-pulse">Chargement...</span>;
  }

  if (isError) {
    return <span className="text-destructive">Erreur client</span>;
  }
  
  // 💡 Assurez-vous que votre type Client a les propriétés firstName et lastName
  return (
    <div className="font-medium">
      {client?.first_name} {client?.last_name}
    </div>
  );
};