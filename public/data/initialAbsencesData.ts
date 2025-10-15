// src/data/AbsencesData.ts
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

const initialAbsencesData: Absence[] = [
  {
    id: 10,
    employeId: 1, // Alice Dubois
    typeAbsence: 'Vacances',
    statut: 'Approuvé',
    raison: 'Repos estival bien mérité ! 🏖️',
    dateDebut: '2025-08-05',
    dateFin: '2025-08-16',
    dureeJoursOuvres: 10,
  },
  {
    id: 11,
    employeId: 2, // Bob Martin
    typeAbsence: 'RTT',
    statut: 'En attente',
    raison: 'Récupération suite à forte charge de travail.',
    dateDebut: '2025-09-09',
    dateFin: '2025-09-09',
    dureeJoursOuvres: 1,
  },
  {
    id: 12,
    employeId: 3, // Charlie Leclerc
    typeAbsence: 'Maladie',
    statut: 'Annulé', // Une absence qui a été annulée
    raison: 'Rendez-vous annulé à la dernière minute.',
    dateDebut: '2025-07-28',
    dateFin: '2025-07-28',
    dureeJoursOuvres: 1,
  },
  {
    id: 13,
    employeId: 1, // Alice Dubois
    typeAbsence: 'Formation Interne',
    statut: 'Approuvé',
    raison: 'Formation obligatoire sur les nouvelles procédures RGPD.',
    dateDebut: '2025-10-10T14:00:00', // Exemple avec heure si besoin
    dateFin: '2025-10-10T17:00:00',
    dureeJoursOuvres: 0.5,
  },
];

export default initialAbsencesData;