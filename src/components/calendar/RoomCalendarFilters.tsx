// components/roomCalendar/RoomCalendarFilters.tsx
import * as React from "react";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";

interface RoomCalendarFiltersProps {
  floor?: string;
  type?: string;
  status?: string;
  onChange: (filters: { floor?: string; type?: string; status?: string }) => void;
}

export function RoomCalendarFilters({
  floor,
  type,
  status,
  onChange,
}: RoomCalendarFiltersProps) {
  return (
    <div className="flex gap-4 flex-wrap items-center py-2 px-4 bg-white border rounded-lg shadow-sm">
      <Select
        value={floor}
        onValueChange={(value) => onChange({ floor: value || undefined, type, status })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Étage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous</SelectItem>
          <SelectItem value="RDC">RDC</SelectItem>
          <SelectItem value="1">1er étage</SelectItem>
          <SelectItem value="2">2e étage</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={type}
        onValueChange={(value) => onChange({ floor, type: value || undefined, status })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Type de chambre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous</SelectItem>
          <SelectItem value="standard">Standard</SelectItem>
          <SelectItem value="suite">Suite</SelectItem>
          <SelectItem value="familiale">Familiale</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(value) => onChange({ floor, type, status: value || undefined })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous</SelectItem>
          <SelectItem value="confirmée">Confirmée</SelectItem>
          <SelectItem value="option">Option</SelectItem>
          <SelectItem value="annulée">Annulée</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
