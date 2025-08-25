"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical, BellOff } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Incident } from "@/lib/stores/maintenance_store";

interface IncidentsTableProps {
  incidents: Incident[];
}

const statusColorMap: Record<Incident["status"], string> = {
  "Ouvert": "bg-red-500 hover:bg-red-600",
  "En cours": "bg-yellow-500 hover:bg-yellow-600",
  "Fermé": "bg-green-500 hover:bg-green-600",
};

const severityColorMap: Record<Incident["severity"], string> = {
  "Faible": "text-green-500",
  "Moyen": "text-yellow-500",
  "Élevé": "text-red-500",
};

export function IncidentsTable({ incidents }: IncidentsTableProps) {
  // ✅ Sécurité : filtrer les incidents avec des champs critiques manquants
  const filteredIncidents = incidents.filter(
    (incident) =>
      incident &&
      typeof incident.id === "string" &&
      typeof incident.title === "string" &&
      typeof incident.status === "string" &&
      typeof incident.severity === "string" &&
      typeof incident.equipement_id === "string"
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Liste des incidents</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        {filteredIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12">
            <BellOff className="h-16 w-16 text-gray-300 dark:text-gray-700" />
            <p className="mt-4 text-lg font-medium text-gray-500 dark:text-gray-400">
              Aucun incident valide à afficher.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Équipement</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Sévérité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Signalé le</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => {
                const reportedDate = incident.reportedAt
                  ? (() => {
                      try {
                        const dateString = incident.reportedAt.split(".")[0] + "Z";
                        const date = new Date(dateString);
                        if (isNaN(date.getTime())) throw new Error("Invalid date");
                        return format(date, "dd MMM yyyy à HH:mm", { locale: fr });
                      } catch {
                        return "Date invalide";
                      }
                    })()
                  : "Non renseignée";

                return (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono text-sm">{incident.id}</TableCell>
                    <TableCell className="font-medium">{incident.equipement_id}</TableCell>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>
                      <span className={severityColorMap[incident.severity] || "text-gray-500"}>
                        {incident.severity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColorMap[incident.status] || "bg-gray-500"}>
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{reportedDate}</TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
