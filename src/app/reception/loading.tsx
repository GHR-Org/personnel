// src/app/reception/dashboard/loading.tsx

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

// Si votre composant FiltresReservations a une structure particulière,
// vous pouvez créer un squelette pour l'imiter.
const FiltresReservationsSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-center justify-between pb-4 space-y-4 sm:space-y-0">
    <div className="flex flex-col space-y-2 w-full sm:w-auto">
      <Skeleton className="h-8 w-40" /> {/* Pour la barre de recherche par exemple */}
    </div>
    <div className="flex space-x-2 w-full sm:w-auto justify-end">
      <Skeleton className="h-10 w-24" /> {/* Pour le bouton "Ajouter une réservation" */}
    </div>
  </div>
);

// Si votre composant RoomTable a une structure particulière,
// nous allons l'imiter ici avec un squelette.
const RoomTableSkeleton = () => (
  <div className="border rounded-lg overflow-hidden mt-4">
    {/* En-tête du tableau */}
    <div className="grid grid-cols-[1fr_repeat(7,_1fr)] gap-2 p-2 bg-gray-100 dark:bg-gray-800">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
    </div>
    {/* Lignes du tableau */}
    {Array.from({ length: 10 }).map((_, index) => (
      <div key={index} className="grid grid-cols-[1fr_repeat(7,_1fr)] gap-2 p-2 border-t">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full col-span-7" />
      </div>
    ))}
  </div>
);

export default function Loading() {
  return (
    <div className="h-[80vh] p-6">
      <Skeleton className="h-10 w-96 mb-4" /> {/* Squelette pour le titre */}
      
      <FiltresReservationsSkeleton />
      
      <div className="animate-pulse">
        <RoomTableSkeleton />
      </div>

      <div className="fixed bottom-4 right-4 animate-bounce">
         {/* Squelette pour le bouton d'ajout de réservation flottant si vous en avez un */}
         <Skeleton className="h-16 w-16 rounded-full" />
      </div>
    </div>
  );
}