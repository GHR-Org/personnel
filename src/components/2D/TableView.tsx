// src/components/TableView.tsx
"use client";

import React from "react";
import { useFurnitureStore } from "@/lib/stores/furniture-store";
import { TableCard } from "./TableCard";

export function TableView() {
  // On récupère les données des meubles (tables, etc.) depuis le store
  const { previewFurniture: furnitures } = useFurnitureStore();

  // On filtre pour n'afficher que les "tables" (ou d'autres types pertinents si tu veux)
  const tables = furnitures.filter(item => item.type.includes("table") || item.type.includes("couple") || item.type.includes("family"));

  if (tables.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">
          Aucune table à afficher.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-wrap gap-4 p-4 overflow-y-auto">
      {tables.map(item => (
        <TableCard key={item.id} item={item} />
      ))}
    </div>
  );
}