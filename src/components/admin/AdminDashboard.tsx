"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Building,
  Users,
  CreditCard,
  TrendingUp,
  Calendar,
  Activity,
  DollarSign,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  AlertTriangle,
  Info,
  MapPin,
  Clock,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  UserPlus,
  Rocket
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminStatisticsAPI } from "@/lib/func/api/admin";
import { PlatformMetrics } from "./PlatformMetrics";
import { RealTimeActivity } from "./RealTimeActivity";
import { AdvancedCharts } from "./AdvancedCharts";
import { QuickStats } from "./QuickStats";
import { UserAccountsChart } from "./UserAccountsChart";
import { getStatTypeEtab, getNbrAllClient, getNbrAllStatus, getNbrAllEtab } from "@/lib/func/api/superAdmin/bord";

interface AdminStats {
  total_etablissements: number;
  hotels: number;
  restaurants: number;
  hotel_restaurants: number;
  etablissements_par_ville: { [key: string]: number };
  etablissements_par_statut: { [key: string]: number };
  etablissements_par_pays: { [key: string]: number };
  etablissements_recents_30_jours: number;
  etablissements_recents_7_jours: number;
  croissance_mensuelle: Array<{ mois: string; nouveaux_etablissements: number }>;
  croissance_par_type: {
    [key: string]: Array<{ mois: string; nouveaux_etablissements: number }>;
  };
  taux_adoption: number;
  taux_croissance: number;
  densite_geographique: number;
  etablissements_recents: Array<{
    nom: string;
    ville: string;
    type: string;
    statut: string;
    date_creation: string;
    email: string;
  }>;
  top_villes: Array<{ ville: string; nb_etablissements: number }>;
  inscriptions_par_jour: Array<{ date: string; inscriptions: number }>;
  alertes: Array<{ type: string; message: string }>;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [etabStats, setEtabStats] = useState({ nombre_hotelerie: 0, nombre_restauration: 0, nombre_Hotel_et_restauration: 0 });
  const [clientCount, setClientCount] = useState(0);
  const [accountStatus, setAccountStatus] = useState({ nombre_active: 0, nombre_inactive: 0, nombre_suspendu: 0, nombre_total: 0 });
  const [etabStatus, setEtabStatus] = useState({ actifs: 0, inactifs: 0, total: 0 });

  const fallbackStats: AdminStats = {
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

  const fetchStats = async () => {
    try {
      setError(null);
      const data = await adminStatisticsAPI.getStatistics();
      setStats(data && Object.keys(data).length > 0 ? data : fallbackStats);
      if (typeof window !== 'undefined') {
        setLastUpdate(new Date());
      }
      toast.success("Données actualisées");
    } catch (err: any) {
      setStats(fallbackStats);
      setError("Affichage des données de démonstration (API indisponible)");
      toast.error("API indisponible, affichage des données de démonstration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    // Charger les stats d'établissements
    getStatTypeEtab().then((data) => {
      setEtabStats(data);
    }).catch(() => {});
    // Charger le nombre de clients
    getNbrAllClient().then((data) => {
      setClientCount(data.nombre_client || 0);
    }).catch(() => {});
    // Charger le statut des comptes
    getNbrAllStatus().then((data) => {
      setAccountStatus(data);
    }).catch(() => {});
    // Charger le statut des établissements
    getNbrAllEtab().then((data) => {
      const total = data.nombre_etablissement || 0;
      // Supposons que 80% sont actifs et 20% inactifs
      setEtabStatus({
        actifs: Math.round(total * 0.8),
        inactifs: Math.round(total * 0.2),
        total: total
      });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [mounted]);

  useEffect(() => {
    const checkOnline = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      if (!online) toast.error("Connexion perdue");
      else toast.success("Connexion rétablie");
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
    if (!stats) return;
    const headers = ["Métrique", "Valeur", "Date d'export"];
    const rows = [
      ["Établissements", stats.total_etablissements, new Date().toISOString()],
      ["Hôtels", stats.hotels, new Date().toISOString()],
      ["Restaurants", stats.restaurants, new Date().toISOString()],
      ["Hôtels-Restaurants", stats.hotel_restaurants, new Date().toISOString()],
      ["Nouveaux (30j)", stats.etablissements_recents_30_jours, new Date().toISOString()],
      ["Taux d'adoption", stats.taux_adoption + "%", new Date().toISOString()],
      ["Taux de croissance", stats.taux_croissance + "%", new Date().toISOString()],
    ];
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `admin_dashboard_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export terminé");
  };

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold">Erreur de chargement</div>
            <div className="text-sm">{error}</div>
            <Button variant="outline" size="sm" className="mt-2" onClick={fetchStats}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) {
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
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Dashboard Super Admin
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Dernière mise à jour: {lastUpdate && typeof window !== 'undefined' ? lastUpdate.toLocaleTimeString('fr-FR') : '--:--:--'}
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
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={!isOnline}>
            <RefreshCw className="h-4 w-4 mr-2" />Actualiser
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />Exporter
          </Button>
        </div>
      </div>

      {/* CARDS STATS COLORÉES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* nombre_etablissement */}
        <MetricCard 
          title="Etablissement" 
          value={
            (etabStats.nombre_hotelerie + etabStats.nombre_restauration + etabStats.nombre_Hotel_et_restauration).toString()
          }
          subtitle=""
          icon={<DollarSign className="h-6 w-6 text-pink-500" />} 
          color="bg-pink-100 text-pink-700" 
          trend=""
        />

        {/* nombre_client */}
        <MetricCard 
          title="Clients" 
          value={clientCount.toString()}
          subtitle=""
          icon={<Users className="h-6 w-6 text-green-500" />} 
          color="bg-green-100 text-green-700" 
          trend=""
        />
        <MetricCard 
          title="Evolution dans 24 heures" 
          value={stats.taux_adoption.toString() +"%"}
          subtitle="" 
          icon={<UserPlus className="h-6 w-6 text-orange-500" />} 
          color="bg-orange-100 text-orange-700" 
          trend=""
        />
        <MetricCard 
          title="Moyen de paiement" 
          value="$103,430" 
          subtitle="+5%" 
          icon={<TrendingUp className="h-6 w-6 text-blue-500" />} 
          color="bg-blue-100 text-blue-700" 
          trend="+5%"
        />
      </div>

      {/* GRAPHIQUES CÔTE À CÔTE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <UserAccountsChart 
            data={{
              clients: {
                nombre_active: accountStatus.nombre_active || 0,
                nombre_inactive: accountStatus.nombre_inactive || 0,
                nombre_suspendu: accountStatus.nombre_suspendu || 0,
                nombre_total: accountStatus.nombre_total || 0
              },
              etablissements: {
                nombre_hotelerie: etabStats.nombre_hotelerie || 0,
                nombre_restauration: etabStats.nombre_restauration || 0,
                nombre_Hotel_et_restauration: etabStats.nombre_Hotel_et_restauration || 0,
                total: etabStatus.total || 0,
                actifs: etabStatus.actifs || 0,
                inactifs: etabStatus.inactifs || 0
              }
            }} 
          />
        </div>
        {/* Notifications recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">30 derniers jours</span>
                </div>
                <Badge variant="default" className="bg-green-500">
                  +{stats.etablissements_recents_30_jours}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">7 derniers jours</span>
                </div>
                <Badge variant="default" className="bg-blue-500">
                  +{stats.etablissements_recents_7_jours}
                </Badge>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {((stats.etablissements_recents_7_jours / 7) * 30).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Projetion mensuelle
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métriques de la plateforme */}
      <PlatformMetrics stats={stats} />

      {/* Widgets rapides */}
      <QuickStats stats={stats} />

      {/* Onglets pour différentes vues */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="geography">Géographie</TabsTrigger>
          <TabsTrigger value="growth">Croissance</TabsTrigger>
          <TabsTrigger value="recent">Récent</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition par type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Répartition par type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Hôtellerie</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{stats.hotels}</span>
                      <Progress value={(stats.hotels / stats.total_etablissements) * 100} className="w-20" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>Restauration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{stats.restaurants}</span>
                      <Progress value={(stats.restaurants / stats.total_etablissements) * 100} className="w-20" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Hôtellerie & Restauration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{stats.hotel_restaurants}</span>
                      <Progress value={(stats.hotel_restaurants / stats.total_etablissements) * 100} className="w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top villes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Top villes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.top_villes.slice(0, 5).map((ville, index) => (
                    <div key={ville.ville} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span>{ville.ville}</span>
                      </div>
                      <span className="font-semibold">{ville.nb_etablissements} établissements</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Carte de densité géographique */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Densité géographique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-primary">
                    {stats.densite_geographique.toFixed(1)}
                  </div>
                  <p className="text-muted-foreground">
                    Établissements par ville en moyenne
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">{Object.keys(stats.etablissements_par_ville).length}</div>
                      <div className="text-muted-foreground">Villes</div>
                    </div>
                    <div>
                      <div className="font-semibold">{stats.total_etablissements}</div>
                      <div className="text-muted-foreground">Établissements</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Répartition par pays */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Répartition par pays
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.etablissements_par_pays).map(([pays, count]) => (
                    <div key={pays} className="flex items-center justify-between">
                      <span>{pays}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Croissance mensuelle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Croissance mensuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.croissance_mensuelle.slice(-6).map((item) => (
                    <div key={item.mois} className="flex items-center justify-between">
                      <span>{item.mois}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.nouveaux_etablissements}</span>
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${(item.nouveaux_etablissements / Math.max(...stats.croissance_mensuelle.map(x => x.nouveaux_etablissements))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Métriques de croissance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Métriques de croissance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.taux_croissance.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Taux de croissance</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.taux_adoption.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Taux d'adoption</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.etablissements_recents_7_jours}
                    </div>
                    <p className="text-sm text-muted-foreground">Nouveaux (7 jours)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Établissements récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.etablissements_recents.map((etab, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{etab.nom}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {etab.ville}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={etab.statut === "Activer" ? "default" : "secondary"}>
                        {etab.statut}
                      </Badge>
                      <Badge variant="outline">{etab.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Graphiques avancés */}
      <AdvancedCharts data={stats} />

      {/* Activité en temps réel */}
      <RealTimeActivity stats={stats} />

      {/* Alertes */}
      {stats.alertes && stats.alertes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Alertes et Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.alertes.map((alerte, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{alerte.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Composant pour les métriques avec animations
function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  color 
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}) {
  // Correction: trend doit toujours être une string définie
  const safeTrend = typeof trend === 'string' ? trend : '';
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-full ${color} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
        {(safeTrend !== "0%" && safeTrend !== "") && (
          <div className="mt-2 flex items-center gap-1">
            <TrendingUp className={`h-3 w-3 ${safeTrend.includes('+') ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs ${safeTrend.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
              {safeTrend.includes('+') ? '+' : ''}{safeTrend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Skeleton pour le chargement
function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-80" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </div>
  );
} 