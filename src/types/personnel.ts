export interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  role: string;
  poste?: string;
  date_embauche: string;
  statut_compte: string;
  etablissement_id: number;
  etablissement?: {
    id: number;
    nom: string;
  };
  date_creation: string;
  date_mise_a_jour: string;
}

export interface PersonnelFormData {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  mot_de_passe: string;
  role: string;
  poste?: string;
  date_embauche: string;
  statut_compte: string;
}

export interface PersonnelStats {
  total: number;
  actifs: number;
  inactifs: number;
  suspendus: number;
  par_role: Record<string, number>;
  par_etablissement: Record<string, number>;
}

export interface PersonnelStatsByEtablissement {
  total: number;
  actifs: number;
  inactifs: number;
  suspendus: number;
  par_role: Record<string, number>;
}

export type Role = "Receptionniste" | "Technicien" | "Manager" | "RH" | "Caissier" | "Directeur";
export type AccountStatus = "active" | "inactive" | "suspended"; 