
import { useContext } from "react";
import APIClient from "@/func/APIClient";
import { Personnel } from "@/types/personnel";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


interface LoginData {
  email: string;
  password: string;
}

// interface RegisterData{
//   data :{
//       nom: string;
//     adresse: string;
//     ville: string;
//     pays: string;
//     code_postal: string;
//     telephone: string;
//     email: string;
//     site_web: string;
//     description: string;
//     type_: 'Hotelerie' | 'Restauration' | 'Hotelerie et Restauration' | string;
//     mot_de_passe: string;
//     logo: string;
//     statut: 'Inactive' | 'Activer' | string;
//   }
//   code: string
// }

interface ResetPasswordRequestData {
  email: string;
}

interface ResetPasswordConfirmData {
  token: string;
  newPassword: string;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

interface VerifyCodeData {
  email: string;
}

/**
 * Redirige l'utilisateur vers la page appropriée en fonction de son rôle.
 * @param user L'objet utilisateur contenant le rôle.
 * @param router L'instance du router de Next.js.
 */
const redirectByRole = (user: Personnel, router: AppRouterInstance) => {
  if (!user || !user.role) {
    console.warn("Impossible de rediriger : informations utilisateur ou rôle manquants.");
    router.replace("/login"); // Redirige vers la page de connexion par défaut
    return;
  }

  switch (user.role) {
    case "Caissier":
      router.replace("/caissier/caisse"); // Route spécifique pour le caissier
      break;
    case "Manager":
      router.replace("/manager"); // Route spécifique pour le caissier
      break;
    case "Receptionniste":
      router.replace("/reception/dashboard"); // Route spécifique pour la réceptionniste
      break;
    case "Technicien":
      router.replace("/maintenance"); // Route spécifique pour le technicien
      break;
    case "RH":
      router.replace("/rh"); // Route spécifique pour le RH
      break;
    default:
      console.warn(`Rôle inconnu : ${user.role}. Redirection vers le tableau de bord par défaut.`);
      router.replace("/"); // Redirection par défaut pour les rôles non définis
      break;
  }
};


export const useAuth = () => { 

  const loginPersonnel = async (data: LoginData, router: AppRouterInstance) => {
    try {
      const response = await APIClient.post("/auth/login/personnel", data);
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("access_token_ghr", access_token);
      localStorage.setItem("refresh_token_ghr", refresh_token);
      const currentUser = await getCurrentUser(); // Récupère les infos complètes de l'utilisateur
      redirectByRole(currentUser, router);
      return response.data;
    } catch (error : any) {
      throw new Error("Erreur lors de la connexion de votre compte personnel", error);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token_ghr");
      const response = await APIClient.post("/auth/refresh", { refresh_token: refreshToken });
      const { access_token } = response.data;
      localStorage.setItem("access_token_ghr", access_token);
      return response.data;
    } catch (error : any) {
      throw new Error("Erreur lors du rafraîchissement du token", error);
    }
  };

  const requestPasswordReset = async (data: ResetPasswordRequestData) => {
    try {
      const response = await APIClient.post("/auth/password/reset-request", data);
      return response.data;
    } catch (error : any) {
      throw new Error("Erreur lors de la demande de réinitialisation du mot de passe : ", error);
    }
  };

  const resetPassword = async (data: ResetPasswordConfirmData) => {
    try {
      const response = await APIClient.post("/auth/password/reset-confirm", data);
      return response.data;
    } catch (error : any) {
      throw new Error("Erreur lors de la réinitialisation du mot de passe : ", error);
    }
  };

  const changePassword = async (data: ChangePasswordData) => {
    try {
      const response = await APIClient.post("/auth/password/change", data);
      return response.data;
    } catch (error : any) {
      throw new Error("Erreur lors du changement du mot de passe : ", error);
    }
  };

  const sendVerifyCode = async (data: VerifyCodeData) => {
    try {
      const response = await APIClient.post("/auth/envoye-code", data);
      return response.data;
    } catch (error : any) {
      throw new Error("Erreur lors de l'envoi du code de vérification : ", error);
    }
  };

  const getCurrentUser = async (): Promise<Personnel> => {
  try {
    const response = await APIClient.get("/auth/current-user");
    console.log("Current user data:", response.data);
    return response.data;
  } catch (error : any) {
    console.error("Erreur lors de la récupération de l'utilisateur actuel:", error.response?.status, error.response?.data);
    // Lancez l'erreur pour qu'elle puisse être attrapée dans l'AuthProvider
    throw error;
  }
};

  return {
    loginPersonnel,
    refreshToken,
    requestPasswordReset,
    resetPassword,
    changePassword,
    sendVerifyCode,
    getCurrentUser,
    redirectByRole, 
  };
};