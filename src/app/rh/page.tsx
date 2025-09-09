/* eslint-disable @typescript-eslint/no-unused-vars */
// app/rh/page.tsx
"use client";

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/receptionComponents/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"
import RhNavigation from "@/components/config/RhNavigation.json"
import { UserAccountsChart } from "@/components/rhcomponents/StatRh"
import { RealTimePersonnelActivity } from "@/components/personnel/RealTimePersonnelActivity"
const mockPersonnelStats = {
  nouveaux_enregistrements: [
    { nom: "Dupont", prenom: "Jean", fonction: "Développeur", date_enregistrement: "2025-07-21T14:30:00Z" },
    { nom: "Martin", prenom: "Sophie", fonction: "Designer", date_enregistrement: "2025-07-20T10:00:00Z" },
  ],
  demandes_conges_recentes: [
    { employe: "Jean Dupont", type: "Vacances", statut: "En attente", date_demande: "2025-07-21 14:40:00" },
    { employe: "Marie Curie", type: "Maladie", statut: "Approuvé", date_demande: "2025-07-21 13:15:00" },
    { employe: "Pierre Dubois", type: "RTT", statut: "Refusé", date_demande: "2025-07-20 16:00:00" },
  ],
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col w-full">
      <div className="@container/main flex flex-1 flex-col gap-8 py-4 md:gap-10 md:py-6">
        <section>
          <div className="mb-6 px-4 lg:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              Synthèse des Ressources Humaines
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Visualisez les métriques clés de votre personnel et les statistiques RH essentielles.
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <SectionCards />
          </div>
        </section>

        <section>
          <div className="mb-6 px-4 lg:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              Analyse des Tendances RH
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Explorez les évolutions des effectifs, des présences ou d&apos;autres données RH clés avec cette visualisation interactive.
            </p>
          </div>
          <div className="px-4 lg:px-6">
            {/* RealTimePersonnelActivity est un Client Component, il gérera son propre état de temps */}
             {/* <RealTimePersonnelActivity statsPersonnel={mockPersonnelStats} />  */}
          </div>
        </section>

        
      </div>
    </div>
  );
}