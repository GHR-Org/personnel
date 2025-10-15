// ============================================================================
// SERVICE CHAMBRES - Intégration avec le backend
// ============================================================================

import { apiService, createFormData, handleApiError } from "./api";
import { Chambre, ChambreFormData, EtatChambre, normalizeEtatChambre } from "@/types";
import { authService } from "./auth";

export class ChambresService {
  private readonly baseUrl = "/chambre";

  // ✅ Transformer les données du backend vers notre format
  private transformBackendChambre(backendChambre: any): Chambre {
    return {
      ...backendChambre,
      etat: normalizeEtatChambre(backendChambre.etat), // ✅ Normalise l'état
    };
  }

  // Récupérer toutes les chambres d'un établissement
  async getByEtablissement(etablissementId: number): Promise<Chambre[]> {
    try {
      const response = await apiService.get<{ chambres: any[] }>(
        `${this.baseUrl}/etablissement/${etablissementId}`
      );
      // ✅ Transformer chaque chambre pour normaliser les états
      return (response.chambres || []).map(chambre => this.transformBackendChambre(chambre));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Récupérer une chambre par ID
  async getById(id: number): Promise<Chambre> {
    try {
      const response = await apiService.get<{ chambre: any }>(
        `${this.baseUrl}/${id}`
      );
      // ✅ Transformer la chambre pour normaliser l'état
      return this.transformBackendChambre(response.chambre);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Créer une nouvelle chambre
  async create(data: ChambreFormData & { id_etablissement: number }): Promise<Chambre> {
    try {

      const formData = createFormData({
        numero: data.numero,
        capacite: data.capacite,
        equipements: JSON.stringify(data.equipements || []),
        categorie: data.categorie,
        tarif: data.tarif,
        description: data.description || "Chambre confortable",
        etat: data.etat || "LIBRE",
        id_etablissement: data.id_etablissement,
        ...(data.photo && { image: data.photo }),
      });

      const response = await apiService.post<{ chambre: any }>(
        this.baseUrl,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // ✅ Transformer la chambre créée
      return this.transformBackendChambre(response.chambre);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mettre à jour une chambre
  async update(id: number, data: Partial<ChambreFormData>, etablissementId?: number): Promise<Chambre> {
    try {
      // Récupérer l'utilisateur connecté pour obtenir son etablissement_id
      const currentUser = await authService.getCurrentUser();
      const userEtablissementId = currentUser?.etablissement_id || currentUser?.id;

      // ⚠️ ATTENTION: Le backend PUT exige TOUS les champs comme requis !
      // On doit d'abord récupérer la chambre existante pour avoir toutes les valeurs
      const existingChambre = await this.getById(id);

      // Fusionner les données existantes avec les nouvelles
      // ⚠️ ATTENTION: Tous les champs doivent être des strings pour FormData
      const updateFields = {
        numero: (data.numero || existingChambre.numero).toString(),
        categorie: (data.categorie || existingChambre.categorie).toString(),
        tarif: (data.tarif !== undefined ? data.tarif : existingChambre.tarif).toString(),
        capacite: (data.capacite !== undefined ? data.capacite : existingChambre.capacite).toString(),
        description: (data.description !== undefined ? data.description : (existingChambre.description || "Chambre confortable")).toString(),
        equipements: data.equipements !== undefined ? JSON.stringify(data.equipements) : JSON.stringify(existingChambre.equipements || []),
        id_etablissement: (userEtablissementId || etablissementId || existingChambre.id_etablissement || 1).toString(),
        ...(data.photo && data.photo instanceof File && { image: data.photo })
      };

      const formData = createFormData(updateFields);

      const response = await apiService.put<{ chambre: any }>(
        `${this.baseUrl}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // ✅ Transformer la chambre mise à jour
      return this.transformBackendChambre(response.chambre);
    } catch (error) {
      console.error("[ChambresService] Update error:", error);
      throw new Error(handleApiError(error));
    }
  }

  // Supprimer une chambre
  async delete(id: number): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Changer l'état d'une chambre
  async changeEtat(id: number, etat: string): Promise<Chambre> {
    try {
      const response = await apiService.patch<{ chambre: Chambre }>(
        `${this.baseUrl}/${id}/etat`,
        { etat }
      );
      return response.chambre;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Récupérer les chambres disponibles
  async getDisponibles(etablissementId: number, dateDebut?: string, dateFin?: string): Promise<Chambre[]> {
    try {
      const params = new URLSearchParams();
      if (dateDebut) params.append("date_debut", dateDebut);
      if (dateFin) params.append("date_fin", dateFin);

      const response = await apiService.get<{ chambres: Chambre[] }>(
        `${this.baseUrl}/etablissement/${etablissementId}/disponibles?${params.toString()}`
      );
      return response.chambres || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Statistiques des chambres
  async getStats(etablissementId: number): Promise<{
    total: number;
    libres: number;
    occupees: number;
    maintenance: number;
    hors_service: number;
    taux_occupation: number;
  }> {
    try {
      const chambres = await this.getByEtablissement(etablissementId);
      const total = chambres.length;
      const libres = chambres.filter(c => c.etat === EtatChambre.LIBRE).length;
      const occupees = chambres.filter(c => c.etat === EtatChambre.OCCUPEE).length;
      const maintenance = chambres.filter(c => c.etat === EtatChambre.NETTOYAGE).length;
      const hors_service = chambres.filter(c => c.etat === EtatChambre.HORSSERVICE).length;
      const taux_occupation = total > 0 ? Math.round((occupees / total) * 100) : 0;

      return {
        total,
        libres,
        occupees,
        maintenance,
        hors_service,
        taux_occupation,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Rechercher des chambres
  async search(etablissementId: number, query: {
    numero?: string;
    categorie?: string;
    capacite_min?: number;
    capacite_max?: number;
    etat?: string;
    tarif_min?: number;
    tarif_max?: number;
  }): Promise<Chambre[]> {
    try {
      const chambres = await this.getByEtablissement(etablissementId);
      
      return chambres.filter(chambre => {
        if (query.numero && !chambre.numero.toLowerCase().includes(query.numero.toLowerCase())) {
          return false;
        }
        if (query.categorie && chambre.categorie !== query.categorie) {
          return false;
        }
        if (query.capacite_min && chambre.capacite < query.capacite_min) {
          return false;
        }
        if (query.capacite_max && chambre.capacite > query.capacite_max) {
          return false;
        }
        if (query.etat && chambre.etat !== query.etat) {
          return false;
        }
        if (query.tarif_min && chambre.tarif < query.tarif_min) {
          return false;
        }
        if (query.tarif_max && chambre.tarif > query.tarif_max) {
          return false;
        }
        return true;
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const chambresService = new ChambresService();
