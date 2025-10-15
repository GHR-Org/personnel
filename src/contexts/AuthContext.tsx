/* eslint-disable react-hooks/exhaustive-deps */
// src/components/auth/AuthProvider.tsx
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
import { useTheme } from "next-themes";
import Image from "next/image";

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
  // 🛑 Clé anti-boucle
  const [isRedirecting, setIsRedirecting] = useState(false); 
  
  const router = useRouter();
  const pathname = usePathname();
  const { getCurrentUser, redirectByRole } = useAuth();
  

  // --- GESTION DES MESSAGES DE CHARGEMENT (Inchangée) ---
  const loadingMessages = [
    "Chargement de la page",
    "Chargement des données, veuillez patienter",
    "Nous y sommes presque",
    "Encore quelques instants",
  ];
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState("");

  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/logo/dark.png");
  
  useEffect(() => {
    setLogoSrc(theme === "dark" ? "/logo/dark.png" : "/logo/white.png");
  }, [theme]);

  useEffect(() => {
    if (loading || !isAuthorized) {
      const messageInterval = setInterval(() => {
        setMessageIndex(
          (prevIndex) => (prevIndex + 1) % loadingMessages.length
        );
      }, 3000);
      return () => clearInterval(messageInterval);
    }
  }, [loading, isAuthorized, loadingMessages.length]);

  useEffect(() => {
    setCurrentMessage(loadingMessages[messageIndex]);
  }, [messageIndex, loadingMessages]);

  useEffect(() => {
    if (loading || !isAuthorized) {
      const dotsInterval = setInterval(() => {
        setDots((prevDots) => (prevDots.length >= 3 ? "" : prevDots + "."));
      }, 500);
      return () => clearInterval(dotsInterval);
    }
  }, [loading, isAuthorized]);
  // ----------------------------------------------------------------------


  // --- DÉFINITION DES ROUTES (Les routes complètes sont utilisées) ---
  const publicRoutes = new Set([
    "/login", "/forgot-password", "/reset-password", "/", "/page-not-found"
  ]);

  const CaissierRoutes = new Set([
    "/caissier", "/caissier/caisse", "/caissier/invoice", "/caissier/invoice/facture", 
    "/caissier/statistiques", "/parametres", "/parametres/general", "/parametres/profil", 
    "/parametres/notifications", "/parametres/security", "/parametres/help", "/"
  ]);
  const RhRoutes = new Set([
    "/rh/surveillance/conges", "/rh", "/rh/rapport", "/rh/planning", "/rh/surveillance", 
    "/rh/surveillance/planning-personnel", "/rh/personnel", "/reservations/restaurant", 
    "/parametres", "/parametres/general", "/parametres/profil", "/parametres/notifications", 
    "/parametres/security", "/parametres/help", "/"
  ]);
  const ReceptionRoutes = new Set([
    "/reception/dashboard", "/reception/reservation", "/reception", "/reception/rapports", 
    "/reception/caissier", "/reception/caissier/caisse", "/reception/caissier/invoice", 
    "/reception/caissier/invoice/facture", "/reception/caissier/statistiques", 
    "/parametres", "/parametres/general", "/parametres/profil", "/parametres/notifications", 
    "/parametres/security", "/parametres/help", "/"
  ]);
  const TechnicienRoutes = new Set([
    "/maintenance", "/maintenance/equipements", "/maintenance/incidents", 
    "/maintenance/interventions", "/maintenance/rapports", "/parametres", 
    "/parametres/general", "/parametres/profil", "/parametres/notifications", 
    "/parametres/security", "/parametres/help", "/maintenance/interventions/calendrier", 
    "/maintenance/documentation", "/"
  ]);
  const ManagerRoutes = new Set([
    "/manager", "/manager/personnalisation", "/manager/commande", "/manager/menus", 
    "/manager/personnalisation", "/manager/rapports", "/manager/restaurant", "/parametres", 
    "/parametres/general", "/parametres/profil", "/parametres/notifications", 
    "/parametres/security", "/parametres/help", "/"
  ]);
  // ----------------------------------------------------------------------
  
  const hasCheckedPath = useRef<string | null>(null);

  // 🛑 NOUVEAU : Gestionnaire de fin de chargement et de redirection
  // Permet d'encapsuler la logique de changement d'état
  const completeAuthorization = useCallback((authorized: boolean, redirectPath: string | null = null) => {
    if (redirectPath) {
      setIsRedirecting(true);
      setLoading(true); 
      // On met le chemin actuel dans le ref, pour que l'useEffect suivant puisse détecter le changement
      hasCheckedPath.current = pathname; 
      router.replace(redirectPath);
    } else {
      setIsAuthorized(authorized);
      setLoading(false);
      setIsRedirecting(false); // S'assurer que le drapeau est à false si l'autorisation est complétée
      hasCheckedPath.current = pathname;
    }
  }, [pathname, router]);

  const checkAuthorization = useCallback(async () => {
    // 🛑 ANTI-BOUCLE 1 : Si on redirige déjà, on s'arrête.
    if (isRedirecting) {
      setLoading(true);
      return;
    }
    
    // 🛑 ANTI-BOUCLE 2 : Si le chemin a déjà été vérifié avec succès, on s'arrête.
    if (hasCheckedPath.current === pathname && isAuthorized) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    setIsAuthorized(false);

    const accessToken = localStorage.getItem("access_token_ghr");

    try {
      // 1. Gestion des routes publiques
      if (publicRoutes.has(pathname)) {
        if (accessToken) {
          try {
            const userData = await getCurrentUser();
            if (userData?.role && pathname === "/") {
              // Si connecté et sur '/', on redirige vers le dashboard par rôle
              redirectByRole(userData, router);
              return;
            }
          } catch (error) {
            localStorage.removeItem("access_token_ghr");
            localStorage.removeItem("refresh_token_ghr");
          }
        }
        // Autorise l'accès à la route publique
        completeAuthorization(true, null); 
        return;
      }

      // 2. Routes privées : Vérification du token
      if (!accessToken) {
        completeAuthorization(false, "/login");
        return;
      }

      // 3. Récupération des données utilisateur et vérification de rôle
      const userData = await getCurrentUser();
      setUser(userData);

      if (userData?.role) {
        const { role } = userData;
        let allowedRoutes: Set<string> = new Set();
        
        // Logique d'assignation des allowedRoutes
        if (role === "Caissier") { allowedRoutes = CaissierRoutes; } 
        else if (role === "Receptionniste") { allowedRoutes = ReceptionRoutes; } 
        else if (role === "Technicien") { allowedRoutes = TechnicienRoutes; } 
        else if (role === "RH") { allowedRoutes = RhRoutes; } 
        else if (role === "Manager") { allowedRoutes = ManagerRoutes; } 
        else {
          console.warn(`Rôle inconnu: ${role}. Redirection vers /login`);
          completeAuthorization(false, "/login");
          return;
        }
        
        // 4. Vérification de l'autorisation de la route actuelle
        if (allowedRoutes.has(pathname)) {
          // Autorisé
          completeAuthorization(true, null);
        } else {
          // Non autorisé -> Redirection vers la page d'erreur
          console.warn(`Accès non autorisé à ${pathname} pour le rôle ${role}. Redirection vers /page-not-found.`);
          completeAuthorization(false, "/page-not-found");
          return;
        }
      } else {
        console.error("Informations utilisateur ou rôle manquants après l'authentification.");
        completeAuthorization(false, "/login");
        return;
      }
    } catch (error) {
      console.error("Erreur lors de la vérification d'authentification/autorisation:", error);
      localStorage.removeItem("access_token_ghr");
      localStorage.removeItem("refresh_token_ghr");
      completeAuthorization(false, "/login");
    }
  }, [pathname, router, getCurrentUser, isAuthorized, isRedirecting, CaissierRoutes, ReceptionRoutes, TechnicienRoutes, RhRoutes, ManagerRoutes, publicRoutes, redirectByRole, completeAuthorization]);

  useEffect(() => {
    checkAuthorization();
  }, [checkAuthorization]);

  // 🛑 ANTI-BOUCLE 3 : useEffect pour réinitialiser le drapeau isRedirecting après le changement de route effectif
  // C'est ici que l'on donne le feu vert pour une nouvelle vérification.
  useEffect(() => {
    if (isRedirecting && hasCheckedPath.current !== pathname) {
      // La redirection a eu lieu, on réinitialise pour que checkAuthorization se relance 
      // sur le nouveau 'pathname' (/page-not-found ou /login) sans être bloqué par 'isRedirecting'.
      setIsRedirecting(false);
    }
  }, [pathname, isRedirecting]);

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
          <Image
            src={logoSrc}
            alt="Logo de l'application"
            width={150}
            height={150}
            className="mb-4 animate-pulse"
          />
          <p className="mt-4 text-xl font-medium text-center">
            {currentMessage}
            {dots}
          </p>
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