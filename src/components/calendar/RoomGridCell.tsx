// components/roomCalendar/RoomGridCell.tsx
import * as React from "react";

interface RoomGridCellProps {
  roomIndex: number;
  dayIndex: number;
  onClick: () => void;
}

export function RoomGridCell({ roomIndex, dayIndex, onClick }: RoomGridCellProps) {
  return (
    <div
      key={`cell-${roomIndex}-${dayIndex}`}
      className="border cursor-pointer hover:bg-blue-50 transition-all"
      onClick={onClick}
    />
  );
}
