import { buildApiUrl, getAuthHeaders } from './config';

// API pour les établissements
export const etablissementAPI = {
  // Récupérer tous les établissements (sans authentification pour l'inscription)
  getAll: async () => {
    const response = await fetch(buildApiUrl('/etablissement'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur lors de la récupération des établissements');
    }

    return await response.json();
  },

  // Récupérer un établissement par ID
  getById: async (id) => {
    const response = await fetch(buildApiUrl(`/etablissement/${id}`), {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur lors de la récupération de l\'établissement');
    }

    return await response.json();
  },

  // Créer un établissement
  create: async (etablissementData) => {
    // Le backend s'occupe du hachage du mot de passe
    console.log("🔐 Le mot de passe sera hashé côté serveur pour la sécurité");
    
    const response = await fetch(buildApiUrl('/etablissement'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(etablissementData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Erreur API:", error);
      
      // Gérer les erreurs de validation (422)
      if (response.status === 422 && error.detail) {
        if (Array.isArray(error.detail)) {
          // Erreurs de validation multiples
          const validationErrors = error.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
          throw new Error(`Erreur de validation: ${validationErrors}`);
        } else {
          throw new Error(error.detail);
        }
      }
      
      throw new Error(error.detail || 'Erreur lors de la création de l\'établissement');
    }

    return await response.json();
  },

  // Mettre à jour un établissement
  update: async (id, etablissementData) => {
    // Le backend s'occupe du hachage du mot de passe si nécessaire
    console.log("🔐 Le mot de passe sera hashé côté serveur si fourni");
    
    const response = await fetch(buildApiUrl(`/etablissement/${id}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(etablissementData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur lors de la mise à jour de l\'établissement');
    }

    return await response.json();
  },

  // Supprimer un établissement
  delete: async (id) => {
    const response = await fetch(buildApiUrl(`/etablissement/${id}`), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur lors de la suppression de l\'établissement');
    }

    return await response.json();
  },
}; 