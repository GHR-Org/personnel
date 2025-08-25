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
  EN_ATTENTE = "En attente",
  APPROUVER = "Approuvé",
  REFUSER = "Refusé",
  ANNULER = "Annulé",
}

export interface Conge {
  id: string; // Identifiant unique de la demande (ex: "cge_001", "abs_002")
  employeId: string; // Identifiant unique de l'employé
  nomEmploye: string; // Nom complet de l'employé
  typeConge: CongeType // Type de congé/absence
  dateDebut: string; // Date de début du congé (format 'YYYY-MM-DD')
  dateFin: string; // Date de fin du congé (format 'YYYY-MM-DD')
  dureeJoursOuvres: number; // Durée du congé en jours ouvrés
  statut: CongeStatut // Statut de la demande
  dateDemande: string; // Date à laquelle la demande a été soumise (format 'YYYY-MM-DD')
  raison?: string; // Raison ou description courte du congé (optionnel)
  commentaireManager?: string; // Commentaire du manager (optionnel)
  fichiersJoints?: string[]; // Liste des URLs ou IDs de fichiers joints (ex: certificat médical) (optionnel)
  // Vous pouvez ajouter d'autres champs au besoin, par exemple:
  // dateApprobation?: string;
  // approuvePar?: string; // ID ou nom de la personne qui a approuvé
}