// API pour les statistiques administrateur avec données statiques
export const adminStatisticsAPI = {
  // Obtenir les statistiques générales
  getStatistics: async () => {
    // Données statiques de démonstration
    return {
      total_etablissements: 8,
      hotels: 3,
      restaurants: 2,
      hotel_restaurants: 3,
      etablissements_par_ville: { "Antananarivo": 3, "Toamasina": 2, "Fianarantsoa": 1, "Mahajanga": 1, "Toliara": 1 },
      etablissements_par_statut: { "Activer": 6, "Inactive": 2 },
      etablissements_par_pays: { "Madagascar": 8 },
      etablissements_recents_30_jours: 4,
      etablissements_recents_7_jours: 2,
      croissance_mensuelle: [
        { mois: "2024-01", nouveaux_etablissements: 1 },
        { mois: "2024-02", nouveaux_etablissements: 2 },
        { mois: "2024-03", nouveaux_etablissements: 1 },
        { mois: "2024-04", nouveaux_etablissements: 2 },
        { mois: "2024-05", nouveaux_etablissements: 2 },
      ],
      croissance_par_type: {
        "Hotelerie": [
          { mois: "2024-01", nouveaux_etablissements: 1 },
          { mois: "2024-02", nouveaux_etablissements: 1 },
          { mois: "2024-03", nouveaux_etablissements: 0 },
          { mois: "2024-04", nouveaux_etablissements: 1 },
          { mois: "2024-05", nouveaux_etablissements: 0 },
        ],
        "Restauration": [
          { mois: "2024-01", nouveaux_etablissements: 0 },
          { mois: "2024-02", nouveaux_etablissements: 1 },
          { mois: "2024-03", nouveaux_etablissements: 1 },
          { mois: "2024-04", nouveaux_etablissements: 0 },
          { mois: "2024-05", nouveaux_etablissements: 1 },
        ],
        "Hotelerie et Restauration": [
          { mois: "2024-01", nouveaux_etablissements: 0 },
          { mois: "2024-02", nouveaux_etablissements: 0 },
          { mois: "2024-03", nouveaux_etablissements: 0 },
          { mois: "2024-04", nouveaux_etablissements: 1 },
          { mois: "2024-05", nouveaux_etablissements: 1 },
        ],
      },
      taux_adoption: 75.5,
      taux_croissance: 12.3,
      densite_geographique: 2.1,
      etablissements_recents: [
        { nom: "Hotel Tana", ville: "Antananarivo", type: "Hotelerie", statut: "Activer", date_creation: "2024-05-01", email: "contact@hoteltana.mg" },
        { nom: "Restaurant Océan", ville: "Toamasina", type: "Restauration", statut: "Activer", date_creation: "2024-05-03", email: "info@oceantoamasina.mg" },
        { nom: "Majunga Palace", ville: "Mahajanga", type: "Hotelerie et Restauration", statut: "Inactive", date_creation: "2024-04-15", email: "majunga@palace.mg" },
      ],
      top_villes: [
        { ville: "Antananarivo", nb_etablissements: 3 },
        { ville: "Toamasina", nb_etablissements: 2 },
        { ville: "Fianarantsoa", nb_etablissements: 1 },
        { ville: "Mahajanga", nb_etablissements: 1 },
        { ville: "Toliara", nb_etablissements: 1 },
      ],
      inscriptions_par_jour: [
        { date: "2024-05-01", inscriptions: 2 },
        { date: "2024-05-02", inscriptions: 1 },
        { date: "2024-05-03", inscriptions: 1 },
        { date: "2024-05-04", inscriptions: 0 },
        { date: "2024-05-05", inscriptions: 2 },
      ],
      alertes: [
        { type: "info", message: "Plateforme stable. Toutes les fonctionnalités sont opérationnelles." },
        { type: "warning", message: "2 établissements inactifs nécessitent une attention." },
      ],
    };
  },

  // Obtenir les statistiques globales des établissements
  getGlobalEstablishmentStats: async () => {
    return {
      total_etablissements: 8,
      etablissements_actifs: 6,
      etablissements_inactifs: 2,
      nouveaux_ce_mois: 2,
      croissance: 12.3,
      repartition_par_type: {
        "Hotelerie": 3,
        "Restauration": 2,
        "Hotelerie et Restauration": 3
      },
      repartition_par_ville: {
        "Antananarivo": 3,
        "Toamasina": 2,
        "Fianarantsoa": 1,
        "Mahajanga": 1,
        "Toliara": 1
      }
    };
  },

  // Obtenir les statistiques par période
  getStatisticsByPeriod: async (period) => {
    return {
      periode: period,
      total: 8,
      croissance: 12.3,
      nouveaux: 2
    };
  },

  // Obtenir les alertes système
  getSystemAlerts: async () => {
    return [
      { type: "info", message: "Plateforme stable. Toutes les fonctionnalités sont opérationnelles." },
      { type: "warning", message: "2 établissements inactifs nécessitent une attention." },
      { type: "success", message: "Mise à jour système terminée avec succès." }
    ];
  }
};

// API pour la gestion des établissements avec données statiques
export const adminEstablishmentsAPI = {
  // Obtenir tous les établissements
  getAllEstablishments: async () => {
    return [
      { id: 1, nom: "Hotel Tana", ville: "Antananarivo", type: "Hotelerie", statut: "Activer", email: "contact@hoteltana.mg" },
      { id: 2, nom: "Restaurant Océan", ville: "Toamasina", type: "Restauration", statut: "Activer", email: "info@oceantoamasina.mg" },
      { id: 3, nom: "Majunga Palace", ville: "Mahajanga", type: "Hotelerie et Restauration", statut: "Inactive", email: "majunga@palace.mg" },
      { id: 4, nom: "Hotel Fianarantsoa", ville: "Fianarantsoa", type: "Hotelerie", statut: "Activer", email: "contact@hotelfianarantsoa.mg" },
      { id: 5, nom: "Restaurant Toliara", ville: "Toliara", type: "Restauration", statut: "Activer", email: "info@restotoliara.mg" }
    ];
  },

  // Obtenir un établissement par ID
  getEstablishmentById: async (id) => {
    const etablissements = [
      { id: 1, nom: "Hotel Tana", ville: "Antananarivo", type: "Hotelerie", statut: "Activer", email: "contact@hoteltana.mg" },
      { id: 2, nom: "Restaurant Océan", ville: "Toamasina", type: "Restauration", statut: "Activer", email: "info@oceantoamasina.mg" },
      { id: 3, nom: "Majunga Palace", ville: "Mahajanga", type: "Hotelerie et Restauration", statut: "Inactive", email: "majunga@palace.mg" }
    ];
    return etablissements.find(e => e.id === id) || null;
  },

  // Mettre à jour le statut d'un établissement
  updateEstablishmentStatus: async (id, status) => {
    return { success: true, message: `Statut de l'établissement ${id} mis à jour vers ${status}` };
  },

  // Supprimer un établissement
  deleteEstablishment: async (id) => {
    return { success: true, message: `Établissement ${id} supprimé avec succès` };
  }
};

// API pour les rapports administrateur avec données statiques
export const adminReportsAPI = {
  // Générer un rapport d'activité
  generateActivityReport: async (startDate, endDate) => {
    return {
      periode: { startDate, endDate },
      total_activites: 150,
      activites_par_jour: [
        { date: "2024-05-01", activites: 25 },
        { date: "2024-05-02", activites: 30 },
        { date: "2024-05-03", activites: 28 },
        { date: "2024-05-04", activites: 22 },
        { date: "2024-05-05", activites: 35 }
      ],
      type_activites: {
        "Connexions": 45,
        "Réservations": 30,
        "Modifications": 25,
        "Suppressions": 10,
        "Créations": 40
      }
    };
  },

  // Générer un rapport financier
  generateFinancialReport: async (startDate, endDate) => {
    return {
      periode: { startDate, endDate },
      revenus_totaux: 1500000,
      depenses_totales: 800000,
      benefice_net: 700000,
      transactions: 150,
      moyenne_transaction: 10000,
      repartition_revenus: {
        "Hébergement": 60,
        "Restauration": 25,
        "Services": 15
      }
    };
  },

  // Exporter les données
  exportData: async (type, format) => {
    return {
      success: true,
      message: `Données ${type} exportées au format ${format}`,
      downloadUrl: `/exports/${type}_${new Date().toISOString().split('T')[0]}.${format}`
    };
  }
};

// API pour la configuration système avec données statiques
export const adminConfigAPI = {
  // Obtenir la configuration système
  getSystemConfig: async () => {
    return {
      maintenance_mode: false,
      max_file_size: 10485760,
      allowed_file_types: ["jpg", "png", "pdf"],
      email_notifications: true,
      sms_notifications: false,
      backup_frequency: "daily",
      retention_period: 30,
      api_rate_limit: 1000
    };
  },

  // Mettre à jour la configuration système
  updateSystemConfig: async (config) => {
    return {
      success: true,
      message: "Configuration mise à jour avec succès",
      config: config
    };
  }
}; 