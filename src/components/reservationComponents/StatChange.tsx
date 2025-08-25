"use client"
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ShoppingCart } from "lucide-react";

interface StatCardProps {
  title: string;
  stats: {
    label: string;
    value: number | string;
    change?: number; // en pourcentage, positif ou négatif
  }[];
  weekSelector?: boolean;
}

const StatChange = ({ change }: { change?: number }) => {
  if (change === undefined) return null;
  if (change > 0)
    return (
      <span className="ml-2 text-xs font-semibold text-secondary-foreground bg-secondary/20 rounded-full px-1.5 py-0.5">
        +{change} %
      </span>
    );
  if (change < 0)
    return (
      <span className="ml-2 text-xs font-semibold text-destructive-foreground bg-destructive/20 rounded-full px-1.5 py-0.5">
        {change} %
      </span>
    );
  return (
    <span className="ml-2 text-xs font-semibold text-accent-foreground bg-accent/20 rounded-full px-1.5 py-0.5">
      0%
    </span>
  );
};

export const ReservationStatsCard = ({ title, stats, weekSelector }: StatCardProps) => {
  const [dateRange, setDateRange] = useState("This week");

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-lg p-6 flex flex-col gap-6 w-3xl h-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <span className="font-semibold text-foreground">{title}</span>
        </div>

        {weekSelector && (
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[120px] h-9 text-xs border-primary">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="This week">Cette semaine</SelectItem>
              <SelectItem value="Last week">La semaine dernière</SelectItem>
              <SelectItem value="This month">Ce mois-ci</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex justify-between items-center">
        {stats.map(({ label, value, change }, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-start gap-1">
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
              <div className="flex items-center">
                <span className="text-2xl font-bold">{value}</span>
                <StatChange change={change} />
              </div>
            </div>
            {i < stats.length - 1 && (
              <div className="h-16 w-px bg-border" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};