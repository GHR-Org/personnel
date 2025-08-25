// src/app/incidents/loading.tsx ou src/app/equipements/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Skeleton pour l'en-tête de la page */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Skeleton pour les filtres */}
      <div className="flex flex-wrap items-end gap-4 p-4 border rounded-md bg-background">
        <div className="flex-1 min-w-[200px]">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 min-w-[180px]">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 min-w-[100px]">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Skeleton pour la table ou la liste */}
      <Card>
        <CardContent className="p-4">
          {/* Skeleton pour les en-têtes de colonnes */}
          <div className="grid grid-cols-5 gap-4 p-2 border-b">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
          {/* Squelette pour 5 lignes de données */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 p-2 border-b last:border-b-0">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}