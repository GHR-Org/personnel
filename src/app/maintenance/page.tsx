"use client";

import { KpiCard } from "@/components/maintenance/KpiCard";
import { IncidentCard } from "@/components/maintenance/IncidentCard";
import { Wrench, AlertTriangle, PackageX, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InterventionDistributionChart } from "@/components/maintenance/InterventionDistributionChart";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react"; // <-- NOUVEAU : Import de useMemo
import { useAppStore } from "@/lib/stores/maintenance_store";

export default function MaintenanceDashboardPage() {
  const router = useRouter();

  // On récupère les données et les actions de fetch depuis le store
  const {
    incidents,
    interventions, // <-- NOUVEAU : On récupère les interventions
    fetchIncidents,
    fetchInterventions, // <-- NOUVEAU : On récupère l'action pour les interventions
    isLoadingIncidents,
  } = useAppStore();

  // On utilise useEffect pour lancer le fetch des incidents et des interventions au chargement du composant
  useEffect(() => {
    fetchIncidents();
    fetchInterventions(); // <-- On fetch aussi les interventions
  }, [fetchIncidents, fetchInterventions]);

  // Utilisation de useMemo pour calculer les stats dynamiquement
  const calculatedStats = useMemo(() => {
    const planned = interventions.filter(
      (i) => i.status === "Planifiée"
    ).length;
    const urgent = incidents.filter((i) => i.severity === "Élevé").length;
    // La logique des équipements "en panne" n'est pas dans le store,
    // on va donc simuler le calcul basé sur les incidents pour l'exemple.
    const brokenEquipments = incidents.length;
    
    // Calcul du taux de résolution
    const resolvedIncidents = interventions.filter((i) => i.status === "Terminée").length;
    const totalInterventions = interventions.length;
    const resolutionRate = totalInterventions > 0 ? Math.round((resolvedIncidents / totalInterventions) * 100) : 0;
    

    return {
      planned,
      urgent,
      brokenEquipments,
      resolutionRate,
    };
  }, [interventions, incidents]); // Les dépendances pour recalculer les stats

  const handleClick = () => {
    router.push("/maintenance/incidents");
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Tableau de bord maintenance
        </h2>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Interventions planifiées"
          icon={<Wrench className="h-5 w-5" />}
          value={calculatedStats.planned} // <-- On utilise la valeur calculée
          description="pour cette semaine"
        />
        <KpiCard
          title="Incidents urgents"
          icon={<AlertTriangle className="h-5 w-5" />}
          iconColor="text-red-500"
          value={calculatedStats.urgent} // <-- On utilise la valeur calculée
          description="non encore traités"
        />
        <KpiCard
          title="Équipements en panne"
          icon={<PackageX className="h-5 w-5" />}
          value={calculatedStats.brokenEquipments} // <-- On utilise la valeur calculée
          description="à vérifier"
        />
        <KpiCard
          title="Taux de résolution"
          icon={<CheckCircle className="h-5 w-5" />}
          iconColor="text-green-500"
          value={`${calculatedStats.resolutionRate}%`} // <-- On utilise la valeur calculée
          progress={calculatedStats.resolutionRate}
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
            {isLoadingIncidents ? (
              <p className="text-sm text-muted-foreground">
                Chargement des incidents...
              </p>
            ) : incidents.length > 0 ? (
              incidents.slice(0, 2).map((incident) => (
                <IncidentCard
                  key={incident.id}
                  id={incident.id}
                  location={incident.description}
                  description={incident.title}
                  level={incident.severity === "Élevé" ? "Urgent" : incident.severity}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun incident signalé récemment.
              </p>
            )}
            <Button variant="outline" onClick={handleClick} className="w-full mt-4">
              Voir tous les incidents
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des interventions</CardTitle>
          </CardHeader>
          <CardContent>
            <InterventionDistributionChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}