import { IconTrendingDown, IconTrendingUp, IconProps } from "@tabler/icons-react"; // Importation de IconProps pour référence
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";
import { cn } from "@/lib/utils"; 

// 🎯 Type simple pour l'icône afin d'éviter le conflit ForwardRefExoticComponent/IconProps
// React.ComponentType<any> est le plus tolérant et acceptera l'icône Tabler.
type IconType = React.ComponentType<any>; 


interface MetricCardProps {
  title: string;
  value: string;
  percentage: string;
  isTrendingUp: boolean;
  footerText: string;
  footerDescription: string;
  icon: IconType; // Type simplifié
  iconColorClass?: string; 
  cardClasses?: string; 
}

export function MetricCard({
  title,
  value,
  percentage,
  isTrendingUp,
  footerText,
  footerDescription,
  icon: IconComponent,
  iconColorClass,
  cardClasses, 
}: MetricCardProps) {
  const TrendIcon = isTrendingUp ? IconTrendingUp : IconTrendingDown;
  const badgeVariant = isTrendingUp ? "outline" : "destructive";

  return (
    <Card className={cn("@container/card", cardClasses)}>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant={badgeVariant}>
            <TrendIcon className="size-4" />
            {percentage}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {footerText}{" "}
          {/* L'icône passe sans erreur grâce à la simplification du type IconType */}
          <IconComponent className={cn("size-4", iconColorClass)} /> 
        </div>
        <div className="text-muted-foreground">{footerDescription}</div>
      </CardFooter>
    </Card>
  );
}