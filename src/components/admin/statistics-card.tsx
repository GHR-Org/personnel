import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import * as React from "react";

interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function StatisticsCard({ title, value, subtitle, icon }: StatisticsCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardDescription className="text-muted-foreground">{title}</CardDescription>
          <CardTitle className="text-2xl font-bold tabular-nums">{value}</CardTitle>
          {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
        </div>
        {icon && <div className="text-primary/80">{icon}</div>}
      </CardHeader>
    </Card>
  );
} 