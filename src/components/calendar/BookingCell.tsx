// components/roomCalendar/BookingCell.tsx
"use client";

import * as React from "react";
import { BookingFormData, ReservationStatut } from "@/schemas/reservation";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  IconLogin2,
  IconLogout2,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface BookingCellProps {
  reservation: BookingFormData;
  rowIndex: number;
  gridColumnStart: number;
  gridColumnEnd: number;
  statusStyle: Record<ReservationStatut, string>;
  onDetails: () => void;
  onEdit: () => void;
  onCheckIn: () => void;
  onCancel: () => void;
  onCheckout: () => void;
  onDelete: () => void;
  onViewArrhes: () => void;
  onReportIncident: () => void;
  onRequestCleaning: () => void;
}

export function BookingCell({
  reservation,
  rowIndex,
  gridColumnStart,
  gridColumnEnd,
  statusStyle,
  onDetails,
  onEdit,
  onCheckIn,
  onCancel,
  onCheckout,
  onDelete,
  onViewArrhes,
  onReportIncident,
  onRequestCleaning,
}: BookingCellProps) {
  const statut = reservation.statut;

  if (statut === "ANNULEE" || statut === "TERMINEE") return null;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          className={cn(
            "p-1 rounded-md text-xs font-medium overflow-hidden whitespace-nowrap text-ellipsis flex items-center justify-center cursor-pointer shadow-sm z-20",
            statusStyle[statut] || "bg-gray-400 hover:bg-gray-500 text-white"
          )}
          style={{
            gridColumn: `${gridColumnStart} / ${gridColumnEnd}`,
            gridRow: rowIndex + 1,
            alignSelf: "stretch",
            justifySelf: "stretch",
            margin: 0,
          }}
          onClick={onDetails}
        >
          {reservation.nom} {reservation.prenom?.charAt(0) ?? ""}.
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onEdit}>Modifier la fiche</ContextMenuItem>
        <ContextMenuItem onClick={onDetails}>Détails</ContextMenuItem>
        <ContextMenuItem onClick={onViewArrhes}>Voir les arrhes</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={onCheckIn}
          disabled={
            statut === "ARRIVE" || statut === "ANNULEE" || statut === "TERMINEE"
          }
        >
          <IconLogin2 className="mr-2 h-4 w-4" /> Faire arriver
        </ContextMenuItem>
        <ContextMenuItem
          onClick={onCancel}
          disabled={
            statut === "ANNULEE" || statut === "ARRIVE" || statut === "TERMINEE"
          }
        >
          <IconX className="mr-2 h-4 w-4" /> Annulation
        </ContextMenuItem>
        <ContextMenuItem
          onClick={onCheckout}
          disabled={
            statut === "TERMINEE" ||
            statut === "ANNULEE" ||
            statut === "CONFIRMEE"
          }
        >
          <IconLogout2 className="mr-2 h-4 w-4" /> Dégagement
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onRequestCleaning()}>
          Demander nettoyage
        </ContextMenuItem>
        <ContextMenuItem onClick={onReportIncident}>
          Rapport & Incidents
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => toast.info("Fonction 'Imprimer' à venir")}
        >
          Imprimer
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={onDelete}
          className="text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <IconTrash className="mr-2 h-4 w-4" /> Supprimer
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
