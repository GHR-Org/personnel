// src/data/congesData.ts

import { Conge } from '@/types/conge'; // Assurez-vous que le chemin est correct

const initialconges: Conge[] = [
  {
    id: "cge_001",
    employeId: "emp_123",
    nomEmploye: "Dupont Jean",
    typeConge: "Vacances",
    dateDebut: "2025-08-01",
    dateFin: "2025-08-15",
    dureeJoursOuvres: 11,
    statut: "Approuvé",
    dateDemande: "2025-07-01",
    raison: "Voyage en famille",
    commentaireManager: "Bonnes vacances !",
    fichiersJoints: []
  },
  {
    id: "abs_002",
    employeId: "emp_456",
    nomEmploye: "Martin Sophie",
    typeConge: "Maladie",
    dateDebut: "2025-07-20",
    dateFin: "2025-07-22",
    dureeJoursOuvres: 3,
    statut: "En attente",
    dateDemande: "2025-07-19",
    raison: "Grippe saisonnière",
    fichiersJoints: ["/api/files/certificat_sophie_001.pdf"]
  },
  {
    id: "cge_003",
    employeId: "emp_789",
    nomEmploye: "Lefebvre Paul",
    typeConge: "RTT",
    dateDebut: "2025-07-25",
    dateFin: "2025-07-25",
    dureeJoursOuvres: 1,
    statut: "Approuvé",
    dateDemande: "2025-07-10",
    raison: "Jour de récupération",
    fichiersJoints: []
  },
  {
    id: "abs_004",
    employeId: "emp_101",
    nomEmploye: "Dubois Léa",
    typeConge: "Congé Parental",
    dateDebut: "2025-09-01",
    dateFin: "2025-12-31",
    dureeJoursOuvres: 88,
    statut: "En attente",
    dateDemande: "2025-06-15",
    raison: "Congé pour s'occuper du nouveau-né",
    fichiersJoints: ["/api/files/acte_naissance_lea_001.pdf"]
  },
  {
    id: "cge_005",
    employeId: "emp_222",
    nomEmploye: "Durand Marc",
    typeConge: "Formation",
    dateDebut: "2025-08-05",
    dateFin: "2025-08-07",
    dureeJoursOuvres: 3,
    statut: "Refusé",
    dateDemande: "2025-07-10",
    raison: "Formation Python Avancé",
    commentaireManager: "Non prioritaire ce mois-ci, à reporter."
  }
];

export default initialconges;