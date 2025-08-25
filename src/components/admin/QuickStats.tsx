"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Calendar,
  MapPin,
  Building,
  Users,
  Activity,
  Zap,
  Target,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface QuickStatsProps {
  stats: {
    total_etablissements: number;
    etablissements_recents_7_jours: number;
    etablissements_recents_30_jours: number;
    taux_croissance: number;
    top_villes: Array<{ ville: string; nb_etablissements: number }>;
    etablissements_par_statut: { [key: string]: number };
  };
}

export function QuickStats({ stats }: QuickStatsProps) {
  const totalActifs = stats.etablissements_par_statut["Activer"] || 0;
  const totalInactifs = stats.etablissements_par_statut["Inactive"] || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Widget de croissance */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Croissance</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {stats.taux_croissance.toFixed(1)}%
              </p>
            </div>
            <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-full">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs text-blue-600 dark:text-blue-400">
              +{stats.etablissements_recents_7_jours} cette semaine
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Widget de statut */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Actifs</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {totalActifs}
              </p>
            </div>
            <div className="p-2 bg-green-200 dark:bg-green-800 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs text-green-600 dark:text-green-400">
              {((totalActifs / stats.total_etablissements) * 100).toFixed(1)}% du total
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Widget de géographie */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Villes</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {stats.top_villes.length}
              </p>
            </div>
            <div className="p-2 bg-purple-200 dark:bg-purple-800 rounded-full">
              <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs text-purple-600 dark:text-purple-400">
              {stats.top_villes[0]?.ville || "Aucune"} en tête
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Widget de performance */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Performance</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {stats.etablissements_recents_30_jours}
              </p>
            </div>
            <div className="p-2 bg-orange-200 dark:bg-orange-800 rounded-full">
              <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs text-orange-600 dark:text-orange-400">
              Nouveaux ce mois
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Widget d'alerte rapide
export function QuickAlert({ message, type = "info" }: { message: string; type?: "info" | "warning" | "success" | "error" }) {
  const alertStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300",
    success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300",
    error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
  };

  const icons = {
    info: <AlertCircle className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    success: <CheckCircle className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />
  };

  return (
    <div className={`p-4 border rounded-lg ${alertStyles[type]} flex items-center gap-2`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

// Widget de métrique rapide
export function QuickMetric({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon 
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            {icon}
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-2 flex items-center gap-1">
            {trend > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 