// app/(manager)/room-calendar/page.tsx
"use client";

import NotFound404 from "../../../components/404";


export default function RoomCalendarViewPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Calendrier des chambres</h1>
      <NotFound404 />
    </div>
  );
}
