/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/personnel/RealTimePersonnelActivity.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock, UserPlus, UserCog, Briefcase, Wifi, Activity,
  AlertTriangle, CheckCircle, RefreshCw, Clock3, XCircle
} from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";

// Interface pour le format d'affichage
interface PersonnelActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  status: "success" | "info" | "warning" | "error";
  icon: React.ReactNode;
}

interface RealTimePersonnelActivityProps {
  etablissementId: number;
  onNewNotification: () => void;
}

// Fonction de mapping simplifiée pour le nouveau format
const mapWebSocketMessageToActivity = (event: string, message: string): PersonnelActivityItem => {
  let icon: React.ReactNode;
  let status: PersonnelActivityItem['status'];
  
  // Définir l'icône et le statut en fonction du nom de l'événement
  switch (event) {
    case "personnel_registered":
      icon = <UserPlus className="h-4 w-4" />;
      status = "success";
      break;
    case "personnel_updated":
      icon = <UserCog className="h-4 w-4" />;
      status = "info";
      break;
    case "conge_requested":
      icon = <Clock className="h-4 w-4" />;
      status = "info";
      break;
    case "conge_approved":
      icon = <CheckCircle className="h-4 w-4" />;
      status = "success";
      break;
    case "conge_rejected":
      icon = <XCircle className="h-4 w-4" />;
      status = "error";
      break;
    case "chambre_delete":
      icon = <XCircle className="h-4 w-4" />;
      status = "error";
      break;
    default:
      icon = <Activity className="h-4 w-4" />;
      status = "info";
  }

  // Créer un titre lisible à partir de l'événement
  const title = event.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());

  return {
    id: `event-${Date.now()}-${Math.random()}`,
    type: event,
    title,
    description: message,
    timestamp: new Date(),
    status,
    icon,
  };
};

export function RealTimePersonnelActivity({ etablissementId, onNewNotification }: RealTimePersonnelActivityProps) {
  const [activities, setActivities] = useState<PersonnelActivityItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const url = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/etablissement/${etablissementId}`;
  const { lastMessage, isConnected: wsConnected } = useWebSocket(url);

  // Mettre à jour l'état de la connexion basé sur le hook
  useEffect(() => {
    setIsConnected(wsConnected);
  }, [wsConnected]);

  // Hook pour les nouvelles notifications du WebSocket
  useEffect(() => {
    if (lastMessage) {
      try {
        const { event, payload } = JSON.parse(lastMessage.data);
        const newActivity = mapWebSocketMessageToActivity(event, payload.message);
        
        setActivities(prevActivities => {
          const updatedActivities = [newActivity, ...prevActivities];
          return updatedActivities.slice(0, 20);
        });
        
        setLastUpdate(new Date());
        onNewNotification();
        
      } catch (error) {
        console.error("Erreur lors de l'analyse du message WebSocket:", error);
      }
    }
  }, [lastMessage, onNewNotification]);

  const getStatusColor = (status: PersonnelActivityItem['status']) => {
    switch (status) {
      case "success": return "text-green-500 bg-green-100 dark:bg-green-900/20";
      case "warning": return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20";
      case "error": return "text-red-500 bg-red-100 dark:bg-red-900/20";
      case "info": return "text-blue-500 bg-blue-100 dark:bg-blue-900/20";
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
    // Si l'événement est 'chambre_delete', afficher 'Suppression'
    switch (type) {
      case "personnel_registered": return "Inscription";
      case "personnel_updated": return "Mise à jour";
      case "conge_requested": return "Demande congé";
      case "conge_approved": return "Congé approuvé";
      case "conge_rejected": return "Congé refusé";
      case "chambre_delete": return "Suppression";
      default: return "Activité";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            isConnected
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            <Wifi className="h-3 w-3" />
            {isConnected ? 'Connecté' : 'Déconnecté'}
          </div>
          
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={() => setLastUpdate(new Date())}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

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

       <div className="flex flex-col gap-4">
      {/* Conteneur pour les 2 cartes du haut */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Carte des Succès */}
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

        {/* Carte des Alertes/Refus */}
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
      </div>

      {/* Carte "Total Activités" qui prendra toute la largeur */}
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

      <div className="text-center text-xs text-muted-foreground">
        Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
      </div>
    </div>
  );
}