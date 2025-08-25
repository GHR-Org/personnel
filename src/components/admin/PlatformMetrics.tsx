"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building, 
  Globe, 
  Activity,
  Target,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";

interface PlatformMetricsProps {
  stats: {
    total_etablissements: number;
    hotels: number;
    restaurants: number;
    hotel_restaurants: number;
    etablissements_recents_30_jours: number;
    etablissements_recents_7_jours: number;
    taux_adoption: number;
    taux_croissance: number;
    densite_geographique: number;
    etablissements_par_statut: { [key: string]: number };
    top_villes: Array<{ ville: string; nb_etablissements: number }>;
  };
}

export function PlatformMetrics({ stats }: PlatformMetricsProps) {
  const totalActifs = stats.etablissements_par_statut["Activer"] || 0;
  const totalInactifs = stats.etablissements_par_statut["Inactive"] || 0;
  const tauxActifs = (totalActifs / stats.total_etablissements) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Métriques de performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance de la plateforme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Taux d'adoption</span>
              <span className="font-semibold">{stats.taux_adoption.toFixed(1)}%</span>
            </div>
            <Progress value={stats.taux_adoption} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Taux de croissance</span>
              <span className="font-semibold">{stats.taux_croissance.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(stats.taux_croissance, 100)} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Densité géographique</span>
              <span className="font-semibold">{stats.densite_geographique.toFixed(1)}</span>
            </div>
            <Progress value={Math.min((stats.densite_geographique / 10) * 100, 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Statut des établissements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Statut des établissements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Actifs</span>
              </div>
              <span className="font-semibold">{totalActifs}</span>
            </div>
            <Progress value={tauxActifs} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Inactifs</span>
              </div>
              <span className="font-semibold">{totalInactifs}</span>
            </div>
            <Progress value={100 - tauxActifs} className="h-2" />
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span>Total</span>
              <span className="font-semibold">{stats.total_etablissements}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Croissance récente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Croissance récente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">30 derniers jours</span>
              </div>
              <Badge variant="default" className="bg-green-500">
                +{stats.etablissements_recents_30_jours}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">7 derniers jours</span>
              </div>
              <Badge variant="default" className="bg-blue-500">
                +{stats.etablissements_recents_7_jours}
              </Badge>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {((stats.etablissements_recents_7_jours / 7) * 30).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                Projetion mensuelle
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 