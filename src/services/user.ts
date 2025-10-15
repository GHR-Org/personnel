// ============================================================================
// SERVICE UTILISATEUR
// ============================================================================

import { apiService, handleApiError } from "./api";
import { User } from "@/types";

export interface EtablissementUpdateData {
  nom?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  email?: string;
  type_?: string;
  code_postal?: string;
  telephone?: string;
  site_web?: string;
  description?: string;
}

class EtablissementService {
  private baseUrl = "/etablissement";

  // Récupérer les données actuelles de l'établissement
  async getEtablissement(id: number): Promise<any> {
    try {
      const response = await apiService.get<any>(`${this.baseUrl}/${id}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mettre à jour le profil établissement (utilise l'endpoint PUT /{id_} du backend)
  async updateProfile(id: number, data: EtablissementUpdateData): Promise<any> {
    try {
      // Récupérer d'abord les données actuelles
      const currentData = await this.getEtablissement(id);

      const formData = new FormData();

      // Utiliser les données actuelles comme base et ne modifier que ce qui est fourni
      formData.append('nom', data.nom || currentData.nom || '');
      formData.append('adresse', data.adresse || currentData.adresse || '');
      formData.append('ville', data.ville || currentData.ville || '');
      formData.append('pays', data.pays || currentData.pays || '');
      formData.append('email', data.email || currentData.email || '');
      formData.append('type_', data.type_ || currentData.type_ || '');
      formData.append('statut', currentData.statut || 'Activer'); // Utiliser le bon format

      // Champs optionnels - utiliser les nouvelles données ou garder les anciennes
      formData.append('code_postal', data.code_postal || currentData.code_postal || '');
      formData.append('telephone', data.telephone || currentData.telephone || '');
      formData.append('site_web', data.site_web || currentData.site_web || '');
      formData.append('description', data.description || currentData.description || '');

      const response = await apiService.put<any>(
        `${this.baseUrl}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mettre à jour le logo établissement
  async updateLogo(id: number, file: File): Promise<any> {
    try {
      // Récupérer d'abord les données actuelles
      const currentData = await this.getEtablissement(id);

      const formData = new FormData();

      // Utiliser les données actuelles pour tous les champs requis
      formData.append('nom', currentData.nom || '');
      formData.append('adresse', currentData.adresse || '');
      formData.append('ville', currentData.ville || '');
      formData.append('pays', currentData.pays || '');
      formData.append('email', currentData.email || '');
      formData.append('type_', currentData.type_ || '');
      formData.append('statut', currentData.statut || 'Activer'); // Utiliser le bon format

      // Champs optionnels - garder les données actuelles
      formData.append('code_postal', currentData.code_postal || '');
      formData.append('telephone', currentData.telephone || '');
      formData.append('site_web', currentData.site_web || '');
      formData.append('description', currentData.description || '');

      // Ajouter le fichier logo (seul changement)
      formData.append('logo', file);

      const response = await apiService.put<any>(
        `${this.baseUrl}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const etablissementService = new EtablissementService();