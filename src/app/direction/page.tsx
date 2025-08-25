"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  Building, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  Activity,
  DollarSign,
  FileText,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  Info
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DashboardData {
  chambres_summary: { [key: string]: number };
  pending_reservations: number;
  total_paiements: number;
  chiffre_affaire_mensuel: number;
  nb_clients: number;
  nb_employes: number;
  taux_occupation: number;
  revenu_journalier: number;
  revenus_mensuels: Array<{ mois: string; total: number }>;
  paiements_par_mode: { [key: string]: number };
  reservations_7_jours: Array<{ date: string; count: number }>;
  paiements_7_jours: Array<{ date: string; montant: number }>;
  chambres_par_type: { [key: string]: number };
  commandes_par_statut: { [key: string]: number };
  top_clients: Array<{ nom: string; email: string; nb_reservations: number }>;
  duree_moyenne_sejour: number;
  taux_conversion: number;
  montant_moyen_reservation: number;
  revenu_par_chambre: number;
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      // Récupérer l'utilisateur connecté et son établissement
      const user = JSON.parse(localStorage.getItem("ghr_user") || "{}");
      const etablissementId = user.etablissement_id || user.etablissement?.id;
      if (!etablissementId) {
        setError("Impossible de trouver l'établissement lié à ce compte.");
        return;
      }
      const response = await fetch(`http://localhost:8000/etablissement/${etablissementId}/statistiques`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDashboardData(data.statistiques);
      setLastUpdate(new Date());
      toast.success("Données actualisées");
    } catch (err: any) {
      console.error("Erreur lors du chargement:", err);
      const errorMessage = err.message || "Erreur lors du chargement des données";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

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

    checkOnline();
    window.addEventListener('online', checkOnline);
    window.addEventListener('offline', checkOnline);

    return () => {
      window.removeEventListener('online', checkOnline);
      window.removeEventListener('offline', checkOnline);
    };
  }, []);

  const handleExport = () => {
    if (!dashboardData) return;
    
    const csvContent = generateCSV(dashboardData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dashboard_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Export terminé");
  };

  const generateCSV = (data: DashboardData): string => {
    const headers = ["Métrique", "Valeur", "Date d'export"];
    const rows = [
      ["Taux d'occupation", `${data.taux_occupation || 0}%`, new Date().toISOString()],
      ["Revenu journalier", `${data.revenu_journalier || 0} Ar`, new Date().toISOString()],
      ["Nombre de clients", (data.nb_clients || 0).toString(), new Date().toISOString()],
      ["Nombre d'employés", (data.nb_employes || 0).toString(), new Date().toISOString()],
      ["Réservations en attente", (data.pending_reservations || 0).toString(), new Date().toISOString()],
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  // Fonction utilitaire pour obtenir une valeur sécurisée
  const getSafeValue = (obj: any, key: string, defaultValue: any = 0) => {
    return obj && obj[key] !== undefined ? obj[key] : defaultValue;
  };

  // Fonction utilitaire pour calculer le total des chambres
  const getTotalChambres = () => {
    if (!dashboardData?.chambres_summary) return 0;
    return Object.values(dashboardData.chambres_summary).reduce((a, b) => a + b, 0);
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
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold">Erreur de chargement</div>
            <div className="text-sm">{error}</div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={fetchDashboardData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
        </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Aucune donnée disponible
          </AlertDescription>
        </Alert>
        </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec statut de connexion */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Administratif</h1>
          <p className="text-muted-foreground">
            Dernière mise à jour: {lastUpdate ? lastUpdate.toLocaleTimeString('fr-FR') : '--:--:--'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isOnline 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchDashboardData}
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
          taux_occupation: dashboardData.taux_occupation || 0,
          revenu_journalier: dashboardData.revenu_journalier || 0,
          nb_clients: dashboardData.nb_clients || 0,
          nb_employes: dashboardData.nb_employes || 0,
          chambres_occupees: getSafeValue(dashboardData.chambres_summary, "Occupée", 0),
          total_chambres: getTotalChambres(),
          reservations_aujourd_hui: dashboardData.reservations_7_jours?.length ? dashboardData.reservations_7_jours[dashboardData.reservations_7_jours.length - 1]?.count : 0,
          paiements_aujourd_hui: dashboardData.paiements_7_jours?.length ? dashboardData.paiements_7_jours[dashboardData.paiements_7_jours.length - 1]?.montant : 0
        }}
      />

      {/* Tableau de bord analytique */}
      <AnalyticsDashboard
        data={{
          revenus_mensuels: dashboardData.revenus_mensuels || [],
          paiements_par_mode: dashboardData.paiements_par_mode || {},
          reservations_7_jours: dashboardData.reservations_7_jours || [],
          paiements_7_jours: dashboardData.paiements_7_jours || [],
          chambres_par_type: dashboardData.chambres_par_type || {},
          commandes_par_statut: dashboardData.commandes_par_statut || {},
          top_clients: dashboardData.top_clients || []
        }}
        onRefresh={fetchDashboardData}
        onExport={handleExport}
      />

      {/* Graphique des revenus */}
      <RevenueChart
        data={dashboardData.revenus_mensuels || []}
        title="Analyse des Revenus"
        description="Évolution des revenus sur les 6 derniers mois"
        variant="area"
        height={400}
      />

      {/* Indicateurs de performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticsCard
          title="Taux de conversion"
          value={`${(dashboardData.taux_conversion || 0).toFixed(1)}%`}
          subtitle="Réservations confirmées"
          variant="success"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatisticsCard
          title="Durée moyenne séjour"
          value={`${(dashboardData.duree_moyenne_sejour || 0).toFixed(1)} jours`}
          subtitle="Par réservation"
          variant="info"
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatisticsCard
          title="Montant moyen"
          value={`${(dashboardData.montant_moyen_reservation || 0).toLocaleString()} Ar`}
          subtitle="Par réservation"
          variant="warning"
          icon={<CreditCard className="h-5 w-5" />}
        />
        <StatisticsCard
          title="Revenu par chambre"
          value={`${(dashboardData.revenu_par_chambre || 0).toLocaleString()} Ar`}
          subtitle="Moyenne"
          variant="default"
          icon={<Building className="h-5 w-5" />}
          />
        </div>

      {/* Alertes et recommandations */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">Alertes et Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(dashboardData.taux_occupation || 0) < 50 && (
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <AlertTriangle className="h-4 w-4" />
                <span>Taux d'occupation faible ({(dashboardData.taux_occupation || 0).toFixed(1)}%) - Considérez des promotions</span>
              </div>
            )}
            {(dashboardData.taux_occupation || 0) > 90 && (
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="h-4 w-4" />
                <span>Excellent taux d'occupation ({(dashboardData.taux_occupation || 0).toFixed(1)}%) - Performance optimale</span>
              </div>
            )}
            {(dashboardData.revenu_journalier || 0) > (dashboardData.chiffre_affaire_mensuel || 0) / 30 && (
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <TrendingUp className="h-4 w-4" />
                <span>Revenu journalier élevé - Bonne performance commerciale</span>
              </div>
            )}
            {(dashboardData.pending_reservations || 0) > 10 && (
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <AlertTriangle className="h-4 w-4" />
                <span>{dashboardData.pending_reservations} réservations en attente - Traitement recommandé</span>
              </div>
            )}
        </div>
        </CardContent>
      </Card>

      {/* Résumé des chambres */}
      {dashboardData.chambres_summary && Object.keys(dashboardData.chambres_summary).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(dashboardData.chambres_summary).map(([etat, count], index) => (
            <StatisticsCard
              key={etat}
              title={`Chambres ${etat}`}
              value={count}
              subtitle={`${((count / getTotalChambres()) * 100).toFixed(1)}% du total`}
              variant={index === 0 ? "success" : index === 1 ? "warning" : index === 2 ? "info" : "default"}
              icon={<Building className="h-5 w-5" />}
            />
          ))}
        </div>
      )}
    </div>
  );
}
