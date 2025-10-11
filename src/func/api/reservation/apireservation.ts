/* eslint-disable @typescript-eslint/no-unused-vars */
// src/api/reservation.api.ts

import apiClient from "@/func/APIClient";

import { BookingManuelSchema, BookingFormInputs, UpdateBookingStatutDataSchema, UpdateBookingData } from "@/schemas/reservation";
import { z } from "zod";
import axios, { AxiosResponse } from "axios";


export type BookingManuel = z.infer<typeof BookingManuelSchema>;

export type CreateBookingData = BookingFormInputs;

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

export type UpdateBookingStatutData = z.infer<typeof UpdateBookingStatutDataSchema>;


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

/**
 * 
 * @param bookingData 
 * @returns 
 */
export const createBooking = async (
  bookingData: CreateBookingData 
): Promise<BookingManuel> => {
  try {
    console.log("Données de réservation envoyées:", bookingData);
    const response = await apiClient.post<CreateReservationResponse>(
      `${APIURL}/reservation`, // Endpoint pour la création
      bookingData
    );
    console.table(response.data.reservation)
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
/**
 * Met à jour une réservation existante.
 * @param id L'ID de la réservation à mettre à jour.
 * @param updateData Les données de mise à jour.
 * @returns La réservation mise à jour.
 */
export const updateBooking = async (
  id: number | undefined,
  updateData: UpdateBookingData
): Promise<BookingManuel> => {
  try {
    const response = await apiClient.patch<BookingManuel>( // 1. Changez le type générique de la réponse ici
      `${APIURL}/reservation/${id}`,
      updateData
    );
    return response.data; // 2. Retournez le corps de la réponse, pas l'objet entier
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const apiErrorMessage = (error.response?.data as { message?: string })?.message;

      console.error(
        "Erreur lors de la mise à jour de la réservation:",
        apiErrorMessage || error.response?.data || error.message
      );

      throw new Error(apiErrorMessage || "Erreur inconnue lors de la mise à jour de la réservation.");
    } else {
      console.error("Erreur inattendue lors de la mise à jour de la réservation:", error);
      throw new Error("Une erreur inattendue est survenue lors de la mise à jour de la réservation.");
    }
  }
};
interface ConfirmationResponse {
  message: string;
}
/**
 * 
 * @param reservationId 
 * @param statusData
 * @returns 
 */
export const sendBookingConfirmation = async (
  reservationId: number,
  statusData: UpdateBookingStatutData // Ajout du paramètre 'statusData'
): Promise<ConfirmationResponse> => {
  try {
    const response = await apiClient.patch<ConfirmationResponse>(
      `${APIURL}/reservation/${reservationId}`,
      statusData // Le corps de la requête PATCH
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Erreur lors de l'envoi de la confirmation:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Erreur inconnue lors de l'envoi de la confirmation.");
    } else {
      console.error("Erreur inattendue lors de l'envoi de la confirmation:", error);
      throw new Error("Une erreur inattendue est survenue lors de l'envoi de la confirmation.");
    }
  }
};