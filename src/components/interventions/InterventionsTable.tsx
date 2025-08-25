/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/interventions/InterventionsTable.tsx
"use client";

import React, { useState } from "react";
import { useAppStore, Intervention, Equipment } from "@/lib/stores/maintenance_store";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomDataTable } from "../CustomDatatable";
import { UpdateInterventionModal } from "./UpdateInterventionModal";
import { DeleteInterventionDialog } from "./DeleteInterventionDialog";
import { InterventionDetailsModal } from "./InterventionDetailsModal";

interface InterventionsTableProps {
  interventions: Intervention[];
}

const statusColorMap: Record<Intervention["status"], string> = {
  "Planifiée": "bg-blue-500",
  "En cours": "bg-yellow-500",
  "Terminée": "bg-green-500",
  "Annulée": "bg-red-500",
};

export const InterventionsTable: React.FC<InterventionsTableProps> = ({ interventions }) => {
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const incidents = useAppStore(state => state.incidents);
  const equipments = useAppStore(state => state.equipments);
  
  const technicians = [
    { id: 'TECH-001', nom: 'Lovasoa Nantenaina' },
    { id: 'TECH-002', nom: 'This is the end' },
    { id: 'TECH-003', nom: 'I am the lord' },
  ];
  
  // --- Fonction corrigée pour obtenir le nom de l'équipement via l'incident ---
  const getEquipmentName = (incidentId: string): string => {
    const incident = incidents.find(inc => inc.id === incidentId);
    if (!incident) {
      return 'Incident non trouvé';
    }
    const equipment = equipments.find(eq => eq.id === incident.equipement_id);
    return equipment?.nom || 'Équipement non trouvé';
  };

  const getTechnicianName = (id: string | undefined): string => {
    const technician = technicians.find(tech => tech.id === id);
    return technician?.nom || 'Technicien non trouvé';
  };

  const columns: ColumnDef<Intervention>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "incident_Id", // Utiliser incident_Id comme clé
      header: "Équipement",
      cell: ({ row }) => (
        <div className="font-medium">
          {getEquipmentName(row.original.incident_Id)}
        </div>
      ),
    },
    {
      accessorKey: "personnel_Id",
      header: "Technicien",
      cell: ({ row }) => (
        <div className="font-medium">
          {getTechnicianName(row.original.personnel_Id)}
        </div>
      ),
    },
    {
      accessorKey: "scheduledDate",
      header: "Date",
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <Badge className={statusColorMap[row.original.status]}>
          {row.original.status}
        </Badge>
      ),
    },
  ];

  const handleRowClick = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setIsModalOpen(true);
  };

  return (
    <>
      <CustomDataTable columns={columns} data={interventions} onRowClick={handleRowClick} />
      {selectedIntervention && (
        <InterventionDetailsModal 
          intervention={selectedIntervention}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};