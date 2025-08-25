/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/personnel/RealTimePersonnelActivity.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  UserPlus, // Pour les nouvelles inscriptions de personnel
  UserCog,    // Pour les mises à jour de profil
  Briefcase,  // Pour les demandes de congé
  Wifi,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Clock3, // Ou une autre icône pour le total des activités
  XCircle
} from "lucide-react";

interface PersonnelActivityItem {
  id: string;
  type: "personnel_registered" | "personnel_updated" | "conge_requested" | "conge_approved" | "conge_rejected";
  title: string;
  description: string;
  timestamp: Date;
  status: "success" | "info" | "warning" | "error"; // 'info' pour les demandes en attente
  icon: React.ReactNode;
}

// Interface pour les données de props (simulées ici)
interface RealTimePersonnelActivityProps {
  // Ces données seraient typiquement fetched depuis une API réelle
  // Ici, nous les simulons pour l'exemple
  statsPersonnel: {
    nouveaux_enregistrements: Array<{
      nom: string;
      prenom: string;
      fonction: string;
      date_enregistrement: string; // Ex: "YYYY-MM-DD"
    }>;
    demandes_conges_recentes: Array<{
      employe: string;
      type: string;
      statut: "En attente" | "Approuvé" | "Refusé";
      date_demande: string; // Ex: "YYYY-MM-DD HH:MM:SS"
    }>;
    // ... d'autres types de données pertinentes (ex: mises à jour de profil)
  };
}

export function RealTimePersonnelActivity({ statsPersonnel }: RealTimePersonnelActivityProps) {
  const [activities, setActivities] = useState<PersonnelActivityItem[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simuler des activités en temps réel basées sur les props
  useEffect(() => {
    const generatePersonnelActivities = () => {
      const newActivities: PersonnelActivityItem[] = [];

      // Activités de nouveaux enregistrements
      statsPersonnel.nouveaux_enregistrements.forEach((personnel, index) => {
        newActivities.push({
          id: `pers-reg-${index}-${Date.now()}`, // ID unique
          type: "personnel_registered",
          title: `Nouveau personnel: ${personnel.nom} ${personnel.prenom}`,
          description: `Fonction: ${personnel.fonction}`,
          timestamp: new Date(personnel.date_enregistrement),
          status: "success",
          icon: <UserPlus className="h-4 w-4" />,
        });
      });

      // Activités de demandes de congés récentes
      statsPersonnel.demandes_conges_recentes.forEach((conge, index) => {
        let status: PersonnelActivityItem['status'] = 'info'; // Par défaut pour 'En attente'
        let icon: React.ReactNode = <Briefcase className="h-4 w-4" />;

        switch (conge.statut) {
          case "Approuvé":
            status = "success";
            icon = <CheckCircle className="h-4 w-4" />;
            break;
          case "Refusé":
            status = "error";
            icon = <XCircle className="h-4 w-4" />;
            break;
          case "En attente":
          default:
            status = "info"; // Utiliser 'info' pour en attente
            icon = <Clock className="h-4 w-4" />; // Icône de montre pour "en attente"
            break;
        }

        newActivities.push({
          id: `conge-${index}-${Date.now()}`,
          type: `conge_${conge.statut.toLowerCase().replace(' ', '_')}` as PersonnelActivityItem['type'], // Ex: conge_en_attente
          title: `Demande de congé (${conge.type})`,
          description: `Par ${conge.employe} - Statut: ${conge.statut}`,
          timestamp: new Date(conge.date_demande),
          status: status,
          icon: icon,
        });
      });

      // Simuler d'autres activités aléatoires si les props sont vides ou pour plus de variété
      if (newActivities.length === 0 || Math.random() < 0.3) { // 30% de chance d'ajouter une activité aléatoire
        const randomActivities: PersonnelActivityItem[] = [
          {
            id: `rand-upd-${Date.now()}`,
            type: "personnel_updated",
            title: "Mise à jour de profil",
            description: "Le profil de Jean Dupont a été mis à jour.",
            timestamp: new Date(Date.now() - Math.random() * 3600000), // Dernière heure
            status: "info",
            icon: <UserCog className="h-4 w-4" />,
          },
          {
            id: `rand-conge-app-${Date.now()}`,
            type: "conge_approved",
            title: "Congé approuvé",
            description: "La demande de vacances de Marie Curie a été approuvée.",
            timestamp: new Date(Date.now() - Math.random() * 7200000), // Dernières 2 heures
            status: "success",
            icon: <CheckCircle className="h-4 w-4" />,
          },
        ];
        newActivities.push(randomActivities[Math.floor(Math.random() * randomActivities.length)]);
      }


      // Trier par timestamp (le plus récent en premier)
      newActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      // Limiter le nombre d'activités affichées pour la performance
      setActivities(newActivities.slice(0, 10)); // Garder les 10 dernières activités
      setLastUpdate(new Date());
    };

    generatePersonnelActivities();
    const interval = setInterval(generatePersonnelActivities, 30000); // Mise à jour toutes les 30s

    return () => clearInterval(interval);
  }, [statsPersonnel]); // Dépend de statsPersonnel pour les mises à jour

  // Vérifier la connexion (idem que l'autre composant)
  useEffect(() => {
    const checkOnline = () => {
      setIsOnline(navigator.onLine);
    };

    checkOnline();
    window.addEventListener('online', checkOnline);
    window.addEventListener('offline', checkOnline);

    return () => {
      window.removeEventListener('online', checkOnline);
      window.removeEventListener('offline', checkOnline);
    };
  }, []);

  const getStatusColor = (status: PersonnelActivityItem['status']) => {
    switch (status) {
      case "success": return "text-green-500 bg-green-100 dark:bg-green-900/20";
      case "warning": return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20";
      case "error": return "text-red-500 bg-red-100 dark:bg-red-900/20";
      case "info": return "text-blue-500 bg-blue-100 dark:bg-blue-900/20"; // Pour 'En attente'
      default: return "text-gray-500 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  const getTypeBadgeText = (type: PersonnelActivityItem['type']) => {
    switch(type) {
      case "personnel_registered": return "Inscription";
      case "personnel_updated": return "Mise à jour";
      case "conge_requested": return "Demande congé";
      case "conge_approved": return "Congé approuvé";
      case "conge_rejected": return "Congé refusé";
      default: return "Activité";
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statut en temps réel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Activité du personnel en temps réel</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            isOnline
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            <Wifi className="h-3 w-3" />
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </div>
          <Button variant="outline" size="sm" onClick={() => setLastUpdate(new Date())}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Flux d'activité */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {activities.length === 0 && (
              <p className="p-4 text-center text-muted-foreground">Aucune activité récente du personnel.</p>
            )}
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors ${
                  index !== activities.length - 1 ? 'border-b' : ''
                }`}
              >
                <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={activity.status === "success" ? "default" : (activity.status === "error" ? "destructive" : "secondary")}
                        className="text-xs"
                      >
                        {getTypeBadgeText(activity.type)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques de l'activité du personnel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {activities.filter(a => a.status === "success").length}
                </div>
                <div className="text-xs text-muted-foreground">Succès</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {activities.filter(a => a.status === "warning" || a.type === "conge_rejected").length}
                </div>
                <div className="text-xs text-muted-foreground">Alertes/Refus</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Clock3 className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {activities.length}
                </div>
                <div className="text-xs text-muted-foreground">Total Activités</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dernière mise à jour */}
      <div className="text-center text-xs text-muted-foreground">
        Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
      </div>
    </div>
  );
}