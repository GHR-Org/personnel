// components/roomCalendar/RoomLegend.tsx
import * as React from "react";

const STATUS_COLORS: Record<string, string> = {
  "confirmée": "bg-green-500",
  "option": "bg-yellow-400",
  "annulée": "bg-red-500",
  "en attente": "bg-blue-400",
};

export function RoomLegend() {
  return (
    <div className="flex flex-wrap gap-4 py-2 px-4 text-sm text-muted-foreground border rounded-lg bg-white shadow-sm">
      {Object.entries(STATUS_COLORS).map(([label, color]) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded ${color}`} />
          <span className="capitalize">{label}</span>
        </div>
      ))}
    </div>
  );
}
