
// src/types/conge.ts

/**
 * Interface représentant un congé ou une absence.
 * Utilisée pour typer les données des demandes de congés/absences.
 */
export enum CongeType {
  VACANCE = "Vacance",
  MALADIE = "Maladie",
  RTT = "RTT",
  PARENTAL = "Congé Parentale",
  FORMATION = "Formation",
  AUTRE = "Autre",
}
export enum CongeStatut {
  EN_ATTENTE = "En Attente",
  APPROUVER = "Approuvé",
  REFUSER = "Refusé",
  ANNULER = "Annulé",
}

export interface Conge {
  id: number;
  type: CongeType; // Type de congé (ex: Vacance, Maladie, RTT, etc.)
  personnel_id: number;
  dateDebut: string; // Date de début du congé (format 'YYYY-MM-DD')
  dateFin: string; // Date de fin du congé (format 'YYYY-MM-DD')
  dateDmd : string
  status: CongeStatut // Statut de la demande
  raison: string; // Raison ou description courte du congé (optionnel)
  fichierJoin: any; // Liste des URLs ou IDs de fichiers joints (ex: certificat médical) (optionnel)
}
export type FormCongeData = Omit<Conge, "id" | "status" | "dateDmd" | "dureeJoursOuvres">;