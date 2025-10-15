/**
 * Service pour la gestion des rapports
 */

import { apiService, handleApiError } from "./api";
import { 
  Rapport, 
  RapportFormData, 
  RapportStats, 
  TypeRapport, 
  StatusRapport, 
  normalizeTypeRapport, 
  normalizeStatusRapport 
} from "@/types";

export class RapportsService {
  private readonly baseUrl = "/rapport";

  // ✅ Transformer les données du backend vers notre format
  private transformBackendRapport(backendRapport: any): Rapport {
    return {
      id: backendRapport.id,
      date: backendRapport.date,
      created_at: backendRapport.created_at,
      updated_at: backendRapport.updated_at,
      personnel: backendRapport.personnel,
      type: normalizeTypeRapport(backendRapport.type),
      titre: backendRapport.titre,
      description: backendRapport.description,
      reponse_responsable: backendRapport.reponse_responsable || "",
      statut: normalizeStatusRapport(backendRapport.statut),
    };
  }

  // Récupérer tous les rapports d'un établissement
  async getByEtablissement(etablissementId: number): Promise<Rapport[]> {
    try {
      console.log("[RapportsService] Getting rapports for etablissement:", etablissementId);

      const response = await apiService.get<{ rapports: any[] }>(
        `${this.baseUrl}/etablissement/${etablissementId}`
      );

      // ✅ Transformer chaque rapport pour normaliser les enums
      const rapports = (response.rapports || []).map(rapport => this.transformBackendRapport(rapport));

      console.log("[RapportsService] Rapports retrieved:", rapports.length);
      return rapports;
    } catch (error) {
      console.error("[RapportsService] Error getting rapports:", error);

      throw new Error(handleApiError(error));
    }
  }

  // Récupérer les rapports récents (X derniers jours)
  async getRecentByEtablissement(etablissementId: number, days: number = 7): Promise<{ rapports: Rapport[], nombre: number }> {
    try {
      console.log("[RapportsService] Getting recent rapports:", { etablissementId, days });
      
      const response = await apiService.get<{ rapports: any[], nombre: number }>(
        `${this.baseUrl}/etablissement/recent/${etablissementId}/${days}`
      );
      
      const rapports = (response.rapports || []).map(rapport => this.transformBackendRapport(rapport));
      
      return {
        rapports,
        nombre: response.nombre || rapports.length
      };
    } catch (error) {
      console.error("[RapportsService] Error getting recent rapports:", error);
      throw new Error(handleApiError(error));
    }
  }

  // Récupérer les rapports par statut
  async getByStatus(status: StatusRapport, etablissementId: number): Promise<{ rapports: Rapport[], nombres: number }> {
    try {
      console.log("[RapportsService] Getting rapports by status:", { status, etablissementId });
      
      const response = await apiService.get<{ rapports: any[], nombres: number }>(
        `${this.baseUrl}/status/${status}/${etablissementId}`
      );
      
      const rapports = (response.rapports || []).map(rapport => this.transformBackendRapport(rapport));
      
      return {
        rapports,
        nombres: response.nombres || rapports.length
      };
    } catch (error) {
      console.error("[RapportsService] Error getting rapports by status:", error);
      throw new Error(handleApiError(error));
    }
  }

  // Changer le statut d'un rapport (marquer comme traité, clôturé, etc.)
  async changeStatus(rapportId: number, newStatus: StatusRapport): Promise<Rapport> {
    try {
      console.log("[RapportsService] Changing rapport status:", { rapportId, newStatus });
      
      const response = await apiService.put<{ rapport: any }>(
        `${this.baseUrl}/status/${newStatus}/${rapportId}`
      );
      
      const rapport = this.transformBackendRapport(response.rapport);
      console.log("[RapportsService] Status changed successfully");
      
      return rapport;
    } catch (error) {
      console.error("[RapportsService] Error changing status:", error);
      throw new Error(handleApiError(error));
    }
  }

  // Supprimer un rapport
  async delete(rapportId: number): Promise<void> {
    try {
      console.log("[RapportsService] Deleting rapport:", rapportId);
      
      await apiService.delete(`${this.baseUrl}/${rapportId}`);
      
      console.log("[RapportsService] Rapport deleted successfully");
    } catch (error) {
      console.error("[RapportsService] Error deleting rapport:", error);
      throw new Error(handleApiError(error));
    }
  }

  // Calculer les statistiques des rapports
  async getStats(etablissementId: number): Promise<RapportStats> {
    try {
      console.log("[RapportsService] Getting rapport stats for etablissement:", etablissementId);
      
      // Récupérer tous les rapports
      const allRapports = await this.getByEtablissement(etablissementId);
      
      const stats: RapportStats = {
        total: allRapports.length,
        en_attente: allRapports.filter(r => r.statut === StatusRapport.EN_ATTENTE).length,
        traiter: allRapports.filter(r => r.statut === StatusRapport.TRAITER).length,
        cloturer: allRapports.filter(r => r.statut === StatusRapport.CLOTURER).length,
      };
      
      console.log("[RapportsService] Stats calculated:", stats);
      return stats;
    } catch (error) {
      console.error("[RapportsService] Error getting stats:", error);
      throw new Error(handleApiError(error));
    }
  }

  // Marquer un rapport comme lu/traité
  async markAsRead(rapportId: number): Promise<Rapport> {
    return this.changeStatus(rapportId, StatusRapport.TRAITER);
  }

  // Clôturer un rapport
  async markAsClosed(rapportId: number): Promise<Rapport> {
    return this.changeStatus(rapportId, StatusRapport.CLOTURER);
  }

  // Filtrer les rapports par date
  filterByDate(rapports: Rapport[], startDate?: Date, endDate?: Date): Rapport[] {
    if (!startDate && !endDate) return rapports;
    
    return rapports.filter(rapport => {
      const rapportDate = new Date(rapport.date);
      
      if (startDate && rapportDate < startDate) return false;
      if (endDate && rapportDate > endDate) return false;
      
      return true;
    });
  }

  // Filtrer les rapports par type
  filterByType(rapports: Rapport[], type?: TypeRapport): Rapport[] {
    if (!type) return rapports;
    return rapports.filter(rapport => rapport.type === type);
  }

  // Obtenir les rapports d'aujourd'hui
  async getTodayReports(etablissementId: number): Promise<Rapport[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const allRapports = await this.getByEtablissement(etablissementId);
    return this.filterByDate(allRapports, today);
  }

  // Obtenir les rapports d'hier
  async getYesterdayReports(etablissementId: number): Promise<Rapport[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);
    
    const allRapports = await this.getByEtablissement(etablissementId);
    return this.filterByDate(allRapports, yesterday, endOfYesterday);
  }

  // Obtenir les rapports de la semaine dernière
  async getLastWeekReports(etablissementId: number): Promise<Rapport[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const allRapports = await this.getByEtablissement(etablissementId);
    return this.filterByDate(allRapports, oneWeekAgo);
  }
}

// Instance singleton du service
export const rapportsService = new RapportsService();
