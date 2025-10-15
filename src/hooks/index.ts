// ============================================================================
// HOOKS INDEX - Export centralisé
// ============================================================================

// Hook d'authentification
export { useAuth } from "./useAuth";

// Hooks pour les entités
export { useChambres, useChambre, useChambresStats } from "./useChambres";
export { useReservations, useReservationsStats } from "./useReservations";
export { useClients, useClientsStats } from "./useClients";
export { usePlats, usePlatsStats } from "./usePlats";
export { useTables, useTablesStats } from "./useTables";
export { usePersonnels, usePersonnel, usePersonnelsStats } from "./usePersonnels";
export { useRapports, useRapportsStats } from "./useRapports";
export { useNotifications } from "./useNotifications";

// Hooks WebSocket (legacy) supprimés au profit de l'EventBus et WebSocketProvider
