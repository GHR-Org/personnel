"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { getPersonnel, createPersonnel, updatePersonnel, deletePersonnel, getPersonnelStats, getPersonnelStatsByEtablissement } from "@/lib/func/api/etablissement/personnel";
import { getStoredUser } from "@/lib/func/api/auth";
import { PersonnelFormData } from "@/types/personnel";
import { testPasswordHashing } from "../../../../password-utils";
import { 
  User, Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, 
  Mail, Phone, Building, Users, Target, TrendingUp, CheckCircle,
  AlertTriangle, Clock, Star, Award, Settings, Download, RefreshCw, FileText,
  BarChart3, PieChart, Activity, Calendar, Filter as FilterIcon, 
  ChevronDown, ChevronUp, ExternalLink, Copy, Share2, Archive, 
  AlertCircle, Info, Zap, Shield, Globe2, Map, Database, Briefcase,
  UserCheck, UserX, UserPlus, GraduationCap, Crown, Wrench
} from "lucide-react";
import { PersonnelForm } from "@/components/form/personnelForm";
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

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  role: string;
  poste?: string;
  date_embauche: string;
  statut_compte: string;
  etablissement_id: number;
  etablissement?: {
    id: number;
    nom: string;
  };
  date_creation: string;
  date_mise_a_jour: string;
}



export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [currentEtablissement, setCurrentEtablissement] = useState<{id: number, nom: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards" | "analytics">("table");
  const [statistics, setStatistics] = useState<any>(null);
  const [exporting, setExporting] = useState(false);
  const [createdDates, setCreatedDates] = useState<{[id:number]: string}>({});

  // Données de démonstration qui s'adaptent à l'établissement connecté
  const getFallbackPersonnel = (etablissementId: number, etablissementNom: string) => [
    { 
      id: 1, 
      nom: "Rakoto", 
      prenom: "Jean", 
      telephone: "0341234567", 
      email: "jean.rakoto@personnel.mg", 
      role: "Receptionniste", 
      poste: "Réceptionniste de jour",
      date_embauche: "2024-01-15", 
      statut_compte: "active", 
      etablissement_id: etablissementId,
      etablissement: { id: etablissementId, nom: etablissementNom },
      date_creation: "2024-01-15", 
      date_mise_a_jour: "2024-01-15" 
    },
    { 
      id: 2, 
      nom: "Rasoa", 
      prenom: "Marie", 
      telephone: "0349876543", 
      email: "marie.rasoa@personnel.mg", 
      role: "Manager", 
      poste: "Manager restaurant",
      date_embauche: "2023-06-10", 
      statut_compte: "active", 
      etablissement_id: etablissementId,
      etablissement: { id: etablissementId, nom: etablissementNom },
      date_creation: "2023-06-10", 
      date_mise_a_jour: "2023-06-10" 
    },
    { 
      id: 3, 
      nom: "Andry", 
      prenom: "Pierre", 
      telephone: "0341122334", 
      email: "pierre.andry@personnel.mg", 
      role: "Technicien", 
      poste: "Technicien maintenance",
      date_embauche: "2024-03-20", 
      statut_compte: "inactive", 
      etablissement_id: etablissementId,
      etablissement: { id: etablissementId, nom: etablissementNom },
      date_creation: "2024-03-20", 
      date_mise_a_jour: "2024-03-20" 
    },
  ];

  // Récupérer l'établissement connecté
  useEffect(() => {
    // Test de la fonction de hachage au chargement de la page
    testPasswordHashing();
    
    const user = getStoredUser();
    console.log("🔍 Données utilisateur stockées:", user); // Debug
    
    if (user) {
      // Essayer différentes propriétés possibles pour l'ID de l'établissement
      const etabId = user.etablissement_id || user.id || user.etablissementId || user.establishment_id || user.sub;
      const etabNom = user.nom || user.name || user.email || "Mon établissement";
      
      console.log("🔍 ID établissement trouvé:", etabId); // Debug
      console.log("🔍 Nom établissement trouvé:", etabNom); // Debug
      
      if (etabId) {
        setCurrentEtablissement({
          id: etabId,
          nom: etabNom
        });
      } else {
        console.error("❌ Aucun ID d'établissement trouvé dans les données utilisateur");
        console.error("❌ Structure des données:", JSON.stringify(user, null, 2));
        
        // Solution temporaire : utiliser l'ID utilisateur comme ID d'établissement
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

  const fetchPersonnel = async () => {
    if (!currentEtablissement) return;
    
    try {
      setLoading(true);
      // Passer l'ID de l'établissement connecté pour récupérer uniquement son personnel
      const data = await getPersonnel(currentEtablissement.id);
      setPersonnel((data.Personnels || data) && (data.Personnels || data).length > 0 ? (data.Personnels || data) : getFallbackPersonnel(currentEtablissement.id, currentEtablissement.nom));
    } catch (error) {
      setPersonnel(getFallbackPersonnel(currentEtablissement?.id || 1, currentEtablissement?.nom || "Mon établissement"));
      toast.error("API indisponible, affichage du personnel de démonstration");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    if (!currentEtablissement) return;
    
    try {
      const statsData = await getPersonnelStatsByEtablissement(currentEtablissement.id);
      setStatistics(statsData);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      // Statistiques de démonstration
      setStatistics({
        total: personnel.length,
        actifs: personnel.filter(p => p.statut_compte === "active").length,
        inactifs: personnel.filter(p => p.statut_compte === "inactive").length,
        suspendus: personnel.filter(p => p.statut_compte === "suspended").length
      });
    }
  };

  const handleCreate = async (data: PersonnelFormData) => {
    if (!currentEtablissement) {
      toast.error("Établissement non identifié");
      return;
    }

    try {
      console.log("🔧 Création personnel - Données reçues:", data);
      console.log("🔧 Création personnel - Établissement actuel:", currentEtablissement);
      
      // Nettoyer les données pour correspondre au schéma backend
      const personnelData = {
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        email: data.email,
        mot_de_passe: data.mot_de_passe,
        etablissement_id: currentEtablissement.id,
        role: data.role,
        poste: data.poste && data.poste.trim() !== "" ? data.poste : "",
        date_embauche: data.date_embauche,
        statut_compte: data.statut_compte
      };
      
      console.log("🔧 Création personnel - Données envoyées à l'API:", personnelData);
      console.log("🔐 Le mot de passe sera automatiquement hashé avant l'envoi au serveur");
      console.log("📅 Date d'embauche:", personnelData.date_embauche);
      console.log("💼 Poste:", personnelData.poste);
      console.log("👤 Rôle:", personnelData.role);
      console.log("📧 Email:", personnelData.email);
      
      const result = await createPersonnel(personnelData);
      console.log("🔧 Création personnel - Réponse API:", result);
      
      setIsCreateDialogOpen(false);
      fetchPersonnel();
      fetchStatistics();
      toast.success("Personnel créé avec succès - Mot de passe sécurisé");
    } catch (error: any) {
      console.error("❌ Erreur création personnel:", error);
      
      // Améliorer l'affichage de l'erreur
      let errorMessage = "Erreur lors de la création du personnel";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.detail) {
        errorMessage = error.detail;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleEdit = async (data: PersonnelFormData) => {
    if (!editingPersonnel || !currentEtablissement) return;
    
    try {
      console.log("🔧 Modification personnel - Données reçues:", data);
      console.log("🔧 Modification personnel - Personnel à modifier:", editingPersonnel);
      console.log("🔧 Modification personnel - Statut actuel:", editingPersonnel.statut_compte);
      console.log("🔧 Modification personnel - Nouveau statut:", data.statut_compte);
      
      // Nettoyer les données pour correspondre au schéma backend
      const personnelData = {
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        email: data.email,
        etablissement_id: currentEtablissement.id,
        role: data.role,
        poste: data.poste && data.poste.trim() !== "" ? data.poste : "",
        date_embauche: data.date_embauche,
        statut_compte: data.statut_compte
      };
      
      // Ajouter le mot de passe seulement s'il est fourni
      if (data.mot_de_passe && data.mot_de_passe.trim() !== "") {
        personnelData.mot_de_passe = data.mot_de_passe;
        console.log("🔐 Le mot de passe sera automatiquement hashé avant l'envoi au serveur");
      }
      
      console.log("🔧 Modification personnel - Données envoyées à l'API:", personnelData);
      console.log("🔧 Modification personnel - Statut dans les données envoyées:", personnelData.statut_compte);
      
      const result = await updatePersonnel(editingPersonnel.id, personnelData);
      console.log("🔧 Modification personnel - Réponse API:", result);
      
      setIsEditDialogOpen(false);
      setEditingPersonnel(null);
      fetchPersonnel();
      fetchStatistics();
      toast.success("Personnel modifié avec succès");
    } catch (error: any) {
      console.error("❌ Erreur modification personnel:", error);
      
      // Améliorer l'affichage de l'erreur
      let errorMessage = "Erreur lors de la modification du personnel";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.detail) {
        errorMessage = error.detail;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log("🔧 Suppression personnel - ID:", id);
      
      const result = await deletePersonnel(id);
      console.log("🔧 Suppression personnel - Réponse API:", result);
      
      fetchPersonnel();
      fetchStatistics();
      toast.success("Personnel supprimé avec succès");
    } catch (error) {
      console.error("❌ Erreur suppression personnel:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPersonnel.length === 0) {
      toast.error("Aucun personnel sélectionné");
      return;
    }

    try {
      for (const id of selectedPersonnel) {
        await deletePersonnel(id);
      }
      setSelectedPersonnel([]);
      fetchPersonnel();
      fetchStatistics();
      toast.success(`${selectedPersonnel.length} membres du personnel supprimés avec succès`);
    } catch (error) {
      toast.error("Erreur lors de la suppression en lot");
      console.error(error);
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true);
      
      const data = filteredPersonnel.map(p => ({
        id: p.id,
        nom: p.nom,
        prenom: p.prenom,
        role: p.role,
        poste: p.poste,
        email: p.email,
        telephone: p.telephone,
        etablissement: p.etablissement?.nom,
        statut: p.statut_compte,
        date_embauche: p.date_embauche,
        date_creation: p.date_creation
      }));
      
      if (format === 'csv') {
        const headers = ['ID', 'Nom', 'Prénom', 'Rôle', 'Poste', 'Email', 'Téléphone', 'Établissement', 'Statut', 'Date embauche', 'Date création'];
        const csvContent = [headers, ...data.map(row => [
          row.id, row.nom, row.prenom, row.role, row.poste, row.email, row.telephone, row.etablissement, row.statut, row.date_embauche, row.date_creation
        ])].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `personnel_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `personnel_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      toast.success(`Export ${format.toUpperCase()} terminé: ${data.length} membres du personnel`);
    } catch (error) {
      toast.error(`Erreur lors de l'export ${format.toUpperCase()}`);
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedPersonnel.length === filteredPersonnel.length) {
      setSelectedPersonnel([]);
    } else {
      setSelectedPersonnel(filteredPersonnel.map(p => p.id));
    }
  };

  const handleSelectPersonnel = (id: number) => {
    setSelectedPersonnel(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const openEditDialog = (personnel: Personnel) => {
    setEditingPersonnel(personnel);
    setIsEditDialogOpen(true);
  };

  const filteredPersonnel = personnel.filter(p => {
    const matchesSearch = p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === "all" || p.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || p.statut_compte === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const uniqueRoles = [...new Set(personnel.map(p => p.role))].sort();

  useEffect(() => {
    if (currentEtablissement) {
      fetchPersonnel();
    }
  }, [currentEtablissement]);

  useEffect(() => {
    if (currentEtablissement) {
      fetchStatistics();
    }
  }, [personnel, currentEtablissement]);

  useEffect(() => {
    const dates: {[id:number]: string} = {};
    personnel.forEach(p => {
      dates[p.id] = new Date(p.date_creation).toLocaleDateString('fr-FR');
    });
    setCreatedDates(dates);
  }, [personnel]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Receptionniste": return <User className="h-4 w-4 text-blue-500" />;
      case "Technicien": return <Wrench className="h-4 w-4 text-green-500" />;
      case "Manager": return <Briefcase className="h-4 w-4 text-purple-500" />;
      case "RH": return <UserCheck className="h-4 w-4 text-orange-500" />;
      case "Caissier": return <User className="h-4 w-4 text-red-500" />;
      case "Directeur": return <Crown className="h-4 w-4 text-indigo-500" />;
      default: return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactif</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      "Receptionniste": "bg-blue-100 text-blue-800",
      "Technicien": "bg-green-100 text-green-800",
      "Manager": "bg-purple-100 text-purple-800",
      "RH": "bg-orange-100 text-orange-800",
      "Caissier": "bg-red-100 text-red-800",
      "Directeur": "bg-indigo-100 text-indigo-800"
    };
    
    return (
      <Badge className={`${colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'} hover:bg-opacity-80`}>
        {role}
      </Badge>
    );
  };

  if (!currentEtablissement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Établissement non identifié</h2>
          <p className="text-gray-600 mb-4">
            Impossible de récupérer les informations de votre établissement.
          </p>
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
          <h1 className="text-3xl font-bold tracking-tight">Gestion du Personnel</h1>
          <p className="text-muted-foreground">
            Gérez le personnel de votre établissement : <strong>{currentEtablissement.nom}</strong>
          </p>
          <p className="text-sm text-blue-600 mt-1">
            <Info className="h-4 w-4 inline mr-1" />
            Vous ne voyez que le personnel de votre établissement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchPersonnel();
              fetchStatistics();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau personnel
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
                  <p className="text-2xl font-bold">{statistics.total || personnel.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {personnel.filter(p => p.statut_compte === "active").length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rôles</p>
                  <p className="text-2xl font-bold">{uniqueRoles.length}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nouveaux (30j)</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {personnel.filter(p => {
                      const created = new Date(p.date_creation);
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                      return created > thirtyDaysAgo;
                    }).length}
                  </p>
                </div>
                <UserPlus className="h-8 w-8 text-purple-600" />
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
                  placeholder="Rechercher du personnel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtres de base */}
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {uniqueRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
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
            {selectedPersonnel.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedPersonnel.length} sélectionné(s)
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

        {/* Contenu principal */}
        <TabsContent value="table" className="mt-6 w-full">
          <Card className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedPersonnel.length === filteredPersonnel.length && filteredPersonnel.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Personnel</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersonnel.map((personnel) => (
                  <TableRow key={personnel.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPersonnel.includes(personnel.id)}
                        onCheckedChange={() => handleSelectPersonnel(personnel.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{personnel.prenom} {personnel.nom}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {personnel.id} • {personnel.poste}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(personnel.role)}
                        {getRoleBadge(personnel.role)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{personnel.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{personnel.telephone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(personnel.statut_compte)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(personnel)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(personnel.id)}
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
            {filteredPersonnel.map((personnel) => (
              <Card key={personnel.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(personnel.role)}
                      <div>
                        <CardTitle className="text-lg">{personnel.prenom} {personnel.nom}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {getRoleBadge(personnel.role)}
                          {getStatusBadge(personnel.statut_compte)}
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
                        <DropdownMenuItem onClick={() => openEditDialog(personnel)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(personnel.id)}
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
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{personnel.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{personnel.telephone}</span>
                  </div>
                  {personnel.poste && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{personnel.poste}</span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Embauché le {new Date(personnel.date_embauche).toLocaleDateString('fr-FR')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Répartition par rôle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Répartition par rôle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    filteredPersonnel.reduce((acc, p) => {
                      acc[p.role] = (acc[p.role] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(role)}
                        <span className="text-sm font-medium">{role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(count / filteredPersonnel.length) * 100} 
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

            {/* Répartition par statut */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Répartition par statut
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    filteredPersonnel.reduce((acc, p) => {
                      acc[p.statut_compte] = (acc[p.statut_compte] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {status === "active" && <UserCheck className="h-4 w-4 text-green-500" />}
                        {status === "inactive" && <UserX className="h-4 w-4 text-gray-500" />}
                        {status === "suspended" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        <span className="text-sm font-medium">
                          {status === "active" ? "Actif" : status === "inactive" ? "Inactif" : "Suspendu"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(count / filteredPersonnel.length) * 100} 
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
          Affichage de {filteredPersonnel.length} membre(s) du personnel 
          {filteredPersonnel.length !== personnel.length && 
            ` sur ${personnel.length} total`
          }
        </div>
        <div>
          {selectedPersonnel.length > 0 && (
            <span className="text-blue-600 font-medium">
              {selectedPersonnel.length} sélectionné(s)
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
                <User className="h-6 w-6" />
              </div>
              Nouveau personnel
            </DialogTitle>
            <p className="text-blue-100 mt-2">Ajoutez un nouveau membre du personnel à votre établissement</p>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
            <PersonnelForm onSubmit={handleCreate} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-50 to-white border-2 border-green-200 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 -m-6 mb-6 rounded-t-lg">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <User className="h-6 w-6" />
              </div>
              Modifier le personnel
            </DialogTitle>
            <p className="text-green-100 mt-2">Modifiez les informations du personnel</p>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
            {editingPersonnel && (
              <PersonnelForm 
                onSubmit={handleEdit} 
                initialData={editingPersonnel}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}