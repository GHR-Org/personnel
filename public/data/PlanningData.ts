// src/data/planningData.ts

import { PlanningEvent } from '@/types/planning';
 // Réutilisation des données d'Conge
import { parseISO, addHours } from 'date-fns'; // Pour aider à la conversion
import initialCongesData from './CongesData'; // Assurez-vous que le chemin est correct


// Convertir les Conges en événements de planning
const CongesAsPlanningEvents: PlanningEvent[] = initialCongesData.map(Conge => ({
  id: Conge.id,
  employeId: Conge.employeId,
  nomEmploye: Conge.nomEmploye,
  type: 'Conge',
  title: `${Conge.typeConge} (${Conge.dureeJoursOuvres}j)`,
  description: Conge.raison,
  dateDebut: Conge.dateDebut,
  dateFin: Conge.dateFin,
  status: Conge.statut === 'Approuvé' ? 'Confirmé' : (Conge.statut === 'En attente' ? 'En attente' : 'Annulé'),
  location: '', // N/A pour une Conge
}));

const initialPlanningData: PlanningEvent[] = [
  ...CongesAsPlanningEvents, // Inclure toutes les Conges comme événements
  {
    id: 'plan_001',
    employeId: 'emp_001',
    nomEmploye: 'Alice Dubois',
    type: 'Formation',
    title: 'Formation TypeScript Avancé',
    description: 'Formation intensive sur les concepts avancés de TypeScript.',
    dateDebut: '2025-09-01',
    dateFin: '2025-09-03',
    status: 'Confirmé',
    location: 'Salle de Conférence B',
  },
  {
    id: 'plan_002',
    employeId: 'emp_002',
    nomEmploye: 'Bob Martin',
    type: 'Mission',
    title: 'Client Project Alpha',
    description: 'Déploiement et support sur site chez le client Alpha.',
    dateDebut: '2025-08-20',
    dateFin: '2025-08-25',
    status: 'Confirmé',
    location: 'Lyon, France',
  },
  {
    id: 'plan_003',
    employeId: 'emp_001',
    nomEmploye: 'Alice Dubois',
    type: 'Réunion',
    title: 'Réunion de l\'équipe projet X',
    description: 'Point d\'avancement hebdomadaire.',
    dateDebut: '2025-07-25',
    dateFin: '2025-07-25',
    status: 'Confirmé',
    location: 'En ligne (Zoom)',
  },
  {
    id: 'plan_004',
    employeId: 'emp_003',
    nomEmploye: 'Charlie Leclerc',
    type: 'Tâche',
    title: 'Revue de code Module RH',
    description: 'Revue et validation du code du nouveau module RH.',
    dateDebut: '2025-07-23',
    dateFin: '2025-07-24',
    status: 'En attente',
    location: 'Bureau',
  },
  // Ajoutons un événement avec heure pour tester le calendrier
  {
    id: 'plan_005',
    employeId: 'emp_001',
    nomEmploye: 'Alice Dubois',
    type: 'Réunion',
    title: 'Réunion de lancement Sprint',
    description: 'Lancement du nouveau sprint de développement.',
    dateDebut: '2025-07-22T09:00:00', // Date et heure
    dateFin: '2025-07-22T10:00:00',   // Date et heure
    status: 'Confirmé',
    location: 'Salle de réunion 3',
  },
  {
    id: 'plan_006',
    employeId: 'emp_002',
    nomEmploye: 'Bob Martin',
    type: 'Tâche',
    title: 'Préparation rapport mensuel',
    description: 'Compilation des données pour le rapport de juillet.',
    dateDebut: '2025-07-21T14:00:00',
    dateFin: '2025-07-21T17:00:00',
    status: 'En attente',
    location: 'Bureau',
  },
];

export default initialPlanningData;