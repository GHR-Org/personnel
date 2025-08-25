// src/types/planning.ts

// Réutilisation de l'interface Absence
// import { Absence } from './absence';


export enum PlanningEventType  {
  ABSENCE = 'Absence',
  FORMATION = 'Formation',
  MISSION = 'Mission',
  TACHE = 'Tâche',
  REUNION = 'Réunion',
}

export enum PlanningEventStatus {
  CONFRIME = 'Confirmée',
  EN_ATTENTE = 'En attente',
  ANNULEE = 'Annulée',
  TERMINE = 'Terminée',
}


export interface PlanningEvent {
  id: number
  personnel_id: number
  type: PlanningEventType;
  titre: string; // Titre de l'événement (ex: "Vacances d'été", "Formation sécurité")
  description?: string; // Description détaillée
  dateDebut: string; // Format 'YYYY-MM-DD'
  dateFin: string; // Format 'YYYY-MM-DD' Optionnel, pour les événements avec des heures spécifiques
  status: PlanningEventStatus;
  responsable_id: number; // ID de l'employé responsable
  etablissement_id: number
  // On peut ajouter d'autres champs spécifiques selon le type
}