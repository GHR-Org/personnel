import api from "@/lib/func/api/api";

const getPersonnel = async (etablissementId) => {
    try {
        // Si un etablissementId est fourni, récupérer le personnel de cet établissement
        if (etablissementId) {
            const response = await api.get(`/personnel/etablissement/${etablissementId}`);
            return response.data;
        }
        // Sinon, récupérer tout le personnel (pour les super admins)
        const response = await api.get("/personnel");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du personnel:", error);
        throw error;
    }
};

const createPersonnel = async (data) => {
    // Le backend s'occupe du hachage du mot de passe
    console.log("🔐 Le mot de passe sera hashé côté serveur pour la sécurité");
    
    try {
        const response = await api.post("/personnel", data);
        return response.data;
    } catch (error) {
        console.error("Erreur API création personnel:", error);
        
        // Gérer les erreurs de validation (422)
        if (error.response && error.response.status === 422 && error.response.data.detail) {
            if (Array.isArray(error.response.data.detail)) {
                // Erreurs de validation multiples
                const validationErrors = error.response.data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
                throw new Error(`Erreur de validation: ${validationErrors}`);
            } else {
                throw new Error(error.response.data.detail);
            }
        }
        
        throw error;
    }
};

const updatePersonnel = async (id, data) => {
    // Le backend s'occupe du hachage du mot de passe si nécessaire
    console.log("🔐 Le mot de passe sera hashé côté serveur si fourni");
    
    try {
        const response = await api.put(`/personnel/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Erreur API modification personnel:", error);
        
        // Gérer les erreurs de validation (422)
        if (error.response && error.response.status === 422 && error.response.data.detail) {
            if (Array.isArray(error.response.data.detail)) {
                // Erreurs de validation multiples
                const validationErrors = error.response.data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
                throw new Error(`Erreur de validation: ${validationErrors}`);
            } else {
                throw new Error(error.response.data.detail);
            }
        }
        
        throw error;
    }
};

const deletePersonnel = async (id) => {
    const response = await api.delete(`/personnel/${id}`);
    return response.data;
};

const getPersonnelStats = async () => {
    try {
        const response = await api.get("/personnel/stats");
        return response.data;
    } catch (error) {
        // Retourner des statistiques de démonstration si l'API n'est pas disponible
        return {
            total: 0,
            actifs: 0,
            inactifs: 0,
            suspendus: 0,
            par_role: {},
            par_etablissement: {}
        };
    }
};

const getPersonnelStatsByEtablissement = async (etablissementId) => {
    try {
        const response = await api.get(`/personnel/stats/etablissement/${etablissementId}`);
        return response.data;
    } catch (error) {
        return {
            total: 0,
            actifs: 0,
            inactifs: 0,
            suspendus: 0,
            par_role: {}
        };
    }
};

const getPersonnelByEtablissement = async (etablissementId) => {
    try {
        const response = await api.get(`/personnel/etablissement/${etablissementId}`);
        return response.data;
    } catch (error) {
        return { Personnels: [] };
    }
};

const updatePersonnelStatus = async (id, status) => {
    try {
        const response = await api.patch(`/personnel/${id}/status`, { statut_compte: status });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { 
    getPersonnel, 
    createPersonnel, 
    updatePersonnel, 
    deletePersonnel, 
    getPersonnelStats, 
    getPersonnelStatsByEtablissement,
    getPersonnelByEtablissement,
    updatePersonnelStatus
};