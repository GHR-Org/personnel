"use client";

import { Progress } from "@/components/ui/progress";

interface RoomLoaderProps {
  progress: number;
}

export function RoomLoader({ progress }: RoomLoaderProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <p className="text-sm text-muted-foreground">
        Chargement du plan de salle… {Math.round(progress)}%
      </p>
      <Progress value={progress} className="w-1/2 max-w-sm" />
    </div>
  );
}
