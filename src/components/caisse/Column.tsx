"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BookingManuel } from "@/schemas/reservation";
import { Button } from "@/components/ui/button"; // Pour le bouton d'action
import { IconArrowRight } from "@tabler/icons-react"; // Pour une icône "Sélectionner"
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { ClientNameCell } from "../reservationComponents/ClientNameCell";

interface ColumnsProps {
  onSelectReservation: (reservation: BookingManuel) => void;
}

export const createReservationColumns = ({ onSelectReservation }: ColumnsProps): ColumnDef<BookingManuel>[] => [
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
    cell: ({ row }) => {
      // 💡 On passe l'ID client au composant ClientNameCell
      const clientId = row.original.client_id;
      
      // On s'assure que clientId est bien un nombre avant de le passer
      if (typeof clientId !== 'number' || isNaN(clientId)) {
          return <span className="text-destructive">ID Invalide</span>;
      }

      // 🎯 C'est ici que l'appel asynchrone est déclenché pour chaque ligne !
      return <ClientNameCell clientId={clientId} />;
    },
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
    header: "arhee",
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