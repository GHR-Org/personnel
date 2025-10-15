import { PlanningEvent, PlanningEventType, PlanningEventStatus } from '@/types/planning';
// Réutilisation des données d'Absence (anciennement 'Conge')
// NOTE : J'ai renommé 'Conge' en 'Absence' pour correspondre à votre Enum.
// Vous devrez vous assurer que ce fichier 'AbsenceData' existe et exporte bien des données.
import { parseISO, addHours } from 'date-fns'; // Pour aider à la conversion (même si peu utilisé ici)
import initialAbsencesData from './initialAbsencesData';
// Assurez-vous que le chemin est correct

// --- Helper pour mapper le statut ---
const mapStatus = (oldStatus: string): PlanningEventStatus => {
  switch (oldStatus) {
    case 'Approuvé':
    case 'Confirmé':
      return PlanningEventStatus.CONFRIME; // 'Confirmée'
    case 'En attente':
      return PlanningEventStatus.EN_ATTENTE; // 'En attente'
    case 'Annulé':
    case 'Annulée':
      return PlanningEventStatus.ANNULEE; // 'Annulée'
    default:
      return PlanningEventStatus.EN_ATTENTE; // Statut par défaut si inconnu
  }
};

// --- 1. Conversion des Anciens Congés/Absences ---
// J'ai pris le pari que vos anciennes données de 'Conge' sont maintenant vos données d'Absence.
// J'ai remplacé les champs obsolètes (nomEmploye, location, employeId) par les nouveaux requis.
const AbsencesAsPlanningEvents: PlanningEvent[] = initialAbsencesData.map((absence: { id: any; employeId: any; typeAbsence: any; dureeJoursOuvres: any; raison: any; dateDebut: any; dateFin: any; statut: string; }) => ({
  // NOTE: On suppose que l'ID est bien un 'number' dans les données d'Absence
  id: absence.id,
  personnel_id: absence.employeId, // On mappe l'ancien employeId au nouveau personnel_id
  type: PlanningEventType.ABSENCE, // 'Absence'
  titre: `${absence.typeAbsence} (${absence.dureeJoursOuvres}j)`,
  description: absence.raison,
  dateDebut: absence.dateDebut,
  dateFin: absence.dateFin,
  status: mapStatus(absence.statut),
  // Ces IDs sont ajoutés par défaut car ils sont obligatoires dans la nouvelle interface
  responsable_id: 99, // ID du responsable par défaut (à ajuster si possible)
  etablissement_id: 1, // ID de l'établissement par défaut (à ajuster si possible)
}));

// --- 2. Les autres événements de planning ---
const initialPlanningData: PlanningEvent[] = [
  ...AbsencesAsPlanningEvents, // On inclut toutes les Absences
  
  // Événement 1 : Formation
  {
    id: 1001, // Changement en number
    personnel_id: 1, // 'emp_001' devient 1
    type: PlanningEventType.FORMATION, // 'Formation'
    titre: 'Formation TypeScript Avancé 🚀',
    description: 'Formation intensive sur les concepts avancés pour devenir un ninja de TypeScript.',
    dateDebut: '2025-09-01',
    dateFin: '2025-09-03',
    status: PlanningEventStatus.CONFRIME, // 'Confirmée'
    responsable_id: 5, // ID du responsable
    etablissement_id: 1,
    // Note : Le lieu ('Salle de Conférence B') pourrait aller dans la description ou un champ 'location' optionnel si on l'ajoute.
  },
  
  // Événement 2 : Mission
  {
    id: 1002, // Changement en number
    personnel_id: 2, // 'emp_002' devient 2
    type: PlanningEventType.MISSION, // 'Mission'
    titre: 'Mission Client Alpha à Lyon 💼',
    description: 'Déploiement et support crucial sur site chez le client Alpha à Lyon, France.',
    dateDebut: '2025-08-20',
    dateFin: '2025-08-25',
    status: PlanningEventStatus.CONFRIME, // 'Confirmée'
    responsable_id: 8,
    etablissement_id: 2,
  },
  
  // Événement 3 : Réunion
  {
    id: 1003, // Changement en number
    personnel_id: 1, // 'emp_001' devient 1
    type: PlanningEventType.REUNION, // 'Réunion'
    titre: 'Réunion d\'équipe Projet X (Hebdo)',
    description: 'Point d\'avancement hebdomadaire. Préparez vos 5 minutes ! ☕',
    dateDebut: '2025-07-25',
    dateFin: '2025-07-25',
    status: PlanningEventStatus.CONFRIME, // 'Confirmée'
    responsable_id: 5,
    etablissement_id: 1,
  },
  
  // Événement 4 : Tâche
  {
    id: 1004, // Changement en number
    personnel_id: 3, // 'emp_003' devient 3
    type: PlanningEventType.TACHE, // 'Tâche'
    titre: 'Revue de code Module RH 🧐',
    description: 'Revue et validation du code du nouveau module RH. Priorité haute.',
    dateDebut: '2025-07-23',
    dateFin: '2025-07-24',
    status: PlanningEventStatus.EN_ATTENTE, // 'En attente'
    responsable_id: 5,
    etablissement_id: 1,
  },
  
  // Événement 5 : Réunion avec heure (on garde le format ISO pour les heures)
  {
    id: 1005, // Changement en number
    personnel_id: 1, // 'emp_001' devient 1
    type: PlanningEventType.REUNION, // 'Réunion'
    titre: 'Kick-off Sprint ! 🎉',
    description: 'Lancement du nouveau sprint de développement. Soyez à l\'heure !',
    dateDebut: '2025-07-22T09:00:00',
    dateFin: '2025-07-22T10:00:00',
    status: PlanningEventStatus.CONFRIME, // 'Confirmée'
    responsable_id: 5,
    etablissement_id: 1,
  },
  
  // Événement 6 : Tâche avec heure
  {
    id: 1006, // Changement en number
    personnel_id: 2, // 'emp_002' devient 2
    type: PlanningEventType.TACHE, // 'Tâche'
    titre: 'Préparation Rapport Mensuel de Juillet 📊',
    description: 'Compilation finale des données pour le rapport de juillet.',
    dateDebut: '2025-07-21T14:00:00',
    dateFin: '2025-07-21T17:00:00',
    status: PlanningEventStatus.EN_ATTENTE, // 'En attente'
    responsable_id: 8,
    etablissement_id: 2,
  },
];

export default initialPlanningData;