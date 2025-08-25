/* eslint-disable @typescript-eslint/no-unused-vars */
// src/store/reservation-store.ts
import { create } from 'zustand'
import { Booking, ReservationStatut, CreateBookingData, UpdateBookingData } from '@/types/reservation'

interface ReservationStore {
  currentReservation: Booking | null
  setReservation: (data: Booking) => void
  updateReservation: (data: Partial<Booking>) => void
  updateStatut: (statut: ReservationStatut) => void
  clearReservation: () => void
}

export const useReservationStore = create<ReservationStore>((set) => ({
  currentReservation: null,

  setReservation: (data) => set({ currentReservation: data }),

  updateReservation: (data) =>
    set((state) =>
      state.currentReservation
        ? { currentReservation: { ...state.currentReservation, ...data } }
        : state
    ),

  updateStatut: (statut) =>
    set((state) =>
      state.currentReservation
        ? { currentReservation: { ...state.currentReservation, statut } }
        : state
    ),

  clearReservation: () => set({ currentReservation: null }),
}))
