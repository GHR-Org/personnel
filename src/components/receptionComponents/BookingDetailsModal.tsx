// components/receptionComponents/BookingDetailsModal.tsx
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge"; // Pour afficher les statuts avec style
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { BookingFormData } from "@/schemas/booking"; // Assurez-vous que le chemin est correct

interface BookingDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: BookingFormData | null; // Les données de la réservation à afficher
}

export function BookingDetailsModal({ open, onOpenChange, booking }: BookingDetailsModalProps) {
  if (!booking) {
    return null; // Ne rien rendre si aucune réservation n'est fournie
  }

  // Fonction utilitaire pour obtenir le style de badge pour le statut
  const getStatusBadgeVariant = (status: BookingFormData["statut"]) => {
    switch (status) {
      case "Confirmée":
        return "default"; // Ou une variante spécifique comme "success" si vous l'avez
      case "En Attente":
        return "secondary";
      case "Annulée":
        return "destructive";
      case "Terminée":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails de la réservation</DialogTitle>
          <DialogDescription>
            Informations complètes sur la réservation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-gray-500">ID Client:</span>
            <span className="col-span-2 font-medium">{booking.client_id}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-gray-500">ID Chambre:</span>
            <span className="col-span-2 font-medium">{booking.chambre_id}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-gray-500">Établissement:</span>
            <span className="col-span-2 font-medium">{booking.etablissement_id}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-gray-500">Date d&apos;arrivée:</span>
            <span className="col-span-2 font-medium">
              {format(new Date(booking.date_arrivee), "PPP", { locale: fr })}
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-gray-500">Date de départ:</span>
            <span className="col-span-2 font-medium">
              {format(new Date(booking.date_depart), "PPP", { locale: fr })}
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-gray-500">Durée:</span>
            <span className="col-span-2 font-medium">{booking.duree} nuits</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-gray-500">Nb Personnes:</span>
            <span className="col-span-2 font-medium">{booking.nb_personnes}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-gray-500">Statut:</span>
            <span className="col-span-2">
              <Badge variant={getStatusBadgeVariant(booking.statut)}>
                {booking.statut}
              </Badge>
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-gray-500">Mode Check-in:</span>
            <span className="col-span-2 font-medium">{booking.mode_checkin}</span>
          </div>
          {booking.code_checkin && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-gray-500">Code Check-in:</span>
              <span className="col-span-2 font-medium">{booking.code_checkin}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}