import api from "../api";

const adminLogin = async (email, password) => {
    const response = await api.post("/auth/login/superadmin", { email, password });
    return response.data;
};

const etablissementLogin = async (email, password) => {
    const response = await api.post("/auth/login/etablissement", { email, password });
    return response.data;
};

const personnelLogin = async (email, password) => {
    const response = await api.post("/auth/login/personnel", { email, password });
    return response.data;
};

const refreshToken = async (token) => {
    const response = await api.post("/auth/refresh", { token });
    return response.data;
};

const passwordResetRequest = async (email) => {
    const response = await api.post("/auth/password/reset-request", { email });
    return response.data;
};

const resetPassword = async (token, newPassword) => {
    const response = await api.post("/auth/password/reset-confirm", { token, newPassword });
    return response.data;
};

const changePassword = async (token, newPassword) => {
    const response = await api.post("/auth/password/change", { token, newPassword });
    return response.data;
};

export { 
    adminLogin, 
    etablissementLogin, 
    personnelLogin, 
    refreshToken, 
    passwordResetRequest, 
    resetPassword, 
    changePassword 
};