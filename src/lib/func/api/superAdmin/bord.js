import api from "../api";

const getStatTypeEtab = async () => {
    const response = await api.get("/typeEtab");
    return response.data;
};

const getNbrAllStatus = async () => {
    const response = await api.get("/statut_account");
    return response.data;
};

const getNbrAllEtab = async () => {
    const response = await api.get("/nbrEtablissement");
    return response.data;
};

const personnelRegister = async () => {
    const response = await api.post("/auth/register/personnel");
    return response.data;
};

const getNbrAllClient = async () => {
    const response = await api.get("/nbrClient");
    return response.data;
};

export { getStatTypeEtab, personnelRegister, getNbrAllClient, getNbrAllStatus, getNbrAllEtab };