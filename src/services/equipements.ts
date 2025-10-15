// adminstration_etablissement/src/services/equipements.ts
import { apiService } from "./api";

// Types locaux (pour intégration rapide). Pour unifier plus tard, on pourra les déplacer dans types/index.ts
export interface Equipement {
  id: string;
  nom: string;
  type: string;
  localisation: string;
  status: string;
  description: string;
  etablissement_id: number;
  created_at?: string;
}

export interface EquipementFormData {
  id: string; // Identifiant fonctionnel (référence), le backend l'exige comme clé primaire
  nom: string;
  type: string;
  localisation: string;
  status: string;
  description: string;
  etablissement_id?: number; // injecté côté hook avec l'établissement courant
}

class EquipementsService {
  private baseUrl = "/equipement";

  // Récupérer tous les équipements d'un établissement
  async getByEtablissement(etablissementId: number): Promise<Equipement[]> {
    try {
      const response: any = await apiService.get(
        `${this.baseUrl}/etablissement/${etablissementId}`
      );
      const items = response?.equipements || [];
      return (items as any[]).map(this.normalize);
    } catch (error: any) {
      console.error("[EquipementsService] getByEtablissement error:", error);
      throw new Error(
        error?.response?.data?.message || "Erreur lors du chargement des équipements"
      );
    }
  }

  // Créer un équipement
  async create(data: EquipementFormData & { etablissement_id: number }): Promise<Equipement> {
    try {
      // Backend attend le schéma EquipementCreate
      const payload = {
        id: data.id,
        nom: data.nom,
        type: data.type,
        localisation: data.localisation,
        status: data.status,
        description: data.description,
        etablissement_id: data.etablissement_id,
      };
      const response: any = await apiService.post(this.baseUrl, payload);
      return this.normalize(response?.equipement || response);
    } catch (error: any) {
      console.error("[EquipementsService] create error:", error);
      throw new Error(
        error?.response?.data?.message || "Erreur lors de la création de l'équipement"
      );
    }
  }

  // Mettre à jour un équipement (PUT /equipement/{id})
  async update(id: string, data: EquipementFormData & { etablissement_id: number }): Promise<Equipement> {
    try {
      const payload = {
        id: data.id,
        nom: data.nom,
        type: data.type,
        localisation: data.localisation,
        status: data.status,
        description: data.description,
        etablissement_id: data.etablissement_id,
      };
      const response: any = await apiService.put(`${this.baseUrl}/${id}`, payload);
      return this.normalize(response?.equipement || response?.produit || response);
    } catch (error: any) {
      console.error("[EquipementsService] update error:", error);
      throw new Error(
        error?.response?.data?.message || "Erreur lors de la mise à jour de l'équipement"
      );
    }
  }

  // Supprimer un équipement (DELETE /equipement/{id}) — si non disponible côté backend, géré par message d'erreur
  async delete(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      console.error("[EquipementsService] delete error:", error);
      throw new Error(
        error?.response?.data?.message || "Erreur lors de la suppression de l'équipement"
      );
    }
  }

  // Normalisation minimale pour robustesse
  private normalize = (e: any): Equipement => ({
    id: e?.id?.toString() || "",
    nom: e?.nom ?? "",
    type: e?.type ?? "",
    localisation: e?.localisation ?? "",
    status: e?.status ?? e?.statut ?? "",
    description: e?.description ?? "",
    etablissement_id: Number(e?.etablissement_id ?? e?.etablissementId ?? 0) || 0,
    created_at: e?.created_at ?? e?.createdAt,
  });
}

export const equipementsService = new EquipementsService();
