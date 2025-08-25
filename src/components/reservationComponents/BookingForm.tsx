/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/BookingForm.tsx

"use client";

import * as React from "react";
import { useState } from "react";
import { createBooking } from "@/func/api/reservation/apireservation";
import { BookingFormInputs } from "@/schemas/reservation";
import { Button } from "@/components/ui/button";
import { BookingReservationForm } from "./BookingReservationForm";
import { BookingClientForm } from "./BookingClientForm";

interface BookingFormProps {
  onSave: (data: BookingFormInputs) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function BookingForm({ onSave, onCancel, onClose }: BookingFormProps) {
  const [step, setStep] = useState<"client" | "reservation">("client");
  const [clientData, setClientData] = useState<any | null>(null);
  const [clientId, setClientId] = useState<number | null>(null);
  // Le type `Partial` est correct ici car les données peuvent être partielles au début
  const [reservationData, setReservationData] = useState<Partial<BookingFormInputs> | null>(null);

  const handleClientSubmit = async (data: any) => {
    // ... (votre code pour le client) ...
    const newClientId = 123;
    setClientId(newClientId);
    setClientData(data);
    setStep("reservation");
  };

  // La fonction `handleReservationSubmit` accepte `data` en tant que `Partial`,
  // mais nous l'assurons d'être complète lors de la soumission.
  const handleReservationSubmit = async (data: Partial<BookingFormInputs>) => {
    if (!clientId) {
      console.error("ID client manquant. Impossible de créer la réservation.");
      return;
    }

    // On s'assure que les données sont conformes au type final attendu
    // en utilisant une assertion de type pour signaler que la validation Zod a été effectuée
    const finalData = {
        ...data,
        client_id: clientId,
        articles: data.articles || [],
        arrhes: data.arrhes || {
            montant: 0,
            date_paiement: "",
            mode_paiement: "",
            commentaire: ""
        }
    } as BookingFormInputs; // <-- C'est l'étape cruciale pour corriger l'erreur

    try {
      await createBooking(finalData);
      onSave(finalData);
      if (onClose) onClose();
    } catch (error) {
      console.error("Erreur lors de la création de la réservation :", error);
    }
  };

  return (
    <div className="p-6">
      {step === "client" && (
        <BookingClientForm onSubmit={handleClientSubmit} />
      )}
      {step === "reservation" && (
        <BookingReservationForm
          clientId={clientId}
          onBack={() => setStep("client")}
          onSubmit={handleReservationSubmit}
          initialData={reservationData}
        />
      )}
    </div>
  );
}