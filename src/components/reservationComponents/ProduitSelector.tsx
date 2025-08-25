// src/components/reservationComponents/ProductSelector.tsx
"use client";

import React from "react";
import { useArticles } from "@/hooks/useBookingData"; // Assurez-vous que le chemin est correct
import { Produit } from "@/types/produit"; // Assurez-vous que le type Produit est bien défini
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductSelectorProps {
  etablissementId: number;
  selectedProduitId: number | null;
  onSelectProduit: (produit: Produit) => void;
}

export function ProductSelector({
  etablissementId,
  selectedProduitId,
  onSelectProduit,
}: ProductSelectorProps) {
  const { data: produits, isLoading, isError } = useArticles(etablissementId, true);

  if (isLoading) {
    return <div className="text-center text-gray-500">Chargement des produits...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500">Erreur lors de la récupération des produits.</div>;
  }
  
  const formatPrix = (prix: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(prix);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
      {produits?.map((produit: Produit) => (
        <div
          key={produit.id}
          className={cn(
            "border rounded-lg p-4 cursor-pointer transition-colors duration-200",
            "hover:bg-gray-50 dark:hover:bg-gray-800",
            selectedProduitId === produit.id && "bg-blue-100 border-blue-500 dark:bg-blue-900/30"
          )}
          onClick={() => onSelectProduit(produit)}
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-md font-bold">{produit.nom}</p>
            <Badge variant="secondary" className="font-semibold">{produit.quantite} en stock</Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Prix unitaire : {formatPrix(produit.prix)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Seuil de stock : {produit.seuil_stock}</p>
        </div>
      ))}
    </div>
  );
}