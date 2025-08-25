"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

// Description du graphique
export const description = "Chiffre d'affaires mensuel (exemple)";

// Exemple de données mensuelles de chiffre d'affaires
const revenueData = [
  { mois: "Janvier", total: 120000 },
  { mois: "Février", total: 95000 },
  { mois: "Mars", total: 110000 },
  { mois: "Avril", total: 130000 },
  { mois: "Mai", total: 125000 },
  { mois: "Juin", total: 140000 },
  { mois: "Juillet", total: 135000 },
  { mois: "Août", total: 128000 },
  { mois: "Septembre", total: 119000 },
  { mois: "Octobre", total: 145000 },
  { mois: "Novembre", total: 138000 },
  { mois: "Décembre", total: 150000 },
];

const chartConfig = {
  total: {
    label: "Chiffre d'affaires (Ar)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("12m");

  // Filtrage par période (ici, toujours 12 mois, mais structure prête pour extension)
  const filteredData = React.useMemo(() => {
    // Pour l'exemple, retourne tout
    return revenueData;
  }, [timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Chiffre d'affaires mensuel</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Évolution du chiffre d'affaires sur les 12 derniers mois
          </span>
          <span className="@[540px]/card:hidden">CA par mois</span>
        </CardDescription>
        <CardAction>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Sélectionner une période"
            >
              <SelectValue placeholder="12 derniers mois" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="12m" className="rounded-lg">
                12 derniers mois
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="mois" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#fillRevenue)"
                name="Chiffre d'affaires"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 