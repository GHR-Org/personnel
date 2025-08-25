// src/app/maintenance/equipements/page.tsx
"use client";


import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";

import { Equipment, useAppStore } from "@/lib/stores/maintenance_store";
import { EquipmentDetailsModal } from "@/components/equipment/EquipmentDetailsModal";
import { CustomDataTable } from "@/components/CustomDatatable";
import { EquipmentFormModal } from "@/components/equipment/EquipmentForm";

const statusColorMap: Record<Equipment["status"], string> = {
  Fonctionnel: "bg-green-500",
  "En Maintenance": "bg-yellow-500",
  "Hors service": "bg-blue-800",
  "En panne": "bg-red-600",
};

export default function EquipementsPage() {
  // Récupération des données et des actions du store
  const equipments = useAppStore((state) => state.equipments);
  const fetchEquipments = useAppStore((state) => state.fetchEquipments);
  const establishmentId = useAppStore((state) => state.establishmentId);

  // États locaux pour gérer les modales
  const [filter, setFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // <-- Nouvel état pour la modale de détails
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null); // <-- Nouvel état pour l'équipement sélectionné

  useEffect(() => {
    // S'assure que les équipements sont chargés au montage de la page
    if (establishmentId) {
      fetchEquipments();
    }
  }, [establishmentId, fetchEquipments]);

  // Fonction pour gérer l'ouverture de la modale de détails
  const handleOpenDetails = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsDetailsModalOpen(true);
  };

  const filteredEquipments = equipments.filter((equip) =>
    equip.nom?.toLowerCase().includes(filter.toLowerCase())
  );

  // Définition des colonnes du tableau (mise à jour)
  const columns: ColumnDef<Equipment>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "nom",
      header: "Nom",
    },
    {
      accessorKey: "localisation",
      header: "Localisation",
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
                onClick={() => handleOpenDetails(row.original)} // <-- Appel de la nouvelle fonction
              >
                Voir les détails
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  if (!establishmentId) {
    return <div>Chargement de l&apos;établissement...</div>;
  }
  
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Liste des équipements</h1>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Rechercher par nom..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => setIsFormOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un équipement
          </Button>
        </div>
      </div>
      <CustomDataTable columns={columns} data={filteredEquipments} />
      <EquipmentFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <EquipmentDetailsModal
        equipment={selectedEquipment}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
}