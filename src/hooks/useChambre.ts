import api from "@/lib/api";
import { Chambre } from "@/types/chambre";

export const useChambre = () => {
  const addChambre = async (data: Chambre) => {
    try {
      const response = await api.post("/chambre", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la chambre :", error);
      throw new Error("Erreur lors de l'ajout de la chambre");
    }
  };

  const updateChambre = async (id_chambre: string, data: Chambre) => {
    try {
      const response = await api.put(`/chambre/${id_chambre}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la chambre :", error);
      throw new Error("Erreur lors de la mise à jour de la chambre");
    }
  };

  const deleteChambre = async (id_chambre: string) => {
    try {
      const response = await api.delete(`/chambre/${id_chambre}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de la chambre :", error);
      throw new Error("Erreur lors de la suppression de la chambre");
    }
  };

  const getChambreById = async (id_chambre: string) => {
    try {
      const response = await api.get(`/chambre/${id_chambre}`);
      return response.data as Chambre;
    } catch (error) {
      console.error("Erreur lors de la récupération de la chambre :", error);
      throw new Error("Erreur lors de la récupération de la chambre");
    }
  };

  const getChambresByEtablissement = async (id_etab: string) => {
    try {
      const response = await api.get(
        `/chambre/etablissement/${id_etab}`
      );
      return response.data as Chambre[];
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des chambres de l'établissement :",
        error
      );
      throw new Error(
        "Erreur lors de la récupération des chambres de l'établissement"
      );
    }
  };

  const getNombreChambreByEtablissement = async (id_etab: string) => {
    try {
      const response = await api.get(`/chambre/nombre/${id_etab}`);
      return response.data as number;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du nombre de chambres de l'établissement :",
        error
      );
      throw new Error(
        "Erreur lors de la récupération du nombre de chambres de l'établissement"
      );
    }
  }

  return {
    addChambre,
    updateChambre,
    deleteChambre,
    getChambreById,
    getChambresByEtablissement,
    getNombreChambreByEtablissement,
  };
};
