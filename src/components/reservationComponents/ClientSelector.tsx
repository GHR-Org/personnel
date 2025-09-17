"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/client";
import { useQuery } from "@tanstack/react-query";
import { IconUserPlus, IconSearch } from "@tabler/icons-react";
import { getClientByEmail } from "@/func/api/clients/apiclient";
import { Loader2 } from "lucide-react";

interface ClientSelectorProps {
  onSelectClient: (clientId: number) => void;
  onNewClient: () => void;
}

const isEmailValid = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function ClientSelector({ onSelectClient, onNewClient }: ClientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const isSearchEnabled = isEmailValid(searchTerm);

  // Le type de `data` est maintenant un tableau `Client[]`
  const { data, isLoading, isError } = useQuery<Client[]>({
  queryKey: ['clientByEmail', searchTerm],
  // Appelle directement la fonction getClientByEmail qui retourne déjà un Client[]
  queryFn: () => getClientByEmail(searchTerm), 
  enabled: isEmailValid(searchTerm),
});

  // src/components/ClientSelector.tsx
// Remplace le bloc existant dans ta fonction `return` avec ce code

return (
  <div className="space-y-4 p-4 border rounded-lg">
    <h2 className="text-lg font-semibold">1. Sélectionner ou créer un client</h2>
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          placeholder="Rechercher par email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      <Button onClick={onNewClient} variant="outline" type="button">
        <IconUserPlus className="mr-2 h-4 w-4" /> Nouveau client
      </Button>
    </div>

    {isSearchEnabled && isLoading && (
      <p className="text-gray-500 flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Recherche en cours...
      </p>
    )}
    
    {isError && (
      <p className="text-red-500">Une erreur s&apos;est produite lors de la recherche.</p>
    )}

    {data && data.length > 0 && (
      <div className="space-y-2 max-h-60 overflow-y-auto">
        <p className="font-medium text-sm ">Client trouvé :</p>
        {data.map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => onSelectClient(client.id)}
          >
            <div>
              <p className="font-semibold">{client.first_name} {client.last_name}</p>
              <p className="text-sm">{client.email}</p>
            </div>
            {/* Le bouton "Sélectionner" a été retiré pour éviter le conflit */}
          </div>
        ))}
      </div>
    )}

    {isSearchEnabled && !isLoading && data?.length === 0 && (
      <p className="text-gray-500">Aucun client trouvé pour cet email. Créez un nouveau client.</p>
    )}

    {!isSearchEnabled && searchTerm.length > 0 && (
      <p className="text-gray-500">Veuillez entrer une adresse email valide pour rechercher.</p>
    )}
  </div>
);
}