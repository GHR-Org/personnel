import api from "@/lib/func/api/api";

// Récupérer toutes les chambres d'un établissement
export const getChambres = async (etablissementId) => {
  const response = await api.get(`/chambre/chambres/etablissement/${etablissementId}`);
  return response.data;
};

// Récupérer toutes les chambres (pour admin)
export const getAllChambres = async () => {
  const response = await api.get("/chambre/chambres");
  return response.data;
};

// Récupérer une chambre par ID
export const getChambreById = async (chambreId) => {
  const response = await api.get(`/chambre/chambres/${chambreId}`);
  return response.data;
};

// Créer une nouvelle chambre
export const createChambre = async (chambreData) => {
  const response = await api.post("/chambre/add_chambre", chambreData);
  return response.data;
};

// Modifier une chambre
export const updateChambre = async (chambreId, chambreData) => {
  const response = await api.put(`/chambre/chambres/${chambreId}`, chambreData);
  return response.data;
};

// Supprimer une chambre
export const deleteChambre = async (chambreId) => {
  const response = await api.delete(`/chambre/chambres/${chambreId}`);
  return response.data;
};

// Récupérer les chambres par statut
export const getChambresByStatus = async (status, etablissementId) => {
  const response = await api.get(`/chambre/getStatus/${status}/${etablissementId}`);
  return response.data;
};

// Récupérer le taux d'occupation
export const getTauxOccupation = async (etablissementId) => {
  const response = await api.get(`/chambre/occupation/taux/${etablissementId}`);
  return response.data;
};

// Statistiques des chambres
export const getChambreStats = async (etablissementId) => {
  try {
    const [chambres, tauxOccupation] = await Promise.all([
      getChambres(etablissementId),
      getTauxOccupation(etablissementId)
    ]);

    const chambresList = chambres.chambres || [];
    
    return {
      total: chambresList.length,
      libres: chambresList.filter(c => c.etat === "Libre").length,
      occupees: chambresList.filter(c => c.etat === "Occupée").length,
      maintenance: chambresList.filter(c => c.etat === "En maintenance").length,
      reservees: chambresList.filter(c => c.etat === "Réservée").length,
      taux_occupation: tauxOccupation.pourcentage || 0,
      categories: [...new Set(chambresList.map(c => c.categorie))],
      tarif_moyen: chambresList.length > 0 
        ? chambresList.reduce((sum, c) => sum + c.tarif, 0) / chambresList.length 
        : 0
    };
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques:", error);
    throw error;
  }
};