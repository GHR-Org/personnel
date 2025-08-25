/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Badge } from "@/components/ui/badge";
import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";

import { BookingFormData } from "@/schemas/reservation";

interface BookingDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: BookingFormData | null;
  onBookingUpdated?: (booking: BookingFormData) => void;
  onBookingDeleted?: (bookingId: string) => void;
  onEditBooking?: (booking: BookingFormData) => void;
}

export function BookingDetailsModal({
  open,
  onOpenChange,
  booking,
  onBookingUpdated,
  onBookingDeleted,
  onEditBooking,
}: BookingDetailsModalProps) {
  if (!booking) {
    return null;
  }

  const getStatusBadgeVariant = (status: BookingFormData["statut"]) => {
    switch (status) {
      case "Confirmée":
        return "default";
      case "Arrivé":
        return "success";
      case "Annulée":
        return "destructive";
      case "Terminée":
        return "outline";
      default:
        return "secondary";
    }
  };

  // --- MODIFICATION ICI : Pas besoin de getValidDate comme avant, car on recrée.
  //     MAIS gardons isValid pour la vérification finale.

  let displayDateArrivee: Date | null = null;
  let displayDateDepart: Date | null = null;

  try {
    // Tenter de créer un nouvel objet Date à partir de la date reçue
    // Même si booking.dateArrivee est déjà un Date, cela garantit un "nouveau" objet
    const tempDateArrivee = new Date(booking.dateArrivee);
    if (isValid(tempDateArrivee)) {
      displayDateArrivee = tempDateArrivee;
    }
  } catch (e) {
    console.error("Erreur lors de la création de displayDateArrivee:", e);
    displayDateArrivee = null;
  }

  try {
    const tempDateDepart = new Date(booking.dateDepart);
    if (isValid(tempDateDepart)) {
      displayDateDepart = tempDateDepart;
    }
  } catch (e) {
    console.error("Erreur lors de la création de displayDateDepart:", e);
    displayDateDepart = null;
  }

  // Ajout de logs de débogage pour voir la situation juste avant le formatage
  console.log("DEBUG MODAL - displayDateArrivee:", displayDateArrivee, "isValid:", displayDateArrivee ? isValid(displayDateArrivee) : false);
  console.log("DEBUG MODAL - displayDateDepart:", displayDateDepart, "isValid:", displayDateDepart ? isValid(displayDateDepart) : false);
  console.log("DEBUG MODAL - Typeof displayDateArrivee:", typeof displayDateArrivee);
  console.log("DEBUG MODAL - displayDateArrivee instanceof Date:", displayDateArrivee instanceof Date);
  console.log("DEBUG MODAL - Object.prototype.toString.call(displayDateArrivee):", Object.prototype.toString.call(displayDateArrivee));


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
          {/* ... autres champs ... */}
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-gray-500">Date d&apos;arrivée:</span>
            <span className="col-span-2 font-medium">
                {displayDateArrivee ?
                    format(displayDateArrivee, "PPP", { locale: fr }) :
                    "Date invalide ou erreur de traitement"
                }
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-gray-500">Date de départ:</span>
            <span className="col-span-2 font-medium">
                {displayDateDepart ?
                    format(displayDateDepart, "PPP", { locale: fr }) :
                    "Date invalide ou erreur de traitement"
                }
            </span>
          </div>
          {/* ... le reste des champs ... */}
        </div>
      </DialogContent>
    </Dialog>
  );
}