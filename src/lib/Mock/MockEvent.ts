// lib/mock/events.ts
export const mockEvents = [
  {
    id: 1,
    title: "Réservation - Chambre 101",
    start: new Date(2025, 6, 31, 12, 0), // 31 juillet 2025, 12h
    end: new Date(2025, 6, 31, 14, 0),
    resourceId: "chambre-101",
  },
  {
    id: 2,
    title: "Réservation - Chambre 203",
    start: new Date(2025, 6, 31, 9, 0),
    end: new Date(2025, 6, 31, 11, 30),
    resourceId: "chambre-203",
  },
];
