/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/reservationComponents/AddBookingModal.tsx

import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { BookingFormInputs } from "@/schemas/reservation";
import { BookingManuel } from "@/schemas/reservation";
import { Client, ClientFormInputs } from "@/types/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { BookingReservationForm } from "../reservationComponents/BookingReservationForm";
import { createBooking } from "@/func/api/reservation/apireservation";
import { Loader2 } from "lucide-react";
import { getClientById, postClient } from "@/func/api/clients/apiclient";
import { BookingClientForm } from "../reservationComponents/BookingClientForm";
import { ClientSelector } from "../reservationComponents/ClientSelector";


interface AddBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveBooking: (data: BookingFormInputs) => void;
  reservationToEdit?: BookingManuel | null;
  prefilledData?: Partial<BookingFormInputs> & Partial<ClientFormInputs> | null;
  onSendConfirmation?: (reservationId: string) => Promise<void>;
  clientDetails?: Client | null;
}

export function AddBookingModal({
  open,
  onOpenChange,
  onSaveBooking,
  reservationToEdit = null,
  prefilledData = null,
  onSendConfirmation,
  clientDetails = null,
}: AddBookingModalProps) {
  const isEditMode = Boolean(reservationToEdit);

  // Initialisation des états
  const [clientState, setClientState] = useState<Partial<ClientFormInputs> | null>(() => {
    if (isEditMode && clientDetails) {
      return clientDetails;
    }
    if (prefilledData) {
      const { first_name, last_name, email, phone, pays } = prefilledData;
      return { first_name, last_name, email, phone, pays };
    }
    return null;
  });

  const [reservationState, setReservationState] = useState<Partial<BookingFormInputs> | null>(() => {
    if (isEditMode) {
      return reservationToEdit;
    }
    if (prefilledData) {
      const {
        date_arrivee,
        date_depart,
        duree,
        nbr_adultes,
        nbr_enfants,
        status,
        chambre_id,
        mode_checkin,
        code_checkin,
        articles,
        arrhes,
      } = prefilledData;
      return {
        date_arrivee,
        date_depart,
        duree,
        nbr_adultes,
        nbr_enfants,
        status,
        chambre_id,
        mode_checkin,
        code_checkin,
        articles,
        arrhes,
      };
    }
    return null;
  });

  const [clientId, setClientId] = useState<number | undefined>(isEditMode && clientDetails ? clientDetails.id : undefined);
  const [step, setStep] = useState<"client-select" | "client-create" | "reservation">("client-select"); // Mettre à jour les étapes
  const [isLoading, setIsLoading] = useState(false);

  // Logique pour la sélection d'un client existant
  const handleSelectClient = (selectedClientId: number) => {
    setClientId(selectedClientId);
    setStep("reservation"); // Passe directement au formulaire de réservation
  };

  // Logique pour la création d'un nouveau client
  const handleCreateClient = async (clientData: ClientFormInputs) => {
    setIsLoading(true);
    try {
      const newClient = await postClient(clientData);
      setClientId(newClient.id);
      setStep("reservation"); // Passe au formulaire de réservation après la création
      toast.success(`Client ${newClient.first_name} ${newClient.last_name} créé avec succès.`);
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      toast.error("Échec de la création du client. Veuillez vérifier les informations.");
    } finally {
      setIsLoading(false);
    }
  };

  // Logique pour la sauvegarde de la réservation
  const handleBookingFormSave = (bookingData: BookingFormInputs) => {
    if (!clientId) {
      toast.error("L'ID client est manquant. Veuillez sélectionner ou créer un client.");
      return;
    }
    const finalBookingData = {
      ...bookingData,
      client_id: clientId,
    };

    onSaveBooking(finalBookingData);
    onOpenChange(false);
  };
  
  const handleClose = () => onOpenChange(false);
  
  const handleSendConfirmation = async () => {
    if (onSendConfirmation && reservationToEdit?.id) {
      try {
        await onSendConfirmation(reservationToEdit.id);
        toast.success("Email de confirmation envoyé !");
      } catch (error) {
        console.error("Erreur lors de l'envoi de la confirmation :", error);
        toast.error("Échec de l'envoi de l'email de confirmation.");
      }
    } else {
      toast.error("Impossible d'envoyer la confirmation : ID de réservation manquant.");
    }
  };

  const currentStep = isEditMode ? "reservation" : step;

  // Si on est en mode édition, on force le clientId
  React.useEffect(() => {
    if (isEditMode && clientDetails) {
      setClientId(clientDetails.id);
    }
  }, [isEditMode, clientDetails]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Modifier la Réservation" : "Ajouter une Nouvelle Réservation"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Mettez à jour les détails de cette réservation."
              : "Remplissez les informations pour ajouter une nouvelle réservation."}
          </DialogDescription>
        </DialogHeader>

        {/* Étape de sélection ou de création de client */}
        {currentStep === "client-select" && (
          <ClientSelector
            onSelectClient={handleSelectClient}
            onNewClient={() => setStep("client-create")}
          />
        )}

        {/* Étape de création manuelle de client */}
        {currentStep === "client-create" && (
          <BookingClientForm
            initialData={clientState}
            onSubmit={handleCreateClient}
            onCancel={() => setStep("client-select")} // Permet de revenir en arrière
            isLoading={isLoading}
          />
        )}

        {/* Étape de création de la réservation */}
        {currentStep === "reservation" && (
          <BookingReservationForm
            clientId={clientId}
            initialData={reservationState}
            onBack={() => setStep("client-select")}
            onSubmit={handleBookingFormSave}
            isLoading={isLoading}
          />
        )}

        {isEditMode && onSendConfirmation && (
          <DialogFooter className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={handleSendConfirmation}
              disabled={!reservationToEdit?.id}
            >
              Envoyer la confirmation
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}