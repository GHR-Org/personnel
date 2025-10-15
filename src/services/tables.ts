// ============================================================================
// SERVICE TABLES - Mock Data (en attente d'intégration backend)
// ============================================================================

import { Table, TableFormData, StatusTable, TypeTable, normalizeStatusTable, normalizeTypeTable } from "@/types";
import { handleApiError, apiService } from "./api";

export class TablesService {
  private readonly baseUrl = "/table";



  async getByEtablissement(etablissementId: number): Promise<Table[]> {
    try {
      const response = await apiService.get<{ tables: Table[] }>(`${this.baseUrl}/etablissement/${etablissementId}`);
      return response.tables || [];
    } catch (error) {
      console.error(`[TablesService] Erreur lors de la récupération des tables pour l'établissement ${etablissementId}:`, error);
      throw new Error(handleApiError(error));
    }
  }

  async getById(id: number): Promise<Table> {
    try {
      const response = await apiService.get<Table>(`${this.baseUrl}/${id}`);
      return response;
    } catch (error) {
      console.error(`[TablesService] Erreur lors de la récupération de la table ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  }

  async create(data: TableFormData & { etablissement_id: number }): Promise<Table> {
    try {
      const response = await apiService.post<Table>(this.baseUrl, data);
      return response;
    } catch (error) {
      console.error("[TablesService] Erreur lors de la création de la table:", error);
      throw new Error(handleApiError(error));
    }
  }

  async update(id: number, data: Partial<TableFormData>): Promise<Table> {
    try {
      const response = await apiService.put<Table>(`${this.baseUrl}/${id}`, data);
      return response;
    } catch (error) {
      console.error(`[TablesService] Erreur lors de la mise à jour de la table ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`[TablesService] Erreur lors de la suppression de la table ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  }

  async changeStatut(id: number, statut: string): Promise<Table> {
    try {
      const normalizedStatut = normalizeStatusTable(statut);
      const response = await apiService.put<Table>(`${this.baseUrl}/${id}/statut`, { statut: normalizedStatut });
      return response;
    } catch (error) {
      console.error(`[TablesService] Erreur lors du changement de statut de la table ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  }

  async getDisponibles(etablissementId: number, capaciteMin?: number): Promise<Table[]> {
    try {
      const tables = await this.getByEtablissement(etablissementId);
      
      return tables.filter(table => {
        if (table.statut !== StatusTable.LIBRE) return false;  // ✅ Utilise l'enum
        if (capaciteMin && table.capacite < capaciteMin) return false;
        return true;
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getStats(etablissementId: number): Promise<{
    total: number;
    libres: number;
    occupees: number;
    reservees: number;
    hors_service: number;
    capacite_totale: number;
    taux_occupation: number;
  }> {
    try {
      const tables = await this.getByEtablissement(etablissementId);
      
      const total = tables.length;
      const libres = tables.filter(t => t.statut === StatusTable.LIBRE).length;          // ✅ Utilise l'enum
      const occupees = tables.filter(t => t.statut === StatusTable.OCCUPE).length;       // ✅ Utilise l'enum
      const reservees = tables.filter(t => t.statut === StatusTable.RESERVEE).length;    // ✅ Utilise l'enum
      const hors_service = tables.filter(t => t.statut === StatusTable.HORS_SERVICE).length; // ✅ Utilise l'enum
      const capacite_totale = tables.reduce((sum, t) => sum + t.capacite, 0);
      const taux_occupation = total > 0 ? Math.round(((occupees + reservees) / total) * 100) : 0;
      
      return {
        total,
        libres,
        occupees,
        reservees,
        hors_service,
        capacite_totale,
        taux_occupation,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const tablesService = new TablesService();
