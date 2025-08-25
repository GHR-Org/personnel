import api from "@/lib/api";
import { Reservation } from "@/types/reservation";

export const useReservation = () => {
  const getReservationsByEtablissement = async (id : string) => {
    try {
      const response = await api.get(`/reservation/etablissement/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
      throw new Error("Erreur lors de la récupération des réservations");
    }
  };

  const getReservation = async (id: number) => {
    try {
      const response = await api.get(`/reservation/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la réservation :",
        error
      );
      throw new Error("Erreur lors de la récupération de la réservation");
    }
  };

  const addReservation = async (data: Reservation) => {
    try {
      const response = await api.post("/reservation", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réservation :", error);
      throw new Error("Erreur lors de l'ajout de la réservation");
    }
  };

  const updateReservation = async (id: number, data: Partial<Reservation>) => {
    try {
      const response = await api.put(`/reservation/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réservation :", error);
      throw new Error("Erreur lors de la mise à jour de la réservation");
    }
  };

  const deleteReservation = async (id: number) => {
    try {
      const response = await api.delete(`/reservation/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de la réservation :", error);
      throw new Error("Erreur lors de la suppression de la réservation");
    }
  };

  return {
    getReservationsByEtablissement,
    getReservation,
    addReservation,
    updateReservation,
    deleteReservation,
  };
};
