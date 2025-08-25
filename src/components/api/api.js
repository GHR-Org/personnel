import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré, essayer de rafraîchir
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/refresh`, {
            token: refreshToken
          });
          
          if (response.data.access_token) {
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            
            // Retenter la requête originale
            error.config.headers.Authorization = `Bearer ${response.data.access_token}`;
            return api.request(error.config);
          }
        } catch (refreshError) {
          // Échec du rafraîchissement, déconnecter l'utilisateur
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;