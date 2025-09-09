// src/components/ui/ActivitySidebar.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import clsx from "clsx";
import { RealTimePersonnelActivity } from "@/components/personnel/RealTimePersonnelActivity";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Theme = "light" | "dark";

interface ActivitySidebarProps {
  etablissementId: number;
  theme?: Theme;
}

export function ActivitySidebar({ etablissementId, theme = "light" }: ActivitySidebarProps) {
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false); // État pour le badge

  // Fonction appelée par l'enfant (RealTimePersonnelActivity)
  const handleNewNotification = () => {
    if (!open) {
      setHasUnread(true);
    }
  };

  // Gérer la lecture des notifications à l'ouverture de la sidebar
  const handleOpenChange = (newOpenState: boolean) => {
    setOpen(newOpenState);
    if (newOpenState) {
      setHasUnread(false); // Marquer les notifications comme lues à l'ouverture
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {/* Bouton flottant pour ouvrir la sidebar */}
      <SheetTrigger asChild>
        <div className="fixed bottom-18 right-6 z-50">
          <Button
            className={clsx(
              "rounded-full w-12 h-12 p-3 shadow-lg transition relative",
              theme === "dark"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            )}
            aria-label="Ouvrir la barre latérale d'activité"
          >
            <Activity className="w-10 h-10 animate-pulse" />
            {/* Badge de notification non lu */}
            {hasUnread && (
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 animate-ping" />
            )}
            {hasUnread && (
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500" />
            )}
          </Button>
        </div>
      </SheetTrigger>
      {/* Panneau de la barre latérale */}
      <SheetContent side="right" className="w-full sm:w-full md:w-2/5 lg:w-1/2 xl:w-2xl p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <Activity className="h-6 w-6" />
            Activités des personnels
          </SheetTitle>
        </SheetHeader>
        <div className="p-6 h-full overflow-y-auto">
          {/* Passage de la fonction de rappel à l'enfant */}
          <RealTimePersonnelActivity etablissementId={etablissementId} onNewNotification={handleNewNotification} />
        </div>
      </SheetContent>
    </Sheet>
  );
}