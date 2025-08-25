/* eslint-disable @typescript-eslint/no-unused-vars */
// src/api/reservation.api.ts

import apiClient from "@/func/APIClient";

import { BookingManuelSchema, UpdateBookingDataSchema, UpdateBookingStatutDataSchema, BookingFormInputs } from "@/schemas/reservation";
import { z } from "zod";
import axios, { AxiosResponse } from "axios";


export type BookingManuel = z.infer<typeof BookingManuelSchema>;

export type CreateBookingData = BookingFormInputs;
// UpdateBookingData est le type pour les données envoyées lors de la mise à jour partielle d'une réservation
export type UpdateBookingData = z.infer<typeof UpdateBookingDataSchema>;
// UpdateBookingStatutData est le type pour la mise à jour du statut
export type UpdateBookingStatutData = z.infer<typeof UpdateBookingStatutDataSchema>;


interface ApiClientResponse<T> extends AxiosResponse {
  data: T;
}

interface GetReservationsResponse {
  message: string;
  reservations: BookingManuel[]; 
}

interface CreateReservationResponse {
  message: string;
  reservation: BookingManuel; 
}

interface UpdateReservationResponse {
  message: string;
  reservation: BookingManuel;
}

const APIURL = process.env.NEXT_PUBLIC_API_URL;


export const getBookings = async (etablissement_id: number): Promise<BookingManuel[]> => {
  try {
    const response = await apiClient.get<GetReservationsResponse>(
      `${APIURL}/reservation/etablissement/${etablissement_id}`
    );
    return response.data.reservations;
    console.table()
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des réservations:", error); 
    return []; 
  }
};

// --- Créer une nouvelle réservation ---
export const createBooking = async (
  bookingData: CreateBookingData 
): Promise<BookingManuel> => {
  try {
    const response = await apiClient.post<CreateReservationResponse>(
      `${APIURL}/reservation`, // Endpoint pour la création
      bookingData
    );
    return response.data.reservation;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Erreur lors de la création de la réservation:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erreur inconnue lors de la création de la réservation.");
    } else {
      console.error("Erreur inattendue lors de la création de la réservation:", error);
      throw new Error("Une erreur inattendue est survenue lors de la création de la réservation.");
    }
  }
};

// --- Mettre à jour une réservation existante ---
export const updateBooking = async (
  id: string,
  updateData: UpdateBookingData
): Promise<BookingManuel> => {
  try {
  

    const response = await apiClient.patch<UpdateReservationResponse>( // PATCH est généralement utilisé pour les mises à jour partielles
      `${APIURL}/reservation/${id}`,
      updateData
    );
    return response.data.reservation; // Assurez-vous que votre API renvoie l'objet réservation mis à jour
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Erreur lors de la mise à jour de la réservation:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erreur inconnue lors de la mise à jour de la réservation.");
    } else {
      console.error("Erreur inattendue lors de la mise à jour de la réservation:", error);
      throw new Error("Une erreur inattendue est survenue lors de la mise à jour de la réservation.");
    }
  }
};

// --- Mettre à jour le statut d'une réservation ---
export const updateBookingStatus = async (
  id: string,
  statusData: UpdateBookingStatutData 
): Promise<BookingManuel> => {
  try {
    

    const response = await apiClient.patch<UpdateReservationResponse>(
      `${APIURL}/reservation/${id}/status`,
      statusData
    );
    return response.data.reservation;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Erreur lors de la mise à jour du statut de la réservation:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erreur inconnue lors de la mise à jour du statut de la réservation.");
    } else {
      console.error("Erreur inattendue lors de la mise à jour du statut de la réservation:", error);
      throw new Error("Une erreur inattendue est survenue lors de la mise à jour du statut de la réservation.");
    }
  }
};

// --- Supprimer une réservation ---
export const deleteBooking = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${APIURL}/reservation/${id}`);
    console.log(`Réservation ${id} supprimée avec succès.`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Erreur lors de la suppression de la réservation:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erreur inconnue lors de la suppression de la réservation.");
    } else {
      console.error("Erreur inattendue lors de la suppression de la réservation:", error);
      throw new Error("Une erreur inattendue est survenue lors de la suppression de la réservation.");
    }
  }
};