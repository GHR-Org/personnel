// ============================================================================
// SERVICE NOTIFICATIONS
// ============================================================================

import APIClient from "@/func/APIClient";

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
      const response = await APIClient.get<NotificationsResponse>(
        `${this.baseUrl}/etablissement/${etablissementId}`
      );
      return response.data.notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  /**
   * Marquer une notification comme lue/non lue
   */
  async updateReadStatus(notificationId: number): Promise<void> {
    try {
      // Le backend PATCH /api/notification/{id} marque automatiquement comme lu
      await APIClient.patch(`${this.baseUrl}/${notificationId}`);
    } catch (error) {
      console.error("Error updating notification read status:", error);
    }
  }

  /**
   * Supprimer une notification
   */
  async delete(notificationId: number): Promise<void> {
    try {
      await APIClient.delete(`${this.baseUrl}/${notificationId}`);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
