import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";


if (!process.env.NEXT_PUBLIC_API_URL) {
  console.error("NEXT_PUBLIC_API_URL n'est pas défini. Veuillez le configurer dans votre fichier .env.local ou .env.");
}

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// --- Intercepteur de Requête ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Récupère le token d'accès depuis le localStorage
    const token = localStorage.getItem("access_token_ghr");
    
    // Si un token existe, l'ajouter à l'en-tête Authorization
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);


// --- Intercepteur de Réponse ---
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token_ghr");
        if (!refreshToken) {
          console.warn("Pas de refresh token disponible, impossible de rafraîchir le token d'accès.");
          return Promise.reject(error);
        }

        const response: AxiosResponse<{ access_token: string }> = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          },
          { withCredentials: true }
        );

        const newAccessToken = response.data.access_token;
        localStorage.setItem("access_token_ghr", newAccessToken);

        if (!originalRequest.headers) {
          originalRequest.headers = new AxiosHeaders();
        }
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);

      } catch (err) {
        console.error("Échec du refresh token", err);
        // Optionnel : rediriger l'utilisateur en cas d'échec du refresh
        // window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;