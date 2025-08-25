import api from "../api";



const getEtablissements = async () => {
    const response = await api.get("/etablissement");
    return response.data;
};

const getEtablissementById = async (id) => {
    const response = await api.get(`/etablissement/${id}`);
    return response.data;
};

const createEtablissement = async (data) => {
    // Hasher le mot de passe avant l'envoi
    const hashedData = {
        ...data,
        mot_de_passe: hashPassword(data.mot_de_passe)
    };
    
    console.log("🔐 Mot de passe hashé avant envoi (admin):", hashedData.mot_de_passe);
    
    const response = await api.post("/etablissement", hashedData);
    return response.data;
};

const updateEtablissement = async (id, data) => {
    // Hasher le mot de passe avant l'envoi si il est fourni
    const hashedData = {
        ...data
    };
    
    if (data.mot_de_passe) {
        hashedData.mot_de_passe = hashPassword(data.mot_de_passe);
        console.log("🔐 Mot de passe hashé avant modification (admin):", hashedData.mot_de_passe);
    }
    
    const response = await api.put(`/etablissement/${id}`, hashedData);
    return response.data;
};

const deleteEtablissement = async (id) => {
    const response = await api.delete(`/etablissement/${id}`);
    return response.data;
};

const updateEtablissementStatus = async (id, status) => {
    const response = await api.put(`/etablissement/${id}/status`, { statut: status });
    return response.data;
};

const getEtablissementsByStatus = async (status) => {
    const response = await api.get(`/etablissement/status/${status}`);
    return response.data;
};

// Statistiques des établissements
const getEtablissementStats = async () => {
    const response = await api.get("/typeEtab");
    return response.data;
};

const getTotalEtablissements = async () => {
    const response = await api.get("/nbrEtablissement");
    return response.data;
};

export { 
    getEtablissements, 
    getEtablissementById, 
    createEtablissement, 
    updateEtablissement, 
    deleteEtablissement, 
    updateEtablissementStatus,
    getEtablissementsByStatus,
    getEtablissementStats,
    getTotalEtablissements
};