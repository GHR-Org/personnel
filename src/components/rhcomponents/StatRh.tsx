"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface UserAccountsData {
  clients: {
    nombre_active: number;
    nombre_inactive: number;
    nombre_suspendu: number;
    nombre_total: number;
  };
  etablissements: {
    nombre_hotelerie: number;
    nombre_restauration: number;
    nombre_Hotel_et_restauration: number;
    total: number;
    actifs: number;
    inactifs: number;
  };
}

interface UserAccountsChartProps {
  data: UserAccountsData;
}

export function UserAccountsChart({ data }: UserAccountsChartProps) {
  // Générer des données temporelles pour simuler l'évolution des comptes
  const generateTimeSeriesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const baseClients = data.clients.nombre_total;
    const baseEtablissements = data.etablissements.total;
    
    return months.map((month, index) => {
      // Simulation de croissance avec variations
      const growthFactor = 1 + (index * 0.1) + (Math.random() * 0.2 - 0.1);
      const clientsGrowth = Math.floor(baseClients * growthFactor);
      const etablissementsGrowth = Math.floor(baseEtablissements * (1 + index * 0.05));
      
      return {
        month,
        Clients: clientsGrowth,
        Établissements: etablissementsGrowth,
      };
    });
  };

  const chartData = generateTimeSeriesData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {label} 2025
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {entry.name}:
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="rounded-xl shadow-lg border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-blue-600" />
          Évolution des Comptes Utilisateurs
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Croissance des comptes clients et établissements au fil du temps
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 14, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
                iconSize={8}
              />
              <Line 
                type="monotone"
                dataKey="Clients" 
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              />
              <Line 
                type="monotone"
                dataKey="Établissements" 
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Résumé en bas */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-6">
            {/* Clients */}
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-red-600" />
                Clients ({data.clients.nombre_total.toLocaleString()})
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{data.clients.nombre_active}</div>
                  <div className="text-xs text-muted-foreground">Actifs</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">{data.clients.nombre_inactive}</div>
                  <div className="text-xs text-muted-foreground">Inactifs</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">{data.clients.nombre_suspendu}</div>
                  <div className="text-xs text-muted-foreground">Suspendus</div>
                </div>
              </div>
            </div>
            
            {/* Établissements */}
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Building className="h-4 w-4 text-orange-600" />
                Établissements ({data.etablissements.total.toLocaleString()})
              </h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{data.etablissements.actifs}</div>
                  <div className="text-xs text-muted-foreground">Actifs</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">{data.etablissements.inactifs}</div>
                  <div className="text-xs text-muted-foreground">Inactifs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 