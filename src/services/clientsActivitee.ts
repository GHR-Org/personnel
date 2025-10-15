// src/services/ClientsActivitee.ts
import apiService, { handleApiError } from "./api";

interface ClientWithActivity {
  id: number;
  first_name: string;
  last_name: string;
  sexe: string;
}

export class ClientsActivitee {
    private readonly baseUrl = "/etablissement";

    async getByEtablissement(id: number): Promise<ClientWithActivity[]> {
        try {
            const response = await apiService.get<{ message: string; clients: ClientWithActivity[] }>(
                `${this.baseUrl}/client/activiter/${id}`
            );
            return response.clients;
        } catch (error) {
            console.error(`[ClientsActivitee] Erreur récupération client ${id}:`, error);
            throw new Error(handleApiError(error));
        }
    }

    async getRecentByEtablissement(id: number): Promise<ClientWithActivity[]> {
        try {
            // Tentative de l'endpoint "recent" si disponible côté backend
            const response = await apiService.get<{ message: string; clients: ClientWithActivity[] }>(
                `${this.baseUrl}/client/activiter/recent/${id}`
            );
            return response.clients;
        } catch (error: any) {
            // Si l'endpoint n'existe pas (404), on bascule sur l'endpoint général et laisse le frontend gérer le filtrage récent si besoin
            const status = error?.response?.status;
            if (status === 404) {
                try {
                    const fallback = await apiService.get<{ message: string; clients: ClientWithActivity[] }>(
                        `${this.baseUrl}/client/activiter/${id}`
                    );
                    return fallback.clients;
                } catch (fallbackError) {
                    console.error(`[ClientsActivitee] Fallback échec pour clients récents ${id}:`, fallbackError);
                    throw new Error(handleApiError(fallbackError));
                }
            }
            console.error(`[ClientsActivitee] Erreur récupération client recent ${id}:`, error);
            throw new Error(handleApiError(error));
        }
    }
}

export const clientsActivitee = new ClientsActivitee();
