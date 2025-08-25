/* eslint-disable @typescript-eslint/no-explicit-any */
// src/func/api/incident/APIIncident.ts
import APIClient from "@/func/APIClient";
import { Incident, IncidentFormValues } from "@/lib/stores/maintenance_store";

interface IncidentAPIRequest {
  title: string; // Le nom du champ attendu par le backend
  equipement_id: string; // Le nom du champ attendu par le backend
  description: string;
  severity: "Faible" | "Moyen" | "Élevé";
  status: "Ouvert" | "En cours" | "Fermé";
  // Vous pourriez aussi ajouter l'ID et la date ici si nécessaire
}
interface incidentResponse {
    message : string
    incidents : Incident[]
}

const APIURL = process.env.NEXT_PUBLIC_API_URL 


const apiIncident = {
  // Récupère la liste des incidents
  getIncidents: async (): Promise<Incident[]> => {
    try {
      const response = await APIClient.get<incidentResponse>(`${APIURL}/incident`);
      // S'assurer que le format de la réponse est correct
      if (response.data && response.data.incidents) {
        return response.data.incidents;
      }
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des incidents :", error);
      throw error;
    }
  },

  // Crée un nouvel incident
  createIncident: async (incidentData: IncidentFormValues): Promise<any> => {
    try {
      // Mappage des noms de champs
      const requestData: IncidentAPIRequest = {
        title: incidentData.title,
        equipement_id: incidentData.equipement_id,
        description: incidentData.description,
        severity: incidentData.severity,
        status: incidentData.status,
      };

      const response = await APIClient.post(`${APIURL}/incident`, requestData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'incident :", error);
      throw error;
    }
  },

  // Supprime un incident par son ID
  deleteIncident: async (id: string): Promise<void> => {
    try {
      await APIClient.delete(`/incident/${id}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'incident :", error);
      throw error;
    }
  },
};

export default apiIncident;