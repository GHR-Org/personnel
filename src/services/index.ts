// ============================================================================
// SERVICES CENTRALISÉS - INDEX
// ============================================================================

// Services principaux
export { apiService } from "./api";
export { authService } from "./auth";
export { chambresService } from "./chambres";

// Services à implémenter (avec mock data pour l'instant)
export * from "./reservations";
export * from "./clients";
export * from "./personnels";
export * from "./plats";
export * from "./tables";
export * from "./rapports";

// Utilitaires
export { handleApiError, createFormData } from "./api";
