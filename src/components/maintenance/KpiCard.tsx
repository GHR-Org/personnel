import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  icon: ReactNode;
  value: number | string;
  description?: string;
  progress?: number;
  iconColor?: string;
}

export function KpiCard({
  title,
  icon,
  value,
  description,
  progress,
  iconColor = "text-muted-foreground",
}: KpiCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={iconColor}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {progress !== undefined && <Progress value={progress} className="mt-2" />}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
