/* eslint-disable @typescript-eslint/no-explicit-any */
// src/func/api/personnel/apipersonnel.ts

import apiClient from "@/func/APIClient";
import { Personnel } from "@/types/personnel";

const APIURL = process.env.NEXT_PUBLIC_API_URL

export const getCurrentUser = async (): Promise<Personnel | null> => {
  try {
    // La requête est simplifiée, car l'intercepteur d'Axios gère l'en-tête Authorization
    const response = await apiClient.get<Personnel>(`${APIURL}/auth/current-user`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.error("Token JWT invalide ou expiré. Impossible de récupérer l'utilisateur actuel.");
    } else {
      console.error("Erreur lors de la récupération de l'utilisateur actuel :", error);
    }
    return null;
  }
};

/**
 * Récupère la liste du personnel pour un établissement donné.
 * @param etablissementId L'ID de l'établissement.
 * @returns Une promesse qui résout en un tableau de Personnel, ou un tableau vide en cas d'erreur.
 */
export const getPersonnelList = async (etablissementId: number, token: string): Promise<Personnel[]> => {
    try {
        const response = await apiClient.get<Personnel[]>(`${APIURL}/personnels/${etablissementId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        console.error("Erreur lors de la récupération de la liste du personnel:", error);
        return [];
    }
};

export const getPersonnelById = async (personnelId: number): Promise<Personnel | null> => {
    try {
        const response = await apiClient.get<Personnel>(`${APIURL}/personnels/${personnelId}`);
        return response.data;
    } catch (error: any) {
        console.error("Erreur lors de la récupération du personnel par ID :", error);
        return null;
    }
};