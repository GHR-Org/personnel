// ============================================================================
// SERVICE PERSONNELS - Intégration avec le backend
// ============================================================================

import { apiService, handleApiError } from "./api";
import { Personnel, PersonnelFormData } from "@/types";
import { authService } from "./auth";

// Enums correspondant exactement au backend
export enum RoleType {
  RECEPTIONNISTE = "Receptionniste",
  TECHNICIEN = "Technicien",
  MANAGER = "Manager",
  RH = "RH",
}

export enum StatusAccount {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

// Interface pour les données envoyées au backend (format exact du schéma Personnel_Create)
interface PersonnelBackendData {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  mot_de_passe?: string;
  etablissement_id: number;
  role: RoleType;
  poste?: string;
  date_embauche: string; // Format YYYY-MM-DD
  statut_compte: StatusAccount;
}

// Interface pour les données reçues du backend
interface PersonnelBackendResponse {
  id: number;
  nom: string;
  prenom: string;
  telephone?: string;
  email: string;
  role: string;
  poste?: string;
  date_embauche?: string;
  statut_compte: string;
  etablissement_id?: number;
  date_creation?: string;
  date_mise_a_jour?: string;
}

export class PersonnelsService {
  private readonly baseUrl = "/personnel";

  // ✅ Transformer les données du backend vers notre format
  private transformBackendPersonnel(backendPersonnel: PersonnelBackendResponse): Personnel {
    return {
      id: backendPersonnel.id,
      first_name: backendPersonnel.nom,
      last_name: backendPersonnel.prenom,
      email: backendPersonnel.email,
      phone: backendPersonnel.telephone || "",
      poste: backendPersonnel.poste || "",
      departement: backendPersonnel.role,
      salaire: 0, // Le backend n'a pas ce champ dans le modèle actuel
      date_embauche: backendPersonnel.date_embauche || new Date().toISOString().split("T")[0],
      statut: backendPersonnel.statut_compte,
      etablissement_id: backendPersonnel.etablissement_id || 0,
      created_at: backendPersonnel.date_creation || new Date().toISOString(),
    };
  }

  // ✅ Transformer les données du frontend vers le format backend
  private transformToBackendData(data: PersonnelFormData & { etablissement_id: number }): PersonnelBackendData {
    // Validation des données requises
    if (!data.first_name?.trim()) {
      throw new Error("Le nom est requis");
    }
    if (!data.email?.trim()) {
      throw new Error("L'email est requis");
    }
    if (!data.poste?.trim()) {
      throw new Error("Le poste est requis");
    }

    return {
      nom: data.first_name.trim(),
      prenom: data.last_name?.trim() || "",
      telephone: data.phone?.trim() || "",
      email: data.email.trim(),
      mot_de_passe: data.password || "defaultPassword123",
      etablissement_id: data.etablissement_id,
      role: data.departement as RoleType,
      poste: data.poste.trim(),
      date_embauche: data.date_embauche,
      statut_compte: data.statut as StatusAccount,
    };
  }

  // Récupérer tous les personnels d'un établissement
  async getByEtablissement(etablissementId: number): Promise<Personnel[]> {
    try {
      const response = await apiService.get<{ personnels: PersonnelBackendResponse[] }>(
        `${this.baseUrl}/etablissement/${etablissementId}`
      );

      // ✅ Transformer chaque personnel
      const personnels = (response.personnels || []).map(personnel =>
        this.transformBackendPersonnel(personnel)
      );

      console.log("✅ [PersonnelsService] Personnel transformé:", personnels);
      return personnels;
    } catch (error) {
      console.error("❌ [PersonnelsService] Erreur lors de la récupération:", error);
      throw new Error(handleApiError(error));
    }
  }

  // Récupérer un personnel par ID
  async getById(id: number, etablissementId?: number): Promise<Personnel> {
    try {
      console.log(`🔍 [PersonnelsService] Récupération personnel ID: ${id}`);

      // Utiliser directement l'endpoint GET /personnel/{id} du backend
      const response = await apiService.get<{ personnel: PersonnelBackendResponse }>(
        `${this.baseUrl}/${id}`
      );

      console.log("✅ [PersonnelsService] Personnel récupéré:", response.personnel);

      // Transformer les données du backend vers notre format
      return this.transformBackendPersonnel(response.personnel);
    } catch (error) {
      console.error(`❌ [PersonnelsService] Erreur récupération personnel ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  }

  // Créer un nouveau personnel
  async create(data: PersonnelFormData & { etablissement_id: number }): Promise<Personnel> {
    try {
      const backendData = this.transformToBackendData(data);

      const response = await apiService.post<{ personnel: PersonnelBackendResponse }>(
        this.baseUrl,
        backendData
      );

      console.log("✅ [PersonnelsService] Réponse de création:", response);

      return this.transformBackendPersonnel(response.personnel);
    } catch (error) {
      console.error("❌ [PersonnelsService] Erreur lors de la création:", error);

      // Gestion spécifique des erreurs 422
      if (error instanceof Error && error.message.includes("422")) {
        console.error("❌ [PersonnelsService] Erreur de validation 422");
      }

      throw new Error(handleApiError(error));
    }
  }

  // Mettre à jour un personnel
  async update(id: number, data: Partial<PersonnelFormData>, etablissementId?: number, existingPersonnel?: Personnel): Promise<Personnel> {
    try {
      // Récupérer l'utilisateur connecté pour obtenir son etablissement_id
      const currentUser = await authService.getCurrentUser();
      const userEtablissementId = currentUser?.etablissement_id || currentUser?.id;

      // Si on n'a pas les données existantes, on doit les récupérer
      let personnelExistant = existingPersonnel;
      if (!personnelExistant) {
        personnelExistant = await this.getById(id, userEtablissementId || etablissementId);
      }

      // Fusionner les données existantes avec les nouvelles
      const updateData: PersonnelFormData & { etablissement_id: number } = {
        first_name: data.first_name || personnelExistant.first_name,
        last_name: data.last_name || personnelExistant.last_name,
        email: data.email || personnelExistant.email,
        phone: data.phone || personnelExistant.phone,
        poste: data.poste || personnelExistant.poste,
        departement: data.departement || personnelExistant.departement,
        salaire: data.salaire !== undefined ? data.salaire : personnelExistant.salaire,
        date_embauche: data.date_embauche || personnelExistant.date_embauche,
        statut: data.statut || personnelExistant.statut,
        etablissement_id: userEtablissementId || etablissementId || personnelExistant.etablissement_id,
        // Ne pas inclure le mot de passe en mise à jour sauf si explicitement fourni
        ...(data.password && { password: data.password })
      };

      const backendData = this.transformToBackendData(updateData);

      const response = await apiService.put<{ personnel: PersonnelBackendResponse }>(
        `${this.baseUrl}/${id}`,
        backendData
      );

      return this.transformBackendPersonnel(response.personnel);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Méthode de mise à jour rapide avec données existantes (évite l'appel à getById)
  async updateWithExistingData(id: number, data: Partial<PersonnelFormData>, existingPersonnel: Personnel): Promise<Personnel> {
    try {
      console.log("🔍 [PersonnelsService] Mise à jour rapide avec données existantes:", data);

      // Récupérer l'utilisateur connecté pour obtenir son etablissement_id
      const currentUser = await authService.getCurrentUser();
      const userEtablissementId = currentUser?.etablissement_id || currentUser?.id;

      // Fusionner les données existantes avec les nouvelles
      const updateData: PersonnelFormData & { etablissement_id: number } = {
        first_name: data.first_name || existingPersonnel.first_name,
        last_name: data.last_name || existingPersonnel.last_name,
        email: data.email || existingPersonnel.email,
        phone: data.phone || existingPersonnel.phone,
        poste: data.poste || existingPersonnel.poste,
        departement: data.departement || existingPersonnel.departement,
        salaire: data.salaire !== undefined ? data.salaire : existingPersonnel.salaire,
        date_embauche: data.date_embauche || existingPersonnel.date_embauche,
        statut: data.statut || existingPersonnel.statut,
        etablissement_id: userEtablissementId || existingPersonnel.etablissement_id,
        // Ne pas inclure le mot de passe en mise à jour sauf si explicitement fourni
        ...(data.password && { password: data.password })
      };

      const backendData = this.transformToBackendData(updateData);
      console.log("📡 [PersonnelsService] Données de mise à jour rapide envoyées:", backendData);

      const response = await apiService.put<{ personnel: PersonnelBackendResponse }>(
        `${this.baseUrl}/${id}`,
        backendData
      );

      return this.transformBackendPersonnel(response.personnel);
    } catch (error) {
      console.error("❌ [PersonnelsService] Erreur lors de la mise à jour rapide:", error);
      throw new Error(handleApiError(error));
    }
  }

  // Supprimer un personnel
  async delete(id: number): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Récupérer tous les personnels (pour les super admins)
  async getAll(): Promise<Personnel[]> {
    try {
      const response = await apiService.get<{ personnels: PersonnelBackendResponse[] }>(
        this.baseUrl
      );

      return (response.personnels || []).map(personnel =>
        this.transformBackendPersonnel(personnel)
      );
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Statistiques des personnels
  async getStats(etablissementId: number): Promise<{
    total: number;
    actifs: number;
    inactifs: number;
    suspendus: number;
    par_role: Record<string, number>;
  }> {
    try {
      const personnels = await this.getByEtablissement(etablissementId);
      const total = personnels.length;
      const actifs = personnels.filter(p => p.statut === StatusAccount.ACTIVE).length;
      const inactifs = personnels.filter(p => p.statut === StatusAccount.INACTIVE).length;
      const suspendus = personnels.filter(p => p.statut === StatusAccount.SUSPENDED).length;

      // Compter par rôle
      const par_role: Record<string, number> = {};
      personnels.forEach(p => {
        par_role[p.departement] = (par_role[p.departement] || 0) + 1;
      });

      return {
        total,
        actifs,
        inactifs,
        suspendus,
        par_role,
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Rechercher des personnels
  async search(etablissementId: number, query: {
    nom?: string;
    email?: string;
    poste?: string;
    role?: string;
    statut?: string;
  }): Promise<Personnel[]> {
    try {
      const personnels = await this.getByEtablissement(etablissementId);

      return personnels.filter(personnel => {
        if (query.nom && !personnel.first_name.toLowerCase().includes(query.nom.toLowerCase()) &&
          !personnel.last_name.toLowerCase().includes(query.nom.toLowerCase())) {
          return false;
        }
        if (query.email && !personnel.email.toLowerCase().includes(query.email.toLowerCase())) {
          return false;
        }
        if (query.poste && !personnel.poste.toLowerCase().includes(query.poste.toLowerCase())) {
          return false;
        }
        if (query.role && personnel.departement !== query.role) {
          return false;
        }
        if (query.statut && personnel.statut !== query.statut) {
          return false;
        }
        return true;
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const personnelsService = new PersonnelsService();
