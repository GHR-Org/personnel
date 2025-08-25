/* eslint-disable @typescript-eslint/no-unused-vars */
// DraggableReservation.tsx
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import type { BookingEvent } from "@/types/reservation";

// Configuration de base, à ajuster si nécessaire
const ROW_BASE_PX = 56;
const LANE_PX = 28;
const LANE_GAP = 6;

// Propriétés nécessaires pour le composant de réservation
interface DraggableReservationProps {
  reservation: BookingEvent;
  placement: {
    roomId: number;
    startIdx: number;
    span: number;
    lane: number;
  };
  dayArrayLength: number;
  openDetailsDrawer: (reservation: BookingEvent) => void;
  handleReservationKey: (e: React.KeyboardEvent, id: string) => void;
  reservationStatusStyle: Record<string, string>;
}

export const DraggableReservation: React.FC<DraggableReservationProps> = ({
  reservation,
  placement,
  dayArrayLength,
  openDetailsDrawer,
  handleReservationKey,
  reservationStatusStyle,
}) => {
  // Hook dnd-kit pour rendre le composant glissable
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `res-${reservation.id}`,
    data: {
      type: "reservation",
      reservationId: reservation.id,
      chambreId: reservation.chambre_id,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const leftPercent = (placement.startIdx / dayArrayLength) * 100;
  const widthPercent = (placement.span / dayArrayLength) * 100;
  const top = ROW_BASE_PX - 40 + placement.lane * (LANE_PX + LANE_GAP);

  const statusClass = reservationStatusStyle[reservation.status ?? "PREVUE"];

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        ...style,
        position: "absolute",
        left: `${leftPercent}%`,
        width: `calc(${widthPercent}% - 8px)`,
        top,
        height: LANE_PX,
        touchAction: 'none', // Important pour la compatibilité mobile
      }}
      className="z-10" // Assure que la réservation est au-dessus du fond de grille
    >
      {/* Handle de redimensionnement gauche */}
      <div
        id={`resize-left-${reservation.id}`}
        className="absolute left-0 top-0 h-full w-2 -ml-1 cursor-ew-resize opacity-0 hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />

      {/* La barre de réservation cliquable et glissable */}
      <div
        className={cn(
          "w-full h-full rounded-md px-2 flex items-center text-sm truncate shadow-md cursor-grab",
          statusClass
        )}
        aria-label={`${reservation.first_name} ${reservation.last_name || ""} — ${reservation.status} — du ${reservation.date_arrivee} au ${reservation.date_depart}`}
        onClick={() => openDetailsDrawer(reservation)}
        onKeyDown={(e) => handleReservationKey(e, reservation.id)}
        {...listeners}
        {...attributes}
      >
        <span className="truncate">{`${reservation.first_name} ${reservation.last_name ? reservation.last_name.charAt(0) + "." : ""}`}</span>
      </div>

      {/* Handle de redimensionnement droit */}
      <div
        id={`resize-right-${reservation.id}`}
        className="absolute right-0 top-0 h-full w-2 -mr-1 cursor-ew-resize opacity-0 hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
    </motion.div>
  );
};