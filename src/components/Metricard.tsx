import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
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
import { cn } from "@/lib/utils"; // Assurez-vous d'avoir ce fichier utilitaire pour `cn`

interface MetricCardProps {
  title: string;
  value: string;
  percentage: string;
  isTrendingUp: boolean;
  footerText: string;
  footerDescription: string;
  icon: React.ElementType;
  iconColorClass?: string; // Gardons celle-ci pour la couleur de l'icône si besoin
  cardClasses?: string; // Nouvelle prop pour les classes de la carte elle-même
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
  cardClasses, // Accepter la nouvelle prop
}: MetricCardProps) {
  const TrendIcon = isTrendingUp ? IconTrendingUp : IconTrendingDown;
  const badgeVariant = isTrendingUp ? "outline" : "destructive";

  return (
    // Appliquer la prop cardClasses ici
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
          <IconComponent className={cn("size-4", iconColorClass)} />
        </div>
        <div className="text-muted-foreground">{footerDescription}</div>
      </CardFooter>
    </Card>
  );
}