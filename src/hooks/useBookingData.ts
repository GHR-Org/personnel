// src/hooks/useBookingData.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookings, createBooking, updateBooking } from "@/func/api/reservation/apireservation";
import { getRooms } from "@/func/api/chambre/apiroom";
import { getClientById } from "@/func/api/clients/apiclient";
import type { BookingEvent, BookingFormInputs } from "@/schemas/reservation";
import type { room as RoomType } from "@/types/room";
import { Produit } from "@/types/Produit";
import { getAllProduits } from "@/func/api/produit/apiproduit";

// Importez l'énumération si vous en avez besoin pour les mutations
// import { ReservationStatut } from "@/lib/enum/ReservationStatus";

/**
 * Hook pour récupérer les réservations avec enrichissement des données client.
 * La requête est activée uniquement si etablissementId est un nombre valide.
 */
export const useBookings = (etablissementId: number, isEnabled: boolean) => {
  return useQuery<BookingEvent[]>({
    queryKey: ["bookings", etablissementId],
    queryFn: async () => {
      const bookingsData = await getBookings(etablissementId);
      const enrichedBookings = await Promise.all(
        bookingsData.map(async (booking) => {
          if (booking.client_id) {
            const client = await getClientById(booking.client_id);
            if (client) {
              return {
                ...booking,
                first_name: client.first_name,
                last_name: client.last_name,
              } as BookingEvent;
            }
          }
          return {
            ...booking,
            first_name: booking.first_name || "N/A",
            last_name: booking.last_name || "",
          } as BookingEvent;
        })
      );
      return enrichedBookings;
    },
    enabled: isEnabled,
  });
};

/**
 * Hook pour récupérer les chambres.
 * La requête est activée uniquement si etablissementId est un nombre valide.
 */
export const useRooms = (etablissementId: number, isEnabled: boolean) => {
  return useQuery<RoomType[]>({
    queryKey: ["rooms", etablissementId],
    queryFn: () => getRooms(etablissementId),
    enabled: isEnabled,
  });
};

export const useArticles = (etablissementId: number, isEnabled: boolean) => {
  return useQuery<Produit[]>({
    queryKey: ["Produits", etablissementId],
    queryFn: () => getAllProduits(etablissementId),
    enabled: isEnabled,
  });
};

/**
 * Hook de mutation pour créer une nouvelle réservation.
 * Invalide le cache des réservations après une création réussie.
 */
export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newBooking: BookingFormInputs) => createBooking(newBooking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

/**
 * Hook de mutation pour mettre à jour une réservation existante.
 * Invalide le cache des réservations après une mise à jour réussie.
 */
export const useUpdateBookingMutation = (etablissementId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedBooking: BookingFormInputs) => updateBooking(updatedBooking, etablissementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};