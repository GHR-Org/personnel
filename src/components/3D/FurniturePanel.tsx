"use client";

import * as React from "react";
import { SaveButton } from "./saveButton";

export function FurniturePanel() {
  return (
     <div className="flex flex-col h-full">
      <div className="flex-grow">
        <h2 className="text-lg font-bold mb-4">Éléments</h2>
        <div className="space-y-2">
          <DraggableFurniture label="Chaise" type="chaise" />
          <DraggableFurniture label="Table" type="table" />
          <DraggableFurniture label="Caisse" type="caisse" />
          <DraggableFurniture label="Couple" type="couple" />
          <DraggableFurniture label="Famille" type="family" />
          <DraggableFurniture label="Exterieur" type="exterieur" />
        </div>
      </div>

      {/* Bouton global en bas */}
      <div className="mt-4">
        <SaveButton />
      </div>
    </div>
  );
}

function DraggableFurniture({ label, type }: { label: string; type: string }) {
  return (
    <aside>
      <div
      className="bg-card p-2 rounded shadow cursor-grab"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("furniture-type", type);
        // Optionnel : effet de transparence
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      {label}
      </div>
    
    </aside>
  );
}
