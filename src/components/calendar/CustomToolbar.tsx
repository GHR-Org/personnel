// src/components/RoomCalendar/CustomToolbar.tsx
"use client";

import { Button } from "@/components/ui/button";

export const CustomToolbar = ({ label, onNavigate, view, onView }) => (
  <div className="flex flex-wrap justify-between items-center p-2 gap-2">
    <div className="flex gap-1">
      <Button variant="outline" size="sm" onClick={() => onNavigate("TODAY")}>Aujourd’hui</Button>
      <Button variant="ghost" size="sm" onClick={() => onNavigate("PREV")}>⬅️</Button>
      <Button variant="ghost" size="sm" onClick={() => onNavigate("NEXT")}>➡️</Button>
    </div>

    <div className="font-semibold text-sm">{label}</div>

    <div className="flex gap-1">
      {["month", "week", "day", "agenda"].map((v) => (
        <Button
          key={v}
          variant={view === v ? "default" : "outline"}
          size="sm"
          onClick={() => onView(v)}
        >
          {v}
        </Button>
      ))}
    </div>
  </div>
);
