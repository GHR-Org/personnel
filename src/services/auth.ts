// ============================================================================
// SERVICE AUTHENTIFICATION
// ============================================================================

import { apiService, handleApiError, createFormData } from "./api";
import { User, RegisterData, ETABLISSEMENT_TYPES } from "@/types";
import config from "@/config";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}


export class AuthService {
  private readonly baseUrl = "/auth";

  // Connexion
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(
        `${this.baseUrl}/login/etablissement`,
        {
          email: credentials.email,
          password: credentials.password
        }
      );

      console.log("🔍 [login] Réponse login complète:", response);
      console.log("🎫 [login] Access token:", response.access_token);
      console.log("👤 [login] User data:", response.user);
      console.log("📷 [login] Logo dans user:", response.user?.logo || "❌ Pas de logo");

      // Stocker les tokens et l'utilisateur
      this.storeAuthData(response);
      // console.log("💾 Données stockées dans localStorage");

      // Configurer l'établissement dans le service API
      if (response.user.etablissement_id) {
        apiService.setEtablissementId(response.user.etablissement_id);
      }

      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Envoyer un code de vérification
  async sendVerificationCode(email: string): Promise<void> {
    try {
      await apiService.post(`${this.baseUrl}/envoye-code`, { email });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Vérifier le code de vérification
  async verifyCode(email: string, code: string): Promise<boolean> {
    try {
      const response = await apiService.post(`${this.baseUrl}/verify-code`, {
        email,
        code
      });
      return response === true;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Inscription établissement
  async registerEtablissement(data: RegisterData, verificationCode: string): Promise<LoginResponse> {
    try {
      // Validation des champs requis
      if (!data.nom) throw new Error("Le nom de l'établissement est requis");
      if (!data.adresse) throw new Error("L'adresse est requise");
      if (!data.ville) throw new Error("La ville est requise");
      if (!data.pays) throw new Error("Le pays est requis");
      if (!data.email) throw new Error("L'email est requis");
      if (!data.mot_de_passe) throw new Error("Le mot de passe est requis");
      if (!data.type_) throw new Error("Le type d'établissement est requis");
      if (!verificationCode) throw new Error("Le code de vérification est requis");

      // Créer un objet JSON
      const formData = createFormData({
        nom: data.nom,
        adresse: data.adresse,
        ville: data.ville,
        pays: data.pays,
        email: data.email,
        mot_de_passe: data.mot_de_passe,
        type_: data.type_,
        code: verificationCode,
        statut: "Inactive",
        code_postal: data.code_postal || undefined,
        telephone: data.telephone || undefined,
        site_web: data.site_web || undefined,
        description: data.description || undefined,
        ...(data.logo && { logo: data.logo }),
      });

      const response = await apiService.post<LoginResponse>(
        `${this.baseUrl}/register/etablissement`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ [registerEtablissement] Réponse inscription:", response);
      console.log("👤 [registerEtablissement] User créé:", response.user);
      console.log("📷 [registerEtablissement] Logo dans user:", response.user?.logo || "❌ Pas de logo");

      this.storeAuthData(response);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Inscription (méthode générique - garde pour compatibilité)
  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(
        `${this.baseUrl}/register`,
        data
      );

      this.storeAuthData(response);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await apiService.post(`${this.baseUrl}/logout`);
    } catch (error) {
      // Continue même si l'API échoue
      console.warn("Logout API failed:", error);
    } finally {
      this.clearAuthData();
    }
  }

  // Rafraîchir le token
  async refreshToken(): Promise<LoginResponse> {
    try {
      if (typeof window === 'undefined') {
        throw new Error("Cannot refresh token on server side");
      }
      const refreshToken = localStorage.getItem(config.auth.refreshTokenKey);
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiService.post<LoginResponse>(
        `${this.baseUrl}/refresh`,
        { refresh_token: refreshToken }
      );

      this.storeAuthData(response);
      return response;
    } catch (error) {
      this.clearAuthData();
      throw new Error(handleApiError(error));
    }
  }

  // Récupérer l'utilisateur actuel
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<User>(`${this.baseUrl}/current-user`);

      console.log("👤 [getCurrentUser] Réponse complète du backend:", response);
      console.log("📷 [getCurrentUser] Logo dans la réponse:", response.logo || "❌ Pas de logo");

      // Mettre à jour les données stockées
      if (typeof window !== 'undefined') {
        localStorage.setItem(config.auth.userKey, JSON.stringify(response));
      }

      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Changer le mot de passe
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiService.post(`${this.baseUrl}/password/change`, {
        current_password: currentPassword,
        new_password: newPassword,
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mot de passe oublié
  async forgotPassword(email: string): Promise<void> {
    try {
      await apiService.post(`${this.baseUrl}/password/etablissement/reset-request`, { email });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Réinitialiser le mot de passe
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiService.post(`${this.baseUrl}/password/etablissement/reset-confirm`, {
        token,
        new_password: newPassword,
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem(config.auth.tokenKey);
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Récupérer l'utilisateur stocké
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem(config.auth.userKey);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  // Récupérer le token stocké
  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(config.auth.tokenKey);
  }

  // Stocker les données d'authentification
  private storeAuthData(data: LoginResponse): void {
    if (typeof window === 'undefined') {
      // console.log("⚠️ Tentative de stockage côté serveur, ignoré");
      return;
    }

    // console.log("💾 Stockage des données d'auth:", {
    //   tokenKey: config.auth.tokenKey,
    //   refreshTokenKey: config.auth.refreshTokenKey,
    //   userKey: config.auth.userKey,
    //   hasAccessToken: !!data.access_token,
    //   hasRefreshToken: !!data.refresh_token,
    //   hasUser: !!data.user
    // });

    localStorage.setItem(config.auth.tokenKey, data.access_token);
    localStorage.setItem(config.auth.refreshTokenKey, data.refresh_token);
    localStorage.setItem(config.auth.userKey, JSON.stringify(data.user));

    // Configurer le token dans l'API service pour les prochains appels
    apiService.setAuthToken(data.access_token);

    // Vérification immédiate (commentée)
    // const storedToken = localStorage.getItem(config.auth.tokenKey);
    // const storedUser = localStorage.getItem(config.auth.userKey);
    // console.log("✅ Vérification stockage:", {
    //   tokenStored: !!storedToken,
    //   userStored: !!storedUser,
    //   tokenLength: storedToken?.length,
    //   userLength: storedUser?.length
    // });
  }

  // Effacer les données d'authentification
  private clearAuthData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.refreshTokenKey);
    localStorage.removeItem(config.auth.userKey);
    apiService.clearAuth();
  }

  // Vérifier si le token est expiré
  isTokenExpired(): boolean {
    const token = this.getStoredToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Auto-refresh du token
  async autoRefreshToken(): Promise<void> {
    if (this.isTokenExpired()) {
      try {
        await this.refreshToken();
      } catch {
        this.clearAuthData();
        window.location.href = "/login";
      }
    }
  }
}

export const authService = new AuthService();
