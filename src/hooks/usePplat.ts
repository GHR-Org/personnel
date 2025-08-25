import api from "@/lib/api";
import { Plat } from "@/types/plat";

export const usePlat = () => {
  const getPlatsByEtablissement = async (etablissementId: number) => {
    try {
      const response = await api.get(`/plat/etablissement/${etablissementId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des plats :", error);
      throw new Error("Erreur lors de la récupération des plats");
    }
  };

  const addPlat = async (data: Plat) => {
    try {
      const response = await api.post("/plat", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du plat :", error);
      throw new Error("Erreur lors de l'ajout du plat");
    }
  };

  const updatePlat = async (id: number, data: Plat) => {
    try {
      const response = await api.put(`/plat/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du plat :", error);
      throw new Error("Erreur lors de la mise à jour du plat");
    }
  };

  const deletePlat = async (id: number) => {
    try {
      const response = await api.delete(`/plat/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression du plat :", error);
      throw new Error("Erreur lors de la suppression du plat");
    }
  };

  return {
    getPlatsByEtablissement,
    addPlat,
    updatePlat,
    deletePlat,
  };
};
