// Type représentant un rapport rédigé par un membre du personnel
export interface Rapport {
  id: string;           // Identifiant unique du rapport (ex: UUID ou timestamp)
  auteur: string;       // Nom complet ou identifiant de l'auteur du rapport
  role?: string;        // Rôle de l'auteur (ex: "Réceptionniste", "Manager", etc.) - optionnel
  contenu: string;      // Texte du rapport
  dateCreation: Date;   // Date et heure de création du rapport
  dateModification?: Date; // Date de dernière modification, si applicable
    statut?: RapportStatut; // Statut du rapport (ex: "brouillon", "publié", etc.) - optionnel
   // Statut du rapport (optionnel)
}
export enum RapportStatut {
    BROUILLON = "brouillon", 
    PUBLIE = "publié",
    APPRUVE = "approuvé",
    REJETE = "rejeté",
    ARCHIVE = "archivé",
}
