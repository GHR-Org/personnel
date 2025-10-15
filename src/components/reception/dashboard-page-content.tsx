/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/reception/dashboard/dashboard-page-content.tsx

"use client";
import React, { useState, useCallback } from "react";
import type { BookingFormInputs } from "@/schemas/reservation";
import { ReservationStatut } from "@/lib/enum/ReservationStatus";
import { ModeCheckin } from "@/lib/enum/ModeCheckin";
import { ModePaiment } from "@/lib/enum/ModePaiment";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import RoomTable from "@/components/calendar/RoomTable";
import { AddBookingModal } from "@/components/modals/AddBookingModal";
import { ReportIncidentModal } from "@/components/modals/ReportIncidentModal";
import { ViewarheeModal } from "@/components/modals/ViewArrhesModal";
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
import { BookingEvent } from "@/types/reservation";
import { useQueryClient } from "@tanstack/react-query";
import { checkinReservation, sendBookingConfirmation } from "@/func/api/reservation/apireservation";
import { useAuth } from "@/hooks/useAuth";
import { getCurrentUser } from "@/func/api/personnel/apipersonnel";
import { Report } from "../modals/Report";

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
  const [isarheeModalOpen, setIsarheeModalOpen] = useState(false);
  const [arheeToView, setarheeToView] = useState<BookingEvent | null>(null);
  const [isReportIncidentModalOpen, setIsReportIncidentModalOpen] = useState(false);
  const [reservationForReport, setReservationForReport] = useState<BookingEvent | null>(null);
  const queryClient = useQueryClient();

  const resetModalsStates = useCallback(() => {
    setPrefilledDataForNewReservation(null);
    setReservationToEdit(null);
    setReservationToView(null);
    setarheeToView(null);
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
  const createBookingMutation = useCreateBookingMutation(etablissementId);
  const updateBookingMutation = useUpdateBookingMutation(etablissementId);

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
  const openEditReservationModal = useCallback(async (reservation: BookingEvent) => {
  // 1. Fermer le tiroir de détails si il est ouvert
  handleOpenChange(setIsDetailsDrawerOpen, false);
  
  // 2. Mettre la réservation à éditer dans l'état
  setReservationToEdit(reservation);
  
  // 3. Récupérer les données du client si elles existent
  if (reservation.client_id) {
    try {
      const client = await getClientById(reservation.client_id);
      setClientDetailsToViewOrEdit(client);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du client pour l'édition :", error);
      toast.error("Impossible de charger les informations du client.");
      setClientDetailsToViewOrEdit(null);
    }
  } else {
    setClientDetailsToViewOrEdit(null);
  }
  
  // 4. Ouvrir la modale d'ajout/modification
  handleOpenChange(setIsReservationModalOpen, true);
}, [handleOpenChange]);


  const openarheeModal = useCallback((reservation: BookingEvent) => { setarheeToView(reservation);
        // 2. Ouvrir la modale
        handleOpenChange(setIsarheeModalOpen, true); }, [handleOpenChange]);
  const openReportIncidentModal = useCallback((reservation: BookingEvent) => {
        // 1. Mettre l'objet de la réservation dans l'état pour que la modale y accède
        setReservationForReport(reservation);
        
        // 2. Ouvrir la modale
        // Utilisation de handleOpenChange pour gérer les états de fermeture
        handleOpenChange(setIsReportIncidentModalOpen, true);
    }, [handleOpenChange]);
  const handleSaveReservation = useCallback(
    (newReservationData: BookingFormInputs) => {
        if (reservationToEdit) {
            updateBookingMutation.mutate({ id: reservationToEdit.id, updateData: newReservationData }, {
                onSuccess: () => {
                    toast.success("Réservation mise à jour avec succès !");
                    handleOpenChange(setIsReservationModalOpen, false);
                    queryClient.invalidateQueries({
                        queryKey: ["reservations", etablissementId],
                    });
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
                    queryClient.invalidateQueries({
                        queryKey: ["reservations", etablissementId],
                    });
                },
                onError: (error) => {
                    toast.error("Échec de l'ajout de la réservation.");
                    console.error("Erreur de création:", error);
                },
            });
        }
    },
    [handleOpenChange, reservationToEdit, createBookingMutation, updateBookingMutation, queryClient, etablissementId]
);
  const updateReservationStatus = useCallback((reservationId: string, newStatus: ReservationStatut, message: string) => { /* ... */ }, []);
  const handleCheckInClient = useCallback(async(reservationId: number | undefined) => { 
    if (!reservationId) {
            toast.error("ID de réservation manquant pour l'arrivée.");
            return;
        }

        // 1. Récupérer l'utilisateur actuel (Personnel)
        const user = await getCurrentUser();

        if (!user || !user.id) {
            toast.error("Utilisateur non authentifié. Impossible d'effectuer l'arrivée.");
            return;
        }

        try {
            // 2. Préparer les données de statut pour le PATCH
            const statusData = {
                status: ReservationStatut.ARRIVEE, // Le nouveau statut est "Arrivée"
                personnel_id: user.id,             // L'ID du personnel qui effectue l'action
            };

            // 3. Appeler l'API pour mettre à jour le statut
            await checkinReservation(reservationId, statusData);

            // 4. Invalider les requêtes pour rafraîchir le calendrier
            queryClient.invalidateQueries({
                queryKey: ["reservations", etablissementId],
            });

            // 5. Afficher une notification de succès
            toast.success(`Arrivée enregistrée avec succès pour la réservation n° ${reservationId} !`);
            
            // Fermer le tiroir si la mise à jour vient du tiroir
            handleOpenChange(setIsDetailsDrawerOpen, false); 
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de l'arrivée :", error);
            toast.error("Échec de l'enregistrement de l'arrivée.");
        }
   }, [queryClient, etablissementId ]);
  const handleCheckoutReservation = useCallback((reservationId: number | undefined) => { /* ... */ }, [updateReservationStatus]);
  const handleCancelReservation = useCallback(async (reservationId: number) => { 
    const user = await getCurrentUser();
    if (!user || !user.id) {
      toast.error("Utilisateur non authentifié. Impossible de confirmer la réservation.");
      return;
    }

    try {
      const statusData = {
        status: ReservationStatut.ANNULEE,
        personnel_id: user.id, // Maintenant user.id est accessible
      };
      await sendBookingConfirmation(reservationId, statusData);
      queryClient.invalidateQueries({
        queryKey: ["reservations", etablissementId],
      });
      toast.success(`Réservation n° ${reservationId} annulé avec succès !`);

    } catch (error) {
      console.error("Erreur lors de l'envoi de la confirmation:", error);
      toast.error("Échec de l'envoi de la confirmation de réservation.");
    }
  }, [updateReservationStatus]);
  const handleFilterChange = useCallback((filters: ReservationFilters) => { /* ... */ }, []);
  const handleDeleteReservation = useCallback((reservationId: number | undefined) => { /* ... */ }, [handleOpenChange]);
  const handleRequestCleaning = useCallback((roomId: number | undefined) => { /* ... */ }, []);
  const handleSelectSlotForNewReservation = useCallback((data: { date_arrivee: string; date_depart: string; chambre_id: number | undefined }) => { /* ... */ }, []);
  const handleBookingUpdated = useCallback((updatedReservation: BookingEvent) => {
    // Invalide la requête pour rafraîchir les données du calendrier
    queryClient.invalidateQueries({
      queryKey: ["reservations", etablissementId],
    });
    // Ferme le drawer après la mise à jour
    handleOpenChange(setIsDetailsDrawerOpen, false);
    setReservationToView(updatedReservation);
  }, [queryClient, etablissementId, handleOpenChange]);

  const onSendConfirmation = useCallback(async (reservationId: number) => {
    // 1. Attendez la résolution de la promesse pour obtenir l'objet utilisateur
    const user = await getCurrentUser();

    if (!user || !user.id) {
      toast.error("Utilisateur non authentifié. Impossible de confirmer la réservation.");
      return;
    }

    try {
      const statusData = {
        status: ReservationStatut.CONFIRMEE,
        personnel_id: user.id, // Maintenant user.id est accessible
      };
      await sendBookingConfirmation(reservationId, statusData);
      queryClient.invalidateQueries({
        queryKey: ["reservations", etablissementId],
      });
      toast.success("Confirmation de réservation envoyée avec succès !");

    } catch (error) {
      console.error("Erreur lors de l'envoi de la confirmation:", error);
      toast.error("Échec de l'envoi de la confirmation de réservation.");
    }
  }, [getCurrentUser]);
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
         Calendrier des chambres
        </h2>
      </div>
      
      <FiltresReservations
        onFilterChange={handleFilterChange}
        onAddReservation={handleAddReservationClick}
      />
      
      {reservationsToDisplay.length === 0 && rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
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
            openarheeModal={openarheeModal}
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
      
      <ViewarheeModal
        open={isarheeModalOpen}
        onOpenChange={(status) => handleOpenChange(setIsarheeModalOpen, status)}
        reservation={arheeToView}
      />
      
      {isReportIncidentModalOpen && reservationForReport && (
        <Report
          open={isReportIncidentModalOpen}
          onOpenChange={(status) => handleOpenChange(setIsReportIncidentModalOpen, status)}
        />
      )}
      <ViewarheeModal 
        open={isarheeModalOpen}
        onOpenChange={(status) => handleOpenChange(setIsarheeModalOpen, status)}
        reservation={arheeToView}
      />
    </div>
  );
};

export default DashboardPageContent;