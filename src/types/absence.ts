// src/types/absence.ts

/**
 * Interface de base pour les données brutes d'une demande d'absence
 * avant la conversion en PlanningEvent.
 */
export interface Absence {
  id: number; // L'ID unique de la demande d'absence
  employeId: number; // L'ID de l'employé concerné (qui deviendra personnel_id)
  typeAbsence: string; // Ex: 'Vacances', 'Maladie', 'RTT' (pour le titre)
  statut: 'Approuvé' | 'En attente' | 'Annulé'; // Le statut de l'ancienne demande
  raison: string; // Description détaillée (qui deviendra description)
  dateDebut: string; // Format 'YYYY-MM-DD' ou 'YYYY-MM-DDTHH:MM:SS'
  dateFin: string; // Format 'YYYY-MM-DD' ou 'YYYY-MM-DDTHH:MM:SS'
  dureeJoursOuvres: number; // La durée en jours ouvrés (pour le titre)
}