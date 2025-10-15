// ============================================================================
// SERVICE NOTIFICATIONS
// ============================================================================

import { apiService, handleApiError } from "./api";

export interface Notification {
  id: number;
  message: string;
  date: string;
  lu: boolean;
  etablissement_id: number;
  // Métadonnées facultatives pour navigation/affichage riche
  entity_type?: string; // ex: 'conge', 'personnel', 'chambre', 'plat', 'produit'
  entity_id?: number;
}

export interface NotificationsResponse {
  message: string;
  notifications: Notification[];
}

export class NotificationService {
  private readonly baseUrl = "/notification";

  /**
   * Récupérer les notifications d'un établissement
   */
  async getByEtablissement(etablissementId: number): Promise<Notification[]> {
    try {
      const response = await apiService.get<NotificationsResponse>(
        `${this.baseUrl}/etablissement/${etablissementId}`
      );
      return response.notifications;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Marquer une notification comme lue/non lue
   */
  async updateReadStatus(notificationId: number): Promise<void> {
    try {
      // Le backend PATCH /api/notification/{id} marque automatiquement comme lu
      await apiService.patch(`${this.baseUrl}/${notificationId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Supprimer une notification
   */
  async delete(notificationId: number): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${notificationId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
