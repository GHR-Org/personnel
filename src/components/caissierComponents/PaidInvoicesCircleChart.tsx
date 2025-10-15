// components/caissierComponents/PaidInvoicesCircleChart.tsx
"use client";

import * as React from "react";
import { Pie, PieChart, Cell,  Sector as RechartsSector } from "recharts";
import {
  Card,
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

interface PaidInvoicesCircleChartProps {
  totalInvoices: number;
  totalPaidInvoices: number;
}

const chartConfig = {
  paid: {
    label: "Payées",
    color: "hsl(var(--chart-1))",
  },
  unpaid: {
    label: "Non payées",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function PaidInvoicesCircleChart({
  totalInvoices,
  totalPaidInvoices,
}: PaidInvoicesCircleChartProps) {
  const totalUnpaidInvoices = totalInvoices - totalPaidInvoices;

  // --- NOUVEAU: Lire les couleurs CSS directement si possible ---
  // Cette approche est plus robuste si ChartContainer ne transmet pas les vars correctement


  // Pour garantir que les couleurs sont bien lues, vous pouvez faire cela:
  // Note: document.documentElement n'est disponible que côté client
  const resolvedPaidColor = typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--chart-1') : '155 77% 65%'; // Fallback pour SSR
  const resolvedUnpaidColor = typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--chart-5') : '16 40% 65%'; // Fallback pour SSR

  // Si vous utilisez ChartContainer, il est censé gérer ça, mais si ça ne marche pas,
  // vous pouvez forcer les couleurs HSL si les variables ne sont pas résolues
  const data = [
    { name: "Payées", value: totalPaidInvoices, fill: `hsl(${resolvedPaidColor})` }, // Utilise la couleur HSL directe
    { name: "Non payées", value: totalUnpaidInvoices, fill: `hsl(${resolvedUnpaidColor})` }, // Utilise la couleur HSL directe
  ];

  const globalPercentagePaid = totalInvoices > 0 ? ((totalPaidInvoices / totalInvoices) * 100).toFixed(1) : "0.0";

  interface PieSectorDataItem {
    cx: number;
    cy: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
    payload: {
      name: string;
      value: number;
      fill: string;
    };
    percent: number;
    value: number;
    index: number;
  }

  const renderActiveShape = (props: PieSectorDataItem) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

    const displayPercentage = (payload.name === "Payées")
      ? (percent * 100).toFixed(1)
      : globalPercentagePaid;

    const displayText = (payload.name === "Payées") ? "Payées" : "Non payées";

    return (
      <g>
        <RechartsSector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke={fill}
          strokeWidth={3}
        />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="text-xl font-bold">
          {displayPercentage}%
        </text>
        <text x={cx} y={cy + 20} textAnchor="middle" dominantBaseline="central" className="text-sm text-muted-foreground">
          {displayText}
        </text>
      </g>
    );
  };


  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader className="items-center pb-0">
        <CardTitle>Factures Payées</CardTitle>
        <CardDescription>Pourcentage de factures payées</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig} // Gardez le config pour le tooltip et les légendes de ChartContainer
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={0}
              activeShape={(props: unknown) => renderActiveShape(props as PieSectorDataItem)}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}