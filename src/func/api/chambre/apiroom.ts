/* eslint-disable @typescript-eslint/no-explicit-any */

import apiClient from "@/func/APIClient";
import { room } from "@/types/room";

interface GetRoomsResponse {
    message : string
  chambres: room[]; // Assurez-vous que le nom de la propriété correspond à ce que votre API renvoie
}

// Interface pour une chambre, basée sur votre définition

const APIURL = process.env.NEXT_PUBLIC_API_URL 

/**
 * Récupère la liste des chambres pour un établissement donné.
 * @param etablissement_id L'ID de l'établissement.
 * @returns Une promesse qui résout à un tableau de chambres, ou un tableau vide en cas d'erreur.
 */
export const getRooms = async (etablissement_id: number): Promise<room[]> => {
  try {
    const response = await apiClient.get<GetRoomsResponse>(
      `${APIURL}/chambre/etablissement/${etablissement_id}`
    );
    // Supposons que l'API renvoie un objet { rooms: [...] }
    return response.data.chambres;
  } catch (error: any) { // Utilisez 'any' si vous ne voulez pas typer l'erreur plus précisément ici
    console.error(`Erreur lors de la récupération des chambres pour l'établissement ${etablissement_id}:`, error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};