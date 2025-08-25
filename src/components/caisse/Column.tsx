"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BookingFormData } from "@/schemas/reservation";
import { Button } from "@/components/ui/button"; // Pour le bouton d'action
import { IconArrowRight } from "@tabler/icons-react"; // Pour une icône "Sélectionner"
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

interface ColumnsProps {
  onSelectReservation: (reservation: BookingFormData) => void;
}

export const createReservationColumns = ({ onSelectReservation }: ColumnsProps): ColumnDef<BookingFormData>[] => [
  {
    accessorKey: "id",
    header: "ID Réservation",
    cell: ({ row }) => (
      <div className="font-medium text-primary-foreground">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "nom",
    header: "Nom Client",
    cell: ({ row }) => `${row.original.prenom} ${row.original.nom}`,
  },
  {
    accessorKey: "dateArrivee",
    header: "Arrivée",
    cell: ({ row }) => {
      const date = row.getValue("dateArrivee") as Date;
      return format(new Date(date), "dd/MM/yyyy", { locale: fr });
    },
  },
  {
    accessorKey: "dateDepart",
    header: "Départ",
    cell: ({ row }) => {
      const date = row.getValue("dateDepart") as Date;
      return format(new Date(date), "dd/MM/yyyy", { locale: fr });
    },
  },
  {
    accessorKey: "chambreDesireeId",
    header: "Chambre",
  },
  {
    accessorKey: "statut",
    header: "Statut",
  },
  {
    accessorKey: "montantAttribuer",
    header: "Arrhes",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("montantAttribuer"));
      return amount.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' });
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSelectReservation(row.original)}
        className="text-primary-foreground hover:bg-primary/90"
      >
        <IconArrowRight className="mr-2 h-4 w-4" /> Sélectionner
      </Button>
    ),
  },
];