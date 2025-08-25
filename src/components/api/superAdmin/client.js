import api from "../api";

const getClients = async () => {
    const response = await api.get("/client");
    return response.data;
};

const getClientById = async (id) => {
    const response = await api.get(`/client/${id}`);
    return response.data;
};

const createClient = async (clientData) => {
    const response = await api.post("/client", clientData);
    return response.data;
};

const updateClient = async (id, clientData) => {
    const response = await api.put(`/client/${id}`, clientData);
    return response.data;
};

const deleteClient = async (id) => {
    const response = await api.delete(`/client/${id}`);
    return response.data;
};

const updateClientStatus = async (id, status) => {
    const response = await api.patch(`/client/${id}/status`, { status });
    return response.data;
};

const getClientStats = async () => {
    try {
        const clients = await getClients();
        
        // Calculer les statistiques
        const active = clients.filter(c => c.account_status === "ACTIVE").length;
        const inactive = clients.filter(c => c.account_status === "INACTIVE").length;
        const suspended = clients.filter(c => c.account_status === "SUSPENDED").length;
        
        return {
            nombre_active: active,
            nombre_inactive: inactive,
            nombre_suspendu: suspended,
            nombre_total: clients.length
        };
    } catch (error) {
        console.error("Erreur lors du calcul des statistiques:", error);
        return {
            nombre_active: 0,
            nombre_inactive: 0,
            nombre_suspendu: 0,
            nombre_total: 0
        };
    }
};

export { 
    getClients, 
    getClientById, 
    createClient, 
    updateClient, 
    deleteClient, 
    updateClientStatus,
    getClientStats
};