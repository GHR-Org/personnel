// app/(manager)/room-calendar/page.tsx
"use client";

import { RoomCalendar } from "@/components/calendar/RoomCalendarSkeleton";
import { mockEvents } from "@/lib/mock/MockEvent"; // si tu as des données test

export default function RoomCalendarViewPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Calendrier des chambres</h1>
      <RoomCalendar events={mockEvents} readOnly />
    </div>
  );
}
