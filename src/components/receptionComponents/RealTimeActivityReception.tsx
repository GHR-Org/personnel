"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Building, 
  Users, 
  Globe, 
  Wifi, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "establishment_created" | "establishment_updated" | "user_registered" | "system_alert";
  title: string;
  description: string;
  timestamp: Date;
  status: "success" | "warning" | "error" | "info";
  icon: React.ReactNode;
}

interface RealTimeActivityProps {
  stats: {
    etablissements_recents: Array<{
      nom: string;
      ville: string;
      type: string;
      statut: string;
      date_creation: string;
      email: string;
    }>;
    alertes: Array<{ type: string; message: string }>;
  };
}

export function RealTimeActivity({ stats }: RealTimeActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simuler des activités en temps réel
  useEffect(() => {
    const generateActivities = () => {
      const newActivities: ActivityItem[] = [];
      
      // Convertir les établissements récents en activités
      stats.etablissements_recents.slice(0, 5).forEach((etab, index) => {
        newActivities.push({
          id: `etab-${index}`,
          type: "establishment_created",
          title: `Nouvel établissement: ${etab.nom}`,
          description: `${etab.type} à ${etab.ville}`,
          timestamp: new Date(etab.date_creation),
          status: "success",
          icon: <Building className="h-4 w-4" />
        });
      });

      // Ajouter des alertes système
      stats.alertes.forEach((alerte, index) => {
        newActivities.push({
          id: `alert-${index}`,
          type: "system_alert",
          title: "Alerte système",
          description: alerte.message,
          timestamp: new Date(Date.now() - Math.random() * 86400000), // Dernières 24h
          status: alerte.type === "warning" ? "warning" : "info",
          icon: <AlertTriangle className="h-4 w-4" />
        });
      });

      // Trier par timestamp
      newActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setActivities(newActivities);
      setLastUpdate(new Date());
    };

    generateActivities();
    const interval = setInterval(generateActivities, 30000); // Mise à jour toutes les 30s
    
    return () => clearInterval(interval);
  }, [stats]);

  // Vérifier la connexion
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-500 bg-green-100 dark:bg-green-900/20";
      case "warning": return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20";
      case "error": return "text-red-500 bg-red-100 dark:bg-red-900/20";
      default: return "text-blue-500 bg-blue-100 dark:bg-blue-900/20";
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

  return (
    <div className="space-y-6">
      {/* En-tête avec statut en temps réel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Activité en temps réel</h3>
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
                        variant={activity.status === "success" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {activity.type === "establishment_created" && "Nouveau"}
                        {activity.type === "establishment_updated" && "Modifié"}
                        {activity.type === "user_registered" && "Inscription"}
                        {activity.type === "system_alert" && "Alerte"}
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

      {/* Statistiques de l'activité */}
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
                  {activities.filter(a => a.status === "warning").length}
                </div>
                <div className="text-xs text-muted-foreground">Alertes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {activities.length}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
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