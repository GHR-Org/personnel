// ============================================================================
// CONFIGURATION CENTRALISÉE
// ============================================================================

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    timeout: 10000,
    retries: 3,
  },

  // Authentication
  auth: {
    tokenKey: "accessToken",
    refreshTokenKey: "refreshToken",
    userKey: "user",
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Application
  app: {
    name: "Administration Établissement",
    version: "1.0.0",
    description: "Système de gestion pour établissements hôteliers et de restauration",
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
    pageSizeOptions: [10, 20, 50, 100],
  },

  // File Upload
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedDocumentTypes: ["application/pdf", "application/msword"],
  },

  // UI
  ui: {
    defaultTheme: "light",
    sidebarWidth: 280,
    headerHeight: 64,
  },

  // Validation
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(\+261|0)[0-9]{9}$/,
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
    },
  },

  // Date/Time
  dateTime: {
    defaultFormat: "dd/MM/yyyy",
    defaultTimeFormat: "HH:mm",
    defaultDateTimeFormat: "dd/MM/yyyy HH:mm",
    locale: "fr-FR",
    timezone: "Indian/Antananarivo",
  },

  // Currency
  currency: {
    code: "MGA",
    symbol: "Ar",
    locale: "fr-MG",
    decimals: 0,
  },

  // Features flags
  features: {
    enableNotifications: true,
    enableRealTimeUpdates: true,
    enableAdvancedReports: true,
    enableMultiLanguage: false,
    enableDarkMode: true,
  },

  // Routes
  routes: {
    public: ["/", "/login", "/register", "/forgot-password"],
    protected: ["/dashboard", "/chambres", "/reservations", "/clients", "/personnel", "/plats", "/tables", "/rapports"],
    admin: ["/admin", "/statistics", "/settings"],
  },

  // Error Messages
  errors: {
    network: "Erreur de connexion. Veuillez vérifier votre connexion internet.",
    unauthorized: "Vous n'êtes pas autorisé à accéder à cette ressource.",
    forbidden: "Accès refusé. Vous n'avez pas les permissions nécessaires.",
    notFound: "Ressource non trouvée.",
    serverError: "Erreur serveur. Veuillez réessayer plus tard.",
    validation: "Données invalides. Veuillez vérifier vos informations.",
    timeout: "Délai d'attente dépassé. Veuillez réessayer.",
  },

  // Success Messages
  success: {
    created: "Élément créé avec succès",
    updated: "Élément mis à jour avec succès",
    deleted: "Élément supprimé avec succès",
    saved: "Données sauvegardées avec succès",
    sent: "Envoyé avec succès",
  },

  // Default Values
  defaults: {
    chambre: {
      capacite: 2,
      etat: "LIBRE" as const,
      categorie: "DOUBLE" as const,
    },
    table: {
      capacite: 4,
      statut: "LIBRE" as const,
    },
    reservation: {
      statut: "EN_ATTENTE" as const,
    },
    rapport: {
      statut: "EN_ATTENTE" as const,
      type: "Général",
    },
  },
};

// Environment-specific overrides
if (process.env.NODE_ENV === "development") {
  // Development-specific config
  config.api = { ...config.api, timeout: 30000 };
  config.features = { ...config.features, enableRealTimeUpdates: false };
}

if (process.env.NODE_ENV === "production") {
  // Production-specific config
  config.api = { ...config.api, retries: 5 };
}

export default config;
