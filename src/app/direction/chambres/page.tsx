"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getStoredUser } from "@/lib/func/api/auth";
import { getChambres, createChambre, updateChambre, deleteChambre, getChambreStats } from "@/lib/func/api/etablissement/chambre";
import ChambreForm, { ChambreFormData } from "@/components/form/chambreForm";
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, 
  Bed, Building, Users, Target, TrendingUp, CheckCircle,
  AlertTriangle, Clock, Star, Award, Settings, Download, RefreshCw, FileText,
  BarChart3, PieChart, Activity, Calendar, Filter as FilterIcon, 
  ChevronDown, ChevronUp, ExternalLink, Copy, Share2, Archive, 
  AlertCircle, Info, Zap, Shield, Globe2, Map, Database, Briefcase,
  UserCheck, UserX, UserPlus, GraduationCap, Crown, Wrench,
  Home, Hotel, MapPin, DollarSign, Tag, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

interface Chambre {
  id: number;
  numero: string;
  categorie: string;
  tarif: number;
  description?: string;
  photo_url?: string;
  etat: string;
  etablissement_id: number;
  date_creation: string;
  date_mise_a_jour: string;
}



export default function ChambrePage() {
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [currentEtablissement, setCurrentEtablissement] = useState<{id: number, nom: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingChambre, setEditingChambre] = useState<Chambre | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedChambres, setSelectedChambres] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards" | "analytics">("table");
  const [statistics, setStatistics] = useState<any>(null);
  const [exporting, setExporting] = useState(false);

  // Données de démonstration
  const getFallbackChambres = (etablissementId: number) => [
    { 
      id: 1, 
      numero: "101", 
      categorie: "Standard", 
      tarif: 50000, 
      description: "Chambre standard avec vue sur la ville",
      photo_url: "/images/chambre-101.jpg",
      etat: "Libre", 
      etablissement_id: etablissementId,
      date_creation: "2024-01-15", 
      date_mise_a_jour: "2024-01-15" 
    },
    { 
      id: 2, 
      numero: "102", 
      categorie: "Deluxe", 
      tarif: 75000, 
      description: "Chambre deluxe avec balcon",
      photo_url: "/images/chambre-102.jpg",
      etat: "Occupée", 
      etablissement_id: etablissementId,
      date_creation: "2024-01-15", 
      date_mise_a_jour: "2024-01-15" 
    },
    { 
      id: 3, 
      numero: "201", 
      categorie: "Suite", 
      tarif: 120000, 
      description: "Suite spacieuse avec salon séparé",
      photo_url: "/images/suite-201.jpg",
      etat: "Libre", 
      etablissement_id: etablissementId,
      date_creation: "2024-01-15", 
      date_mise_a_jour: "2024-01-15" 
    },
    { 
      id: 4, 
      numero: "202", 
      categorie: "Familiale", 
      tarif: 60000, 
      description: "Chambre familiale avec vue jardin",
      photo_url: "/images/chambre-202.jpg",
      etat: "En maintenance", 
      etablissement_id: etablissementId,
      date_creation: "2024-01-15", 
      date_mise_a_jour: "2024-01-15" 
    },
  ];

  // Récupérer l'établissement connecté
  useEffect(() => {
    const user = getStoredUser();
    console.log("🔍 Données utilisateur stockées:", user);
    
    if (user) {
      const etabId = user.etablissement_id || user.id || user.etablissementId || user.establishment_id || user.sub;
      const etabNom = user.nom || user.name || user.email || "Mon établissement";
      
      console.log("🔍 ID établissement trouvé:", etabId);
      console.log("🔍 Nom établissement trouvé:", etabNom);
      
      if (etabId) {
        setCurrentEtablissement({
          id: etabId,
          nom: etabNom
        });
      } else {
        console.error("❌ Aucun ID d'établissement trouvé dans les données utilisateur");
        if (user.role === "Etablissement" && user.sub) {
          console.log("🔄 Solution temporaire : utilisation de user.sub comme ID d'établissement");
          setCurrentEtablissement({
            id: user.sub,
            nom: etabNom
          });
        }
      }
    } else {
      console.error("❌ Aucun utilisateur trouvé dans le localStorage");
    }
  }, []);

  const fetchChambres = async () => {
    if (!currentEtablissement) return;
    
    try {
      setLoading(true);
      const data = await getChambres(currentEtablissement.id);
      setChambres(data.chambres || getFallbackChambres(currentEtablissement.id));
    } catch (error) {
      setChambres(getFallbackChambres(currentEtablissement?.id || 1));
      toast.error("API indisponible, affichage des chambres de démonstration");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    if (!currentEtablissement) return;
    
    try {
      const statsData = await getChambreStats(currentEtablissement.id);
      setStatistics(statsData);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      // Statistiques de démonstration en cas d'erreur
      setStatistics({
        total: chambres.length,
        libres: chambres.filter(c => c.etat === "Libre").length,
        occupees: chambres.filter(c => c.etat === "Occupée").length,
        maintenance: chambres.filter(c => c.etat === "En maintenance").length,
        taux_occupation: ((chambres.filter(c => c.etat === "Occupée").length / chambres.length) * 100).toFixed(1)
      });
    }
  };

  useEffect(() => {
    if (currentEtablissement) {
      fetchChambres();
      fetchStatistics();
    }
  }, [currentEtablissement]);

  const handleCreate = async (data: ChambreFormData) => {
    if (!currentEtablissement) {
      toast.error("Établissement non identifié");
      return;
    }

    try {
      console.log("🔧 Création chambre - Données reçues:", data);
      
      await createChambre({
        ...data,
        id_etablissement: currentEtablissement.id
      });
      
      setIsCreateDialogOpen(false);
      toast.success("Chambre créée avec succès");
      fetchChambres();
      fetchStatistics();
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Erreur lors de la création de la chambre");
    }
  };

  const handleEdit = async (data: ChambreFormData) => {
    if (!editingChambre || !currentEtablissement) return;

    try {
      console.log("🔧 Modification chambre - Données reçues:", data);
      
      // Le backend exige TOUS les champs pour la modification, y compris id_etablissement
      const updateData = {
        ...data,
        id_etablissement: currentEtablissement.id
      };
      
      await updateChambre(editingChambre.id, updateData);
      
      setIsEditDialogOpen(false);
      setEditingChambre(null);
      toast.success("Chambre modifiée avec succès");
      fetchChambres();
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error("Erreur lors de la modification de la chambre");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteChambre(id);
      toast.success("Chambre supprimée avec succès");
      fetchChambres();
      fetchStatistics();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de la chambre");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedChambres.map(id => deleteChambre(id)));
      setSelectedChambres([]);
      toast.success(`${selectedChambres.length} chambre(s) supprimée(s) avec succès`);
      fetchChambres();
      fetchStatistics();
    } catch (error) {
      console.error("Erreur lors de la suppression en lot:", error);
      toast.error("Erreur lors de la suppression en lot");
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    if (!chambres.length) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    setExporting(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `chambres_${timestamp}.${format}`;
      
      if (format === 'csv') {
        const csvContent = generateCSVContent(chambres);
        downloadFile(csvContent, filename, 'text/csv');
      } else {
        const jsonContent = JSON.stringify(chambres, null, 2);
        downloadFile(jsonContent, filename, 'application/json');
      }
      
      toast.success(`Export ${format.toUpperCase()} terminé: ${filename}`);
    } catch (error) {
      console.error(`Erreur export ${format}:`, error);
      toast.error(`Erreur lors de l'export ${format.toUpperCase()}`);
    } finally {
      setExporting(false);
    }
  };

  const generateCSVContent = (data: Chambre[]): string => {
    const headers = ["ID", "Numéro", "Catégorie", "Tarif", "État", "Description", "Date création"];
    const rows = data.map(chambre => [
      chambre.id,
      chambre.numero,
      chambre.categorie,
      chambre.tarif,
      chambre.etat,
      chambre.description || "",
      chambre.date_creation
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSelectAll = () => {
    if (selectedChambres.length === chambres.length) {
      setSelectedChambres([]);
    } else {
      setSelectedChambres(chambres.map(c => c.id));
    }
  };

  const handleSelectChambre = (id: number) => {
    setSelectedChambres(prev => 
      prev.includes(id) 
        ? prev.filter(chambreId => chambreId !== id)
        : [...prev, id]
    );
  };

  const openEditDialog = (chambre: Chambre) => {
    setEditingChambre(chambre);
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Libre":
        return <Badge variant="default" className="bg-green-100 text-green-800">Libre</Badge>;
      case "Occupée":
        return <Badge variant="destructive">Occupée</Badge>;
      case "En maintenance":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Maintenance</Badge>;
      case "Réservée":
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Réservée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Standard":
        return <Badge variant="outline" className="border-gray-500 text-gray-700">Standard</Badge>;
      case "Deluxe":
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Deluxe</Badge>;
      case "Suite":
        return <Badge variant="outline" className="border-purple-500 text-purple-700">Suite</Badge>;
      case "Familiale":
        return <Badge variant="outline" className="border-green-500 text-green-700">Familiale</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const filteredChambres = chambres.filter(chambre => {
    const matchesSearch = chambre.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chambre.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || chambre.categorie === selectedCategory;
    const matchesStatus = selectedStatus === "all" || chambre.etat === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const uniqueCategories = [...new Set(chambres.map(c => c.categorie))];
  const uniqueStatuses = [...new Set(chambres.map(c => c.etat))];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full min-w-0 max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Chambres</h1>
          <p className="text-muted-foreground">
            Gérez les chambres de votre établissement : <strong>{currentEtablissement?.nom}</strong>
          </p>
          <p className="text-sm text-blue-600 mt-1">
            <Info className="h-4 w-4 inline mr-1" />
            Interface de direction pour la gestion des chambres
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchChambres();
              fetchStatistics();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle chambre
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                </div>
                <Bed className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Libres</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.libres}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupées</p>
                  <p className="text-2xl font-bold text-red-600">{statistics.occupees}</p>
                </div>
                <UserCheck className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taux occupation</p>
                  <p className="text-2xl font-bold text-purple-600">{statistics.taux_occupation}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres et actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Recherche */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher une chambre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtres de base */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Bouton filtres avancés */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                Filtres avancés
                {showAdvancedFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
            </div>

            {/* Actions en lot */}
            {selectedChambres.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedChambres.length} sélectionnée(s)
                </Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mode d'affichage et exports */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <TabsList>
              <TabsTrigger value="table">Tableau</TabsTrigger>
              <TabsTrigger value="cards">Cartes</TabsTrigger>
              <TabsTrigger value="analytics">Analyses</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('csv')} disabled={exporting}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')} disabled={exporting}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedChambres.length === chambres.length && chambres.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Tarif</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChambres.map((chambre) => (
                    <TableRow key={chambre.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedChambres.includes(chambre.id)}
                          onCheckedChange={() => handleSelectChambre(chambre.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{chambre.numero}</TableCell>
                      <TableCell>{getCategoryBadge(chambre.categorie)}</TableCell>
                      <TableCell>{chambre.tarif.toLocaleString()} Ar</TableCell>
                      <TableCell>{getStatusBadge(chambre.etat)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {chambre.description || "Aucune description"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(chambre)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(chambre.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredChambres.map((chambre) => (
              <Card key={chambre.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">Chambre {chambre.numero}</h3>
                    {getStatusBadge(chambre.etat)}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Catégorie:</span>
                      {getCategoryBadge(chambre.categorie)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tarif:</span>
                      <span className="font-semibold">{chambre.tarif.toLocaleString()} Ar</span>
                    </div>
                  </div>
                  
                  {chambre.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {chambre.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => openEditDialog(chambre)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(chambre.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uniqueCategories.map(category => {
                    const count = chambres.filter(c => c.categorie === category).length;
                    const percentage = ((count / chambres.length) * 100).toFixed(1);
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{category}</span>
                          <span>{count} chambres ({percentage}%)</span>
                        </div>
                        <Progress value={parseFloat(percentage)} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uniqueStatuses.map(status => {
                    const count = chambres.filter(c => c.etat === status).length;
                    const percentage = ((count / chambres.length) * 100).toFixed(1);
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{status}</span>
                          <span>{count} chambres ({percentage}%)</span>
                        </div>
                        <Progress value={parseFloat(percentage)} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de création */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle chambre</DialogTitle>
          </DialogHeader>
          <ChambreForm 
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
            submitLabel="Créer la chambre"
            cancelLabel="Annuler"
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la chambre</DialogTitle>
          </DialogHeader>
          <ChambreForm 
            onSubmit={handleEdit}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingChambre(null);
            }}
            initialData={editingChambre ? {
              numero: editingChambre.numero,
              categorie: editingChambre.categorie,
              tarif: editingChambre.tarif.toString(),
              description: editingChambre.description || "",
              photo_url: editingChambre.photo_url || ""
            } : undefined}
            submitLabel="Modifier la chambre"
            cancelLabel="Annuler"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

 