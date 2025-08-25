// components/3D/SaveButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useFurnitureStore } from "@/lib/stores/furniture-store";
import { toast } from "sonner";

export function SaveButton() {
  const furniture = useFurnitureStore((state) => state.furniture);

  const handleSave = () => {
    const json = JSON.stringify(furniture);
    localStorage.setItem("room-state", json);
    toast.success("Enregistré avec succès")
  };

  return (
    <Button onClick={handleSave} className="w-full">
      Enregistrer la disposition
    </Button>
  );
}
