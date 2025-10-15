import { useAuth } from "./useAuth";
import { TypeEtablissement } from "@/types";

/**
 * Hook pour gérer les fonctionnalités selon le type d'établissement
 */
export function useEtablissementType() {
  const { user } = useAuth();

  // Récupérer le type d'établissement depuis current-user
  const etablissementType = user?.type_ as TypeEtablissement;

  // Fonctionnalités disponibles selon le type
  const features = {
    // Fonctionnalités communes à tous
    common: {
      dashboard: true,
      clients: true,
      personnel: true,
      rapports: true,
      settings: true,
    },

    // Fonctionnalités spécifiques à l'hôtellerie
    hotelerie: {
      chambres: true,
      reservations: true,
      housekeeping: true,
      reception: true,
    },

    // Fonctionnalités spécifiques à la restauration
    restauration: {
      plats: true,
      tables: true,
      commandes: true,
      cuisine: true,
      stock: true,
    },

    // Fonctionnalités pour hôtellerie + restauration
    mixte: {
      chambres: true,
      reservations: true,
      plats: true,
      tables: true,
      commandes: true,
      housekeeping: true,
      reception: true,
      cuisine: true,
      stock: true,
    }
  };

  // Déterminer les fonctionnalités disponibles
  const getAvailableFeatures = () => {
    const common = features.common;

    switch (etablissementType) {
      case TypeEtablissement.HOTELERIE:
        return { ...common, ...features.hotelerie };
      
      case TypeEtablissement.RESTAURATION:
        return { ...common, ...features.restauration };
      
      case TypeEtablissement.HOTELERIE_RESTAURATION:
        return { ...common, ...features.mixte };
      
      default:
        return common;
    }
  };

  // Vérifier si une fonctionnalité est disponible
  const hasFeature = (feature: string): boolean => {
    const availableFeatures = getAvailableFeatures();
    return availableFeatures[feature as keyof typeof availableFeatures] || false;
  };

  // Obtenir le titre de l'établissement
  const getEtablissementTitle = (): string => {
    switch (etablissementType) {
      case TypeEtablissement.HOTELERIE:
        return "Gestion Hôtelière";
      
      case TypeEtablissement.RESTAURATION:
        return "Gestion Restaurant";
      
      case TypeEtablissement.HOTELERIE_RESTAURATION:
        return "Gestion Hôtel & Restaurant";
      
      default:
        return "Gestion Établissement";
    }
  };

  // Obtenir la couleur du thème selon le type
  const getThemeColor = (): string => {
    switch (etablissementType) {
      case TypeEtablissement.HOTELERIE:
        return "blue"; // Bleu pour hôtellerie
      
      case TypeEtablissement.RESTAURATION:
        return "orange"; // Orange pour restauration
      
      case TypeEtablissement.HOTELERIE_RESTAURATION:
        return "purple"; // Violet pour mixte
      
      default:
        return "gray";
    }
  };

  // Obtenir les sections de navigation
  const getNavigationSections = () => {
    const availableFeatures = getAvailableFeatures();
    const sections = [];

    // Section principale
    sections.push({
      title: "Principal",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: "dashboard", available: true },
        { name: "Clients", href: "/clients", icon: "users", available: availableFeatures.clients },
        { name: "Personnel", href: "/personnel", icon: "team", available: availableFeatures.personnel },
      ]
    });

    // Section hôtellerie
    if (availableFeatures.chambres || availableFeatures.reservations) {
      sections.push({
        title: "Hôtellerie",
        items: [
          { name: "Chambres", href: "/chambres", icon: "bed", available: availableFeatures.chambres },
          { name: "Réservations", href: "/reservations", icon: "calendar", available: availableFeatures.reservations },
          { name: "Réception", href: "/reception", icon: "reception", available: availableFeatures.reception },
        ]
      });
    }

    // Section restauration
    if (availableFeatures.plats || availableFeatures.tables) {
      sections.push({
        title: "Restauration",
        items: [
          { name: "Plats", href: "/plats", icon: "utensils", available: availableFeatures.plats },
          { name: "Tables", href: "/tables", icon: "table", available: availableFeatures.tables },
          { name: "Commandes", href: "/commandes", icon: "order", available: availableFeatures.commandes },
          { name: "Stock", href: "/stock", icon: "inventory", available: availableFeatures.stock },
        ]
      });
    }

    // Section rapports
    sections.push({
      title: "Gestion",
      items: [
        { name: "Rapports", href: "/rapports", icon: "chart", available: availableFeatures.rapports },
        { name: "Paramètres", href: "/settings", icon: "settings", available: availableFeatures.settings },
      ]
    });

    return sections.map(section => ({
      ...section,
      items: section.items.filter(item => item.available)
    })).filter(section => section.items.length > 0);
  };

  return {
    etablissementType,
    user,
    hasFeature,
    getAvailableFeatures,
    getEtablissementTitle,
    getThemeColor,
    getNavigationSections,
    
    // Raccourcis pour les types courants
    isHotelerie: etablissementType === TypeEtablissement.HOTELERIE,
    isRestauration: etablissementType === TypeEtablissement.RESTAURATION,
    isMixte: etablissementType === TypeEtablissement.HOTELERIE_RESTAURATION,
  };
}
