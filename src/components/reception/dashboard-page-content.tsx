/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/reception/dashboard/dashboard-page-content.tsx

"use client";
import React, { useState, useCallback } from "react";
import type { BookingEvent, BookingFormInputs } from "@/schemas/reservation";
import { ReservationStatut } from "@/lib/enum/ReservationStatus";
import { Civilite } from "@/lib/enum/Civilite";
import { ModeCheckin } from "@/lib/enum/ModeCheckin";
import { ModePaiment } from "@/lib/enum/ModePaiment";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import RoomTable from "@/components/calendar/RoomTable";
import { AddBookingModal } from "@/components/modals/AddBookingModal";
import { ReportIncidentModal } from "@/components/modals/ReportIncidentModal";
import { ViewArrhesModal } from "@/components/modals/ViewArrhesModal";
import { ReservationDetailsDrawer } from "@/components/reservationComponents/ReservationDetailsDrawer";
import FiltresReservations, { ReservationFilters } from "@/components/reservationComponents/FiltresReservation";
import { Client } from "@/types/client";

// Importez les hooks nécessaires
import { useEtablissementId } from "@/hooks/useEtablissementId";
import { useBookings, useCreateBookingMutation, useRooms, useUpdateBookingMutation } from "@/hooks/useBookingData";
import ModeToggle from "../modetoggle";
import { getClientById } from "@/func/api/clients/apiclient";
import "@/styles/calendar.css";

// Importation de `cn` pour une gestion plus propre des classes
import { cn } from "@/lib/utils"; 

interface RoomTableRoom {
  id: number;
  name: string;
}

const DashboardPageContent = () => {
  const { etablissementId, isLoading: isEtablissementIdLoading } = useEtablissementId();
  const isEnabled = !!etablissementId;

  const { data: reservations, isLoading: areReservationsLoading, error: reservationsError } = useBookings(etablissementId, isEnabled);
  const { data: roomsData, isLoading: areRoomsLoading, error: roomsError } = useRooms(etablissementId, isEnabled);
  
  const [currentFilters, setCurrentFilters] = useState<ReservationFilters>({});
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [prefilledDataForNewReservation, setPrefilledDataForNewReservation] = useState<Partial<BookingEvent> | null>(null);
  const [reservationToEdit, setReservationToEdit] = useState<BookingEvent | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [reservationToView, setReservationToView] = useState<BookingEvent | null>(null);
  const [clientDetailsToViewOrEdit, setClientDetailsToViewOrEdit] = useState<Client | null>(null);
  const [isArrhesModalOpen, setIsArrhesModalOpen] = useState(false);
  const [arrhesToView, setArrhesToView] = useState<BookingEvent | null>(null);
  const [isReportIncidentModalOpen, setIsReportIncidentModalOpen] = useState(false);
  const [reservationForReport, setReservationForReport] = useState<BookingEvent | null>(null);

  const resetModalsStates = useCallback(() => {
    setPrefilledDataForNewReservation(null);
    setReservationToEdit(null);
    setReservationToView(null);
    setArrhesToView(null);
    setReservationForReport(null);
    setClientDetailsToViewOrEdit(null);
  }, []);

  const handleAddReservationClick = useCallback(() => {
    setIsReservationModalOpen(true);
    setPrefilledDataForNewReservation(null);
    setReservationToEdit(null);
    setClientDetailsToViewOrEdit(null);
  }, []);

  const handleOpenChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<boolean>>, status: boolean) => {
      setter(status);
      if (!status) {
        resetModalsStates();
      }
    },
    [resetModalsStates]
  );
  const createBookingMutation = useCreateBookingMutation();
  const updateBookingMutation = useUpdateBookingMutation();

  const openDetailsDrawer = useCallback(async (reservation: BookingEvent) => {
    setReservationToView(reservation);
    setIsDetailsDrawerOpen(true);
    
    if (reservation.client_id) {
      try {
        const client = await getClientById(reservation.client_id);
        setClientDetailsToViewOrEdit(client);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails du client :", error);
        toast.error("Impossible de charger les informations du client.");
        setClientDetailsToViewOrEdit(null);
      }
    } else {
      setClientDetailsToViewOrEdit(null);
    }
  }, []);
  const openEditReservationModal = useCallback(async (reservation: BookingEvent) => { /* ... */ }, []);
  const openArrhesModal = useCallback((reservation: BookingEvent) => { /* ... */ }, []);
  const openReportIncidentModal = useCallback((reservation: BookingEvent) => { /* ... */ }, []);
  const handleSaveReservation = useCallback(
    (newReservationData: BookingFormInputs) => {
      if (reservationToEdit) {
        updateBookingMutation.mutate(newReservationData, {
          onSuccess: () => {
            toast.success("Réservation mise à jour avec succès !");
            handleOpenChange(setIsReservationModalOpen, false);
          },
          onError: (error) => {
            toast.error("Échec de la mise à jour de la réservation.");
            console.error("Erreur de mise à jour:", error);
          },
        });
      } else {
        createBookingMutation.mutate(newReservationData, {
          onSuccess: () => {
            toast.success("Réservation ajoutée avec succès !");
            handleOpenChange(setIsReservationModalOpen, false);
          },
          onError: (error) => {
            toast.error("Échec de l'ajout de la réservation.");
            console.error("Erreur de création:", error);
          },
        });
      }
    },
    [handleOpenChange, reservationToEdit, createBookingMutation, updateBookingMutation]
  );
  const updateReservationStatus = useCallback((reservationId: string, newStatus: ReservationStatut, message: string) => { /* ... */ }, []);
  const handleCheckInClient = useCallback((reservationId: string) => { /* ... */ }, [updateReservationStatus]);
  const handleCheckoutReservation = useCallback((reservationId: string) => { /* ... */ }, [updateReservationStatus]);
  const handleCancelReservation = useCallback((reservationId: string) => { /* ... */ }, [updateReservationStatus]);
  const handleFilterChange = useCallback((filters: ReservationFilters) => { /* ... */ }, []);
  const handleDeleteReservation = useCallback((reservationId: string) => { /* ... */ }, [handleOpenChange]);
  const handleRequestCleaning = useCallback((roomId: string) => { /* ... */ }, []);
  const handleSelectSlotForNewReservation = useCallback((data: { date_arrivee: string; date_depart: string; chambre_id: number }) => { /* ... */ }, []);
  const handleBookingUpdated = useCallback((updatedReservation: BookingEvent) => { /* ... */ }, []);
  const onSendConfirmation = useCallback(async (reservationId: string) => { /* ... */ }, []);
  const handleBookingDeleted = useCallback(() => { /* ... */ }, [handleOpenChange]);

  const rooms: RoomTableRoom[] = roomsData?.map((room) => ({
    id: room.id,
    name: room.numero,
  })) || [];
  const reservationsToDisplay = reservations || [];
  
  if (isEtablissementIdLoading || areReservationsLoading || areRoomsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-center text-xl font-bold text-gray-600 dark:text-gray-400">
          Chargement de la configuration et des données...
        </p>
      </div>
    );
  }

  if (!etablissementId) {
    return (
      <div className="flex flex-col items-center w-screen justify-center min-h-screen">
        <p className="text-center text-xl font-bold text-red-600 dark:text-red-400">
          Erreur : Impossible de récupérer l&apos;ID de l&apos;établissement.
        </p>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
          Veuillez vous reconnecter ou contacter l&apos;administrateur.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative p-4 sm:p-6 lg:p-8"> {/* Modification ici */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center my-2"> {/* Modification ici */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary dark:text-gray-50 pb-4 sm:pb-0">
          Détail des Opérations
        </h2>
      </div>
      
      <FiltresReservations
        onFilterChange={handleFilterChange}
        onAddReservation={handleAddReservationClick}
      />
      
      {reservationsToDisplay.length === 0 && rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4"> {/* Modification ici */}
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Aucune donnée disponible pour le moment.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto mt-4"> {/* Modification ici */}
          <RoomTable
            rooms={rooms}
            reservations={reservationsToDisplay}
            isDetailsDrawerOpen={isDetailsDrawerOpen}
            reservationToView={reservationToView}
            openDetailsDrawer={openDetailsDrawer}
            openEditReservationModal={openEditReservationModal}
            handleCloseReservationSheet={() => handleOpenChange(setIsDetailsDrawerOpen, false)}
            handleCheckInClient={handleCheckInClient}
            openArrhesModal={openArrhesModal}
            handleCancelReservation={handleCancelReservation}
            handleCheckoutReservation={handleCheckoutReservation}
            handleRequestCleaning={handleRequestCleaning}
            openReportIncidentModal={openReportIncidentModal}
            handleDeleteReservation={handleDeleteReservation}
            onSelectSlot={handleSelectSlotForNewReservation}
            onSendConfirmation={onSendConfirmation}
            onBookingUpdated={handleBookingUpdated}
          />
        </div>
      )}
      
      <AddBookingModal
        open={isReservationModalOpen}
        onOpenChange={(status) => handleOpenChange(setIsReservationModalOpen, status)}
        onSaveBooking={handleSaveReservation}
        prefilledData={prefilledDataForNewReservation}
        reservationToEdit={reservationToEdit}
        clientDetails={clientDetailsToViewOrEdit}
        onSendConfirmation={onSendConfirmation}
      />
      
      <ReservationDetailsDrawer
        open={isDetailsDrawerOpen}
        onClose={() => handleOpenChange(setIsDetailsDrawerOpen, false)}
        reservation={reservationToView}
        clientDetails={clientDetailsToViewOrEdit}
        onEdit={openEditReservationModal}
        onCheckIn={handleCheckInClient}
        onCheckout={handleCheckoutReservation}
        onCancel={handleCancelReservation}
        onDelete={handleDeleteReservation}
        onBookingUpdated={handleBookingUpdated}
        onBookingDeleted={handleBookingDeleted}
        onSendConfirmation={onSendConfirmation}
      />
      
      <ViewArrhesModal
        open={isArrhesModalOpen}
        onOpenChange={(status) => handleOpenChange(setIsArrhesModalOpen, status)}
        reservation={arrhesToView}
      />
      
      {isReportIncidentModalOpen && reservationForReport && (
        <ReportIncidentModal
          open={isReportIncidentModalOpen}
          onOpenChange={(status) => handleOpenChange(setIsReportIncidentModalOpen, status)}
          reservation={reservationForReport}
        />
      )}
    </div>
  );
};

export default DashboardPageContent;