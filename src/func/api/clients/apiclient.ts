/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/func/APIClient"; // Assurez-vous que le chemin est correct
import { Client, ClientFormInputs } from "@/types/client"; // Assurez-vous que le chemin est correct pour vos types Client

// Interface pour la réponse de l'API lors de la récupération de clients
interface GetClientsResponse {
    message : string
  clients: Client[]; // Le nom de la propriété 'clients' doit correspondre à ce que votre API renvoie
}

interface GetClientResponse {
  message: string;
  clients: Client; // L'objet client se trouve sous la clé 'client'
}

const APIURL = process.env.NEXT_PUBLIC_API_URL; 
/**
 * Récupère la liste de tous les clients.
 * @returns Une promesse qui résout à un tableau de clients, ou un tableau vide en cas d'erreur.
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await apiClient.get<GetClientsResponse>(
      `${APIURL}/clients` // Endpoint pour récupérer tous les clients
    );
    // Supposons que l'API renvoie un objet { message: "...", clients: [...] }
    return response.data.clients;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des clients :", error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

/**
 * Récupère un client par son ID.
 * @param clientId L'ID du client à récupérer.
 * @returns Une promesse qui résout au client trouvé.
 */
export const getClientById = async (clientId: number): Promise<Client> => {
  try {
    // La réponse contient l'objet client dans une propriété 'client'
    const response = await apiClient.get<{ client: Client }>(`${APIURL}/client/${clientId}`);

    const fetchedClient = response.data.client;
    
    console.log(`Client récupéré avec succès : ${fetchedClient.first_name} ${fetchedClient.last_name}`);
    
    return fetchedClient;
  } catch (error) {
    console.error("Erreur lors de la récupération du client:", error);
    throw error;
  }
};
/**
 * Crée un nouveau client.
 * @param newClientData Les données du nouveau client (sans l'ID, car il est auto-généré).
 * @returns Une promesse qui résout au client créé, ou null en cas d'erreur.
 */
// src/func/api/client/apiclient.ts
export const postClient = async (clientData: ClientFormInputs): Promise<Client> => {
  try {
    // La réponse de l'API est maintenant celle que vous avez fournie.
    const response = await apiClient.post<{ message: string; client: Client }>(`${APIURL}/client`, clientData);

    // Les données du client, y compris l'ID, sont dans response.data.client
    const newClient = response.data.client;
    
    console.log(`Client créé avec succès avec l'ID: ${newClient.id}`);

    return newClient; // Retourne l'objet client complet pour l'utiliser dans le composant parent
  } catch (error) {
    console.error("Erreur lors de la création du client :", error);
    throw error;
  }
};

/**
 * Met à jour un client existant.
 * @param clientId L'ID du client à mettre à jour.
 * @param updatedClientData Les données du client à mettre à jour.
 * @returns Une promesse qui résout au client mis à jour, ou null en cas d'erreur.
 */
export const updateClient = async (clientId: number, updatedClientData: Partial<Client>): Promise<Client | null> => {
    try {
        const response = await apiClient.put<Client>(
            `${APIURL}/clients/${clientId}`,
            updatedClientData
        );
        return response.data;
    } catch (error: any) {
        console.error(`Erreur lors de la mise à jour du client ${clientId}:`, error.response?.data || error.message);
        return null;
    }
};

/**
 * Supprime un client par son ID.
 * @param clientId L'ID du client à supprimer.
 * @returns Une promesse qui résout à true si la suppression est réussie, false sinon.
 */
export const deleteClient = async (clientId: number): Promise<boolean> => {
    try {
        await apiClient.delete(`${APIURL}/clients/${clientId}`);
        return true;
    } catch (error: any) {
        console.error(`Erreur lors de la suppression du client ${clientId}:`, error.response?.data || error.message);
        return false;
    }
};

/**
 * Recherche des clients par email.
 * @param email L'email du client à rechercher.
 * @returns Une promesse qui résout à une liste de clients (un ou aucun).
 */
export const getClientByEmail = async (email: string): Promise<Client[]> => {
  if (!email) {
    return [];
  }
  try {
    const response = await apiClient.get<GetClientResponse>(
      `${APIURL}/clientemail/${email}`
    );
    // L'API renvoie un seul client, on le met dans un tableau
    return [response.data.clients];
  } catch (error: any) {
    // Si l'API renvoie une erreur (ex: 404), on retourne un tableau vide
    if (error.response && error.response.status === 404) {
      console.log("Client non trouvé pour l'email:", email);
      return [];
    }
    console.error("Erreur lors de la recherche de client par email :", error);
    throw error;
  }
};