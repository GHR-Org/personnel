/* eslint-disable @typescript-eslint/no-explicit-any */
// Ce disable devrait être retiré après avoir validé tous les types.

import apiClient from "@/func/APIClient"; // Chemin vers votre instance Axios sécurisée
// Importez le type EtablissementFormData si vous l'utilisez pour la validation avant l'envoi
// import { EtablissementFormData } from "@/schemas/etablissement";
import { GetEtablissementsParams, Etablissement, CreateEtablissementData, UpdateEtablissementData } from "@/types/etablissement";
import axios, { AxiosResponse } from "axios"; // Pour AxiosError et AxiosResponse

// --- Type générique pour la réponse de l'API ---
interface ApiClientResponse<T> extends AxiosResponse {
  data: T;
}

// --- Fonctions d'API pour Etablissement ---

/**
 * Récupère une liste d'établissements.
 * @param params Paramètres de la requête (ex: { page: 1, limit: 10, categorie: "Hotelerie" }).
 * @returns Une promesse qui résout en un tableau d'établissements.
 */
export const getEtablissements = async (params?: GetEtablissementsParams): Promise<Etablissement[]> => {
  try {
    const response: ApiClientResponse<Etablissement[]> = await apiClient.get("/etablissement", { params });
    console.log("Etablissements fetched successfully:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching etablissements:", error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw error;
  }
};

/**
 * Récupère un établissement par son ID.
 * @param id L'ID (UUID) de l'établissement à récupérer.
 * @returns Une promesse qui résout en un objet Etablissement.
 */
export const getEtablissementById = async (id: string): Promise<Etablissement> => {
  try {
    const response: ApiClientResponse<Etablissement> = await apiClient.get(`/etablissement/${id}`);
    console.log(`Etablissement ${id} fetched successfully:`, response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching etablissement ${id}:`, error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw error;
  }
};

/**
 * Crée un nouvel établissement.
 * @param etablissementData Les données de l'établissement à créer (conformes à CreateEtablissementData).
 * @returns Une promesse qui résout en l'établissement créé avec son ID.
 */
export const createEtablissement = async (etablissementData: CreateEtablissementData): Promise<Etablissement> => {
  try {
    // Si vous souhaitez valider les données AVANT l'envoi à l'API, utilisez Zod ici:
    // const validatedData = etablissementSchema.parse(etablissementData);
    const response: ApiClientResponse<Etablissement> = await apiClient.post("/etablissement", etablissementData);
    console.log("Etablissement created successfully:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating etablissement:", error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw error;
  }
};

/**
 * Met à jour un établissement existant.
 * @param id L'ID (UUID) de l'établissement à mettre à jour.
 * @param etablissementData Les données partielles de l'établissement à mettre à jour (conformes à UpdateEtablissementData).
 * @returns Une promesse qui résout en l'établissement mis à jour.
 */
export const updateEtablissement = async (
  id: string, // L'ID est maintenant un string
  etablissementData: UpdateEtablissementData
): Promise<Etablissement> => {
  try {
    // Optionnel: valider les données partielles avec un schéma Zod partial.
    // const validatedData = etablissementSchema.partial().parse(etablissementData);
    const response: ApiClientResponse<Etablissement> = await apiClient.put(`/etablissement/${id}`, etablissementData);
    console.log(`Etablissement ${id} updated successfully:`, response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Error updating etablissement ${id}:`, error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw error;
  }
};

/**
 * Supprime un établissement.
 * @param id L'ID (UUID) de l'établissement à supprimer.
 * @returns Une promesse qui résout lorsque l'opération est terminée (souvent sans données de retour).
 */
export const deleteEtablissement = async (id: string): Promise<void> => { // L'ID est maintenant un string
  try {
    await apiClient.delete(`/etablissement/${id}`);
    console.log(`Etablissement ${id} deleted successfully.`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Error deleting etablissement ${id}:`, error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw error;
  }
};