// components/roomCalendar/RoomSidebarCell.tsx
import * as React from "react";
import { Chambre } from "@/schemas/chambre"; // ou modèle que tu utilises

interface RoomSidebarCellProps {
  chambre: Chambre;
  rowIndex: number;
}

export function RoomSidebarCell({ chambre }: RoomSidebarCellProps) {
  return (
    <div
      key={`sidebar-${rowIndex}`}
      className="p-2 text-sm border-r border-b font-medium bg-white sticky left-0 z-10"
    >
      {chambre.nom ?? `Chambre ${chambre.numero}`}
    </div>
  );
}
