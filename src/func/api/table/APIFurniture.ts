/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/func/APIClient"; // Assurez-vous que le chemin est correct
import { FurnitureItem, FurnitureType, TableStatus, FurnitureApiData, FurnitureApiPostData } from "@/types/table";
import { id } from "date-fns/locale";

// On définit les interfaces pour les données que l'API envoie et reçoit.
// Le format de la DB est un peu différent de celui du store.
export interface FurnitureDbFormat {
  nom: string | undefined;
  type: FurnitureType;
  status: TableStatus;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  client_id: number;
  etablissement_id: number;
}

// Interface pour la réponse de l'API lors de la récupération de meubles
interface GetFurnitureResponse {
  message: string;
  tables: FurnitureApiData[]; // Le nom de la propriété 'furniture' doit correspondre à ce que votre API renvoie
}

const APIURL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Récupère la liste de tous les meubles.
 * @returns Une promesse qui résout à un tableau de meubles au format DB.
 */
export const getFurniture = async (etablissement_id : number): Promise<FurnitureApiData[]> => {
  try {
    const response = await apiClient.get<GetFurnitureResponse>(
      `${APIURL}/table/etablissement/${etablissement_id}`
    );
    // L'API renvoie un objet avec une clé 'furniture'
    return response.data.tables;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des meubles :", error);
    return [];
  }
};

/**
 * Crée un nouveau meuble.
 * @param newFurnitureData Les données du nouveau meuble.
 * @returns Une promesse qui résout au meuble créé.
 */
export const postFurniture = async (
  newFurnitureData: FurnitureDbFormat
): Promise<FurnitureDbFormat> => {
  try {
    const response = await apiClient.post<{ furniture: FurnitureDbFormat }>(
      `${APIURL}/table`,
      newFurnitureData
    );
    const newFurniture = response.data.furniture;
    return newFurniture;
  } catch (error) {
    console.error("Erreur lors de la création du meuble :", error);
    throw error;
  }
};

/**
 * Met à jour un meuble existant.
 * @param furnitureId L'ID du meuble à mettre à jour.
 * @param updatedData Les données du meuble à mettre à jour.
 * @returns Une promesse qui résout au meuble mis à jour.
 */
export const updateFurniture = async (
  furnitureId: number,
  updatedData: Partial<FurnitureDbFormat>
): Promise<FurnitureDbFormat | null> => {
  try {
    const response = await apiClient.put<FurnitureDbFormat>(
      `${APIURL}/table/${furnitureId}`,
      updatedData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Erreur lors de la mise à jour du meuble ${furnitureId}:`,
      error.response?.data || error.message
    );
    return null;
  }
};

/**
 * Supprime un meuble par son ID.
 * @param furnitureId L'ID du meuble à supprimer.
 * @returns Une promesse qui résout à true si la suppression est réussie.
 */
export const deleteFurniture = async (
  furnitureId: number
): Promise<boolean> => {
  try {
    await apiClient.delete(`${APIURL}/table/${furnitureId}`);
    return true;
  } catch (error: any) {
    console.error(
      `Erreur lors de la suppression du meuble ${furnitureId}:`,
      error.response?.data || error.message
    );
    return false;
  }
};

/**
 * Met à jour le statut d'une table.
 * @param id L'ID de la table à mettre à jour.
 * @param status Le nouveau statut de la table.
 * @return Une promesse qui résout au meuble mis à jour.
 */
export const UpdateFurnitureByStatus = async(id: number, status: TableStatus): Promise<FurnitureDbFormat> => {
  try {
    const response = await apiClient.patch<FurnitureDbFormat>(
      `${APIURL}/table/status/${status}/${id}`
    );
    return response.data;
  }
  catch (error) {
    console.error("Erreur lors de la mise à jour du statut de la table :", error);
    throw error;
  }
}

/**
 * Met à jour le nom d'une table.
 * @param id l'id de la table
 * @param name Le nouveau nom de la table.
 * @returns une promesse qui résout au meuble mis à jour.
 */
export const UpdateFurnitureByName = async(id: number, name: string): Promise<FurnitureDbFormat> => {
  try{
    const response = await apiClient.patch<FurnitureDbFormat>(
      `${APIURL}/table/nom/${name}/${id}`
    )
    return response.data;
  }
  catch (error) {
    console.error("Erreur lors de la mise à jour du nom de la table :", error);
    throw error;
  }
}
