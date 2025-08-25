/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/maintenance/IncidentCard.tsx
import { Badge } from "@/components/ui/badge";

// Définition des types pour les niveaux d'incident
interface IncidentCardProps {
  id: string;
  location: string;
  description: string;
  level: "Urgent" | "Moyen" | "Faible";
}

// Mappage des niveaux d'incident avec les variantes de `Badge`
const levelVariant = {
  Urgent: "destructive", // Correspond à la variante `destructive` pour le rouge
  Moyen: "default",      // Utilisez une variante `default` ou `secondary`
  Faible: "secondary",   // Correspond à la variante `secondary` pour le gris clair
} as const; // `as const` assure que les valeurs sont traitées comme des littéraux

export function IncidentCard({ id, location, description, level }: IncidentCardProps) {
  return (
    <div className="border rounded-md p-3 flex justify-between items-start w-full">
      <div>
        <p className="font-medium">{description}</p>
        <p className="text-sm text-muted-foreground">{location}</p>
      </div>
      <Badge variant={levelVariant[level] as "default" | "secondary" | "destructive" | "outline"}>
        {level}
      </Badge>
    </div>
  );
}