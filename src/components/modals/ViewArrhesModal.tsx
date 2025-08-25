// components/modals/ViewArrhesModal.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookingFormInputs } from "@/schemas/reservation";

interface ViewArrhesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: BookingFormInputs | null;
}

export function ViewArrhesModal({ open, onOpenChange, reservation }: ViewArrhesModalProps) {
  if (!reservation) {
    return null;
  }

  const hasArrhes = reservation.montant !== undefined && reservation.montant !== null && reservation.montant > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails des Arrhes</DialogTitle>
          <DialogDescription>
            Informations sur les arrhes versées pour la réservation de {reservation.first_name} {reservation.last_name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {hasArrhes ? (
            <>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Montant:</span>
                <span className="col-span-2 text-sm font-semibold">
                  {reservation.montant?.toLocaleString('fr-FR', { style: 'currency', currency: 'MGA' })}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Date de paiement:</span>
                <span className="col-span-2 text-sm">
                  {reservation.date_paiement ? format(new Date(reservation.date_paiement), "dd MMMM yyyy", { locale: fr }) : "Non spécifiée"}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Mode de paiement:</span>
                <span className="col-span-2 text-sm">
                  {reservation.mode_paiement || "Non spécifié"}
                </span>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground">Aucune arrhe enregistrée pour cette réservation.</p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}