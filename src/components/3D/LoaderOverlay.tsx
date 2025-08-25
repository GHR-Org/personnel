/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Html, useProgress } from "@react-three/drei";
import { Progress } from "../ui/progress";

export function LoaderOverlay() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 bg-background/70 backdrop-blur-md p-4 rounded-lg shadow-lg">
        <p className="text-sm text-muted-foreground">Chargement de la salle…</p>
        <div className="w-40 h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{Math.floor(progress)}%</span>
      </div>
    </Html>
  );
}

function LoaderOverlaygf() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 bg-background/70 backdrop-blur-md p-4 rounded-lg shadow ">
        <p className="text-sm text-muted-foreground">Chargement…</p>
        <Progress value={progress} className="w-40" />
      </div>
    </Html>
  );
}
