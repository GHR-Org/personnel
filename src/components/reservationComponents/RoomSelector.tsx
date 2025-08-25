// src/components/reservationComponents/RoomSelector.tsx
"use client";

import React, { useState } from "react"; 
import { useRooms } from "@/hooks/useBookingData";
import { room as RoomType } from "@/types/room";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; 
import { cn } from "@/lib/utils";

interface RoomSelectorProps {
  etablissementId: number;
  selectedRoomId: number | null;
  onSelectRoom: (roomId: number, roomPrice : number) => void;
}

export function RoomSelector({
  etablissementId,
  selectedRoomId,
  onSelectRoom,
}: RoomSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllRooms, setShowAllRooms] = useState(false); 
  const { data: rooms, isLoading, isError } = useRooms(etablissementId, true);

  if (isLoading) {
    return <div className="text-center text-gray-500">Chargement des chambres...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500">Erreur lors de la récupération des chambres.</div>;
  }

  const filteredRooms = rooms?.filter((room) =>
    room.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.categorie.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatTarif = (tarif: string) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(tarif));
  };
  
  // ✅ Déterminer les chambres à afficher
  const roomsToDisplay = showAllRooms ? filteredRooms : filteredRooms?.slice(0, 3);
  const hasMoreRooms = filteredRooms && filteredRooms.length > 3;

  return (
    <div className="space-y-4">
      {/* Champ de recherche */}
      <Input
        placeholder="Rechercher une chambre par numéro ou catégorie..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {filteredRooms && filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomsToDisplay?.map((room: RoomType) => ( // ✅ Utilisation de roomsToDisplay
            <div
              key={room.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-colors duration-200",
                "hover:bg-gray-50 dark:hover:bg-gray-800",
                selectedRoomId === room.id && "bg-blue-100 border-blue-500 dark:bg-blue-900/30"
              )}
              onClick={() => onSelectRoom(room.id, Number(room.tarif))}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-xl font-bold">Chambre n°{room.numero}</p>
                <Badge variant="secondary" className="font-semibold">{room.etat}</Badge>
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{room.categorie}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Capacité: {room.capacite} personnes
              </p>
              
              {/* Affichage des équipements */}
              <div className="flex flex-wrap gap-1 mb-2">
                {room.equipements.slice(0, 3).map((equipement, index) => (
                  <Badge key={index} variant="outline" className="text-xs">{equipement}</Badge>
                ))}
                {room.equipements.length > 3 && (
                  <span className="text-xs text-gray-500 self-center">...</span>
                )}
              </div>
              
              <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
                {formatTarif(room.tarif)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Aucune chambre trouvée.</p>
      )}

      {/* ✅ Bouton "Voir plus" rendu conditionnellement */}
      {hasMoreRooms && !showAllRooms && (
        <div className="text-center mt-4">
          <Button variant="outline" onClick={() => setShowAllRooms(true)}>
            Voir plus ({filteredRooms?.length - 3})
          </Button>
        </div>
      )}
    </div>
  );
}