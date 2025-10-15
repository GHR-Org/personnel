/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DetailsModal } from "./DetailsModal";
import { DeleteRapport } from "@/func/api/rapports/apiRapports";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export type Rapport = {
  id: number;
  titre: string;
  description: string;
  statut: "En Attente" | "En Cours" | "Terminé";
  type: string;
  created_at: string;
  reponse_responsable: string;
  personnel_id: number;
  etablissement_id: number;
};


export const columns = (refreshData: () => void): ColumnDef<Rapport>[] => [
  {
    accessorKey: "titre",
    header: "Titre du Rapport",
    cell: ({ row }) => {
      const rapport = row.original;

      const handleDelete = async () => {
        try {
          await DeleteRapport(rapport.id);
          toast.success("Rapport supprimé avec succès");
          refreshData(); // Rafraîchir les données après une suppression réussie
        } catch (error) {
          console.error("Erreur lors de la suppression du rapport :", error);
          toast.error("Erreur lors de la suppression du rapport");
        }
      };

      return (
        <DetailsModal
          rapport={rapport}
          onUpdate={() => alert("Fonction de mise à jour à implémenter pour le rapport : " + rapport.id)}
          onDelete={handleDelete}
        />
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "statut",
    header: "Statut",
    cell: ({ row }) => {
      const rapport = row.original;
      const statut = rapport.statut;
      const handleStatusUpdate = (newStatus: "En Attente" | "En Cours" | "Terminé") => {
        if (rapport.statut !== newStatus) {
          const updatedRapport = { ...rapport, statut: newStatus };
          console.log(`Mise à jour du rapport ${rapport.id} vers le statut : ${newStatus}`);
          toast.success(`Statut du rapport #${rapport.id} mis à jour en "${newStatus}"`);
          refreshData(); // Refresh les données pour mettre à jour le tableau
        }
      };

      const getVariant = (statut: string) => {
        switch (statut) {
          case "En Attente":
            return "default";
          case "En Cours":
            return "secondary";
          case "Terminé":
            return "success";
          default:
            return "default";
        }
      };

      return (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Badge variant={getVariant(statut)} className="cursor-pointer">
              {statut}
            </Badge>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-48">
            <ContextMenuItem onClick={() => handleStatusUpdate("En Attente")}>
              En Attente
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleStatusUpdate("En Cours")}>
              En Cours
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleStatusUpdate("Terminé")}>
              Terminé
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date de création",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },
];