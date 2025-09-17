"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface CaisseSummaryCardProps {
  montantTotalDu: number;
  montantDejaPaye: number;
  totalPaiementsActuels: number;
  soldeFinal: number;
  statutCaisse: string; // Ex: "Ouverte", "Soldée"
}

export function CaisseSummaryCard({
  montantTotalDu,
  montantDejaPaye,
  totalPaiementsActuels,
  soldeFinal,
  statutCaisse,
}: CaisseSummaryCardProps) {
  // Fonction pour formater les montants en MGA
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' });
  };

  const getSoldeColor = (solde: number) => {
    if (solde < 0) return "text-red-500 font-bold"; // Montant à rembourser
    if (solde === 0) return "text-green-500 font-bold"; // Soldé
    return "text-orange-500 font-bold"; // Reste à payer
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">Résumé Caisse</CardTitle>
        <CardDescription>Vue d'ensemble de la transaction actuelle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Articles Dû:</span>
          <span className="font-semibold">{formatCurrency(montantTotalDu)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">arhee Déjà Payées:</span>
          <span className="font-semibold">{formatCurrency(montantDejaPaye)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Paiements Actuels Enregistrés:</span>
          <span className="font-semibold">{formatCurrency(totalPaiementsActuels)}</span>
        </div>

        <Separator />

        <div className="flex justify-between items-center text-lg">
          <span className="font-bold">Solde Final:</span>
          <span className={getSoldeColor(soldeFinal)}>
            {formatCurrency(soldeFinal)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Statut Caisse:</span>
          <span className="font-semibold text-primary">{statutCaisse}</span>
        </div>
      </CardContent>
    </Card>
  );
}