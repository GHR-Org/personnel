// ============================================================================
// SERVICE ÉTABLISSEMENT
// ============================================================================

import { apiService, handleApiError } from "./api";
import { Etablissement } from "@/types";

export interface EtablissementUpdateData {
    nom?: string;
    adresse?: string;
    ville?: string;
    pays?: string;
    telephone?: string;
    description?: string;
    photo_url?: string;
}

class EtablissementService {
    private baseUrl = "/etablissement";

    // Récupérer les informations de l'établissement
    async getEtablissement(id: number): Promise<Etablissement> {
        try {
            const response = await apiService.get<Etablissement>(`${this.baseUrl}/${id}`);
            return response;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Mettre à jour les informations de l'établissement
    async updateEtablissement(id: number, data: EtablissementUpdateData): Promise<Etablissement> {
        try {
            const response = await apiService.put<Etablissement>(`${this.baseUrl}/${id}`, data);
            return response;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Mettre à jour la photo de l'établissement
    async updatePhoto(id: number, file: File): Promise<Etablissement> {
        try {
            const response = await apiService.uploadFile<Etablissement>(
                `${this.baseUrl}/${id}/photo`,
                file
            );
            return response;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Récupérer les statistiques de l'établissement
    async getStatistiques(id: number): Promise<{
        reservations: number;
        clients: number;
        avis: number;
    }> {
        try {
            const response = await apiService.get<{
                reservations: number;
                clients: number;
                avis: number;
            }>(`${this.baseUrl}/${id}/statistiques`);
            return response;
        } catch (error) {
            // Retourner des données par défaut en cas d'erreur
            console.warn("Erreur lors de la récupération des statistiques:", error);
            return {
                reservations: 0,
                clients: 0,
                avis: 0
            };
        }
    }
}

export const etablissementService = new EtablissementService();
export default etablissementService;