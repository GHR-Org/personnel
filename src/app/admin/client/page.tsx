"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getClients, deleteClient, updateClientStatus, getClientStats } from "@/lib/func/api/superAdmin/client";

import { 
  Users, Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, 
  Mail, Phone, User, Target, TrendingUp, CheckCircle,
  AlertTriangle, Clock, Star, Award, Settings, Download, RefreshCw, FileText,
  BarChart3, PieChart, Activity, Calendar, Filter as FilterIcon, 
  ChevronDown, ChevronUp, ExternalLink, Copy, Share2, Archive, 
  AlertCircle, Info, Zap, Shield, Globe2, Map, Database, UserCheck, UserX, UserMinus
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

interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  national_id: string;
  account_status: string;
  created_at: string;
  updated_at: string;
}

interface ClientStats {
  nombre_active: number;
  nombre_inactive: number;
  nombre_suspendu: number;
  nombre_total: number;
}

export default function ClientPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards" | "analytics">("table");
  const [statistics, setStatistics] = useState<ClientStats | null>(null);
  const [exporting, setExporting] = useState(false);
  const [createdDates, setCreatedDates] = useState<{[id:number]: string}>({});

  const fallbackClients = [
    { id: 1, first_name: "Jean", last_name: "Dupont", email: "jean.dupont@email.com", phone: "0341234567", national_id: "123456789", account_status: "ACTIVE", created_at: "2024-05-01", updated_at: "2024-05-01" },
    { id: 2, first_name: "Marie", last_name: "Martin", email: "marie.martin@email.com", phone: "0349876543", national_id: "987654321", account_status: "ACTIVE", created_at: "2024-05-03", updated_at: "2024-05-03" },
    { id: 3, first_name: "Pierre", last_name: "Durand", email: "pierre.durand@email.com", phone: "0341122334", national_id: "456789123", account_status: "INACTIVE", created_at: "2024-04-15", updated_at: "2024-04-15" },
    { id: 4, first_name: "Sophie", last_name: "Leroy", email: "sophie.leroy@email.com", phone: "0345566778", national_id: "789123456", account_status: "SUSPENDED", created_at: "2024-03-20", updated_at: "2024-03-20" },
  ];

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getClients();
      setClients(data.clients || data || fallbackClients);
    } catch (error) {
      setClients(fallbackClients);
      toast.error("API indisponible, affichage des clients de démonstration");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await getClientStats();
      setStatistics(stats);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      const stats = calculateStats(clients);
      setStatistics(stats);
    }
  };

  const calculateStats = (clientList: Client[]): ClientStats => {
    const active = clientList.filter(c => c.account_status === "ACTIVE").length;
    const inactive = clientList.filter(c => c.account_status === "INACTIVE").length;
    const suspended = clientList.filter(c => c.account_status === "SUSPENDED").length;
    
    return {
      nombre_active: active,
      nombre_inactive: inactive,
      nombre_suspendu: suspended,
      nombre_total: clientList.length
    };
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClient(id);
      fetchClients();
      fetchStatistics();
      toast.success("Client supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      let newStatus = "ACTIVE";
      if (currentStatus === "ACTIVE") newStatus = "INACTIVE";
      else if (currentStatus === "INACTIVE") newStatus = "SUSPENDED";
      else newStatus = "ACTIVE";

      await updateClientStatus(id, newStatus);
      fetchClients();
      fetchStatistics();
      toast.success(`Statut du client modifié avec succès`);
    } catch (error) {
      toast.error("Erreur lors de la modification du statut");
      console.error(error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedClients.length === 0) {
      toast.error("Aucun client sélectionné");
      return;
    }

    try {
      for (const id of selectedClients) {
        await handleDelete(id);
      }
      setSelectedClients([]);
      toast.success(`${selectedClients.length} clients supprimés avec succès`);
    } catch (error) {
      toast.error("Erreur lors de la suppression en lot");
      console.error(error);
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true);
      
      const data = filteredClients.map(client => ({
        id: client.id,
        nom: `${client.first_name} ${client.last_name}`,
        email: client.email,
        telephone: client.phone,
        national_id: client.national_id,
        statut: client.account_status,
        date_creation: client.created_at
      }));
      
      if (format === 'csv') {
        const headers = ['ID', 'Nom', 'Email', 'Téléphone', 'ID National', 'Statut', 'Date création'];
        const csvContent = [headers, ...data.map(row => [
          row.id, row.nom, row.email, row.telephone, row.national_id, row.statut, row.date_creation
        ])].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `clients_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `clients_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      toast.success(`Export ${format.toUpperCase()} terminé: ${data.length} clients`);
    } catch (error) {
      toast.error(`Erreur lors de l'export ${format.toUpperCase()}`);
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(client => client.id));
    }
  };

  const handleSelectClient = (id: number) => {
    setSelectedClients(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredClients = clients.filter(client => {
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    
    const matchesStatus = selectedStatus === "all" || client.account_status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [clients]);

  useEffect(() => {
    const dates: {[id:number]: string} = {};
    clients.forEach(c => {
      dates[c.id] = new Date(c.created_at).toLocaleDateString('fr-FR');
    });
    setCreatedDates(dates);
  }, [clients]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>;
      case "INACTIVE":
        return <Badge variant="secondary">Inactif</Badge>;
      case "SUSPENDED":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Clients</h1>
          <p className="text-muted-foreground">
            Gérez tous les clients de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchClients();
              fetchStatistics();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau client
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{statistics.nombre_total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {statistics.nombre_active}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inactifs</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {statistics.nombre_inactive}
                  </p>
                </div>
                <UserX className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Suspendus</p>
                  <p className="text-2xl font-bold text-red-600">
                    {statistics.nombre_suspendu}
                  </p>
                </div>
                <UserMinus className="h-8 w-8 text-red-600" />
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
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtres de base */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="ACTIVE">Actif</SelectItem>
                  <SelectItem value="INACTIVE">Inactif</SelectItem>
                  <SelectItem value="SUSPENDED">Suspendu</SelectItem>
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
            {selectedClients.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedClients.length} sélectionné(s)
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
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <div className="flex items-center justify-between">
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
        <TabsContent value="table" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>ID National</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={() => handleSelectClient(client.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.first_name} {client.last_name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {client.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{client.email}</span>
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{client.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{client.national_id}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(client.account_status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{createdDates[client.id] || '--/--/----'}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(client.id, client.account_status)}
                            className={client.account_status === "ACTIVE" ? "text-orange-600" : "text-green-600"}
                          >
                            {client.account_status === "ACTIVE" ? (
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
                            onClick={() => handleDelete(client.id)}
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

        <TabsContent value="cards" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <CardTitle className="text-lg">{client.first_name} {client.last_name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(client.account_status)}
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
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(client.id, client.account_status)}
                          className={client.account_status === "ACTIVE" ? "text-orange-600" : "text-green-600"}
                        >
                          {client.account_status === "ACTIVE" ? (
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
                          onClick={() => handleDelete(client.id)}
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
                    <span className="text-sm">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">ID: {client.national_id}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Inscrit le {createdDates[client.id] || '--/--/----'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Répartition par statut */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Répartition par statut
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistics && [
                    { label: "Actifs", count: statistics.nombre_active, color: "bg-green-500" },
                    { label: "Inactifs", count: statistics.nombre_inactive, color: "bg-orange-500" },
                    { label: "Suspendus", count: statistics.nombre_suspendu, color: "bg-red-500" }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(item.count / statistics.nombre_total) * 100} 
                          className="w-20" 
                        />
                        <span className="text-sm text-muted-foreground w-8 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Évolution des inscriptions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Évolution des inscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Ce mois</span>
                    <span className="text-sm text-muted-foreground">
                      {clients.filter(c => {
                        const created = new Date(c.created_at);
                        const thisMonth = new Date();
                        return created.getMonth() === thisMonth.getMonth() && 
                               created.getFullYear() === thisMonth.getFullYear();
                      }).length} nouveaux
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Ce trimestre</span>
                    <span className="text-sm text-muted-foreground">
                      {clients.filter(c => {
                        const created = new Date(c.created_at);
                        const threeMonthsAgo = new Date();
                        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                        return created > threeMonthsAgo;
                      }).length} nouveaux
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cette année</span>
                    <span className="text-sm text-muted-foreground">
                      {clients.filter(c => {
                        const created = new Date(c.created_at);
                        const thisYear = new Date();
                        return created.getFullYear() === thisYear.getFullYear();
                      }).length} nouveaux
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Résumé des résultats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Affichage de {filteredClients.length} client(s) 
          {filteredClients.length !== clients.length && 
            ` sur ${clients.length} total`
          }
        </div>
        <div>
          {selectedClients.length > 0 && (
            <span className="text-blue-600 font-medium">
              {selectedClients.length} sélectionné(s)
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 