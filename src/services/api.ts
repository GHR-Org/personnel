// ============================================================================
// SERVICE API CENTRALISÉ
// ============================================================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import appConfig from "@/config";
import { ApiResponse } from "@/types";

class ApiService {
  private instance: AxiosInstance;
  private etablissementId: number | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: appConfig.api.baseUrl,
      timeout: appConfig.api.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token
        const token = localStorage.getItem(appConfig.auth.tokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add establishment context
        if (this.etablissementId) {
          config.headers["X-Etablissement-ID"] = this.etablissementId.toString();
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        const data = error.response?.data;
        // Safely extract a string message (server may send objects/arrays)
        const rawMessage =
          (typeof data?.message === 'string' && data?.message)
          || (typeof data?.detail === 'string' && data?.detail)
          || (data?.detail ? JSON.stringify(data.detail) : '')
          || '';
        const msg = rawMessage.toLowerCase();

        const isInvalidToken = msg.includes("invalid token") || msg.includes("token invalide") || msg.includes("invalid signature") || msg.includes("signature invalide");
        const isUserMissing = msg.includes("user not found") || msg.includes("utilisateur inexistant") || msg.includes("utilisateur n'existe") || msg.includes("does not exist") || msg.includes("n'existe pas");

        if (status === 401 || isInvalidToken || isUserMissing) {
          // Handle unauthorized or invalid credentials on new environment
          this.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setEtablissementId(id: number) {
    this.etablissementId = id;
    this.instance.defaults.headers.common['X-Etablissement-ID'] = id.toString();
  }

  clearAuth() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    this.etablissementId = null;
    delete this.instance.defaults.headers.common['Authorization'];
    delete this.instance.defaults.headers.common['X-Etablissement-ID'];
  }

  // Generic CRUD methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // File upload
  async uploadFile<T>(url: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
    }

    const response = await this.instance.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Batch operations
  async batch<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(requests.map(request => request()));
  }

  // Retry mechanism
  async withRetry<T>(operation: () => Promise<T>, retries: number = Number(appConfig.api.retries)): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.withRetry(operation, retries - 1);
      }
      throw error;
    }
  }

  // Authentication methods
  setAuthToken(token: string): void {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // console.log("🔑 Token configuré dans l'API service");
  }

  private clearAuthHeaders(): void {
    delete this.instance.defaults.headers.common['Authorization'];
    // console.log("🚫 Token supprimé de l'API service");
  }

  private setEtablissementIdHeader(etablissementId: number): void {
    this.instance.defaults.headers.common['X-Etablissement-ID'] = etablissementId.toString();
    // console.log("🏨 Etablissement ID configuré:", etablissementId);
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Helper function to handle API errors
export function handleApiError(error: any): string {
  // console.log("🔍 handleApiError - Erreur reçue:", error);

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.detail;

    // console.log("📡 Réponse serveur:", { status, message, data: error.response.data });

    switch (status) {
      case 400:
        return message || appConfig.errors.validation;
      case 401:
        // Priorité au message du serveur pour les erreurs 401
        return message || "Email ou mot de passe incorrect";
      case 403:
        return message || appConfig.errors.forbidden;
      case 404:
        return message || appConfig.errors.notFound;
      case 422:
        // Erreur de validation des données
        console.error("🔍 Erreur 422 - Données invalides:", error.response.data);

        // Gestion des différents formats de réponse d'erreur 422
        const responseData = error.response.data;

        if (responseData?.detail && Array.isArray(responseData.detail)) {
          // Format FastAPI avec detail array
          const errorMessages = responseData.detail
            .map((detail: any) => {
              if (typeof detail === 'string') return detail;
              if (detail.msg && detail.loc) {
                const field = Array.isArray(detail.loc) ? detail.loc.join('.') : detail.loc;
                return `${field}: ${detail.msg}`;
              }
              return JSON.stringify(detail);
            })
            .join('\n');
          return `Erreurs de validation:\n${errorMessages}`;
        }

        if (responseData?.details) {
          // Format avec details object
          const details = responseData.details;
          const errorMessages = Object.entries(details)
            .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          return `Erreurs de validation:\n${errorMessages}`;
        }

        if (responseData?.message) {
          return responseData.message;
        }

        return message || "Données invalides. Vérifiez les champs requis.";
      case 500:
        return message || appConfig.errors.serverError;
      default:
        return message || appConfig.errors.serverError;
    }
  } else if (error.request) {
    // Network error
    // console.log("🌐 Erreur réseau:", error.request);
    return appConfig.errors.network;
  } else {
    // Other error
    // console.log("❓ Autre erreur:", error.message);
    return error.message || appConfig.errors.serverError;
  }
}

// Helper function to create form data
export function createFormData(data: Record<string, any>): FormData {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  
  return formData;
}

export default apiService;
