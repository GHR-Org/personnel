import api from "@/lib/api";
import { Etablissement } from "@/types/etablissement";

export const useEtablissement = () => {
  const updateEtablissement = async (
    id: string,
    data: Etablissement
  ) => {
    try {
      const response = await api.put(`/etablissement/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'établissement :",
        error
      );
      throw new Error("Erreur lors de la mise à jour de l'établissement");
    }
  };

  const deleteEtablissement = async (id: string) => {
    try {
      const response = await api.delete(`/etablissement/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'établissement :",
        error
      );
      throw new Error("Erreur lors de la suppression de l'établissement");
    }
  };

  return {
    updateEtablissement,
    deleteEtablissement,
  };
};
