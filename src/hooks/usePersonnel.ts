import api from "@/lib/api";
import { Personnel } from "@/types/personnel";

export const usePersonnel = () => {
  const addPersonnel = async (data: Personnel) => {
    try {
      const response = await api.post("/personnel", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du personnel :", error);
      throw new Error("Erreur lors de l'ajout du personnel");
    }
  };

  const getPersonnelByEtablissement = async (etablissementId: number) => {
    try {
      const response = await api.get(
        `/personnel/etablissement/${etablissementId}`
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du personnel :", error);
      throw new Error("Erreur lors de la récupération du personnel");
    }
  };

  const editPersonnel = async (id: number, data: Partial<Personnel>) => {
    try {
      const response = await api.put(`/personnel/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modification du personnel :", error);
      throw new Error("Erreur lors de la modification du personnel");
    }
  };

  const deletePersonnel = async (id: number) => {
    try {
      const response = await api.delete(`/personnel/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression du personnel :", error);
      throw new Error("Erreur lors de la suppression du personnel");
    }
  };

  return {
    addPersonnel,
    getPersonnelByEtablissement,
    editPersonnel,
    deletePersonnel,
  };
};
