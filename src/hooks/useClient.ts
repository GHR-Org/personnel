import api from "@/lib/api";
import { Client } from "@/types/client";

export const useClient = () => {
  const getClients = async (): Promise<Client[]> => {
    try {
      const response = await api.get("/client");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des clients :", error);
      throw new Error("Erreur lors de la récupération des clients");
    }
  };

  const getClientById = async (id: number): Promise<Client> => {
    try {
      const response = await api.get(`/client/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du client :", error);
      throw new Error("Erreur lors de la récupération du client");
    }
  };

  const addClient = async (data: Client): Promise<Client> => {
    try {
      const response = await api.post("/client", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du client :", error);
      throw new Error("Erreur lors de l'ajout du client");
    }
  };

  const updateClient = async (
    id: number,
    data: Partial<Client>
  ): Promise<Client> => {
    try {
      const response = await api.put(`/client/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client :", error);
      throw new Error("Erreur lors de la mise à jour du client");
    }
  };

  const deleteClient = async (id: number): Promise<void> => {
    try {
      await api.delete(`/client/${id}`);
    } catch (error) {
      console.error("Erreur lors de la suppression du client :", error);
      throw new Error("Erreur lors de la suppression du client");
    }
  };

  return {
    getClients,
    getClientById,
    addClient,
    updateClient,
    deleteClient,
  };
};
