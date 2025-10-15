// app/page.tsx
"use client";

import { ReservationsTable } from "@/components/reservationComponents/ReservationTable";
import { ReservationStatsCard } from "@/components/reservationComponents/StatChange";
import { useBookings, useCreateBookingMutation } from "@/hooks/useBookingData";
import { ReservationStatut } from "@/lib/enum/ReservationStatus";
import { BookingEvent } from "@/types/reservation";
import { useState, useEffect } from "react";
import { BookingFormInputs } from "@/schemas/reservation";
import { toast } from "sonner"; //
import { AddBookingModal } from "@/components/modals/AddBookingModal";

// TODO: Remplacer par une valeur dynamique, par exemple depuis le contexte de l'utilisateur
const ETABLISSEMENT_ID = 1;

export default function Page() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const createBookingMutation = useCreateBookingMutation(ETABLISSEMENT_ID);

  // Fonction pour gérer la soumission du formulaire de réservation
  const handleSaveBooking = (data: BookingFormInputs) => {
    createBookingMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Nouvelle réservation ajoutée avec succès !");
        handleClose(); // Ferme la modale après le succès de la mutation
      },
      onError: (error) => {
        console.error("Erreur lors de la création de la réservation:", error);
        toast.error("Échec de l'ajout de la réservation. Veuillez réessayer.");
      },
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (ETABLISSEMENT_ID) {
      setIsEnabled(true);
    }
  }, []);

  const {
    data: reservations,
    isLoading,
    isError,
    error,
  } = useBookings(ETABLISSEMENT_ID, isEnabled);

  if (isLoading) {
    return (
      <main className="container mx-auto py-8">
        <p className="text-center">Chargement des réservations...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container mx-auto py-8">
        <p className="text-center text-red-500">
          Erreur lors du chargement des réservations : {error.message}
        </p>
      </main>
    );
  }

  const reservationsToDisplay = reservations || [];

  return (
    <main className="container mx-auto py-8">
      <div className="flex gap-3 my-4 h-3xl justify-between">
        <ReservationStatsCard
          title="Tous les réservations"
          weekSelector
          stats={[
            {
              label: "Total",
              value: reservationsToDisplay.length,
              change: 2.5,
            },
            {
              label: "En attente",
              value: reservationsToDisplay.filter(
                (r) => r.status === ReservationStatut.EN_ATTENTE
              ).length,
              change: -2.5,
            },
            {
              label: "Accomplies",
              value: reservationsToDisplay.filter(
                (r) => r.status === ReservationStatut.TERMINEE
              ).length,
              change: 0,
            },
          ]}
        />
        <ReservationStatsCard
          title="Annulations & retours"
          weekSelector
          stats={[
            {
              label: "Annulé",
              value: reservationsToDisplay.filter(
                (r) => r.status === ReservationStatut.ANNULEE
              ).length,
              change: 2.5,
            },
            { label: "Retourné", value: 0, change: -2.5 },
            { label: "Cassé", value: 0, change: 0 },
          ]}
        />
        <div
          role="button"
          tabIndex={0}
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpen();
            }
          }}
          className="relative bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 max-w-xl w-full flex flex-col justify-center cursor-pointer
    hover:from-blue-500 hover:to-blue-700 hover:scale-[1.03] transition transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {/* Cercle glassmorphisme animé */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-3 w-34 h-34 rounded-full bg-white bg-opacity-20 border border-white border-opacity-10 backdrop-filter backdrop-blur-xl animate-pulse"
          ></div>
          <div className="flex items-center space-x-5 text-white">
            <div className="bg-white bg-opacity-40 rounded-lg p-3 shadow-md">
              <svg
                className="h-7 w-7"
                fill="#87CEEB"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6v-2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-xl leading-tight">Réservation</p>
              <p className="text-sm opacity-90">Ajouter une réservation</p>
            </div>
          </div>
        </div>
      </div>
      <ReservationsTable
        reservations={reservationsToDisplay as BookingEvent[]}
      />

      {/* ✅ Rendu du composant AddBookingModal */}
      <AddBookingModal
        open={isOpen} // Pass the state to control visibility
        onOpenChange={setIsOpen} // Pass the state setter to close the modal
        onSaveBooking={handleSaveBooking} // Pass the save function
      />
    </main>
  );
}
