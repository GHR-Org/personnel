"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Personnel } from "@/types/personnel";

interface AuthContextType {
  user: Personnel | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { getCurrentUser, redirectByRole } = useAuth();
  const publicRoutes = new Set([
    "/login",
    "/forgot-password",
    "/reset-password",
    // Note : On retire "/" des routes publiques car il est géré différemment pour les utilisateurs connectés.
    // L'ajout dans chaque set de rôle (ci-dessous) le rendra accessible à tous les rôles.
  ]);

  // J'ai ajouté "/" à chaque ensemble de routes pour que les utilisateurs connectés
  // de n'importe quel rôle puissent y accéder sans être redirigés.
  const CaissierRoutes = new Set([
    "/",
    "/caissier",
    "/caissier/caisse",
    "/caissier/invoice",
    "/caissier/invoice/facture",
    "/caissier/statistiques",
    "/parametres",
    "/parametres/general",
    "/parametres/profil",
    "/parametres/notifications",
    "/parametres/security",
    "/parametres/help",
  ]);
  const RhRoutes = new Set([
    
    "/rh",
    "/rh/rapport",
    "/rh/surveillance",
    "/rh/personnel",
    "/reservations/restaurant",
    "/parametres",
    "/",  
    "/parametres/general",
    "/parametres/profil",
    "/parametres/notifications",
    "/parametres/security",
    "/parametres/help",
  ]);
  const ReceptionRoutes = new Set([
    "/",
    "/reception/dashboard",
    "/reception/reservation",
    "/reception",
    "/reception/rapports",
    "/reception/caissier",
    "/reception/caissier/caisse",
    "/reception/caissier/invoice",
    "/reception/caissier/invoice/facture",
    "/reception/caissier/statistiques",
    "/parametres",
    "/parametres/general",
    "/parametres/profil",
    "/parametres/notifications",
    "/parametres/security",
    "/parametres/help",
  ]);
  const TechnicienRoutes = new Set([
    "/",
    "/maintenance",
    "/maintenance/equipements",
    "/maintenance/incidents",
    "/maintenance/interventions",
    "/parametres",
    "/parametres/general",
    "/parametres/profil",
    "/parametres/notifications",
    "/parametres/security",
    "/parametres/help",
    "/maintenance/interventions/calendrier",
  ]);
  const ManagerRoutes = new Set([
    "/",
    "/manager",
    "/manager/personnalisation",
    "/manager/commande",
    "/manager/menus",
    "/manager/personnalisation",
    "/manager/rapports",
    "/manager/restaurant",
    "/parametres",
    "/parametres/general",
    "/parametres/profil",
    "/parametres/notifications",
    "/parametres/security",
    "/parametres/help",
  ]);

  const hasCheckedPath = useRef<string | null>(null);

  const checkAuthorization = useCallback(async () => {
    // Si le chemin a déjà été vérifié, on ne fait rien
    if (hasCheckedPath.current === pathname) {
      if (!loading && isAuthorized) {
        return;
      }
    }

    setLoading(true);
    setIsAuthorized(false);

    const accessToken = localStorage.getItem("access_token_ghr");

    try {
      // 1. Gérer les routes publiques
      if (publicRoutes.has(pathname)) {
        if (accessToken) {
          try {
            const userData = await getCurrentUser();
            if (userData?.role) {
              // Si un token existe sur une route publique, on redirige vers le dashboard du rôle
              redirectByRole(userData, router);
              return;
            }
          } catch (error) {
            console.error("Erreur de token sur route publique:", error);
            localStorage.removeItem("access_token_ghr");
            localStorage.removeItem("refresh_token_ghr");
            router.replace("/login");
          }
        }
        setIsAuthorized(true);
        setLoading(false);
        hasCheckedPath.current = pathname;
        return;
      }

      // 2. Gérer les routes privées
      if (!accessToken) {
        router.replace("/login");
        setLoading(false);
        return;
      }

      // 3. Récupérer les données utilisateur et vérifier le rôle
      const userData = await getCurrentUser();
      setUser(userData);

      if (userData?.role) {
        const { role } = userData;
        let allowedRoutes: Set<string> = new Set();

        if (role === "Caissier") {
          allowedRoutes = CaissierRoutes;
        } else if (role === "Receptionniste") {
          allowedRoutes = ReceptionRoutes;
        } else if (role === "Technicien") {
          allowedRoutes = TechnicienRoutes;
        } else if (role === "RH") {
          allowedRoutes = RhRoutes;
        } else if (role === "Manager") {
          allowedRoutes = ManagerRoutes;
        } else {
          console.warn(`Rôle inconnu: ${role}. Redirection vers /login`);
          router.replace("/login");
          setLoading(false);
          return;
        }

        if (allowedRoutes.has(pathname)) {
          setIsAuthorized(true);
          setLoading(false);
        } else {
          console.warn(`Accès non autorisé à ${pathname} pour le rôle ${role}.`);
          console.log("Redirection vers la première page autorisée :", Array.from(allowedRoutes)[0]);
          router.replace(Array.from(allowedRoutes)[0]);
        }
      } else {
        console.error("Informations utilisateur ou rôle manquants après l'authentification.");
        router.replace("/login");
        setLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification d'authentification/autorisation:", error);
      localStorage.removeItem("access_token_ghr");
      localStorage.removeItem("refresh_token_ghr");
      router.replace("/login");
      setLoading(false);
    }
    hasCheckedPath.current = pathname;
  }, [pathname, router, getCurrentUser, isAuthorized, loading, CaissierRoutes, ReceptionRoutes, TechnicienRoutes, RhRoutes, ManagerRoutes, publicRoutes, redirectByRole]);

  useEffect(() => {
    checkAuthorization();
  }, [checkAuthorization]);

  const logout = () => {
    localStorage.removeItem("access_token_ghr");
    localStorage.removeItem("refresh_token_ghr");
    setUser(null);
    hasCheckedPath.current = null;
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {loading || !isAuthorized ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
          <p className="mt-4 text-lg font-medium">Chargement sécurisé...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};