"use client";

import { useAppStore, Incident } from "@/lib/stores/maintenance_store";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomDataTable } from "@/components/CustomDatatable";
import { IncidentFormModal } from "@/components/incidents/IncidentFormModal";

const severityColorMap: Record<Incident["severity"], string> = {
  Faible: "bg-green-500",
  Moyen: "bg-yellow-500",
  Élevé: "bg-red-700",
};

export default function IncidentsPage() {
  const incidents = useAppStore((state) => state.incidents);
  const fetchIncidents = useAppStore((state) => state.fetchIncidents);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const columns: ColumnDef<Incident>[] = [
    {
      accessorKey: "title",
      header: "Titre",
    },
    {
      accessorKey: "equipement_id",
      header: "Équipement ID",
    },
    {
      accessorKey: "severity",
      header: "Sévérité",
      cell: ({ row }) => (
        <Badge className={severityColorMap[row.original.severity]}>
          {row.original.severity}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  console.log("Gérer l'incident", row.original);
                }}
              >
                Gérer l&apos;incident
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Incidents signalés</h1>
        <IncidentFormModal />
      </div>

      <CustomDataTable columns={columns} data={incidents} />
    </div>
  );
}