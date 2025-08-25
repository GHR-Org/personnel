// components/roomCalendar/RoomCalendar.tsx
"use client";

import * as React from "react";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";


import { RoomCalendarSkeleton } from "./RoomCalendarSkeleton";
import { RoomCalendarEmptyState } from "./RoomCalendarEmptyState";
import { RoomLegend } from "./RoomLegend";
import { RoomCalendarFilters } from "./RoomCalendarFilters";
import { ROOM_TYPE_COLORS } from "@/lib/RoomTypeColorMap";


interface Reservation {
  id: string;
  roomId: string;
  dateStart: string;
  dateEnd: string;
  status: string;
  guestName: string;
}

interface Room {
  id: string;
  number: string;
  type: string;
  floor: string;
}

export function BookingCalendar() {
  const today = new Date();
  const dateRange = Array.from({ length: 30 }, (_, i) => addDays(today, i));

  const [filters, setFilters] = React.useState<{
    floor?: string;
    type?: string;
    status?: string;
  }>({});

  const { data: rooms, isLoading: loadingRooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  const { data: reservations, isLoading: loadingReservations } = useQuery({
    queryKey: ["reservations"],
    queryFn: getBookings,
  });

  const filteredRooms = React.useMemo(() => {
    if (!rooms) return [];
    return rooms.filter((room: Room) => {
      return (
        (!filters.floor || room.floor === filters.floor) &&
        (!filters.type || room.type === filters.type)
      );
    });
  }, [rooms, filters]);

  const filteredReservations = React.useMemo(() => {
    if (!reservations) return [];
    return reservations.filter((resa: Reservation) => {
      return (
        (!filters.status || resa.status === filters.status) &&
        filteredRooms.some((r) => r.id === resa.roomId)
      );
    });
  }, [reservations, filters, filteredRooms]);

  if (loadingRooms || loadingReservations) return <RoomCalendarSkeleton />;
  if (!filteredRooms.length) return <RoomCalendarEmptyState message="Aucune chambre correspondante." />;

  return (
    <div className="space-y-4">
      <RoomCalendarFilters {...filters} onChange={setFilters} />
      <RoomLegend />

      <div className="overflow-auto border rounded-md">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `200px repeat(${dateRange.length}, minmax(80px, 1fr))`,
          }}
        >
          {/* Header dates */}
          <div className="bg-white sticky left-0 z-10 border-r border-b font-bold text-sm p-2">
            Chambre
          </div>
          {dateRange.map((date, index) => (
            <div
              key={index}
              className="text-xs text-center border-b bg-gray-50 p-2"
            >
              {format(date, "EEE dd/MM", { locale: fr })}
            </div>
          ))}

          {/* Room Rows */}
          {filteredRooms.map((room) => (
            <React.Fragment key={room.id}>
              {/* Sidebar chambre */}
              <div className="sticky left-0 z-10 bg-white border-r border-b px-2 py-1 text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${ROOM_TYPE_COLORS[room.type] || "bg-gray-300"}`} />
                  {room.number}
                </div>
                <div className="text-xs text-muted-foreground">{room.type}</div>
              </div>

              {/* Cellules */}
              {dateRange.map((date, index) => {
                const matching = filteredReservations.find(
                  (resa) =>
                    resa.roomId === room.id &&
                    new Date(resa.dateStart) <= date &&
                    new Date(resa.dateEnd) >= date
                );

                if (matching) {
                  return (
                    <div
                      key={index}
                      className={`text-xs text-white p-1 truncate ${
                        matching.status === "confirmée"
                          ? "bg-green-500"
                          : matching.status === "option"
                          ? "bg-yellow-400 text-black"
                          : "bg-red-500"
                      }`}
                    >
                      {matching.guestName}
                    </div>
                  );
                }

                return <div key={index} className="border-b" />;
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
