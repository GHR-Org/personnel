// adminstration_etablissement/src/services/revenuService.ts
import { apiService, handleApiError } from "./api";

export interface DailyEstablishmentRevenue {
  message: string;
  date: string;
  revenu_total: number;
  data: {
    revenu: number;
    chambre: {
      numero: string;
      tarif: number;
      status: string;
    };
  }[];
}

export interface DailyRevenue {
  date: string;
  revenu_reservation: number;
  revenu_commande_plat: number;
  revenu_total: number;
}

export interface RevenueStats {
  mois: string;
  details: DailyRevenue[];
}

export class RevenuService {
  private readonly baseUrl = "/etablissement";

  async getMonthlyRevenue(etablissementId: number, dateStr: string): Promise<RevenueStats> {
    try {
      const url = `${this.baseUrl}/revenu/mois/${etablissementId}/${dateStr}`;
      console.log("🔍 [RevenuService] Appel API revenus mensuels:", url);

      const response = await apiService.get<RevenueStats>(url);
      console.log("✅ [RevenuService] Réponse revenus mensuels:", response);

      return response;
    } catch (error: any) {
      console.error("❌ [RevenuService] Erreur revenus mensuels:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: `${this.baseUrl}/revenu/mois/${etablissementId}/${dateStr}`
      });
      throw new Error(handleApiError(error));
    }
  }

  async getDailyRevenue(etablissementId: number, dateStr: string): Promise<DailyEstablishmentRevenue> {
    try {
      const url = `${this.baseUrl}/revenu/journalier/${etablissementId}/${dateStr}`;
      console.log("🔍 [RevenuService] Appel API revenus journaliers:", url);

      const response = await apiService.get<DailyEstablishmentRevenue>(url);
      console.log("✅ [RevenuService] Réponse revenus journaliers:", response);

      return response;
    } catch (error: any) {
      console.error("❌ [RevenuService] Erreur revenus journaliers:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: `${this.baseUrl}/revenu/journalier/${etablissementId}/${dateStr}`
      });
      throw new Error(handleApiError(error));
    }
  }
}

export const revenuService = new RevenuService();
