"use client";

import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFurnitureStore } from "@/lib/stores/furniture-store"; // <-- import correct du store

export function FurnitureInfoPanel() {
  // Utilisation correcte du store
  const selectedId = useFurnitureStore((state) => state.selected);
  const furniture = useFurnitureStore((state) =>
    state.furniture.find((item) => item.id === selectedId)
  );
  const removeFurniture = useFurnitureStore((state) => state.removeFurniture);
  const updateName = useFurnitureStore((state) => state.updateFurnitureName);

  if (!furniture) {
    return (
      <div className="p-4 text-muted-foreground">
        Sélectionnez un meuble pour voir les détails.
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Détails du meuble</h3>

      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={furniture.name || ""}
          placeholder="Nom personnalisé"
          onChange={(e) => updateName(furniture.id, e.target.value)}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Position : x {furniture.position[0].toFixed(2)}, y {furniture.position[1].toFixed(2)}, z {furniture.position[2].toFixed(2)}
      </p>

      <Button variant="destructive" onClick={() => removeFurniture(furniture.id)}>
        Supprimer ce meuble
      </Button>
    </div>
  );
}
