"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { adminStatisticsAPI } from "@/lib/func/api/admin";
import { 
  Activity, TrendingUp, Users, Building, MapPin, 
  BarChart3, PieChart as PieChartIcon, Download, RefreshCw, Wifi, WifiOff,
  Hotel, Utensils, Globe, Calendar, Star, AlertTriangle,
  Plus, Target, Users2, Award, Eye, Filter, Search, ArrowUpRight,
  FileText, Share2, CalendarDays, TrendingDown, BarChart4, LineChart, CheckCircle, X
} from "lucide-react";
import { GrowthChart } from "@/components/admin/growth-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PieChart } from "@/components/admin/pie-chart";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EstablishmentGrowthCharts } from "@/components/admin/establishment-growth-charts";
import { WorldMapChart } from "@/components/admin/world-map-chart";
import { Loading } from "@/components/ui/loading";

interface PlatformStatistics {
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
    "Hotelerie": Array<{ mois: string; nouveaux_etablissements: number }>;
    "Restauration": Array<{ mois: string; nouveaux_etablissements: number }>;
    "Hotelerie et Restauration": Array<{ mois: string; nouveaux_etablissements: number }>;
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
  alertes: Array<{
    type: "info" | "warning" | "error" | "success";
    message: string;
  }>;
  performance_metrics: {
    taux_retention: number;
    temps_moyen_activation: number;
    satisfaction_moyenne: number;
    taux_resolution_support: number;
  };
  tendances_geographiques: Array<{
    region: string;
    croissance: number;
    etablissements: number;
    potentiel: number;
  }>;
}

export default function SuperAdminStatisticsPage() {
  const [stats, setStats] = useState<PlatformStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("vue_d'ensemble");
  const [selectedPeriod, setSelectedPeriod] = useState("30j");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [showNotification, setShowNotification] = useState(true);
  const [clientTime, setClientTime] = useState("--:--:--");
  const [worldMapData, setWorldMapData] = useState<any>(null);

  useEffect(() => {
    if (lastUpdate) setClientTime(lastUpdate.toLocaleTimeString('fr-FR'));
  }, [lastUpdate]);

  useEffect(() => {
    // Charger les données de la carte du monde
    const loadWorldMapData = async () => {
      try {
        const response = await fetch('/carte.json');
        const data = await response.json();
        setWorldMapData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données de la carte:', error);
        // Données de fallback en cas d'erreur
        setWorldMapData({
          total_clients: 12500000000,
          total_users: 8750000000,
          countries: [
            {
              country: "United States",
              clients: 2500000000,
              users: 1800000000,
              region: "North America",
              coordinates: [37.0902, -95.7129]
            },
            {
              country: "China",
              clients: 2200000000,
              users: 1600000000,
              region: "Asia",
              coordinates: [35.8617, 104.1954]
            },
            {
              country: "India",
              clients: 2000000000,
              users: 1500000000,
              region: "Asia",
              coordinates: [20.5937, 78.9629]
            },
            {
              country: "Brazil",
              clients: 2000000000,
              users: 1400000000,
              region: "South America",
              coordinates: [-14.235, -51.9253]
            },
            {
              country: "Madagascar",
              clients: 500000000,
              users: 350000000,
              region: "Africa",
              coordinates: [-18.7669, 46.8691]
            }
          ],
          regions: {
            "North America": { clients: 5500000000, users: 3800000000, growth: 8.5 },
            "South America": { clients: 4200000000, users: 3000000000, growth: 12.3 },
            "Europe": { clients: 9800000000, users: 7200000000, growth: 6.7 },
            "Asia": { clients: 11200000000, users: 8400000000, growth: 15.2 },
            "Africa": { clients: 3500000000, users: 2550000000, growth: 18.9 },
            "Oceania": { clients: 1300000000, users: 900000000, growth: 9.1 }
          },
          cdn_providers: {
            "Fastly": { enabled: true, clients: 7500000000, users: 5250000000 },
            "Cloudflare": { enabled: false, clients: 5000000000, users: 3500000000 }
          },
          time_periods: {
            quarter: "Q2 2024",
            month: "June 2024",
            week: "Week 24"
          }
        });
      }
    };
    
    loadWorldMapData();
  }, []);

  const fallbackStats: PlatformStatistics = {
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
    performance_metrics: {
      taux_retention: 85.2,
      temps_moyen_activation: 2.3,
      satisfaction_moyenne: 4.2,
      taux_resolution_support: 94.5,
    },
    tendances_geographiques: [
      { region: "Analamanga", croissance: 5, etablissements: 3, potentiel: 8 },
      { region: "Atsinanana", croissance: 3, etablissements: 2, potentiel: 7 },
    ],
  };

  const fetchStats = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    fetchStats();

    if (autoRefresh) {
      const interval = setInterval(fetchStats, 60000); // 1 minute
      return () => clearInterval(interval);
    }
  }, [fetchStats, autoRefresh, mounted]);

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

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    if (!stats) return;
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `rapport_statistiques_${timestamp}.${format}`;
    
    try {
      switch (format) {
        case 'csv':
          exportToCSV(stats, filename);
          break;
        case 'pdf':
          exportToPDF(stats, filename);
          break;
        case 'excel':
          exportToExcel(stats, filename);
          break;
      }
      toast.success(`Export ${format.toUpperCase()} terminé: ${filename}`);
    } catch (error) {
      console.error(`Erreur export ${format}:`, error);
      toast.error(`Erreur lors de l'export ${format.toUpperCase()}`);
    }
  };

  const exportToCSV = (data: PlatformStatistics, filename: string) => {
    const csvContent = generateCSVContent(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSVContent = (data: PlatformStatistics): string => {
    const headers = [
      "Métrique", "Valeur", "Date d'export"
    ];
    
    const rows = [
      ["Total établissements", data.total_etablissements.toString(), new Date().toISOString()],
      ["Hôtels", data.hotels.toString(), new Date().toISOString()],
      ["Restaurants", data.restaurants.toString(), new Date().toISOString()],
      ["Hôtel-Restaurants", data.hotel_restaurants.toString(), new Date().toISOString()],
      ["Taux d'adoption", `${data.taux_adoption?.toFixed(2) || 0}%`, new Date().toISOString()],
      ["Taux de croissance", `${data.taux_croissance?.toFixed(2) || 0}%`, new Date().toISOString()],
      ["Densité géographique", data.densite_geographique?.toString() || "0", new Date().toISOString()],
      ["Établissements récents (7j)", data.etablissements_recents_7_jours.toString(), new Date().toISOString()],
      ["Établissements récents (30j)", data.etablissements_recents_30_jours.toString(), new Date().toISOString()],
      ["Taux de rétention", `${data.performance_metrics?.taux_retention?.toFixed(1) || 0}%`, new Date().toISOString()],
      ["Satisfaction moyenne", `${data.performance_metrics?.satisfaction_moyenne?.toFixed(1) || 0}/5`, new Date().toISOString()],
      ["Résolution support", `${data.performance_metrics?.taux_resolution_support?.toFixed(1) || 0}%`, new Date().toISOString()],
      ["Temps d'activation", `${data.performance_metrics?.temps_moyen_activation?.toFixed(1) || 0}j`, new Date().toISOString()],
    ];

    // Ajouter les données par ville
    Object.entries(data.etablissements_par_ville || {}).forEach(([ville, count]) => {
      rows.push([`Établissements - ${ville}`, count.toString(), new Date().toISOString()]);
    });

    // Ajouter les données par statut
    Object.entries(data.etablissements_par_statut || {}).forEach(([statut, count]) => {
      rows.push([`Statut - ${statut}`, count.toString(), new Date().toISOString()]);
    });

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const exportToPDF = async (data: PlatformStatistics, filename: string) => {
    // Utilisation de jsPDF pour générer le PDF
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Titre
    doc.setFontSize(20);
    doc.text('Rapport Statistiques Plateforme', 20, 20);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
    
    // Métriques principales
    doc.setFontSize(16);
    doc.text('Métriques Principales', 20, 50);
    
    doc.setFontSize(12);
    let y = 60;
    doc.text(`Total établissements: ${data.total_etablissements}`, 20, y);
    y += 10;
    doc.text(`Hôtels: ${data.hotels}`, 20, y);
    y += 10;
    doc.text(`Restaurants: ${data.restaurants}`, 20, y);
    y += 10;
    doc.text(`Hôtel-Restaurants: ${data.hotel_restaurants}`, 20, y);
    y += 15;
    
    doc.text(`Taux d'adoption: ${data.taux_adoption?.toFixed(2) || 0}%`, 20, y);
    y += 10;
    doc.text(`Taux de croissance: ${data.taux_croissance?.toFixed(2) || 0}%`, 20, y);
    y += 15;
    
    // Performance
    doc.setFontSize(16);
    doc.text('Métriques de Performance', 20, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.text(`Taux de rétention: ${data.performance_metrics?.taux_retention?.toFixed(1) || 0}%`, 20, y);
    y += 10;
    doc.text(`Satisfaction moyenne: ${data.performance_metrics?.satisfaction_moyenne?.toFixed(1) || 0}/5`, 20, y);
    y += 10;
    doc.text(`Résolution support: ${data.performance_metrics?.taux_resolution_support?.toFixed(1) || 0}%`, 20, y);
    
    // Téléchargement
    doc.save(filename);
  };

  const exportToExcel = (data: PlatformStatistics, filename: string) => {
    // Utilisation de xlsx pour générer le fichier Excel
    import('xlsx').then((XLSX) => {
      const workbook = XLSX.utils.book_new();
      
      // Feuille 1: Métriques principales
      const mainData = [
        ['Métrique', 'Valeur'],
        ['Total établissements', data.total_etablissements],
        ['Hôtels', data.hotels],
        ['Restaurants', data.restaurants],
        ['Hôtel-Restaurants', data.hotel_restaurants],
        ['Taux d\'adoption', `${data.taux_adoption?.toFixed(2) || 0}%`],
        ['Taux de croissance', `${data.taux_croissance?.toFixed(2) || 0}%`],
        ['Densité géographique', data.densite_geographique || 0],
        ['Établissements récents (7j)', data.etablissements_recents_7_jours],
        ['Établissements récents (30j)', data.etablissements_recents_30_jours],
      ];
      
      const mainSheet = XLSX.utils.aoa_to_sheet(mainData);
      XLSX.utils.book_append_sheet(workbook, mainSheet, 'Métriques Principales');
      
      // Feuille 2: Performance
      const perfData = [
        ['Métrique', 'Valeur'],
        ['Taux de rétention', `${data.performance_metrics?.taux_retention?.toFixed(1) || 0}%`],
        ['Satisfaction moyenne', `${data.performance_metrics?.satisfaction_moyenne?.toFixed(1) || 0}/5`],
        ['Résolution support', `${data.performance_metrics?.taux_resolution_support?.toFixed(1) || 0}%`],
        ['Temps d\'activation', `${data.performance_metrics?.temps_moyen_activation?.toFixed(1) || 0}j`],
      ];
      
      const perfSheet = XLSX.utils.aoa_to_sheet(perfData);
      XLSX.utils.book_append_sheet(workbook, perfSheet, 'Performance');
      
      // Feuille 3: Répartition géographique
      const geoData = [
        ['Ville', 'Nombre d\'établissements']
      ];
      
      Object.entries(data.etablissements_par_ville || {}).forEach(([ville, count]) => {
        geoData.push([ville, count]);
      });
      
      const geoSheet = XLSX.utils.aoa_to_sheet(geoData);
      XLSX.utils.book_append_sheet(workbook, geoSheet, 'Répartition Géographique');
      
      // Téléchargement
      XLSX.writeFile(workbook, filename);
    });
  };

  const generateReport = () => {
    if (!stats) return;
    
    toast.success("Génération du rapport en cours...");
    
    // Générer un rapport PDF complet
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `rapport_complet_${timestamp}.pdf`;
    
    exportToPDF(stats, filename);
  };

  if (!mounted) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    <div className="p-6 space-y-8">
      {/* Header avec contrôles avancés */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vues globales</h1>
          {/* <p className="text-muted-foreground">Analyse approfondie et rapports détaillés</p> */}
          <p className="text-sm text-muted-foreground">
            Dernière mise à jour: {clientTime}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isOnline ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </div>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7j">7 jours</SelectItem>
              <SelectItem value="30j">30 jours</SelectItem>
              <SelectItem value="90j">90 jours</SelectItem>
              <SelectItem value="1a">1 an</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={!isOnline}>
            <RefreshCw className="h-4 w-4 mr-2" />Actualiser
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-2" />CSV
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />PDF
          </Button>
          
          <Button onClick={generateReport}>
            <Share2 className="h-4 w-4 mr-2" />Rapport
          </Button>
        </div>
      </div>

      {worldMapData ? (
        <WorldMapChart data={worldMapData} />
      ) : (
        <Card className="rounded-xl shadow-lg border-0">
          <Loading/>
        </Card>
      )}

      {/* Navigation par onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="vue_d'ensemble">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="growth">Croissance</TabsTrigger>
          <TabsTrigger value="geography">Géographie</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="vue_d'ensemble" className="space-y-6">
          {/* Graphiques principaux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Évolution Temporelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GrowthChart data={stats.croissance_mensuelle || []} title="Croissance sur 12 mois" />
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-primary" />
                  Répartition Détaillée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { label: "Hôtellerie", value: stats.hotels },
                    { label: "Restauration", value: stats.restaurants },
                    { label: "Hôtel-Restaurant", value: stats.hotel_restaurants },
                  ]}
                  title="Types d'Établissements"
                />
              </CardContent>
            </Card>
          </div>

          {/* Tableaux détaillés */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Établissements par Statut
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Statut</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Pourcentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(stats.etablissements_par_statut || {}).map(([statut, count]) => (
                      <TableRow key={statut}>
                        <TableCell>
                          <Badge variant={statut === "Activer" ? "default" : "secondary"}>
                            {statut}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{count}</TableCell>
                        <TableCell>
                          {((count / stats.total_etablissements) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Top 10 Villes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rang</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Établissements</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.top_villes?.slice(0, 10).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-bold">#{index + 1}</TableCell>
                        <TableCell>{item.ville}</TableCell>
                        <TableCell className="font-medium">{item.nb_etablissements}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          {/* Métriques de performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 rounded-xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Taux de rétention</p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      {stats.performance_metrics?.taux_retention?.toFixed(1) || 85.2}%
                    </p>
                    <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mt-2">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +2.1% vs mois dernier
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800 rounded-xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Satisfaction</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                      {stats.performance_metrics?.satisfaction_moyenne?.toFixed(1) || 4.2}/5
                    </p>
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400 mt-2">
                      <Star className="h-4 w-4 mr-1" />
                      +0.3 vs mois dernier
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800 rounded-xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Résolution support</p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                      {stats.performance_metrics?.taux_resolution_support?.toFixed(1) || 94.5}%
                    </p>
                    <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 mt-2">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      +1.2% vs mois dernier
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800 rounded-xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Temps d'activation</p>
                    <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                      {stats.performance_metrics?.temps_moyen_activation?.toFixed(0) || 2.3}j
                    </p>
                    <div className="flex items-center text-sm text-orange-600 dark:text-orange-400 mt-2">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      -0.5j vs mois dernier
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <EstablishmentGrowthCharts data={stats.croissance_par_type} />
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Répartition Géographique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.etablissements_par_pays || {}).map(([pays, count]) => (
                    <div key={pays} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{pays}</span>
                      <Badge variant="outline">{count} établissements</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Tendances Régionales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Région</TableHead>
                      <TableHead>Croissance</TableHead>
                      <TableHead>Potentiel</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.tendances_geographiques?.map((tendance, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{tendance.region}</TableCell>
                        <TableCell>
                          <Badge variant={tendance.croissance > 0 ? "default" : "secondary"}>
                            {tendance.croissance > 0 ? '+' : ''}{tendance.croissance}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tendance.potentiel}/10</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Métriques de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div>
                      <p className="font-medium">Taux de rétention</p>
                      <p className="text-sm text-muted-foreground">Établissements actifs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stats.performance_metrics?.taux_retention?.toFixed(1) || 85.2}%</p>
                      <p className="text-sm text-green-600">+2.1%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div>
                      <p className="font-medium">Satisfaction moyenne</p>
                      <p className="text-sm text-muted-foreground">Note utilisateurs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stats.performance_metrics?.satisfaction_moyenne?.toFixed(1) || 4.2}/5</p>
                      <p className="text-sm text-green-600">+0.3</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div>
                      <p className="font-medium">Résolution support</p>
                      <p className="text-sm text-muted-foreground">Tickets résolus</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stats.performance_metrics?.taux_resolution_support?.toFixed(1) || 94.5}%</p>
                      <p className="text-sm text-green-600">+1.2%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Inscriptions par Jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.inscriptions_par_jour?.slice(-7).map((inscription, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{inscription.date}</span>
                      <Badge variant="outline">{inscription.inscriptions} inscriptions</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="rounded-xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Génération de Rapports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-32 flex-col" onClick={() => handleExport('pdf')}>
                  <FileText className="h-8 w-8 mb-2" />
                  <span>Rapport PDF</span>
                  <span className="text-xs text-muted-foreground">Rapport détaillé</span>
                </Button>
                
                <Button variant="outline" className="h-32 flex-col" onClick={() => handleExport('csv')}>
                  <Download className="h-8 w-8 mb-2" />
                  <span>Export CSV</span>
                  <span className="text-xs text-muted-foreground">Données brutes</span>
                </Button>
                
                <Button variant="outline" className="h-32 flex-col" onClick={generateReport}>
                  <Share2 className="h-8 w-8 mb-2" />
                  <span>Rapport complet</span>
                  <span className="text-xs text-muted-foreground">Analyse approfondie</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alertes et recommandations */}
      {stats.alertes && stats.alertes.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes et Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.alertes.map((alerte, index) => (
                <div key={index} className={`flex items-center gap-2 ${
                  alerte.type === 'warning' ? 'text-orange-700 dark:text-orange-300' :
                  alerte.type === 'error' ? 'text-red-700 dark:text-red-300' :
                  alerte.type === 'success' ? 'text-green-700 dark:text-green-300' :
                  'text-blue-700 dark:text-blue-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    alerte.type === 'warning' ? 'bg-orange-500' :
                    alerte.type === 'error' ? 'bg-red-500' :
                    alerte.type === 'success' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}></div>
                  <span>{alerte.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
