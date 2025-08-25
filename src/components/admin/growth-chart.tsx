"use client";

import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface GrowthData {
  mois: string;
  nouveaux_etablissements: number;
}

interface GrowthChartProps {
  data: GrowthData[];
  title?: string;
}

// Données d'exemple si aucune donnée n'est fournie
const defaultData: GrowthData[] = [
  { mois: "Jan", nouveaux_etablissements: 5 },
  { mois: "Fév", nouveaux_etablissements: 8 },
  { mois: "Mar", nouveaux_etablissements: 12 },
  { mois: "Avr", nouveaux_etablissements: 15 },
  { mois: "Mai", nouveaux_etablissements: 18 },
  { mois: "Juin", nouveaux_etablissements: 22 },
  { mois: "Juil", nouveaux_etablissements: 25 },
  { mois: "Août", nouveaux_etablissements: 28 },
  { mois: "Sep", nouveaux_etablissements: 30 },
  { mois: "Oct", nouveaux_etablissements: 32 },
  { mois: "Nov", nouveaux_etablissements: 35 },
  { mois: "Déc", nouveaux_etablissements: 38 },
];

const chartConfig = {
  nouveaux_etablissements: {
    label: "Nouveaux établissements",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Composant de tooltip personnalisé avec style Horizon UI
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-2xl">
        <div className="text-white font-semibold mb-2">{label}</div>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ 
                  background: `linear-gradient(135deg, ${entry.color}, ${entry.color}80)`,
                  boxShadow: `0 0 10px ${entry.color}40`
                }}
              />
              <span className="text-white/90">{entry.name}:</span>
              <span className="text-white font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function GrowthChart({ data = defaultData, title = "Croissance Globale" }: GrowthChartProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-0 shadow-2xl">
      {/* Effet de fond animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              className="transition-all duration-1000 ease-out"
              style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6"/>
                  <stop offset="50%" stopColor="#8b5cf6"/>
                  <stop offset="100%" stopColor="#ec4899"/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.1)" 
                vertical={false}
              />
              
              <XAxis 
                dataKey="mois" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                tickMargin={10}
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                tickMargin={10}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Zone de remplissage avec dégradé */}
              <Area
                type="monotone"
                dataKey="nouveaux_etablissements"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                fill="url(#colorGradient)"
                fillOpacity={0.3}
                dot={{
                  fill: "#3b82f6",
                  stroke: "#ffffff",
                  strokeWidth: 3,
                  r: 6,
                  filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))"
                }}
                activeDot={{
                  r: 8,
                  stroke: "#ffffff",
                  strokeWidth: 4,
                  fill: "#3b82f6",
                  filter: "drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))"
                }}
                name="Nouveaux établissements"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Indicateurs de performance */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-500/30">
            <div className="text-2xl font-bold text-blue-400">
              {data[data.length - 1]?.nouveaux_etablissements || 0}
            </div>
            <div className="text-xs text-blue-300">Ce mois</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-500/30">
            <div className="text-2xl font-bold text-purple-400">
              {Math.max(...data.map(d => d.nouveaux_etablissements))}
            </div>
            <div className="text-xs text-purple-300">Maximum</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-r from-pink-500/20 to-pink-600/20 rounded-lg border border-pink-500/30">
            <div className="text-2xl font-bold text-pink-400">
              {Math.round(data.reduce((sum, d) => sum + d.nouveaux_etablissements, 0) / data.length)}
            </div>
            <div className="text-xs text-pink-300">Moyenne</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 