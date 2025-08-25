/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/etablissement/personnel/page.tsx (ou l'emplacement réel de votre page)
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { format } from "date-fns"; // Assurez-vous d'importer format
import { fr } from "date-fns/locale"; // Et la locale française

import {
  getPersonnel,
  createPersonnel,
  updatePersonnel,
  deletePersonnel,
  // getPersonnelStats, // Utilisez getPersonnelStatsByEtablissement si dispo
  getPersonnelStatsByEtablissement,
} from "@/lib/func/api/etablissement/personnel";
import { getStoredUser } from "@/lib/func/api/auth";// Importez le schéma aussi
import { PersonnelTable } from "@/components/rhcomponents/personnel-table"; // Votre nouveau composant de table
import {
  User,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Mail,
  Phone,
  Building,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Award,
  Settings,
  Download,
  RefreshCw,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter as FilterIcon,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Share2,
  Archive,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Globe2,
  Map,
  Database,
  Briefcase,
  UserCheck,
  UserX,
  UserPlus,
  GraduationCap,
  Crown,
  Wrench,
  Loader2, // Pour l'icône de chargement
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription, // Ajouté pour la modale d'édition/ajout
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem, // Nécessaire pour les filtres de colonne
} from "@/components/ui/dropdown-menu";
import {
  Table, // Pas directement utilisé si PersonnelTable gère sa propre Table
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { PersonnelFormData } from "@/types/personnel";
import z from "zod";
import { PersonnelForm, personnelSchema } from "@/components/form/personnelForm";
// import { RealTimeActivity } from "@/components/admin/RealTimeActivity"; // Commentez ou ajoutez si existant

// Interface mise à jour pour le personnel (doit correspondre à la DB)
interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  // mot_de_passe: string; // Ne pas inclure pour la récupération du backend
  role: string;
  poste?: string;
  date_embauche: string; // Format YYYY-MM-DD
  statut_compte: "active" | "inactive" | "suspended"; // Type plus strict pour statut
  etablissement_id: number;
  etablissement?: {
    id: number;
    nom: string;
  };
  adresse?: string | null; // Ajouté si présent dans la DB
  date_creation: string; // timestamp with time zone
  date_mise_a_jour: string; // timestamp with time zone
  last_login?: string | null; // Ajouté si présent dans la DB
}


export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [currentEtablissement, setCurrentEtablissement] = useState<{
    id: number;
    nom: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedPersonnelIds, setSelectedPersonnelIds] = useState<number[]>([]); // Renommé pour clarté
  const [viewMode, setViewMode] = useState<"table" | "cards" | "analytics">(
    "table"
  );
  const [statistics, setStatistics] = useState<any>(null);
  const [exporting, setExporting] = useState(false);
  // const [createdDates, setCreatedDates] = useState<{ [id: number]: string }>( // semble inutilisé
  //   {}
  // );

  // Données mock pour simuler les statistiques réelles
  // Vos mockStats sont pour les établissements, pas le personnel.
  // Je vais les adapter pour le personnel ou en créer de nouvelles si besoin pour l'onglet analytique.
  
  // Données de démonstration qui s'adaptent à l'établissement connecté
  const getFallbackPersonnel = (
    etablissementId: number | 1,
    etablissementNom: string | "Mon etablissement"
  ): Personnel[] => [ // Spécifiez le type de retour comme Personnel[]
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
      adresse: "Lot IV 123 Ambohijatovo, Antananarivo",
      date_creation: "2024-01-15T08:00:00Z",
      date_mise_a_jour: "2024-01-15T08:00:00Z",
      last_login: "2024-07-21T10:00:00Z",
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
      adresse: "Rue de la Liberté, Fianarantsoa",
      date_creation: "2023-06-10T09:00:00Z",
      date_mise_a_jour: "2023-06-10T09:00:00Z",
      last_login: "2024-07-21T09:30:00Z",
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
      adresse: "Avenue de l'Indépendance, Toamasina",
      date_creation: "2024-03-20T10:00:00Z",
      date_mise_a_jour: "2024-03-20T10:00:00Z",
      last_login: null,
    },
    {
        id: 4,
        nom: "Faniry",
        prenom: "Toky",
        email: "toky.faniry@example.com",
        telephone: "0321122334",
        adresse: "BP 456, Mahajanga",
        role: "RH",
        poste: "Assistant RH",
        date_embauche: "2021-08-01",
        statut_compte: "active",
        etablissement_id: etablissementId,
        etablissement: { id: etablissementId, nom: etablissementNom },
        date_creation: "2021-08-01T08:30:00Z",
        date_mise_a_jour: "2024-07-19T11:00:00Z",
        last_login: "2024-07-20T16:00:00Z",
      },
      {
        id: 5,
        nom: "Zafy",
        prenom: "Hery",
        email: "hery.zafy@example.com",
        telephone: "0334455667",
        adresse: "Ambohidratrimo, Antananarivo",
        role: "Caissier",
        poste: "Caissier principal",
        date_embauche: "2023-03-10",
        statut_compte: "suspended",
        etablissement_id: etablissementId,
        etablissement: { id: etablissementId, nom: etablissementNom },
        date_creation: "2023-03-10T09:00:00Z",
        date_mise_a_jour: "2024-07-10T10:00:00Z",
        last_login: "2024-07-09T17:00:00Z",
      },
  ];
  useEffect(()=>{
     setPersonnel(getFallbackPersonnel(1, "Mon etablissement"))
  }, [])

  // Récupérer l'établissement connecté
  // useEffect(() => {
  //   // testPasswordHashing(); // Déjà fait au chargement du module si c'est global

  //   const user = getStoredUser();
  //   console.log("🔍 Données utilisateur stockées:", user); // Debug

  //   if (user) {
  //     const etabId =
  //       user.etablissement_id ||
  //       user.id ||
  //       user.etablissementId ||
  //       user.establishment_id ||
  //       user.sub;
  //     const etabNom =
  //       user.nom || user.name || user.email || "Mon établissement";

  //     if (etabId) {
  //       setCurrentEtablissement({
  //         id: etabId,
  //         nom: etabNom,
  //       });
  //     } else {
  //       console.error(
  //         "❌ Aucun ID d'établissement trouvé dans les données utilisateur"
  //       );
  //       if (user.role === "Etablissement" && user.sub) {
  //         console.log(
  //           "🔄 Solution temporaire : utilisation de user.sub comme ID d'établissement"
  //         );
  //         setCurrentEtablissement({
  //           id: user.sub,
  //           nom: etabNom,
  //         });
  //       }
  //     }
  //   } else {
  //     console.error("❌ Aucun utilisateur trouvé dans le localStorage");
  //   }
  // }, []);

  // const fetchPersonnel = async () => {
  //   if (!currentEtablissement) {
  //       console.warn("Pas d'établissement courant, impossible de récupérer le personnel.");
  //       setLoading(false);
  //       return;
  //   }

  //   try {
  //     setLoading(true);
  //     const data = await getPersonnel(currentEtablissement.id);
  //     const fetchedPersonnel = (data.Personnels || data) as Personnel[];

  //     // Ajoutez l'adresse et le last_login aux données mockées si l'API ne les fournit pas
  //     // C'est une solution temporaire si votre API n'est pas encore complète.
  //     const personnelWithFallback = fetchedPersonnel.length > 0
  //       ? fetchedPersonnel.map(p => ({
  //           ...p,
  //           adresse: p.adresse || "Adresse non spécifiée", // Fournir une valeur par défaut
  //           last_login: p.last_login || null,
  //         }))
  //       : getFallbackPersonnel(currentEtablissement.id, currentEtablissement.nom);

  //     setPersonnel(personnelWithFallback);
  //   } catch (error) {
  //     console.error("Erreur lors de la récupération du personnel:", error);
  //     toast.error("API indisponible, affichage du personnel de démonstration");
  //     setPersonnel(
  //       getFallbackPersonnel(
  //         currentEtablissement?.id || 1,
  //         currentEtablissement?.nom || "Mon établissement"
  //       )
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchStatistics = async () => {
  //   if (!currentEtablissement) return;

  //   try {
  //     const statsData = await getPersonnelStatsByEtablissement(
  //       currentEtablissement.id
  //     );
  //     setStatistics(statsData);
  //   } catch (error) {
  //     console.error("Erreur lors du chargement des statistiques:", error);
  //     // Statistiques de démonstration (basées sur les données actuelles du personnel)
  //     const totalPersonnel = personnel.length;
  //     const actifs = personnel.filter((p) => p.statut_compte === "active").length;
  //     const inactifs = personnel.filter((p) => p.statut_compte === "inactive").length;
  //     const suspendus = personnel.filter((p) => p.statut_compte === "suspended").length;

  //     const roles = personnel.reduce((acc, p) => {
  //       acc[p.role] = (acc[p.role] || 0) + 1;
  //       return acc;
  //     }, {} as Record<string, number>);

  //     setStatistics({
  //       total: totalPersonnel,
  //       actifs: actifs,
  //       inactifs: inactifs,
  //       suspendus: suspendus,
  //       parRole: Object.entries(roles).map(([role, count]) => ({ role, count })),
  //       // Ajoutez d'autres statistiques pertinentes si vous en avez
  //       moyenneAnciennete: "X ans Y mois", // Calculez si les dates sont disponibles
  //       dernieresConnexions: personnel
  //           .filter(p => p.last_login)
  //           .sort((a, b) => new Date(b.last_login!).getTime() - new Date(a.last_login!).getTime())
  //           .slice(0, 5) // Les 5 dernières connexions
  //           .map(p => ({ nom: `${p.prenom} ${p.nom}`, date: p.last_login })),
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (currentEtablissement) {
  //     fetchPersonnel();
  //     fetchStatistics(); // Charger les stats une fois les données de personnel disponibles
  //   }
  // }, [currentEtablissement]); // Dépend de currentEtablissement

  // Handlers pour les opérations CRUD
  const handleCreate = async (data: PersonnelFormData) => {
    if (!currentEtablissement) {
      toast.error("Établissement non identifié");
      return;
    }

    try {
      const personnelData = {
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        email: data.email,
        mot_de_passe: data.mot_de_passe,
        etablissement_id: currentEtablissement.id,
        role: data.role,
        poste: data.poste && data.poste.trim() !== "" ? data.poste : null, // Important: null si vide
        date_embauche: data.date_embauche,
        statut_compte: data.statut_compte,
      };

      const result = await createPersonnel(personnelData);
      setIsCreateDialogOpen(false);
      // fetchPersonnel();
      // fetchStatistics();
      toast.success("Personnel créé avec succès");
    } catch (error: any) {
      console.error("❌ Erreur création personnel:", error);
      let errorMessage = "Erreur lors de la création du personnel";
      if (error.message) errorMessage = error.message;
      else if (typeof error === "string") errorMessage = error;
      else if (error.detail) errorMessage = error.detail;
      else if (error.error) errorMessage = error.error;
      toast.error(errorMessage);
    }
  };

  const handleEdit = async (data: PersonnelFormData & { id: number }) => {
    if (!currentEtablissement) return;

    try {
      // Utilisez le schéma Zod pour valider et extraire les données
      const validatedData = personnelSchema.parse(data);

      const personnelData = {
        nom: validatedData.nom,
        prenom: validatedData.prenom,
        telephone: validatedData.telephone,
        email: validatedData.email,
        etablissement_id: currentEtablissement.id,
        role: validatedData.role,
        poste: validatedData.poste && validatedData.poste.trim() !== "" ? validatedData.poste : null,
        date_embauche: validatedData.date_embauche,
        statut_compte: validatedData.statut_compte,
      };

      // Inclure le mot de passe seulement s'il est fourni dans le formulaire d'édition
      if (validatedData.mot_de_passe && validatedData.mot_de_passe.trim() !== "") {
        (personnelData as any).mot_de_passe = validatedData.mot_de_passe; // Cast pour ajouter la propriété
      }

      await updatePersonnel(data.id, personnelData); // Utilisez data.id pour l'ID
      setIsEditDialogOpen(false);
       // Réinitialisez editingPersonnel
      // fetchPersonnel();
      // fetchStatistics();
      toast.success("Personnel modifié avec succès");
    } catch (error: any) {
      console.error("❌ Erreur modification personnel:", error);
      let errorMessage = "Erreur lors de la modification du personnel";
      if (error instanceof z.ZodError) {
        errorMessage = "Erreurs de validation: " + error.errors.map(e => e.message).join(", ");
      } else if (error.message) errorMessage = error.message;
      else if (typeof error === "string") errorMessage = error;
      else if (error.detail) errorMessage = error.detail;
      else if (error.error) errorMessage = error.error;
      toast.error(errorMessage);
    }
  };


  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce personnel ?")) return;
    try {
      await deletePersonnel(id);
      // fetchPersonnel();
      // fetchStatistics();
      toast.success("Personnel supprimé avec succès");
    } catch (error: any) {
      console.error("❌ Erreur suppression personnel:", error);
      toast.error("Erreur lors de la suppression du personnel.");
    }
  };


  // Filtering logic for Cards View (your existing logic)
  const filteredPersonnel = useMemo(() => {
    return personnel.filter((p) => {
      const matchesSearch =
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.telephone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === "all" || p.role === selectedRole;
      const matchesStatus =
        selectedStatus === "all" || p.statut_compte === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [personnel, searchTerm, selectedRole, selectedStatus]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-fadeIn">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Chargement des données du personnel...</p>
      </div>
    );
  }

  // Fonctions d'aide pour les icônes de rôle dans la vue carte
  const getRoleIcon = (role: string) => {
    switch (role) {
        case "Receptionniste": return <User className="h-4 w-4 text-blue-500" />;
        case "Technicien": return <Wrench className="h-4 w-4 text-green-500" />;
        case "Manager": return <Briefcase className="h-4 w-4 text-purple-500" />;
        case "RH": return <Users className="h-4 w-4 text-orange-500" />;
        case "Caissier": return <Crown className="h-4 w-4 text-red-500" />; // Ou une autre icône pour Caissier
        case "Directeur": return <Shield className="h-4 w-4 text-indigo-500" />;
        default: return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "inactive": return "secondary";
      case "suspended": return "destructive";
      default: return "outline";
    }
  };

  const getStatusBadgeText = (status: string) => {
    switch (status) {
      case "active": return "Actif";
      case "inactive": return "Inactif";
      case "suspended": return "Suspendu";
      default: return status;
    }
  };


  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Gestion du Personnel</h1>

      <Tabs defaultValue="table" value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "cards" | "analytics")}>
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <TabsList className="bg-muted p-1 rounded-lg shadow-sm">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" /> Tableau
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Cartes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Statistiques
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="hidden sm:flex"
            >
              <FilterIcon className="mr-2 h-4 w-4" />
              Filtres {showAdvancedFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
            {/* Le bouton Ajouter Personnel est maintenant dans PersonnelTable pour la vue tableau */}
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-lg bg-background animate-fadeInDown">
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="Receptionniste">Réceptionniste</SelectItem>
                <SelectItem value="Technicien">Technicien</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="RH">RH</SelectItem>
                <SelectItem value="Caissier">Caissier</SelectItem>
                <SelectItem value="Directeur">Directeur</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>

            {/* Ajoutez d'autres filtres si nécessaire, par ex. par date d'embauche */}
          </div>
        )}

        <TabsContent value="table">
          <PersonnelTable
            data={personnel}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddPersonnel={handleCreate} // Passe le handler de création
          />
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredPersonnel.length > 0 ? (
              filteredPersonnel.map((p) => (
                <Card key={p.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold">
                      {p.prenom} {p.nom}
                    </CardTitle>
                    <Badge variant={getStatusBadgeVariant(p.statut_compte)}>
                        {getStatusBadgeText(p.statut_compte)}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      {getRoleIcon(p.role)} {p.role} {p.poste && `(${p.poste})`}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" /> {p.email}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" /> {p.telephone}
                    </p>
                    {p.adresse && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Map className="h-4 w-4" /> {p.adresse}
                        </p>
                    )}
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Embauché le{" "}
                      {format(new Date(p.date_embauche), "dd/MM/yyyy", { locale: fr })}
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingPersonnel(p)}>
                            <Edit className="h-4 w-4 mr-2" /> Modifier
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Modifier le personnel</DialogTitle>
                                <DialogDescription>
                                    Modifiez les informations du personnel ici. Cliquez sur enregistrer lorsque vous avez terminé.
                                </DialogDescription>
                            </DialogHeader>
                            <PersonnelForm initialData={p} onSubmit={(data) => handleEdit({ ...data, id: p.id })} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">Aucun personnel trouvé avec les filtres actuels.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            <Card className="col-span-full border-l-4 border-primary shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Statistiques Générales</CardTitle>
                <BarChart3 className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statistics?.total || 0}</div>
                <p className="text-xs text-muted-foreground">Personnel total</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Actifs</span>
                    <span className="font-semibold">{statistics?.actifs || 0} ({((statistics?.actifs || 0) / (statistics?.total || 1) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1"><UserX className="h-4 w-4 text-gray-500" /> Inactifs</span>
                    <span className="font-semibold">{statistics?.inactifs || 0} ({((statistics?.inactifs || 0) / (statistics?.total || 1) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1"><AlertTriangle className="h-4 w-4 text-orange-500" /> Suspendus</span>
                    <span className="font-semibold">{statistics?.suspendus || 0} ({((statistics?.suspendus || 0) / (statistics?.total || 1) * 100).toFixed(1)}%)</span>
                  </div>
                  <Progress value={(statistics?.actifs || 0) / (statistics?.total || 1) * 100} className="mt-2 h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-500 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Personnel par Rôle</CardTitle>
                <PieChart className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statistics?.parRole && statistics.parRole.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {statistics.parRole.map((item: { role: string; count: number }) => (
                      <li key={item.role} className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            {getRoleIcon(item.role)} {item.role}
                        </span>
                        <span className="font-semibold">{item.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune donnée de rôle disponible.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-l-4 border-green-500 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Dernières Activités</CardTitle>
                <Activity className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statistics?.dernieresConnexions && statistics.dernieresConnexions.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {statistics.dernieresConnexions.map((activity: { nom: string; date: string }, index: number) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{activity.nom}</span>
                        <span className="text-muted-foreground">
                            <Clock className="inline-block h-3 w-3 mr-1" />
                            {format(new Date(activity.date), "dd/MM/yy HH:mm", { locale: fr })}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
                )}
              </CardContent>
            </Card>

            {/* Vous pouvez ajouter d'autres cartes ici pour d'autres statistiques */}
            {/* Par exemple, ancienneté moyenne, répartition par poste, etc. */}
          </div>
          {/* Si vous avez le composant RealTimeActivity, vous pouvez le décommenter ici */}
          {/* <div className="mt-8">
            <RealTimeActivity />
          </div> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}