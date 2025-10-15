// ============================================================================
// SERVICE PLATS - Intégration Backend
// ============================================================================

import { apiService, handleApiError, createFormData } from "./api";
import { Plat, PlatFormData, TypePlat, normalizeTypePlat } from "@/types";
import { authService } from "./auth";

export class PlatsService {
  private readonly baseUrl = "/plat";

  // Récupérer tous les plats d'un établissement
  async getByEtablissement(etablissementId: number): Promise<Plat[]> {
    try {
      const response = await apiService.get<{ plats: any[] }>(
        `${this.baseUrl}/etablissement/${etablissementId}`
      );

      // Transformer les données backend vers notre format
      return (response.plats || []).map(this.transformBackendPlat);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Récupérer un plat par ID
  async getById(id: number): Promise<Plat> {
    try {
      const response = await apiService.get<{ plat: any }>(
        `${this.baseUrl}/${id}`
      );

      return this.transformBackendPlat(response.plat);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Transformer les données du backend vers notre format
  private transformBackendPlat(backendPlat: any): Plat {
    // ✅ Parser les JSON strings du backend
    let ingredients: string[] = [];
    let tags: string[] = [];

    try {
      ingredients = typeof backendPlat.ingredients === 'string'
        ? JSON.parse(backendPlat.ingredients)
        : (backendPlat.ingredients || []);
    } catch (e) {
      console.warn("[PlatsService] Failed to parse ingredients:", backendPlat.ingredients);
      ingredients = [];
    }

    try {
      tags = typeof backendPlat.tags === 'string'
        ? JSON.parse(backendPlat.tags)
        : (backendPlat.tags || []);
    } catch (e) {
      console.warn("[PlatsService] Failed to parse tags:", backendPlat.tags);
      tags = [];
    }

    return {
      id: backendPlat.id,
      nom: backendPlat.libelle,
      description: backendPlat.description || "",
      prix: backendPlat.prix,
      categorie: normalizeTypePlat(backendPlat.type_ || backendPlat.type || "Autre"),  // ✅ Normalise le type (accepte type_ ou type)
      disponible: backendPlat.disponible,
      livrable: backendPlat.livrable ?? false,
      etablissement_id: backendPlat.etablissement_id,
      photo_url: backendPlat.image_url || backendPlat.image,
      created_at: backendPlat.created_at || new Date().toISOString(),
      // ✅ Nouveaux champs du backend
      note: backendPlat.note || 5,
      ingredients: ingredients,
      tags: tags,
      calories: backendPlat.calories || 0,
      prep_minute: backendPlat.prep_minute || 30,
    };
  }

  // Créer un nouveau plat
  async create(data: PlatFormData & { etablissement_id: number }): Promise<Plat> {
    try {
      console.log("[PlatsService] Creating plat with data:", data);

      // ✅ Log spécifique pour l'image
      if (data.photo && data.photo instanceof File) {
        console.log("[PlatsService] ✅ CREATE - IMAGE FILE DETECTED:", data.photo.name, data.photo.size, data.photo.type);
      } else {
        console.log("[PlatsService] ❌ CREATE - NO IMAGE FILE:", typeof data.photo, data.photo);
      }

      // Normaliser/fiabiliser la catégorie envoyée au backend
      const safeType = normalizeTypePlat(String(data.categorie || "Autre"));

      const formData = createFormData({
        libelle: data.nom,
        type_: safeType,
        description: data.description,
        note: data.note || 5,
        prix: data.prix,
        livrable: data.livrable ?? false,
        ingredients: JSON.stringify(data.ingredients || []),  // ✅ Utilise les vraies données
        etablissement_id: data.etablissement_id,
        disponible: data.disponible,
        calories: data.calories || 0,
        prep_minute: data.prep_minute || 30,
        tags: JSON.stringify(data.tags || []),  // ✅ Utilise les vraies données
        ...(data.photo && { image: data.photo }),
      });

      // Debug détaillé du FormData envoyé (comme pour update)
      console.log("[PlatsService] (CREATE) FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, typeof value, value);
      }

      const response = await apiService.post<{ plat: any }>(
        this.baseUrl,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return this.transformBackendPlat(response.plat);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mettre à jour un plat
  async update(id: number, data: Partial<PlatFormData>, etablissementId?: number): Promise<Plat> {
    try {
      console.log("[PlatsService] Updating plat with data:", data);

      // Récupérer l'utilisateur connecté pour obtenir son etablissement_id
      const currentUser = await authService.getCurrentUser();
      const userEtablissementId = currentUser?.etablissement_id || currentUser?.id;
      console.log("[PlatsService] Current user etablissement_id:", userEtablissementId);

      // ⚠️ ATTENTION: Le backend PUT exige TOUS les champs comme requis !
      // On doit d'abord récupérer le plat existant pour avoir toutes les valeurs
      const existingPlat = await this.getById(id);
      console.log("[PlatsService] Existing plat:", existingPlat);

      // Fusionner les données existantes avec les nouvelles
      // ⚠️ ATTENTION: Tous les champs doivent être des strings pour FormData
      const updateFields = {
        libelle: (data.nom || existingPlat.nom).toString(),
        type_: (data.categorie || existingPlat.categorie).toString(),
        description: (data.description !== undefined ? data.description : (existingPlat.description || "Plat délicieux")).toString(),
        note: (data.note !== undefined ? data.note : existingPlat.note || 5).toString(),
        prix: (data.prix !== undefined ? data.prix : existingPlat.prix).toString(),
        livrable: (data.livrable !== undefined ? data.livrable : (existingPlat as any).livrable ?? false).toString(),
        ingredients: JSON.stringify(data.ingredients !== undefined ? data.ingredients : existingPlat.ingredients || []),
        tags: JSON.stringify(data.tags !== undefined ? data.tags : existingPlat.tags || []),
        disponible: (data.disponible !== undefined ? data.disponible : existingPlat.disponible).toString(),
        calories: (data.calories !== undefined ? data.calories : existingPlat.calories || 0).toString(),
        prep_minute: (data.prep_minute !== undefined ? data.prep_minute : existingPlat.prep_minute || 30).toString(),
        etablissement_id: (userEtablissementId || etablissementId || existingPlat.etablissement_id || 1).toString(),
        ...(data.photo && data.photo instanceof File && { image: data.photo })
      };

      console.log("[PlatsService] Complete fields for update:", updateFields);
      console.log("[PlatsService] Final etablissement_id:", updateFields.etablissement_id);

      // ✅ Log spécifique pour l'image
      if (data.photo && data.photo instanceof File) {
        console.log("[PlatsService] ✅ IMAGE FILE DETECTED:", data.photo.name, data.photo.size, data.photo.type);
      } else {
        console.log("[PlatsService] ❌ NO IMAGE FILE:", typeof data.photo, data.photo);
      }

      // Log chaque champ individuellement
      Object.entries(updateFields).forEach(([key, value]) => {
        console.log(`[PlatsService] Field ${key}:`, typeof value, value);
      });

      const formData = createFormData(updateFields);

      // Log le FormData
      console.log("[PlatsService] FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, typeof value, value);
      }

      const response = await apiService.put<{ plat: any }>(
        `${this.baseUrl}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return this.transformBackendPlat(response.plat);
    } catch (error) {
      console.error("[PlatsService] Update error:", error);
      throw new Error(handleApiError(error));
    }
  }

  // Supprimer un plat
  async delete(id: number): Promise<void> {
    try {
      console.log("[PlatsService] Deleting plat with id:", id);

      await apiService.delete(`${this.baseUrl}/${id}`);

      console.log("[PlatsService] Plat deleted successfully");
    } catch (error) {
      console.error("[PlatsService] Delete error:", error);
      throw new Error(handleApiError(error));
    }
  }

  // Basculer la disponibilité d'un plat
  async toggleDisponibilite(id: number): Promise<Plat> {
    try {
      console.log("[PlatsService] Toggling disponibilite for plat:", id);

      // Récupérer le plat actuel
      const currentPlat = await this.getById(id);

      // Mettre à jour avec la disponibilité inversée
      return await this.update(id, {
        disponible: !currentPlat.disponible
      });
    } catch (error) {
      console.error("[PlatsService] Toggle disponibilite error:", error);
      throw new Error(handleApiError(error));
    }
  }

  async getByCategorie(etablissementId: number, categorie: string): Promise<Plat[]> {
    try {
      const plats = await this.getByEtablissement(etablissementId);
      return plats.filter(p => p.categorie === categorie);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getStats(etablissementId: number): Promise<{
    total: number;
    disponibles: number;
    indisponibles: number;
    par_categorie: Record<string, number>;
    prix_moyen: number;
  }> {
    try {
      const plats = await this.getByEtablissement(etablissementId);
      
      const parCategorie = plats.reduce((acc, p) => {
        acc[p.categorie] = (acc[p.categorie] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const prixMoyen = plats.length > 0 
        ? plats.reduce((sum, p) => sum + p.prix, 0) / plats.length
        : 0;
      
      const stats = {
        total: plats.length,
        disponibles: plats.filter(p => p.disponible).length,
        indisponibles: plats.filter(p => !p.disponible).length,
        par_categorie: parCategorie,
        prix_moyen: Math.round(prixMoyen),
      };
      
      return stats;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const platsService = new PlatsService();
