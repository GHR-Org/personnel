"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  MapPin,
  Building,
  Users,
  Activity
} from "lucide-react";

interface ChartData {
  croissance_mensuelle: Array<{ mois: string; nouveaux_etablissements: number }>;
  croissance_par_type: {
    [key: string]: Array<{ mois: string; nouveaux_etablissements: number }>;
  };
  etablissements_par_ville: { [key: string]: number };
  etablissements_par_statut: { [key: string]: number };
  inscriptions_par_jour: Array<{ date: string; inscriptions: number }>;
}

interface AdvancedChartsProps {
  data: ChartData;
}

export function AdvancedCharts({ data }: AdvancedChartsProps) {
  // Fonction pour créer un graphique en barres simple
  const createBarChart = (data: Array<{ label: string; value: number }>, maxValue: number) => {
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{item.label}</span>
              <span className="font-semibold">{item.value}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Fonction pour créer un graphique circulaire simple
  const createPieChart = (data: Array<{ label: string; value: number; color: string }>) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{item.value}</span>
              <span className="text-xs text-muted-foreground">
                ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Préparer les données pour les graphiques
  const croissanceData = data.croissance_mensuelle.slice(-6).map(item => ({
    label: item.mois,
    value: item.nouveaux_etablissements
  }));

  const villeData = Object.entries(data.etablissements_par_ville)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([ville, count]) => ({
      label: ville,
      value: count
    }));

  const statutData = Object.entries(data.etablissements_par_statut).map(([statut, count], index) => ({
    label: statut,
    value: count,
    color: index === 0 ? '#10b981' : '#ef4444'
  }));

  const inscriptionsData = data.inscriptions_par_jour.slice(-7).map(item => ({
    label: new Date(item.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    value: item.inscriptions
  }));

  return (
    <Tabs defaultValue="growth" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="growth">Croissance</TabsTrigger>
        <TabsTrigger value="geography">Géographie</TabsTrigger>
        <TabsTrigger value="status">Statuts</TabsTrigger>
        <TabsTrigger value="inscriptions">Inscriptions</TabsTrigger>
      </TabsList>

      <TabsContent value="growth" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Croissance mensuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              {createBarChart(
                croissanceData,
                Math.max(...croissanceData.map(d => d.value))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Croissance par type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(data.croissance_par_type).map(([type, data]) => (
                  <div key={type} className="space-y-2">
                    <h4 className="font-medium text-sm">{type}</h4>
                    {createBarChart(
                      data.slice(-3).map(item => ({
                        label: item.mois,
                        value: item.nouveaux_etablissements
                      })),
                      Math.max(...data.map(d => d.nouveaux_etablissements))
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="geography" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Répartition géographique
            </CardTitle>
          </CardHeader>
          <CardContent>
            {createBarChart(
              villeData,
              Math.max(...villeData.map(d => d.value))
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="status" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Statut des établissements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {createPieChart(statutData)}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="inscriptions" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Inscriptions par jour (7 derniers jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {createBarChart(
              inscriptionsData,
              Math.max(...inscriptionsData.map(d => d.value))
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 