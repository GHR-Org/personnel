/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/func/APIClient";


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

