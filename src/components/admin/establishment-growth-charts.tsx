"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrowthChart } from "./growth-chart";
import { Building, Globe, Hotel, Utensils } from "lucide-react";

interface GrowthData {
  "Hotelerie": Array<{ mois: string; nouveaux_etablissements: number }>;
  "Restauration": Array<{ mois: string; nouveaux_etablissements: number }>;
  "Hotelerie et Restauration": Array<{ mois: string; nouveaux_etablissements: number }>;
}

interface EstablishmentGrowthChartsProps {
  data: GrowthData;
}

const chartConfigs = [
  {
    type: "Hotelerie",
    icon: Hotel,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    glowColor: "shadow-blue-500/20"
  },
  {
    type: "Restauration", 
    icon: Utensils,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    glowColor: "shadow-purple-500/20"
  },
  {
    type: "Hotelerie et Restauration",
    icon: Building,
    color: "from-orange-500 to-red-500", 
    bgColor: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30",
    glowColor: "shadow-orange-500/20"
  }
];

export function EstablishmentGrowthCharts({ data }: EstablishmentGrowthChartsProps) {
  const [visibleCharts, setVisibleCharts] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    // Animation séquentielle des graphiques
    const timer1 = setTimeout(() => setVisibleCharts([true, false, false]), 200);
    const timer2 = setTimeout(() => setVisibleCharts([true, true, false]), 400);
    const timer3 = setTimeout(() => setVisibleCharts([true, true, true]), 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Titre de section avec effet Horizon UI */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Analyse de Croissance par Type
        </h2>
        <p className="text-white/70 text-lg">
          Évolution temporelle des inscriptions par catégorie d'établissement
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      {/* Grille des graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chartConfigs.map((config, index) => {
          const IconComponent = config.icon;
          const chartData = data[config.type as keyof GrowthData] || [];
          const isVisible = visibleCharts[index];

          return (
            <div
              key={config.type}
              className={`transition-all duration-1000 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-10 scale-95'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <Card className={`relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group ${config.glowColor}`}>
                {/* Effet de fond animé */}
                <div className={`absolute inset-0 bg-gradient-to-r ${config.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
                
                {/* Bordure animée */}
                <div className={`absolute inset-0 rounded-xl border-2 ${config.borderColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-3 group-hover:scale-105 transition-transform duration-300">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      {config.type}
                    </span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <GrowthChart 
                    data={chartData} 
                    title={`Croissance ${config.type}`} 
                  />
                  
                  {/* Statistiques rapides */}
                  {chartData.length > 0 && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {chartData[chartData.length - 1]?.nouveaux_etablissements || 0}
                          </div>
                          <div className="text-xs text-white/60">Ce mois</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {Math.max(...chartData.map(d => d.nouveaux_etablissements))}
                          </div>
                          <div className="text-xs text-white/60">Maximum</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Card>
            </div>
          );
        })}
      </div>

      {/* Indicateurs de performance globaux */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {chartConfigs.map((config, index) => {
          const chartData = data[config.type as keyof GrowthData] || [];
          const totalGrowth = chartData.reduce((sum, d) => sum + d.nouveaux_etablissements, 0);
          const avgGrowth = chartData.length > 0 ? Math.round(totalGrowth / chartData.length) : 0;
          
          return (
            <div
              key={`stats-${config.type}`}
              className={`p-6 rounded-xl bg-gradient-to-r ${config.bgColor} border ${config.borderColor} transition-all duration-500 hover:scale-105 ${config.glowColor}`}
              style={{ animationDelay: `${(index + 3) * 200}ms` }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{totalGrowth}</div>
                <div className="text-white/80 text-sm mb-1">Total {config.type}</div>
                <div className="text-white/60 text-xs">Moyenne: {avgGrowth}/mois</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 