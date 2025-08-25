import api from "../api";

const etablissementRegister = async (
                                    nom, 
                                    adresse, 
                                    ville, 
                                    code_postal, 
                                    telephone,
                                    email,
                                    site_web,
                                    description,
                                    type_
                                ) => {
    const response = await api.post("/auth/register/etablissement", { 
                                                                    nom, 
                                                                    adresse, 
                                                                    ville, 
                                                                    code_postal, 
                                                                    telephone,
                                                                    email, 
                                                                    site_web,
                                                                    description,
                                                                    type_
                                                                });
    return response.data;
};

const personnelRegister = async (
                                nom, 
                                prenom, 
                                telephone, 
                                email, 
                                mot_de_passe,
                                poste,
                                etablissement
                            ) => {
    const response = await api.post("/auth/register/personnel", { 
                                                                    nom, 
                                                                    prenom, 
                                                                    telephone, 
                                                                    email, 
                                                                    mot_de_passe,
                                                                    poste,
                                                                    etablissement
                                                                });
    return response.data;
};

export { etablissementRegister, personnelRegister };