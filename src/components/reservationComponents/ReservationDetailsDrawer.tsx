/* eslint-disable @typescript-eslint/no-explicit-any */
// components/reservationComponents/ReservationDetailsDialog.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconPrinter, IconMail } from "@tabler/icons-react";

// Importez BookingEvent et ReservationStatut de votre schéma
import { BookingEvent, BookingManuel } from "@/schemas/reservation";
import { ReservationStatut } from "@/lib/enum/ReservationStatus";
import { Client } from "@/types/client";

// Fonction de garde de type pour vérifier si une réservation est de type BookingManuel
function isBookingManuel(reservation: BookingEvent): reservation is BookingManuel {
  return (reservation as BookingManuel).civilite !== undefined;
}

// Définition des props pour la boîte de dialogue de détails
interface ReservationDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  reservation: BookingEvent | null;
  clientDetails?: Client | null;
  onSendConfirmation: (reservationId: string) => Promise<void>;
  onEdit: (reservation: BookingEvent, clientDetails?: Client | null) => void;
  onCheckIn: (id: string) => void;
  onCheckout: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
  onBookingUpdated: (updatedReservation: BookingEvent) => void;
  onBookingDeleted: () => void;
}

export function ReservationDetailsDrawer({
  open,
  onClose,
  reservation,
  clientDetails = null,
  onSendConfirmation,
  onEdit,
  onCheckIn,
  onCheckout,
  onCancel,
  onDelete,
}: ReservationDetailsDialogProps) {
  const printRef = React.useRef<HTMLDivElement>(null);

  if (!reservation) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSendConfirmationClick = async () => {
    if (reservation.id) {
      try {
        await onSendConfirmation(reservation.id);
      } catch (error) {
        console.error("Erreur lors de l'envoi de la confirmation :", error);
      }
    } else {
      console.warn("ID de réservation manquant pour l'envoi de confirmation.");
    }
  };

  // Calculs financiers
  const totalArticlesPrice = (reservation.articles ?? []).reduce(
    (sum: number, item: any) => sum + item.prix * item.quantite,
    0
  );

  const finalTotalPrice = reservation.montant !== undefined && reservation.montant !== null ? reservation.montant : totalArticlesPrice;

  const depositPaid =
    reservation.montant !== undefined &&
    reservation.montant !== null &&
    reservation.date_paiement &&
    reservation.mode_paiement && reservation.mode_paiement !== 'NON_RENSEIGNE'
      ? reservation.montant
      : 0;
  const remainingAmount = finalTotalPrice - depositPaid;

  // Déterminer les informations du client à afficher
  const displayClient = isBookingManuel(reservation) && clientDetails ? clientDetails : reservation;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 print:hidden">
          <DialogTitle className="text-2xl font-semibold">Détails de la Réservation</DialogTitle>
          <DialogDescription>Consultez les informations détaillées de la réservation N° {reservation.id}</DialogDescription>
        </DialogHeader>

        {/* Contenu de la réservation à imprimer */}
        <div ref={printRef} className="flex-1 overflow-y-auto px-6 print:p-0 print:overflow-visible">
          <div className="reservation-print-area p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg print:shadow-none print:rounded-none">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-primary">RÉSERVATION</h1>
                <p className="text-sm text-muted-foreground">N°:
                  <span className="font-semibold">{reservation.id}</span>
                </p>
                {isBookingManuel(reservation) && reservation.date_reservation && (
                  <p className="text-sm text-muted-foreground">
                    Date de réservation: <span className="font-semibold">{format(new Date(reservation.date_reservation), "dd MMMM yyyy", { locale: fr })}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <h2 className="text-xl font-semibold">Nom de l&apos;hotel</h2>
                <p className="text-sm text-muted-foreground">Adresse et Ville de l&apos;hotel</p>
                <p className="text-sm text-muted-foreground">Telephone et email</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-md font-semibold text-muted-foreground">Client:</h3>
              <p className="font-semibold">
                {displayClient.first_name || 'N/A'} {displayClient.last_name || 'N/A'}
              </p>
              {displayClient.email && <p className="text-sm text-muted-foreground">{displayClient.email}</p>}
              {displayClient.phone && <p className="text-sm text-muted-foreground">{displayClient.phone}</p>}
              {displayClient.pays && <p className="text-sm text-muted-foreground">{displayClient.pays}</p>}
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-md font-semibold text-muted-foreground">Détails du Séjour:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Arrivée:</p>
                  <p className="font-semibold">{format(new Date(reservation.date_arrivee), "dd MMMM yyyy", { locale: fr })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Départ:</p>
                  <p className="font-semibold">{format(new Date(reservation.date_depart), "dd MMMM yyyy", { locale: fr })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Chambre:</p>
                  <p className="font-semibold">{reservation.chambre_id || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nombre d&apos;adultes:</p>
                  <p className="font-semibold">{reservation.nbr_adultes}</p>
                </div>
                {reservation.nbr_enfants !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre d&apos;enfants:</p>
                    <p className="font-semibold">{reservation.nbr_enfants}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Statut:</p>
                  <p className="font-semibold">{reservation.status}</p>
                </div>
              </div>
            </div>

            {/* Section Articles */}
            {reservation.articles && reservation.articles.length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-muted-foreground">Articles Réservés:</h3>
                  {reservation.articles.map((article: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm text-muted-foreground mb-1">
                      <p className="font-semibold">{article.nom} (x{article.quantite})</p>
                      <p>{(article.prix * article.quantite).toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</p>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold mt-2">
                    <p>Total Articles:</p>
                    <p>{totalArticlesPrice.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</p>
                  </div>
                </div>
              </>
            )}

            <Separator className="my-6" />

            {/* Section Paiement & Arrhes */}
            <div className="mb-6">
              <h3 className="text-md font-semibold text-muted-foreground">Paiement & Arrhes:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Montant total du séjour:</p>
                  <p className="font-semibold">{finalTotalPrice.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</p>
                </div>
                {depositPaid > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Arrhes payées:</p>
                    <p className="font-semibold">{depositPaid.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</p>
                  </div>
                )}
                {reservation.date_paiement && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date de paiement arrhes:</p>
                    <p className="font-semibold">{format(new Date(reservation.date_paiement), "dd MMMM yyyy", { locale: fr })}</p>
                  </div>
                )}
                {reservation.mode_paiement && reservation.mode_paiement !== 'NON_RENSEIGNE' && (
                  <div>
                    <p className="text-sm text-muted-foreground">Méthode de paiement des arrhes:</p>
                    <p className="font-semibold">{reservation.mode_paiement}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Reste à payer:</p>
                  <p className="font-semibold">
                    {remainingAmount.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}
                  </p>
                </div>
              </div>
            </div>

            {reservation.commentaireSejour && (
              <div className="mt-6 text-sm text-muted-foreground">
                <p className="font-semibold">Commentaires:</p>
                <p className="whitespace-pre-wrap">{reservation.commentaireSejour}</p>
              </div>
            )}

            <div className="mt-8 text-center text-xs text-muted-foreground print:mt-12">
              <p>Merci de votre réservation !</p>
            </div>
          </div>
        </div>

        <DialogFooter className=" flex-wrap w-full mt-4 border-t p-4 bg-background flex flex-row justify-between print:hidden">
          <Button variant="outline" onClick={() => onEdit(reservation, clientDetails)}>
            Modifier
          </Button>

          {reservation.status === ReservationStatut.PREVUE && (
            <Button variant="default" onClick={() => onCheckIn(reservation.id)}>
              Check-in
            </Button>
          )}
          {reservation.status === ReservationStatut.ARRIVEE && (
            <Button variant="default" onClick={() => onCheckout(reservation.id)}>
              Check-out
            </Button>
          )}
          
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => onDelete(reservation.id)}
          >
            Supprimer
          </Button>
          {reservation.status !== ReservationStatut.ANNULEE && reservation.status !== ReservationStatut.TERMINEE && (
            <Button variant="ghost" onClick={() => onCancel(reservation.id)}>
              Annuler
            </Button>
          )}
          <Button variant="default" onClick={handleSendConfirmationClick} disabled={!reservation.id}>
            <IconMail className="mr-2 h-4 w-4" /> Envoyer confirmation
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <IconPrinter className="mr-2 h-4 w-4" /> Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}