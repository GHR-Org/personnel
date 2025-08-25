/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { RapportActiviteRestaurant } from "@/components/manager-restaurant/RapportsActivity";
import { Button } from "@/components/ui/button";
import { DialogRapport } from "@/components/rapportDialog";
import { Rapport, RapportFormData, RapportStatut } from "@/schemas/rapport";

import { StatutCommande } from "@/types/commande";// si tu utilises un enum

const initialStatsRestaurant = {
  commandesInternes: [
    {
      id: "101",
      client: "Chambre 12",
      statut: "En cours" as StatutCommande,
      date_commande: "2025-07-27T10:00:00Z",
    },
    {
      id: "102",
      client: "Salle 3",
      statut: "Livrée" as StatutCommande,
      date_commande: "2025-07-27T09:30:00Z",
    },
  ],
  commandesExternes: [
    {
      id: "201",
      client: "Client externe Jean",
      statut: "Annulée" as StatutCommande,
      date_commande: "2025-07-26T18:00:00Z",
    },
  ],
  rapportsPersonnels: [
    {
      auteur: "Marie",
      contenu: "Rapport sur le service du déjeuner, tout s’est bien passé.",
      date_rapport: new Date("2025-07-27T08:00:00Z").toISOString(),
    },
  ],
};
type RapportPersonnelAffiche = {
  auteur: string;
  contenu: string;
  date_rapport: string;
};


export default function PageRapportsRestaurant() {
  const [statsRestaurant, setStatsRestaurant] = useState(initialStatsRestaurant);
  const [open, setOpen] = useState(false);
  const auteur = "Utilisateur connecté"; // à remplacer par l'utilisateur réel

  const handleSubmit = (data: RapportFormData) => {
  const nouveauRapport: RapportPersonnelAffiche = {
    auteur: data.auteur,
    contenu: data.contenu,
    date_rapport: new Date().toISOString(),
  };

  setStatsRestaurant((prev) => ({
    ...prev,
    rapportsPersonnels: [nouveauRapport, ...prev.rapportsPersonnels],
  }));
};

  return (
    <main className="p-6 w-full mt-14 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rapports & Activités Restaurant</h1>
        <Button onClick={() => setOpen(true)}>Écrire un rapport</Button>
      </div>

      <RapportActiviteRestaurant statsRestaurant={statsRestaurant} />

      <DialogRapport open={open} setOpen={setOpen} onSubmit={handleSubmit} />
    </main>
  );
}
