// components/roomCalendar/RoomCalendarHeader.tsx
import * as React from "react";
import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface RoomCalendarHeaderProps {
  dates: Date[];
}

export function RoomCalendarHeader({ dates }: RoomCalendarHeaderProps) {
  return (
    <div className="grid grid-cols-[200px_repeat(30,_1fr)]">
      <div className="bg-white border-b" /> {/* Espace vide coin haut-gauche */}
      {dates.map((date, index) => (
        <div
          key={index}
          className={cn(
            "text-center py-2 text-sm font-medium border-b",
            isToday(date) ? "bg-blue-100 text-blue-600 font-semibold" : "bg-white"
          )}
        >
          <div className="uppercase text-xs text-muted-foreground">
            {format(date, "EEE", { locale: fr })}
          </div>
          <div>{format(date, "d", { locale: fr })}</div>
        </div>
      ))}
    </div>
  );
}
