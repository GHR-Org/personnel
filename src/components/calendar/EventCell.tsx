/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/RoomCalendar/EventCell.tsx
"use client";

import { eventStyle } from "./CalendarTheme";

export const EventCell = ({ event }) => {
  return (
    <div className={eventStyle({ status: event.status })}>
      <div className="truncate">{event.title}</div>
      {event.client && (
        <div className="text-[10px] italic opacity-70">
          {event.client.nom} ({event.client.type})
        </div>
      )}
    </div>
  );
};
