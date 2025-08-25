// components/caissierComponents/RevenueChart.tsx
"use client"; // Important pour Recharts qui est un composant client

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DailyRevenue {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  data: DailyRevenue[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="col-span-4"> {/* Ajustez le col-span si nécessaire selon votre mise en page */}
      <CardHeader>
        <CardTitle>Aperçu des Revenus Journaliers (Factures Payées)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            Aucune donnée de revenu pour le graphique.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value.toLocaleString('mg-MG')}`}
              />
              <Tooltip
                formatter={(value: number) => value.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
                name="Revenus (MGA)"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}