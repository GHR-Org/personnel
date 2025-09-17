/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/func/APIClient";
import { getCurrentUser } from "../personnel/apipersonnel";
import { Commande } from "@/components/manager-restaurant/MobileOrderTracker";



const APIUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"; // Replace with actual etablissement ID retrieval logic

export const getCommandes = async (etablissement_id: string): Promise<any> => {
    try {
        const response = await apiClient.get(`${APIUrl}/commande/`, {
            params: { etablissement_id }
        });
        console.log(`Fetched commandes for etablissement ID: ${etablissement_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching commandes:", error);
        throw error;
    }
};

export const getCommandeById = async (commande_id: string, etablissement_id: string): Promise<any> => {
    try {
        const response = await apiClient.get(`${APIUrl}/commande/${commande_id}`, {
            params: { etablissement_id }
        });
        console.log(`Fetched commande with ID: ${commande_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching commande by ID:", error);
        throw error;
    }
};

export const createCommande = async (commande: any, etablissement_id: string): Promise<any> => {
    try {
        const response = await apiClient.post(`${APIUrl}/commande/`, commande, {
            params: { etablissement_id }
        });
        console.log(`Commande created successfully with ID: ${response.data.id}`);
        return response.data;
    } catch (error) {
        console.error("Error creating commande:", error);
        throw error;
    }
}

export const updateCommande = async (commande: any, etablissement_id: string): Promise<any> => {
    try {
        const response = await apiClient.put(`${APIUrl}/commande/${commande.id}`, commande, {
            params: { etablissement_id }
        });
        console.log(`Commande with ID ${commande.id} updated successfully.`);
        return response.data;
    } catch (error) {
        console.error("Error updating commande:", error);
        throw error;
    }
};


export const deleteCommande = async (commande_id: string, etablissement_id: string): Promise<void> => {
    try {
        await apiClient.delete(`${APIUrl}/commande/${commande_id}`, {
            params: { etablissement_id }
        });
        console.log(`Commande with ID ${commande_id} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting commande:", error);
        throw error;
    }
}
export const getCommandesByClient = async (client_id: string, etablissement_id: string): Promise<any> => {
    try {
        const response = await apiClient.get(`${APIUrl}/commande/client/${client_id}`, {
            params: { etablissement_id }
        });
        console.log(`Fetched commandes for client ID: ${client_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching commandes by client:", error);
        throw error;
    }
};
export const getCommandesByStatus = async (status: string, etablissement_id: string): Promise<any> => {
    try {
        const response = await apiClient.get(`${APIUrl}/commande/status/${status}`, {
            params: { etablissement_id }
        });
        console.log(`Fetched commandes with status: ${status}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching commandes by status:", error);
        throw error;
    }
};
export const getCommandesByDateRange = async (startDate: string, endDate: string, etablissement_id: string): Promise<any> => {
    try {
        const response = await apiClient.get(`${APIUrl}/commande/date`, {
            params: { startDate, endDate, etablissement_id }
        });
        console.log(`Fetched commandes from ${startDate} to ${endDate}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching commandes by date range:", error);
        throw error;
    }
};
export const getCommandesByEtablissement = async (etablissement_id: string): Promise<any> => {
    try {
        const response = await apiClient.get(`${APIUrl}/commande/etablissement`, {
            params: { etablissement_id }
        });
        console.log(`Fetched commandes for etablissement ID: ${etablissement_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching commandes by etablissement:", error);
        throw error;
    }
};

const getIdEtablissement = async (): Promise<number> => {
    const user = await getCurrentUser();
    return user?.etablissement_id ?? 1; // Assure-toi d'avoir une valeur par défaut ou de gérer l'erreur
};

export const getOrders = async (): Promise<Commande[]> => {
    try {
        const etablissement_id = await getIdEtablissement();

        // On utilise la fonction qui récupère toutes les commandes de l'établissement
        // Tu peux ajouter un filtre ici si ton API permet de distinguer les commandes "mobiles"
        const response = await apiClient.get(`${APIUrl}/commande/etablissement/${etablissement_id }`);

        // La réponse de l'API est un objet avec une clé "commandes"
        const commandes = response.data.commandes;

        if (!commandes) {
            console.error("API response is missing 'commandes' array");
            return [];
        }

        // On mappe les données de l'API pour qu'elles correspondent au type `Commande`
        const mappedCommandes: Commande[] = commandes.map((cmd: any) => ({
            id: cmd.id,
            montant: cmd.montant,
            description: cmd.description,
            date: cmd.date,
            status: cmd.status,
            client_id: cmd.client_id,
            details: cmd.details,
        }));
        
        console.log(`Successfully fetched ${mappedCommandes.length} commandes.`);
        return mappedCommandes;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

/**
 * 
 * @param commande_id 
 * @param new_status 
 * @param etablissement_id 
 * @returns 
 */
export const updateCommandeStatus = async (
  commande_id: string,
  new_status: string,
): Promise<any> => {
  try {
    const response = await apiClient.patch(
      `${APIUrl}/commande/${commande_id}/status/${new_status}`);
    console.log(`Statut de la commande ${commande_id} mis à jour : ${new_status}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de la commande :", error);
    throw error;
  }
};
