/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { DataTable } from "@/components/ui/data-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  IconArrowUp,
  IconClock,
  IconCheck,
  IconPlus,
} from "@tabler/icons-react";
import { Rapport, columns } from "./column"; // Assurez-vous que le chemin est correct.
import { getRapportsByEtablissement } from "@/func/api/rapports/apiRapports";
import { AddFormModal } from "./AddRapports"; // Import du nouveau composant

export default function RapportsPage() {
  const [data, setData] = useState<Rapport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fonction pour rafraîchir les données
  const refreshData = async () => {
    setLoading(true);
    try {
      const rapports = await getRapportsByEtablissement(1);
      if (rapports) {
        setData(rapports);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des rapports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-8 pt-6 space-y-8 flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Chargement des rapports...</h1>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex-1 p-8 pt-6 space-y-8">
        <h2 className="text-3xl font-bold tracking-tight">Rapports</h2>
        <div className="flex items-center space-x-2">
          <AddFormModal />
        </div>
        <div className="text-center mt-10 text-gray-500">
          Aucun rapport de maintenance n&apos;a été trouvé.
        </div>
      </div>
    );
  }

  const totalRapports = data.length;
  const enAttente = data.filter(r => r.statut === "En Attente").length;
  const enCours = data.filter(r => r.statut === "En Cours").length;
  const termines = data.filter(r => r.statut === "Terminé").length;

  return (
    <div className="flex-1 p-8 pt-6 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Rapports</h2>
        <div className="flex items-center space-x-2">
          <AddFormModal />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des Rapports</CardTitle>
            <IconArrowUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRapports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enAttente}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <IconArrowUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enCours}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <IconCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{termines}</div>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns(refreshData)} data={data} />
    </div>
  );
}