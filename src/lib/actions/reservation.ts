/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/actions/reservation.ts
import { BookingFormData } from "@/schemas/reservation";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Met à jour le statut d'une réservation pour la marquer comme "arrivée" (check-in).
 * @param reservationId L'ID de la réservation à mettre à jour.
 * @returns Une promesse résolue avec le statut de l'opération.
 */
export async function checkInReservation(reservationId: string): Promise<ApiResponse<BookingFormData>> {
  try {
    const response = await fetch(`/api/reservations/${reservationId}/checkin`, {
      method: 'PATCH', // Ou PUT si vous mettez à jour l'objet complet
      headers: {
        'Content-Type': 'application/json',
      },
      // Pas de corps si l'ID est dans l'URL et que le statut est fixe
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur lors du check-in de la réservation: ${response.statusText}`);
    }

    const data: BookingFormData = await response.json();
    return { success: true, data };

  } catch (error: any) {
    console.error("Erreur check-in réservation:", error);
    return { success: false, error: error.message || "Une erreur inattendue est survenue lors du check-in." };
  }
}

// Vous pouvez ajouter d'autres fonctions ici, comme `updateReservation`, `deleteReservation`, etc.
export async function updateReservation(reservationId: string, data: Partial<BookingFormData>): Promise<ApiResponse<BookingFormData>> {
  try {
    const response = await fetch(`/api/reservations/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur lors de la mise à jour de la réservation: ${response.statusText}`);
    }

    const updatedData: BookingFormData = await response.json();
    return { success: true, data: updatedData };

  } catch (error: any) {
    console.error("Erreur mise à jour réservation:", error);
    return { success: false, error: error.message || "Une erreur inattendue est survenue lors de la mise à jour." };
  }
}