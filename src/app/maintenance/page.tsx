"use client";

import { KpiCard } from "@/components/maintenance/KpiCard";
import { IncidentCard } from "@/components/maintenance/IncidentCard";
import { Wrench, AlertTriangle, PackageX, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function MaintenanceDashboardPage() {
  const stats = {
    planned: 12,
    urgent: 5,
    brokenEquipments: 7,
    resolutionRate: 72,
  };

  const incidents = [
    {
      id: "INC-001",
      location: "Chambre 204",
      description: "Climatisation HS",
      level: "Urgent",
    },
    {
      id: "INC-002",
      location: "Cuisine",
      description: "Fuite au niveau de l’évier",
      level: "Moyen",
    },
  ]  as const;

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Tableau de bord maintenance</h2>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Interventions planifiées"
          icon={<Wrench className="h-5 w-5" />}
          value={stats.planned}
          description="pour cette semaine"
        />
        <KpiCard
          title="Incidents urgents"
          icon={<AlertTriangle className="h-5 w-5" />}
          iconColor="text-red-500"
          value={stats.urgent}
          description="non encore traités"
        />
        <KpiCard
          title="Équipements en panne"
          icon={<PackageX className="h-5 w-5" />}
          value={stats.brokenEquipments}
          description="à vérifier"
        />
        <KpiCard
          title="Taux de résolution"
          icon={<CheckCircle className="h-5 w-5" />}
          iconColor="text-green-500"
          value={`${stats.resolutionRate}%`}
          progress={stats.resolutionRate}
          description="ce mois"
        />
      </div>

      {/* Incidents récents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Derniers incidents signalés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {incidents.map((incident) => (
              <IncidentCard key={incident.id} {...incident} />
            ))}
            <Button variant="outline" className="w-full mt-4">
              Voir tous les incidents
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des interventions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              (Graphique à venir ici)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
