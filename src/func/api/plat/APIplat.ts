import apiClient from "@/func/APIClient";
import { MenuItem } from "@/types/MenuItem";

const APIUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"; // Replace with actual etablissement ID retrieval logic

interface GetPlatsResponse {
  message: string;
  plats: MenuItem[]; // Le backend renvoie les plats sous cette clé
}

export const getPlatsByEtablissement = async (etablissement_id: number): Promise<MenuItem[]> => {
    try {
        // Le type attendu de la réponse complète de l'API est GetPlatsResponse
        const response = await apiClient.get<GetPlatsResponse>(`${APIUrl}/plat/etablissement/${etablissement_id}`);
        
        // Accédez à la propriété 'plats' qui est le tableau
        const platsData = response.data.plats;

        const parsedData = platsData.map(item => ({
            ...item,
            // Assurez-vous que ces parsings sont toujours nécessaires si le backend envoie des chaînes JSON
            ingredients: typeof item.ingredients === 'string' ? JSON.parse(item.ingredients) : item.ingredients,
            tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags,
            // Si le backend renvoie 'rating' ou 'prep_minute' comme des strings et non des numbers,
            // il faudrait les parser ici aussi (e.g., Number(item.rating))
        }));
        return parsedData;
    } catch (error) {
        console.error("Error fetching plats by etablissement:", error);
        throw error;
    }
};

export const getPlatById = async (plat_id: string, etablissement_id: string): Promise<MenuItem> => {
    try {
        const response = await apiClient.get<MenuItem>(`${APIUrl}/plat/${plat_id}`, {
            params: { etablissement_id }
        });
        console.log(`Fetched plat with ID: ${plat_id}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching plat by ID:", error);
        throw error;
    }
}

export type PlatApiResponse = {
  message: string;
  plat: MenuItem;
};
export const getPlatByIdPlat = async (plat_id: string, etablissement_id: string): Promise<PlatApiResponse> => {
    try {
        const response = await apiClient.get<PlatApiResponse>(`${APIUrl}/plat/${plat_id}`, {
            params: { etablissement_id }
        });
        console.log(`Fetched plat with ID: ${plat_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching plat by ID:", error);
        throw error;
    }
};

export const createPlat = async (payload: FormData): Promise<MenuItem> => {
    try {
        console.table(payload)
        const response = await apiClient.post<MenuItem>(`${APIUrl}/plat`, payload, {
            
        });
        console.log(response.data)
        console.log(`Plat created successfully with ID: ${response.data.id}`);
        return response.data;
    } catch (error) {
        console.error("Error creating plat:", error);
        throw error;
    }
}

export const updatePlat = async (id_plat: number, payload: FormData): Promise<MenuItem> => {
  try {
    // Notez que la méthode est PUT et l'URL inclut l'ID du plat
    const response = await apiClient.put<MenuItem>(`${APIUrl}/plat/${id_plat}`, payload);
    console.log(`Plat with ID ${id_plat} updated successfully.`);
    return response.data;
  } catch (error) {
    console.error(`Error updating plat with ID ${id_plat}:`, error);
    throw error;
  }
};


export const deletePlat = async (plat_id: number): Promise<void> => {
    try {
        await apiClient.delete(`${APIUrl}/plat/${plat_id}`);
        console.log(`Plat with ID ${plat_id} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting plat:", error);
        throw error;
    }
}

