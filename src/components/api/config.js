// Configuration des APIs
export const API_CONFIG = {
  // URL de base pour le développement
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // Timeout par défaut pour les requêtes
  TIMEOUT: 30000,
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Configuration des endpoints
  ENDPOINTS: {
    ADMIN: '/admin',
    CLIENT: '/client',
    ETABLISSEMENT: '/etablissement',
    RECEPTIONNISTE: '/receptionniste',
    CHAMBRE: '/chambre',
    RESERVATION: '/reservation',
  },
  
  // Configuration des retry
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
  },
};

// Fonction pour construire l'URL complète
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Fonction pour obtenir les headers avec authentification
export const getAuthHeaders = (token = null) => {
  const headers = { ...API_CONFIG.DEFAULT_HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}; 