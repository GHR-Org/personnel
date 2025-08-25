'use client';

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Building, 
  CreditCard,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Wifi,
  WifiOff
} from "lucide-react";

// Composants réutilisables
import { StatisticsCard } from "@/components/direction/statistics-card";
import { RealTimeMetrics } from "@/components/direction/real-time-metrics";
import { AnalyticsDashboard } from "@/components/direction/analytics-dashboard";
import { RevenueChart } from "@/components/direction/revenue-chart";

// Composants UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface StatisticsData {
  // === CHAMBRES ===
  chambres_par_etat: { [key: string]: number };
  chambres_par_type: { [key: string]: number };
  taux_occupation: number;
  prix_moyen_par_type: { [key: string]: number };
  total_chambres: number;
  chambres_occupees: number;

  // === COMMANDES ===
  commandes_par_statut: { [key: string]: number };
  duree_moyenne_sejour: number;
  reservations_par_type_chambre: Array<{ type: string; count: number }>;
  taux_conversion: number;

  // === FINANCES ===
  total_revenu: number;
  revenu_mensuel: number;
  revenu_journalier: number;
  revenus_mensuels: Array<{ mois: string; total: number }>;
  paiements_par_mode: { [key: string]: number };
  montant_moyen_reservation: number;
  revenu_par_chambre: number;

  // === CLIENTS ===
  nb_clients: number;
  clients_par_role: { [key: string]: number };
  top_clients: Array<{ nom: string; email: string; nb_reservations: number }>;

  // === FACTURES ===
  nb_factures: number;
  total_factures: number;
  factures_30_jours: number;

  // === ÉTABLISSEMENTS ===
  nb_hotels: number;
  nb_restaurants: number;
  nb_etablissements: number;

  // === PERSONNEL ===
  utilisateurs_par_role: { [key: string]: number };
  nb_employes: number;

  // === TEMPOREL ===
  reservations_7_jours: Array<{ date: string; count: number }>;
  paiements_7_jours: Array<{ date: string; montant: number }>;
}

// Fonction utilitaire pour formater les nombres en toute sécurité
const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  return value.toLocaleString();
};

export default function Page() {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get("http://localhost:8000/statistics");
      setStats(response.data);
      setLastUpdate(new Date());
      toast.success("Données actualisées");
    } catch (err: any) {
      console.error("Erreur Statistiques:", err);
      const errorMessage = err.response?.data?.detail || "Erreur lors du chargement des statistiques";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh toutes les 30 secondes
  useEffect(() => {
    fetchStats();

    if (autoRefresh) {
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchStats, autoRefresh]);

  // Vérification de la connectivité
  useEffect(() => {
    const checkOnline = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      if (!online) {
        toast.error("Connexion perdue");
      } else {
        toast.success("Connexion rétablie");
      }
    };

    // Set initial state only on client side
    checkOnline();

    window.addEventListener('online', checkOnline);
    window.addEventListener('offline', checkOnline);

    return () => {
      window.removeEventListener('online', checkOnline);
      window.removeEventListener('offline', checkOnline);
    };
  }, []);

  const handleExport = () => {
    if (!stats) return;
    
    const csvContent = generateCSV(stats);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `statistiques_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Export terminé");
  };

  const generateCSV = (data: StatisticsData): string => {
    const headers = [
      "Métrique",
      "Valeur",
      "Date d'export"
    ];
    
    const rows = [
      ["Taux d'occupation", `${data.taux_occupation}%`, new Date().toISOString()],
      ["Revenu total", `${data.total_revenu} Ar`, new Date().toISOString()],
      ["Revenu journalier", `${data.revenu_journalier} Ar`, new Date().toISOString()],
      ["Nombre de clients", data.nb_clients.toString(), new Date().toISOString()],
      ["Nombre d'employés", data.nb_employes.toString(), new Date().toISOString()],
      ["Taux de conversion", `${data.taux_conversion}%`, new Date().toISOString()],
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <div className="font-semibold text-red-800 dark:text-red-200">Erreur de chargement</div>
                <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={fetchStats}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <Card className="border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-950/20">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              Aucune donnée disponible
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec statut de connexion */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord Administratif</h1>
          <p className="text-muted-foreground">
            Dernière mise à jour: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '--:--:--'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isOnline ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchStats}
            disabled={!isOnline}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques en temps réel */}
      <RealTimeMetrics
        data={{
          taux_occupation: stats.taux_occupation,
          revenu_journalier: stats.revenu_journalier,
          nb_clients: stats.nb_clients,
          nb_employes: stats.nb_employes,
          chambres_occupees: stats.chambres_occupees,
          total_chambres: stats.total_chambres,
          reservations_aujourd_hui: stats.reservations_7_jours?.length ? stats.reservations_7_jours[stats.reservations_7_jours.length - 1]?.count : 0,
          paiements_aujourd_hui: stats.paiements_7_jours?.length ? stats.paiements_7_jours[stats.paiements_7_jours.length - 1]?.montant : 0
        }}
      />

      {/* Tableau de bord analytique */}
      <AnalyticsDashboard
        data={{
          revenus_mensuels: stats.revenus_mensuels || [],
          paiements_par_mode: stats.paiements_par_mode || {},
          reservations_7_jours: stats.reservations_7_jours || [],
          paiements_7_jours: stats.paiements_7_jours || [],
          chambres_par_type: stats.chambres_par_type || {},
          commandes_par_statut: stats.commandes_par_statut || {},
          top_clients: stats.top_clients || []
        }}
        onRefresh={fetchStats}
        onExport={handleExport}
      />

      {/* Graphique des revenus */}
      <RevenueChart
        data={stats.revenus_mensuels || []}
        title="Analyse des Revenus"
        description="Évolution des revenus sur les 6 derniers mois"
        variant="area"
        height={400}
      />

      {/* Indicateurs de performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsCard
          title="Taux de conversion"
          value={`${stats.taux_conversion.toFixed(1)}%`}
          subtitle="Réservations confirmées"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatisticsCard
          title="Durée moyenne séjour"
          value={`${stats.duree_moyenne_sejour.toFixed(1)} jours`}
          subtitle="Par réservation"
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatisticsCard
          title="Montant moyen"
          value={`${formatNumber(stats.montant_moyen_reservation)} Ar`}
          subtitle="Par réservation"
          icon={<CreditCard className="h-5 w-5" />}
        />
        <StatisticsCard
          title="Revenu par chambre"
          value={`${formatNumber(stats.revenu_par_chambre)} Ar`}
          subtitle="Moyenne"
          icon={<Building className="h-5 w-5" />}
        />
      </div>

      {/* Alertes et notifications */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">Alertes et Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.taux_occupation < 50 && (
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Taux d'occupation faible ({stats.taux_occupation.toFixed(1)}%) - Considérez des promotions</span>
              </div>
            )}
            {stats.taux_occupation > 90 && (
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Excellent taux d'occupation ({stats.taux_occupation.toFixed(1)}%) - Performance optimale</span>
              </div>
            )}
            {stats.revenu_journalier > stats.revenu_mensuel / 30 && (
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Revenu journalier élevé - Bonne performance commerciale</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
