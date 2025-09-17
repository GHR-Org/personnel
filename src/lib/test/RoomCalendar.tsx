/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
// RoomCalendar.final.tsx
// Version finale : dnd-kit (drag & drop + resize), react-window virtualization, ShadCN UI integration,
// Framer Motion animations, et améliorations accessibilité (keyboard + ARIA).

"use client";

import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { format, addDays, parseISO, differenceInCalendarDays } from "date-fns";
import { fr } from "date-fns/locale";
import { VariableSizeList as List } from "react-window";

// shadcn/ui components (assumes you already generated/imported them in your project)
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  IconEdit,
  IconTrash,
  IconLogin2,
  IconLogout2,
  IconX,
} from "@tabler/icons-react";

import type { BookingEvent } from "@/types/reservation";
import { ReservationStatut as ReservationStatutType } from "@/lib/enum/ReservationStatus";
import { DraggableReservation } from "@/components/reservationComponents/DraggableReservation";
import { Client } from "@/types/client"; // Assurez-vous d'avoir ce type
import { getClientById } from "@/func/api/clients/apiclient";

// ------------------ Config & Styles ------------------
const COL_FIRST_WIDTH = 200; // px for the first (rooms) column
const MIN_COL_WIDTH = 110; // minimum width per day column
const ROW_BASE_PX = 56;
const LANE_PX = 28;
const LANE_GAP = 6;

const reservationStatusStyle: Record<string, string> = {
  PREVUE: "bg-blue-500 hover:bg-blue-600 text-white",
  CONFIRMEE: "bg-emerald-500 hover:bg-emerald-600 text-white",
  ARRIVEE: "bg-yellow-500 hover:bg-yellow-600 text-black",
  TERMINEE: "bg-gray-500 hover:bg-gray-600 text-white",
  ANNULEE: "bg-red-500 hover:bg-red-600 text-white line-through",
  NON_RENSEIGNE: "bg-violet-500 hover:bg-violet-600 text-white",
  EN_ATTENTE: "bg-slate-400 hover:bg-slate-500 text-black",
};

// ------------------ Types ------------------
export type Room = { id: number; name: string };
export type ViewType = "day" | "week" | "month";

// ---
// NOTE: `BookingEvent` devrait inclure `client_id: number | null` pour récupérer le client.
// Il n'est pas nécessaire d'ajouter `first_name` et `last_name` ici car
// nous les récupérerons dynamiquement dans le tiroir.
// ---
export interface RoomCalendarProps {
  rooms: Room[];
  reservations: BookingEvent[];
  startDate: string; // YYYY-MM-DD
  initialView?: ViewType;
  onSelectSlot: (data: { date_arrivee: string; date_depart: string; chambre_id: number }) => void;
  openDetailsDrawer: (reservation: BookingEvent) => void;
  openEditReservationModal: (reservation: BookingEvent) => void;
  handleCheckInClient: (id: string) => void;
  openarheeModal: (reservation: BookingEvent) => void;
  handleCancelReservation: (id: string) => void;
  handleCheckoutReservation: (id: string) => void;
  handleRequestCleaning: (roomId: string) => void;
  openReportIncidentModal: (reservation: BookingEvent) => void;
  handleDeleteReservation: (id: string) => void;
  onReservationMove?: (updated: { id: string; new_arrivee: string; new_depart: string }) => void;
  onReservationResize?: (updated: { id: string; new_arrivee: string; new_depart: string }) => void;
  enableVirtualization?: boolean;
}

// ------------------ Utilities ------------------
function toKey(d: Date) {
  return d.toISOString().slice(0, 10);
}
function parseKey(s: string) {
  return parseISO(s);
}
function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

// layout algorithm to compute lanes per room (greedy)
function layoutReservationsForRoom(
  reservations: BookingEvent[],
  displayStart: Date,
  displayEnd: Date
) {
  const startDay = displayStart;
  const endDay = displayEnd;
  const totalDays = differenceInCalendarDays(endDay, startDay) + 1;

  const list = reservations
    .map((r) => {
      const sd = parseKey(r.date_arrivee);
      const ed = parseKey(r.date_depart);
      const startIdx = Math.max(0, differenceInCalendarDays(sd, startDay));
      const endIdx = Math.min(
        totalDays - 1,
        differenceInCalendarDays(ed, startDay)
      );
      return { r, startIdx, endIdx, span: endIdx - startIdx + 1 };
    })
    .filter((m) => m.endIdx >= 0 && m.startIdx <= totalDays - 1)
    .sort((a, b) => a.startIdx - b.startIdx || b.span - a.span);

  const lanes: Array<typeof list> = [];
  const placed: Array<{
    id: string;
    startIdx: number;
    span: number;
    lane: number;
  }> = [];

  for (const item of list) {
    let assigned = -1;
    for (let i = 0; i < lanes.length; i++) {
      const lane = lanes[i];
      const last = lane[lane.length - 1];
      if (!last || item.startIdx > last.endIdx) {
        lane.push(item);
        assigned = i;
        break;
      }
    }
    if (assigned === -1) {
      lanes.push([item]);
      assigned = lanes.length - 1;
    }
    placed.push({
      id: item.r.id ?? '',
      startIdx: item.startIdx,
      span: item.span,
      lane: assigned,
    });
  }

  return { lanesCount: lanes.length, placed };
}

// ------------------ Component ------------------
export default function RoomCalendar(props: RoomCalendarProps) {
  const {
    rooms,
    reservations,
    startDate,
    initialView = "week",
    onSelectSlot,
    openDetailsDrawer,
    openEditReservationModal,
    handleCheckInClient,
    openarheeModal,
    handleCancelReservation,
    handleCheckoutReservation,
    handleRequestCleaning,
    openReportIncidentModal,
    handleDeleteReservation,
    onReservationMove,
    onReservationResize,
    enableVirtualization = true,
  } = props;

  const [view, setView] = useState<ViewType>(initialView);
  const days = view === "day" ? 1 : view === "week" ? 7 : view === "month" ? 30 : 14;

  const displayStart = useMemo(() => parseKey(startDate), [startDate]);
  const displayEnd = useMemo(() => addDays(displayStart, days - 1), [displayStart, days]);

  const dayArray = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < days; i++) arr.push(addDays(displayStart, i));
    return arr;
  }, [displayStart, days]);

  // index reservations by room id
  const reservationsByRoom = useMemo(() => {
    const map = new Map<number, BookingEvent[]>();
    for (const r of reservations) {
      const rid = r.chambre_id as number;
      if (!map.has(rid)) map.set(rid, []);
      map.get(rid)!.push(r);
    }
    return map;
  }, [reservations]);

  const layoutByRoom = useMemo(() => {
    const out = new Map<
      number,
      {
        lanesCount: number;
        placed: Array<{ id: string; startIdx: number; span: number; lane: number }>;
      }
    >();
    for (const room of rooms) {
      const rlist = reservationsByRoom.get(room.id) ?? [];
      out.set(room.id, layoutReservationsForRoom(rlist, displayStart, displayEnd));
    }
    return out;
  }, [rooms, reservationsByRoom, displayStart, displayEnd]);

  // build a fast lookup map from reservationId => placement + roomId
  const placementMap = useMemo(() => {
    const map = new Map<
      string,
      { roomId: number; startIdx: number; span: number; lane: number }
    >();
    for (const room of rooms) {
      const layout = layoutByRoom.get(room.id);
      if (!layout) continue;
      for (const p of layout.placed) {
        map.set(p.id, {
          roomId: room.id,
          startIdx: p.startIdx,
          span: p.span,
          lane: p.lane,
        });
      }
    }
    return map;
  }, [rooms, layoutByRoom]);

  // sensors for dnd-kit (pointer)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // refs for sizing
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      setContainerWidth(containerRef.current.offsetWidth - COL_FIRST_WIDTH);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const cellWidth =
    containerWidth && dayArray.length > 0
      ? Math.max(MIN_COL_WIDTH, containerWidth / dayArray.length)
      : MIN_COL_WIDTH;

  // DnD handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    // optionally: set active dragging state
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;
      const id = String(active.id);
      const deltaX = delta?.x ?? 0;
      const deltaDays = Math.round(deltaX / (cellWidth || MIN_COL_WIDTH));

      if (id.startsWith("res-")) {
        const resId = id.replace("res-", "");
        const p = placementMap.get(resId);
        if (!p) return;
        const originalStart = p.startIdx;
        const span = p.span;
        const newStartIdx = clamp(originalStart + deltaDays, 0, dayArray.length - span);
        const newEndIdx = newStartIdx + span - 1;
        const newArrivee = toKey(addDays(displayStart, newStartIdx));
        const newDepart = toKey(addDays(displayStart, newEndIdx));
        onReservationMove &&
          onReservationMove({
            id: resId,
            new_arrivee: newArrivee,
            new_depart: newDepart,
          });
      }

      if (id.startsWith("resize-left-") || id.startsWith("resize-right-")) {
        const isLeft = id.startsWith("resize-left-");
        const resId = id.replace("resize-left-", "").replace("resize-right-", "");
        const p = placementMap.get(resId);
        if (!p) return;
        const originalStart = p.startIdx;
        const originalSpan = p.span;
        const change = Math.round(deltaX / (cellWidth || MIN_COL_WIDTH));

        let newStart = originalStart;
        let newSpan = originalSpan;

        if (isLeft) {
          newStart = clamp(originalStart + change, 0, originalStart + originalSpan - 1);
          newSpan = originalSpan - (newStart - originalStart);
        } else {
          newSpan = clamp(originalSpan + change, 1, dayArray.length - originalStart);
        }

        const newArrivee = toKey(addDays(displayStart, newStart));
        const newDepart = toKey(addDays(displayStart, newStart + newSpan - 1));
        onReservationResize &&
          onReservationResize({
            id: resId,
            new_arrivee: newArrivee,
            new_depart: newDepart,
          });
      }
    },
    [cellWidth, placementMap, displayStart, dayArray.length, onReservationMove, onReservationResize]
  );

  // Keyboard accessibility: move or resize a focused reservation with arrow keys
  const handleReservationKey = useCallback(
    (e: React.KeyboardEvent, resId: string) => {
      const p = placementMap.get(resId);
      if (!p) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onReservationMove &&
          onReservationMove({
            id: resId,
            new_arrivee: toKey(addDays(displayStart, p.startIdx - 1)),
            new_depart: toKey(addDays(displayStart, p.startIdx + p.span - 2)),
          });
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onReservationMove &&
          onReservationMove({
            id: resId,
            new_arrivee: toKey(addDays(displayStart, p.startIdx + 1)),
            new_depart: toKey(addDays(displayStart, p.startIdx + p.span)),
          });
      }
      if (e.key === "-") {
        e.preventDefault();
        const newSpan = Math.max(1, p.span - 1);
        onReservationResize &&
          onReservationResize({
            id: resId,
            new_arrivee: toKey(addDays(displayStart, p.startIdx)),
            new_depart: toKey(addDays(displayStart, p.startIdx + newSpan - 1)),
          });
      }
      if (e.key === "+") {
        e.preventDefault();
        const newSpan = Math.min(dayArray.length - p.startIdx, p.span + 1);
        onReservationResize &&
          onReservationResize({
            id: resId,
            new_arrivee: toKey(addDays(displayStart, p.startIdx)),
            new_depart: toKey(addDays(displayStart, p.startIdx + newSpan - 1)),
          });
      }
    },
    [placementMap, onReservationMove, onReservationResize, displayStart, dayArray.length]
  );

  // Drawer state (local)
  const [drawerReservation, setDrawerReservation] = useState<BookingEvent | null>(null);
  const [drawerClient, setDrawerClient] = useState<Client | null>(null);
  const [isFetchingClient, setIsFetchingClient] = useState(false);

  async function openLocalDrawer(res: BookingEvent) {
    setDrawerReservation(res);
    setDrawerClient(null); // Réinitialiser le client précédent
    if (res.client_id) {
      setIsFetchingClient(true);
      try {
        const client = await getClientById(res.client_id);
        setDrawerClient(client);
      } catch (e) {
        console.error("Erreur lors de la récupération du client:", e);
      } finally {
        setIsFetchingClient(false);
      }
    }
    try {
      openDetailsDrawer && openDetailsDrawer(res);
    } catch (e) {}
  }

  function closeLocalDrawer() {
    setDrawerReservation(null);
    setDrawerClient(null);
  }

  // virtualization: row heights
  const getRowHeight = (index: number) => {
    const room = rooms[index];
    const layout = layoutByRoom.get(room.id) ?? { lanesCount: 0 };
    return ROW_BASE_PX + (layout.lanesCount ?? 0) * (LANE_PX + LANE_GAP);
  };

  const listRef = useRef<List | null>(null);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const room = rooms[index];
    const layout = layoutByRoom.get(room.id) ?? { lanesCount: 0, placed: [] };
    const rowHeight = ROW_BASE_PX + layout.lanesCount * (LANE_PX + LANE_GAP);

    return (
      <div
        className="grid border-t"
        style={{
          ...style,
          gridTemplateColumns: `200px repeat(${dayArray.length}, minmax(120px,1fr))`,
          display: "grid",
          alignItems: "start",
        }}
      >
        <div className="sticky left-0 z-20 bg-white dark:bg-slate-900 border-r p-3 font-medium">{room.name}</div>
        <div className="relative" style={{ minHeight: rowHeight }}>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${dayArray.length}, minmax(120px,1fr))` }}>
            {dayArray.map((d) => (
              <div
                key={toKey(d)}
                className="h-14 border-r border-b hover:bg-slate-50 cursor-pointer"
                onClick={() => onSelectSlot({ date_arrivee: toKey(d), date_depart: toKey(d), chambre_id: room.id })}
              />
            ))}
          </div>
          {layout.placed.map((p) => {
            const res = (reservationsByRoom.get(room.id) ?? []).find((r) => r.id === p.id)!;
            if (!res) return null;
            return (
              <DraggableReservation
                key={res.id}
                reservation={res}
                placement={{...p, roomId: room.id}}
                dayArrayLength={dayArray.length}
                openDetailsDrawer={openLocalDrawer}
                handleReservationKey={handleReservationKey}
                reservationStatusStyle={reservationStatusStyle}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="w-full overflow-auto border rounded-lg bg-white dark:bg-slate-900" ref={containerRef} aria-label="Calendrier des chambres interactive">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 p-3 border-b sticky top-0 z-40 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Button onClick={() => setView((v) => (v === "day" ? "month" : v === "week" ? "day" : "week"))}>Vue: {view}</Button>
            <div className="text-sm text-slate-600">
              {format(displayStart, "dd MMM yyyy", { locale: fr })} →{" "}
              {format(displayEnd, "dd MMM yyyy", { locale: fr })}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setView("day")}>Jour</Button>
            <Button variant="ghost" onClick={() => setView("week")}>Semaine</Button>
            <Button variant="ghost" onClick={() => setView("month")}>Mois</Button>
          </div>
        </div>

        {/* Column headers */}
        <div className="min-w-max">
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${dayArray.length}, minmax(120px,1fr))` }}>
            <div className="sticky left-0 z-30 bg-white dark:bg-slate-900 border-r p-3 font-semibold">Chambre</div>
            {dayArray.map((d) => (
              <div key={toKey(d)} className="p-2 text-center border-r bg-slate-50 text-xs">
                <div className="font-medium">{format(d, "EEE", { locale: fr })}</div>
                <div className="text-[13px]">{format(d, "dd/MM")}</div>
              </div>
            ))}
          </div>

          {/* Rows: use react-window virtualization when enabled */}
          {enableVirtualization && rooms.length > 80 ? (
            <List height={Math.min(800, window.innerHeight * 0.75)} itemCount={rooms.length} itemSize={getRowHeight} width="100%" ref={listRef}>
              {Row}
            </List>
          ) : (
            <div>
              {rooms.map((room) => (
                <div key={room.id} className="grid border-t" style={{ gridTemplateColumns: `200px repeat(${dayArray.length}, minmax(120px,1fr))`, alignItems: "start" }}>
                  <div className="sticky left-0 z-20 bg-white dark:bg-slate-900 border-r p-3 font-medium">{room.name}</div>
                  <div className="relative" style={{ minHeight: ROW_BASE_PX + ((layoutByRoom.get(room.id)?.lanesCount ?? 0) * (LANE_PX + LANE_GAP)) }}>
                    <div className="grid" style={{ gridTemplateColumns: `repeat(${dayArray.length}, minmax(120px,1fr))` }}>
                      {dayArray.map((d) => (
                        <div key={toKey(d)} className="h-14 border-r border-b hover:bg-slate-50 cursor-pointer" onClick={() => onSelectSlot({ date_arrivee: toKey(d), date_depart: toKey(d), chambre_id: room.id })} />
                      ))}
                    </div>
                    {layoutByRoom.get(room.id)?.placed.map((p) => {
                      const res = (reservationsByRoom.get(room.id) ?? []).find((r) => r.id === p.id)!;
                      if (!res) return null;
                      return (
                        <DraggableReservation
                          key={res.id}
                          reservation={res}
                          placement={{...p, roomId: room.id}}
                          dayArrayLength={dayArray.length}
                          openDetailsDrawer={openLocalDrawer}
                          handleReservationKey={handleReservationKey}
                          reservationStatusStyle={reservationStatusStyle}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog (local) for quick details/polish */}
      <Dialog open={!!drawerReservation} onOpenChange={(open) => !open && closeLocalDrawer()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails réservation</DialogTitle>
          </DialogHeader>
          {drawerReservation && (
            <div className="space-y-2">
              <div>
                <strong>Client:</strong>
                {isFetchingClient ? (
                  <span> Chargement...</span>
                ) : drawerClient ? (
                  `${drawerClient.first_name} ${drawerClient.last_name}`
                ) : (
                  "Non trouvé"
                )}
              </div>
              <div>
                <strong>Chambre:</strong> {drawerReservation.chambre_id}
              </div>
              <div>
                <strong>Dates:</strong> {drawerReservation.date_arrivee} →{" "}
                {drawerReservation.date_depart}
              </div>
              <div>
                <strong>Statut:</strong> {drawerReservation.status}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => drawerReservation && openEditReservationModal(drawerReservation)}
            >
              Modifier
            </Button>
            <Button
              variant="destructive"
              onClick={() => drawerReservation?.id && handleDeleteReservation(drawerReservation.id)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* small notes and accessibility hints */}
      <div className="p-3 text-xs text-slate-500">
        <strong>Accessibilité & UX :</strong> vous pouvez déplacer une réservation par drag (ou
        avec les flèches clavier pour déplacer d&apos;un jour). Utilisez `+` / `-` pour
        redimensionner par clavier. Pour respecter WCAG, nous fournissons des labels ARIA, roles et
        fallback clavier. (voir web.dev/accessibility pour checklist).
      </div>
    </DndContext>
  );
}