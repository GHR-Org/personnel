/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/reservationStore.ts

import { create } from 'zustand';
import {
  BookingManuel,
  BookingFormInputs,
  UpdateBookingData,
  UpdateBookingStatutData,
} from '@/schemas/reservation'; // Vos types et schémas Zod
import { getBookings, createBooking, updateBooking, sendBookingConfirmation, deleteBooking } from '@/func/api/reservation/apireservation';
import {produce} from 'immer';
// Interface du store
interface ReservationState {
  reservations: BookingManuel[];
  currentBooking: Partial<BookingFormInputs> | null;
  isLoading: boolean;
  error: string | null;
  fetchReservations: (etablissementId: number) => Promise<void>;
  createBooking: (bookingData: BookingFormInputs) => Promise<void>;
  updateBooking: (id: number, updateData: UpdateBookingData) => Promise<void>;
  updateBookingStatus: (
    id: number,
    statusData: UpdateBookingStatutData
  ) => Promise<void>;
  deleteBooking: (id: number) => Promise<void>;
  setInitialBooking: (data: Partial<BookingFormInputs>) => void;
  resetState: () => void;
}

// État initial
const initialState = {
  reservations: [],
  currentBooking: null,
  isLoading: false,
  error: null,
};

export const useReservationStore = create<ReservationState>((set, get) => ({
  ...initialState,

  // Action pour récupérer toutes les réservations
  fetchReservations: async (etablissementId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getBookings(etablissementId);
      set({ reservations: data, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Erreur lors de la récupération des réservations.',
      });
    }
  },

  // Action pour créer une nouvelle réservation (POST)
  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null });
    try {
      const newBooking = await createBooking(bookingData);
      set(
        produce((state) => {
          state.reservations.push(newBooking);
          state.currentBooking = newBooking;
          state.isLoading = false;
        })
      );
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Erreur lors de la création de la réservation.',
      });
    }
  },

  // Action pour mettre à jour une réservation (PATCH)
  updateBooking: async (id, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedBooking = await updateBooking(id, updateData);
      set(
        produce((state) => {
          const index = state.reservations.findIndex((r: { id: number; }) => r.id === id);
          if (index !== -1) {
            state.reservations[index] = updatedBooking;
          }
          state.currentBooking = updatedBooking;
          state.isLoading = false;
        })
      );
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Erreur lors de la mise à jour de la réservation.',
      });
    }
  },

  // Action pour mettre à jour le statut (PATCH)
  updateBookingStatus: async (id, statusData) => {
    set({ isLoading: true, error: null });
    try {
      // Utilisez sendBookingConfirmation pour la mise à jour du statut
      await sendBookingConfirmation(id, statusData);
      
      set(
        produce((state) => {
          const bookingToUpdate = state.reservations.find((r: { id: number; }) => r.id === id);
          if (bookingToUpdate) {
            bookingToUpdate.status = statusData.status;
          }
          state.isLoading = false;
        })
      );
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Erreur lors de la mise à jour du statut.',
      });
    }
  },
  
  // Action pour supprimer une réservation (DELETE)
  deleteBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteBooking(id.toString()); // Convertir l'ID en string si nécessaire
      set(
        produce((state) => {
          state.reservations = state.reservations.filter((r: { id: number; }) => r.id !== id);
          state.isLoading = false;
        })
      );
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Erreur lors de la suppression de la réservation.',
      });
    }
  },

  // Action pour initialiser les données du formulaire
  setInitialBooking: (data) =>
    set({
      currentBooking: {
        ...get().currentBooking,
        ...data,
      },
    }),

  // Action pour réinitialiser le store
  resetState: () => set(initialState),
}));