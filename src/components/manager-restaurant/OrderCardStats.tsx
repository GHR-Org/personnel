// src/components/manager-restaurant/OrderCardStats.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface OrderCardStatsProps {
  title: string;
  count: number;
  badgeText: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline" | "success";
  change?: number; // Pourcentage de changement
}

const StatChange = ({ change }: { change?: number }) => {
  if (change === undefined) return null;

  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <span
      className={cn(
        "ml-2 text-xs font-semibold rounded-full px-2 py-0.5",
        isPositive && "bg-green-100 text-green-800", // Vert pour les augmentations
        isNegative && "bg-red-100 text-red-800", // Rouge pour les diminutions
        !isPositive && !isNegative && "bg-yellow-100 text-yellow-800" // Jaune pour 0%
      )}
    >
      {isPositive ? `+${change}%` : `${change}%`}
    </span>
  );
};

export const OrderCardStats = ({ title, count, badgeText, badgeVariant, change }: OrderCardStatsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Badge variant={badgeVariant}>{badgeText}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-center">
          {count}
          <StatChange change={change} />
        </div>
      </CardContent>
    </Card>
  );
};