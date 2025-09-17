// src/components/TableCard.tsx
"use client";

import React from "react";
import { TableStatus, FurnitureData } from "@/types/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFurnitureStore } from "@/lib/stores/furniture-store";

// Fonction pour obtenir les classes de couleur de la carte en fonction du statut
function getCardStatusClasses(status: TableStatus): string {
  switch (status) {
    case TableStatus.LIBRE:
      return "bg-green-500 text-white";
    case TableStatus.OCCUPE:
    case TableStatus.RESERVEE:
      return "bg-red-500 text-white";
    case TableStatus.NETTOYAGE:
      return "bg-yellow-500 text-black";
    case TableStatus.HORS_SERVICE:
      return "bg-gray-500 text-white";
    default:
      return "bg-blue-500 text-white";
  }
}

interface TableCardProps {
  item: FurnitureData;
}

export function TableCard({ item }: TableCardProps) {
  // On récupère la fonction `openDrawer` directement du store
  const openDrawer = useFurnitureStore((state) => state.openDrawer);

  return (
    <>
         {" "}
      <Card
        onClick={() => openDrawer(item)}
        className={`
    relative cursor-pointer transition-all duration-300 transform
    hover:scale-105 hover:shadow-lg
    w-60 h-40
    ${getCardStatusClasses(item.status)}
  `}
      >
        <CardHeader className="flex flex-col items-start justify-between space-y-2 p-4">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="text-lg font-semibold truncate max-w-[calc(100%-60px)]">
              {item.name || "Table sans nom"}
            </CardTitle>
            {item.status && <Badge className="text-xs">{item.status}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-xl font-bold">{item.type}</div>
          <p className="text-sm text-white opacity-80 mt-1">
            {item.status === TableStatus.OCCUPE ? "Actuellement occupée" : ""}
          </p>
        </CardContent>
      </Card>
         {" "}
    </>
  );
}
