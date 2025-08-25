/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/manager-restaurant/RapportsActivity.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ClipboardList, // Commandes
  Users,          // Personnel restaurant
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Clock3,
  XCircle,
  Wifi,
} from "lucide-react";

interface RestaurantActivityItem {
  id: string;
  type: "commande_interne" | "commande_externe" | "rapport_personnel" | "commande_annulee" | "commande_livree";
  title: string;
  description: string;
  timestamp: Date;
  status: "success" | "info" | "warning" | "error";
  icon: React.ReactNode;
}

interface RapportRestaurantProps {
  statsRestaurant: {
    commandesInternes: Array<{
      id: string;
      client: string;
      statut: "En cours" | "Livrée" | "Annulée";
      date_commande: string;
    }>;
    commandesExternes: Array<{
      id: string;
      client: string;
      statut: "En cours" | "Livrée" | "Annulée";
      date_commande: string;
    }>;
    rapportsPersonnels: Array<{
      auteur: string;
      contenu: string;
      date_rapport: string;
    }>;
  };
}

export function RapportActiviteRestaurant({ statsRestaurant }: RapportRestaurantProps) {
  const [activities, setActivities] = useState<RestaurantActivityItem[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const generateRestaurantActivities = () => {
      const newActivities: RestaurantActivityItem[] = [];

      // Commandes internes
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      statsRestaurant.commandesInternes.forEach((cmd, index) => {
        let status: RestaurantActivityItem["status"] = "info";
        let icon: React.ReactNode = <ClipboardList className="h-4 w-4" />;

        switch (cmd.statut) {
          case "Livrée":
            status = "success";
            icon = <CheckCircle className="h-4 w-4" />;
            break;
          case "Annulée":
            status = "error";
            icon = <XCircle className="h-4 w-4" />;
            break;
          case "En cours":
          default:
            status = "info";
            icon = <Clock className="h-4 w-4" />;
            break;
        }

        newActivities.push({
          id: `cmd-int-${cmd.id}`,
          type:
            cmd.statut === "Livrée"
              ? "commande_livree"
              : cmd.statut === "Annulée"
              ? "commande_annulee"
              : "commande_interne",
          title: `Commande interne #${cmd.id} (${cmd.statut})`,
          description: `Client : ${cmd.client}`,
          timestamp: new Date(cmd.date_commande),
          status,
          icon,
        });
      });

      // Commandes externes
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      statsRestaurant.commandesExternes.forEach((cmd, index) => {
        let status: RestaurantActivityItem["status"] = "info";
        let icon: React.ReactNode = <ClipboardList className="h-4 w-4" />;

        switch (cmd.statut) {
          case "Livrée":
            status = "success";
            icon = <CheckCircle className="h-4 w-4" />;
            break;
          case "Annulée":
            status = "error";
            icon = <XCircle className="h-4 w-4" />;
            break;
          case "En cours":
          default:
            status = "info";
            icon = <Clock className="h-4 w-4" />;
            break;
        }

        newActivities.push({
          id: `cmd-ext-${cmd.id}`,
          type:
            cmd.statut === "Livrée"
              ? "commande_livree"
              : cmd.statut === "Annulée"
              ? "commande_annulee"
              : "commande_externe",
          title: `Commande externe #${cmd.id} (${cmd.statut})`,
          description: `Client : ${cmd.client}`,
          timestamp: new Date(cmd.date_commande),
          status,
          icon,
        });
      });

      // Rapports personnels
      statsRestaurant.rapportsPersonnels.forEach((rapport, index) => {
        newActivities.push({
          id: `rapport-${index}-${Date.now()}`,
          type: "rapport_personnel",
          title: `Rapport du personnel : ${rapport.auteur}`,
          description: rapport.contenu,
          timestamp: new Date(rapport.date_rapport),
          status: "info",
          icon: <Users className="h-4 w-4" />,
        });
      });

      // Tri par date descendante
      newActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      // Garder les 20 plus récents
      setActivities(newActivities.slice(0, 20));
      setLastUpdate(new Date());
    };

    generateRestaurantActivities();

    const interval = setInterval(generateRestaurantActivities, 30000);
    return () => clearInterval(interval);
  }, [statsRestaurant]);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  function formatTimeAgo(date: Date) {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffMinutes < 1) return "À l'instant";
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    if (diffMinutes < 1440) return `Il y a ${Math.floor(diffMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffMinutes / 1440)}j`;
  }

  function getStatusColor(status: RestaurantActivityItem["status"]) {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "info":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "error":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  }

  function getBadgeLabel(type: RestaurantActivityItem["type"]) {
    switch (type) {
      case "commande_interne":
        return "Commande interne";
      case "commande_externe":
        return "Commande externe";
      case "commande_annulee":
        return "Commande annulée";
      case "commande_livree":
        return "Commande livrée";
      case "rapport_personnel":
        return "Rapport personnel";
      default:
        return "Activité";
    }
  }

  return (
    <div className="space-y-6 w-full ">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Activités du restaurant en temps réel</h3>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              isOnline
                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            <Wifi className="h-3 w-3" />
            {isOnline ? "En ligne" : "Hors ligne"}
          </div>
          <Button variant="outline" size="sm" onClick={() => setLastUpdate(new Date())}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Liste activités */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {activities.length === 0 && (
              <p className="p-4 text-center text-muted-foreground">
                Aucune activité récente dans le restaurant.
              </p>
            )}
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors ${
                  index !== activities.length - 1 ? "border-b" : ""
                }`}
              >
                <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          activity.status === "success"
                            ? "default"
                            : activity.status === "error"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {getBadgeLabel(activity.type)}
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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold">
                {activities.filter((a) => a.status === "success").length}
              </div>
              <div className="text-xs text-muted-foreground">Commandes réussies</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold">
                {activities.filter((a) => a.status === "error").length}
              </div>
              <div className="text-xs text-muted-foreground">Commandes annulées</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{activities.length}</div>
              <div className="text-xs text-muted-foreground">Total activités</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dernière mise à jour */}
      <div className="text-center text-xs text-muted-foreground">
        Dernière mise à jour : {lastUpdate.toLocaleTimeString("fr-FR")}
      </div>
    </div>
  );
}
