// ============================================================================
// SERVICE CLIENTS - Mock Data (en attente d'intégration backend)
// ============================================================================

import { Client } from "@/types";
import apiService, { handleApiError } from "./api";

export class ClientsService {
  private readonly baseUrl = "/client";

  async getAll(): Promise<Client[]> {
    try {
      const response = await apiService.get<{ clients: Client[] }>(this.baseUrl);
      return response.clients || [];
    } catch (error) {
      console.error("[ClientsService] Erreur lors de la récupération des clients:", error);
      throw new Error(handleApiError(error));
    }
  }

  async getById(id: number): Promise<Client> {
    try {
      const response = await apiService.get<Client>(`${this.baseUrl}/${id}`);
      return response;
    } catch (error) {
      console.error(`[ClientsService] Erreur lors de la récupération du client ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  }

  async create(data: Omit<Client, "id" | "created_at">): Promise<Client> {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const newClient: Client = {
        id: Math.max(...this.mockClients.map(c => c.id)) + 1,
        ...data,
        created_at: new Date().toISOString(),
      };

      this.mockClients.push(newClient);
      return newClient;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async update(id: number, data: Partial<Omit<Client, "id" | "created_at">>): Promise<Client> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const index = this.mockClients.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error("Client non trouvé");
      }

      this.mockClients[index] = { ...this.mockClients[index], ...data };
      return this.mockClients[index];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const index = this.mockClients.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error("Client non trouvé");
      }

      this.mockClients.splice(index, 1);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async search(query: string): Promise<Client[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const searchTerm = query.toLowerCase();
      return this.mockClients.filter(client =>
        client.first_name.toLowerCase().includes(searchTerm) ||
        client.last_name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.phone.includes(searchTerm)
      );
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getStats(): Promise<{
    total: number;
    actifs: number;
    inactifs: number;
    suspendus: number;
    nouveaux_mois: number;
  }> {
    try {
      const clients = await this.getAll();

      const stats = {
        total: clients.length,
        actifs: clients.filter(c => c.account_status === "ACTIVE").length,
        inactifs: clients.filter(c => c.account_status === "INACTIVE").length,
        suspendus: clients.filter(c => c.account_status === "SUSPENDED").length,
        nouveaux_mois: clients.filter(c => {
          const createdDate = new Date(c.created_at);
          const now = new Date();
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return createdDate >= monthAgo;
        }).length,
      };

      return stats;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const clientsService = new ClientsService();
