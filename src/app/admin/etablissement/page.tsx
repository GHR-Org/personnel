"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { getEtablissements, createEtablissement, updateEtablissement, deleteEtablissement, updateEtablissementStatus, getEtablissementStats, getTotalEtablissements } from "@/lib/func/api/superAdmin/etablissement";
import { 
  Building, Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, 
  MapPin, Mail, Phone, Globe, Users, Target, TrendingUp, CheckCircle,
  AlertTriangle, Clock, Star, Award, Settings, Download, RefreshCw, FileText,
  BarChart3, PieChart, Activity, Calendar, Filter as FilterIcon, 
  ChevronDown, ChevronUp, ExternalLink, Copy, Share2, Archive, 
  AlertCircle, Info, Zap, Shield, Globe2, Map, Database
} from "lucide-react";
import { EtablissementForm } from "@/components/form/EtablissementForm";
import { Etablissement, EtablissementFormData } from "@/types/etablissement";
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
import { ApiDiagnostic } from "@/components/admin/ApiDiagnostic";

export default function EtablissementPage() {
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEtablissement, setEditingEtablissement] = useState<Etablissement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedEtablissements, setSelectedEtablissements] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards" | "analytics">("table");
  const [statistics, setStatistics] = useState<any>(null);
  const [exporting, setExporting] = useState(false);
  // Ajout pour hydration safe : dates formatées côté client
  const [createdDates, setCreatedDates] = useState<{[id:number]: string}>({});

  const fallbackEtablissements = [
    { id: 1, nom: "Hotel Tana", ville: "Antananarivo", pays: "Madagascar", type_: "HOTELERIE", statut: "Activer", email: "contact@hoteltana.mg", telephone: "0341234567", created_at: "2024-05-01", adresse: "", updated_at: "2024-05-01" },
    { id: 2, nom: "Restaurant Océan", ville: "Toamasina", pays: "Madagascar", type_: "RESTAURATION", statut: "Activer", email: "info@oceantoamasina.mg", telephone: "0349876543", created_at: "2024-05-03", adresse: "", updated_at: "2024-05-03" },
    { id: 3, nom: "Majunga Palace", ville: "Mahajanga", pays: "Madagascar", type_: "HOTELERIE_RESTAURATION", statut: "Inactive", email: "majunga@palace.mg", telephone: "0341122334", created_at: "2024-04-15", adresse: "", updated_at: "2024-04-15" },
  ];

  const fetchEtablissements = async () => {
    try {
      setLoading(true);
      const data = await getEtablissements();
      setEtablissements((data.etablissements || data) && (data.etablissements || data).length > 0 ? (data.etablissements || data) : fallbackEtablissements);
    } catch (error: any) {
      setEtablissements(fallbackEtablissements);
      console.error("Erreur API:", error);
      
      // Message d'erreur plus détaillé
      if (error.code === 'ECONNREFUSED') {
        toast.error("Serveur backend non accessible. Vérifiez que le serveur est démarré sur http://localhost:8000");
      } else if (error.response?.status === 404) {
        toast.error("Endpoint API non trouvé. Vérifiez la configuration du backend");
      } else if (error.response?.status >= 500) {
        toast.error("Erreur serveur backend. Vérifiez les logs du serveur");
      } else {
        toast.error("API indisponible, affichage des établissements de démonstration");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const [statsData, totalData] = await Promise.all([
        getEtablissementStats(),
        getTotalEtablissements()
      ]);
      
      setStatistics({
        total: totalData.nombre_etablissement,
        hotelerie: statsData.nombre_hotelerie,
        restauration: statsData.nombre_restauration,
        mixte: statsData.nombre_Hotel_et_restauration
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      // Utiliser les données des établissements locaux comme fallback
      const localStats = {
        total: etablissements.length,
        hotelerie: etablissements.filter(e => e.type_ === "HOTELERIE").length,
        restauration: etablissements.filter(e => e.type_ === "RESTAURATION").length,
        mixte: etablissements.filter(e => e.type_ === "HOTELERIE_RESTAURATION").length
      };
      setStatistics(localStats);
    }
  };

  const handleCreate = async (data: EtablissementFormData) => {
    try {
      await createEtablissement(data);
      setIsCreateDialogOpen(false);
      fetchEtablissements();
      fetchStatistics();
      toast.success("Établissement créé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la création");
      console.error(error);
    }
  };

  const handleEdit = async (data: EtablissementFormData) => {
    if (!editingEtablissement) return;
    
    try {
      await updateEtablissement(editingEtablissement.id, data);
      setIsEditDialogOpen(false);
      setEditingEtablissement(null);
      fetchEtablissements();
      fetchStatistics();
      toast.success("Établissement modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEtablissement(id);
      fetchEtablissements();
      fetchStatistics();
      toast.success("Établissement supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "Activer" ? "Inactive" : "Activer";
      await updateEtablissementStatus(id, newStatus);
      fetchEtablissements();
      fetchStatistics();
      toast.success(`Établissement ${newStatus === "Activer" ? "activé" : "désactivé"} avec succès`);
    } catch (error) {
      toast.error("Erreur lors de la modification du statut");
      console.error(error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEtablissements.length === 0) {
      toast.error("Aucun établissement sélectionné");
      return;
    }

    try {
      for (const id of selectedEtablissements) {
        await deleteEtablissement(id);
      }
      setSelectedEtablissements([]);
      fetchEtablissements();
      fetchStatistics();
      toast.success(`${selectedEtablissements.length} établissements supprimés avec succès`);
    } catch (error) {
      toast.error("Erreur lors de la suppression en lot");
      console.error(error);
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true);
      
      // Export simple des données actuelles
      const data = filteredEtablissements.map(etab => ({
        id: etab.id,
        nom: etab.nom,
        type: etab.type_,
        ville: etab.ville,
        pays: etab.pays,
        email: etab.email,
        telephone: etab.telephone,
        statut: etab.statut,
        date_creation: etab.created_at
      }));
      
      if (format === 'csv') {
        const headers = ['ID', 'Nom', 'Type', 'Ville', 'Pays', 'Email', 'Téléphone', 'Statut', 'Date création'];
        const csvContent = [headers, ...data.map(row => [
          row.id, row.nom, row.type, row.ville, row.pays, row.email, row.telephone, row.statut, row.date_creation
        ])].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `etablissements_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `etablissements_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      toast.success(`Export ${format.toUpperCase()} terminé: ${data.length} établissements`);
    } catch (error) {
      toast.error(`Erreur lors de l'export ${format.toUpperCase()}`);
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedEtablissements.length === filteredEtablissements.length) {
      setSelectedEtablissements([]);
    } else {
      setSelectedEtablissements(filteredEtablissements.map(etab => etab.id));
    }
  };

  const handleSelectEtablissement = (id: number) => {
    setSelectedEtablissements(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const openEditDialog = (etablissement: Etablissement) => {
    setEditingEtablissement(etablissement);
    setIsEditDialogOpen(true);
  };

  const filteredEtablissements = etablissements.filter(etab => {
    const matchesSearch = etab.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         etab.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         etab.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || etab.type_ === selectedType;
    const matchesStatus = selectedStatus === "all" || etab.statut === selectedStatus;
    const matchesCity = selectedCity === "all" || etab.ville === selectedCity;
    
    return matchesSearch && matchesType && matchesStatus && matchesCity;
  });

  const uniqueCities = [...new Set(etablissements.map(etab => etab.ville))].sort();

  useEffect(() => {
    fetchEtablissements();
    fetchStatistics();
  }, []);

  useEffect(() => {
    const dates: {[id:number]: string} = {};
    etablissements.forEach(e => {
      dates[e.id] = new Date(e.created_at).toLocaleDateString('fr-FR');
    });
    setCreatedDates(dates);
  }, [etablissements]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "HOTELERIE": return <Building className="h-4 w-4" />;
      case "RESTAURATION": return <Globe className="h-4 w-4" />;
      case "HOTELERIE_RESTAURATION": return <Star className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Activer":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      "HOTELERIE": "bg-blue-100 text-blue-800",
      "RESTAURATION": "bg-orange-100 text-orange-800",
      "HOTELERIE_RESTAURATION": "bg-purple-100 text-purple-800"
    };
    
    return (
      <Badge className={`${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'} hover:bg-opacity-80`}>
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Établissements</h1>
          <p className="text-muted-foreground">
            Gérez tous les établissements du système
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchEtablissements();
              fetchStatistics();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel établissement
          </Button>
        </div>
      </div>

      {/* Diagnostic API */}
      <ApiDiagnostic />

      {/* Statistiques rapides */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{statistics.total || etablissements.length}</p>
                </div>
                <Building className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {etablissements.filter(e => e.statut === "Activer").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Villes</p>
                  <p className="text-2xl font-bold">{uniqueCities.length}</p>
                </div>
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nouveaux (30j)</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {etablissements.filter(e => {
                      const created = new Date(e.created_at);
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                      return created > thirtyDaysAgo;
                    }).length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
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
                  placeholder="Rechercher un établissement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtres de base */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="HOTELERIE">Hôtellerie</SelectItem>
                  <SelectItem value="RESTAURATION">Restauration</SelectItem>
                  <SelectItem value="HOTELERIE_RESTAURATION">Hôtellerie & Restauration</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Activer">Actif</SelectItem>
                  <SelectItem value="Inactive">Inactif</SelectItem>
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
            {selectedEtablissements.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedEtablissements.length} sélectionné(s)
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

          {/* Filtres avancés */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {uniqueCities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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

        {/* Contenu principal */}
        <TabsContent value="table" className="mt-6 w-full">
          <Card className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedEtablissements.length === filteredEtablissements.length && filteredEtablissements.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Établissement</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEtablissements.map((etablissement) => (
                  <TableRow key={etablissement.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEtablissements.includes(etablissement.id)}
                        onCheckedChange={() => handleSelectEtablissement(etablissement.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{etablissement.nom}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {etablissement.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(etablissement.type_)}
                        {getTypeBadge(etablissement.type_)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{etablissement.ville}</div>
                          <div className="text-sm text-muted-foreground">
                            {etablissement.pays}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{etablissement.email}</span>
                        </div>
                        {etablissement.telephone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{etablissement.telephone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(etablissement.statut)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(etablissement)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(etablissement.id, etablissement.statut)}
                            className={etablissement.statut === "Activer" ? "text-orange-600" : "text-green-600"}
                          >
                            {etablissement.statut === "Activer" ? (
                              <>
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activer
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(etablissement.id)}
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
          </Card>
        </TabsContent>
        <TabsContent value="cards" className="mt-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {filteredEtablissements.map((etablissement) => (
              <Card key={etablissement.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(etablissement.type_)}
                      <div>
                        <CardTitle className="text-lg">{etablissement.nom}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {getTypeBadge(etablissement.type_)}
                          {getStatusBadge(etablissement.statut)}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(etablissement)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(etablissement.id, etablissement.statut)}
                          className={etablissement.statut === "Activer" ? "text-orange-600" : "text-green-600"}
                        >
                          {etablissement.statut === "Activer" ? (
                            <>
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activer
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(etablissement.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{etablissement.ville}, {etablissement.pays}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{etablissement.email}</span>
                  </div>
                  {etablissement.telephone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{etablissement.telephone}</span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Créé le {createdDates[etablissement.id] || '--/--/----'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="mt-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
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
                  {Object.entries(
                    filteredEtablissements.reduce((acc, etab) => {
                      acc[etab.type_] = (acc[etab.type_] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(type)}
                        <span className="text-sm font-medium">
                          {type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(count / filteredEtablissements.length) * 100} 
                          className="w-20" 
                        />
                        <span className="text-sm text-muted-foreground w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Répartition par ville */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Top villes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    filteredEtablissements.reduce((acc, etab) => {
                      acc[etab.ville] = (acc[etab.ville] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([city, count]) => (
                      <div key={city} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(count / filteredEtablissements.length) * 100} 
                            className="w-20" 
                          />
                          <span className="text-sm text-muted-foreground w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Résumé des résultats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Affichage de {filteredEtablissements.length} établissement(s) 
          {filteredEtablissements.length !== etablissements.length && 
            ` sur ${etablissements.length} total`
          }
        </div>
        <div>
          {selectedEtablissements.length > 0 && (
            <span className="text-blue-600 font-medium">
              {selectedEtablissements.length} sélectionné(s)
            </span>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-50 to-white border-2 border-blue-200 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 -m-6 mb-6 rounded-t-lg">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building className="h-6 w-6" />
              </div>
              Nouvel établissement
            </DialogTitle>
            <p className="text-blue-100 mt-2">Créez un nouvel établissement dans le système</p>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
          <EtablissementForm onSubmit={handleCreate} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-50 to-white border-2 border-green-200 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 -m-6 mb-6 rounded-t-lg">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building className="h-6 w-6" />
              </div>
              Modifier l'établissement
            </DialogTitle>
            <p className="text-green-100 mt-2">Modifiez les informations de l'établissement</p>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
          {editingEtablissement && (
            <EtablissementForm 
              onSubmit={handleEdit} 
              initialData={editingEtablissement}
            />
          )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}