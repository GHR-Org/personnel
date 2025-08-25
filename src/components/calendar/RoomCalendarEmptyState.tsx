// components/roomCalendar/RoomCalendarEmptyState.tsx
import * as React from "react";
import { IconBedOff } from "@tabler/icons-react";

interface RoomCalendarEmptyStateProps {
  message?: string;
}

export function RoomCalendarEmptyState({
  message = "Aucune chambre ou donnée disponible pour cette période.",
}: RoomCalendarEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground space-y-4">
      <IconBedOff className="w-12 h-12 text-gray-400" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
