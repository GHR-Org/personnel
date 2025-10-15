// src/func/api/conges/apiConge.ts

import apiClient from "@/func/APIClient";
import { Conge, FormCongeData} from "@/types/conge"; // Importe les types de votre schéma

// Type pour la réponse des listes de congés
export interface GetCongesResponse {
    message: string;
    conges: Conge[];
}

// URL de base de votre API (à ajuster si nécessaire)
const APIURL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Récupère tous les congés.
 * @returns Une promesse qui résout en un tableau de congés.
 */
export const getAllConges = async (): Promise<Conge[]> => {
    try {
        const response = await apiClient.get<GetCongesResponse>(`${APIURL}/conge`);
        return response.data.conges;
    } catch (error) {
        console.error("Erreur lors de la récupération des congés:", error);
        return [];
    }
};

/**
 * Récupère un congé spécifique par son ID.
 * @param congeId L'ID du congé à récupérer.
 * @returns Une promesse qui résout en un objet Conge ou null en cas d'erreur.
 */
export const getCongeById = async (congeId: string): Promise<Conge | null> => {
    try {
        const response = await apiClient.get<Conge>(`${APIURL}/conge/${congeId}`);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération du congé ${congeId}:`, error);
        return null;
    }
};

/**
 * Crée une nouvelle demande de congé.
 * @param congeData Les données du congé à créer (exclut les champs générés par le serveur).
 * @returns Une promesse qui résout en le congé créé avec son ID, ou null en cas d'échec.
 */
export const createConge = async (congeData: FormCongeData): Promise<Conge | null> => {
    try {
        // La fonction reçoit directement le bon FormData
        const response = await apiClient.post<Conge>(`${APIURL}/conge`, congeData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du congé:", error);
        return null;
    }
};
/**
 * Met à jour un congé existant.
 * @param congeId L'ID du congé à mettre à jour.
 * @param updateData Les données du congé à modifier.
 * @returns Une promesse qui résout en le congé mis à jour ou null en cas d'échec.
 */
export const updateConge = async (congeId: number, updateData: Partial<Conge>): Promise<Conge | null> => {
    try {
        const response = await apiClient.put<Conge>(`${APIURL}/conge/${congeId}`, updateData);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du congé ${congeId}:`, error);
        return null;
    }
};

/**
 * Supprime un congé par son ID.
 * @param congeId L'ID du congé à supprimer.
 * @returns Une promesse qui résout en true si la suppression a réussi, false sinon.
 */
export const deleteConge = async (congeId: string): Promise<boolean> => {
    try {
        await apiClient.delete(`${APIURL}/conge/${congeId}`);
        return true;
    } catch (error) {
        console.error(`Erreur lors de la suppression du congé ${congeId}:`, error);
        return false;
    }
};

/**
 * Get les congés par établissement
 * @param etablissementId L'ID de l'établissement.
 * @returns Une promesse qui résout en un tableau de congés, ou un tableau vide en cas d'erreur.
 */
export const getCongesByEtablissement = async (etablissementId: number): Promise<Conge[]> => {
    try {
        const response = await apiClient.get<GetCongesResponse>(`${APIURL}/conge/etablissement/${etablissementId}`);
        return response.data.conges;
    } catch (error) {
        console.error(`Erreur lors de la récupération des congés pour l'établissement ${etablissementId}:`, error);
        return [];
    }
}