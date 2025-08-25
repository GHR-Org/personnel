"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Un graphique interactif des nuits réservées"

// Vos données de réservation (inchangées)
const reservationData = [
  {
    "id": 1,
    "firstName": "Alice",
    "lastName": "Dupont",
    "room": "101",
    "startDate": "2025-07-05",
    "endDate": "2025-07-10",
    "nights": 5,
    "total": 500,
    "status": "Confirmée"
  },
  {
    "id": 2,
    "firstName": "Karim",
    "lastName": "Benali",
    "room": "102",
    "startDate": "2025-07-06",
    "endDate": "2025-07-08",
    "nights": 2,
    "total": 220,
    "status": "En attente"
  },
  {
    "id": 3,
    "firstName": "Laura",
    "lastName": "Martin",
    "room": "201",
    "startDate": "2025-07-07",
    "endDate": "2025-07-12",
    "nights": 5,
    "total": 600,
    "status": "Check-in"
  },
  {
    "id": 4,
    "firstName": "Jean",
    "lastName": "Moreau",
    "room": "305",
    "startDate": "2025-07-01",
    "endDate": "2025-07-03",
    "nights": 2,
    "total": 180,
    "status": "Check-out"
  },
  {
    "id": 5,
    "firstName": "Fatima",
    "lastName": "El Idrissi",
    "room": "104",
    "startDate": "2025-07-09",
    "endDate": "2025-07-15",
    "nights": 6,
    "total": 720,
    "status": "Confirmée"
  },
  {
    "id": 6,
    "firstName": "Tom",
    "lastName": "Durand",
    "room": "110",
    "startDate": "2025-07-08",
    "endDate": "2025-07-09",
    "nights": 1,
    "total": 100,
    "status": "Annulée"
  },
  {
    "id": 7,
    "firstName": "Leila",
    "lastName": "Bouzid",
    "room": "207",
    "startDate": "2025-07-10",
    "endDate": "2025-07-14",
    "nights": 4,
    "total": 480,
    "status": "En attente"
  },
  {
    "id": 8,
    "firstName": "Marc",
    "lastName": "Petit",
    "room": "302",
    "startDate": "2025-07-02",
    "endDate": "2025-07-07",
    "nights": 5,
    "total": 550,
    "status": "Check-out"
  }
];


// Fonction pour agréger les données par jour (inchangée)
const aggregateReservationData = (data: typeof reservationData) => {
  const dailyNights: { [key: string]: number } = {};

  data.forEach(reservation => {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      dailyNights[dateString] = (dailyNights[dateString] || 0) + 1;
    }
  });

  const aggregatedData = Object.keys(dailyNights)
    .sort()
    .map(date => ({
      date: date,
      nightsBooked: dailyNights[date]
    }));

  return aggregatedData;
};

const aggregatedChartData = aggregateReservationData(reservationData);

const chartConfig = {
  nightsBooked: {
    label: "Nuits réservées",
    // Utiliser directement la variable --chart-1 que vous avez déjà définie en OKLCH
    color: "hsl(var(--chart-1))", // Recharts utilise HSL, donc on doit le convertir
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const filteredData = React.useMemo(() => {
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }

    const startDateFilter = new Date(today);
    startDateFilter.setDate(today.getDate() - daysToSubtract);

    return aggregatedChartData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDateFilter;
    });
  }, [timeRange, today]);


  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Nuits Réservées par Jour</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Nombre total de nuits réservées sur la période sélectionnée
          </span>
          <span className="@[540px]/card:hidden">Nuits par période</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 derniers mois</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 derniers jours</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 derniers jours</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Sélectionner une période"
            >
              <SelectValue placeholder="3 derniers mois" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 derniers mois
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 derniers jours
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 derniers jours
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
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillNightsBooked" x1="0" y1="0" x2="0" y2="1">
                {/* Recharts attend des couleurs CSS directes.
                    Si --chart-1 est déjà OKLCH, pas besoin de hsl().
                    Sinon, si --chart-1 est en HSL, il faut hsl() ici.
                    Puisque vos variables sont en OKLCH, Recharts peut ne pas les supporter directement
                    dans `stopColor` sans conversion.
                    La solution la plus robuste est d'avoir une variable CSS qui est déjà en HSL ou RGB
                    pour les propriétés de `fill` ou `stroke` de Recharts,
                    ou de convertir la couleur OKLCH en HSL/RGB au moment de l'utilisation si vous voulez rester purement OKLCH partout.

                    Cependant, Recharts peut souvent gérer `oklch(...)` directement si le navigateur le supporte.
                    Pour la compatibilité, la librairie `ui/chart` de shadcn/ui (qui semble être votre base)
                    utilise généralement `hsl(var(--chart-X))` car les variables `--chart-X` y sont définies en HSL.
                    Si vos `--chart-X` sont des valeurs OKLCH brutes, vous devriez soit :
                    1. Changer `chartConfig.color` à `oklch(var(--chart-1))` et le `stopColor` et `stroke` à `oklch(var(--chart-1))`.
                    2. Définir `--chart-1` dans votre CSS comme `hsl(...)` au lieu de `oklch(...)`.
                    3. Utiliser une fonction de conversion JS pour convertir oklch en hsl/rgb au moment de l'utilisation.

                    Étant donné que vous avez `oklch(0.646 0.222 41.116);` pour `--chart-1`,
                    Recharts pourrait avoir du mal avec `oklch(...)` directement dans ses props `stopColor` ou `stroke`
                    si les navigateurs ne le supportent pas universellement pour SVG.
                    La façon la plus sûre de garantir que cela fonctionne avec Recharts et `shadcn/ui`
                    est d'utiliser `hsl(var(--chart-1))` si votre --chart-1 est déjà une valeur HSL,
                    ou de la convertir en HSL dans le CSS pour Recharts.

                    Cependant, la doc de shadcn/ui `chart` montre qu'elle utilise `hsl(var(--chart-1))`.
                    Cela implique que leurs variables `--chart-X` sont *attendues* au format HSL.
                    Si vous les avez définies en OKLCH dans votre `globals.css` et que vous les utilisez
                    avec `hsl(var(--chart-1))` dans React, cela ne fonctionnera pas comme prévu
                    car `hsl(oklch(...))` n'est pas une syntaxe CSS valide.

                    Re-vérifions la meilleure approche pour _votre_ configuration exacte.
                    Puisque vous avez `--chart-1: oklch(...)`, nous devons nous assurer que Recharts peut l'interpréter.
                    Les navigateurs modernes peuvent souvent gérer `oklch(...)` directement dans les attributs SVG.
                    Donc, essayons `oklch(var(--chart-1))` directement.
                */}
                <stop
                  offset="5%"
                  stopColor="oklch(var(--chart-1))" // Utiliser la couleur --chart-1 en OKLCH
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="oklch(var(--chart-1))" // Même couleur
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="nightsBooked"
              type="natural"
              fill="url(#fillNightsBooked)"
              stroke="oklch(var(--chart-1))" // Utiliser la couleur --chart-1 en OKLCH pour le trait
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}