// src/types/etablissement.ts

// Interface pour les paramètres de requête si vous avez des filtres/pagination pour la liste des établissements
export interface GetEtablissementsParams {
  page?: number;
  limit?: number;
  categorie?: "Hotelerie" | "Restauration" | "Hotelerie et Restauration" | string; // Le type d'établissement
  statut?: "Inactive" | "Activer" | string;
  nom?: string;
  ville?: string;
  // Ajoutez d'autres paramètres de recherche ou de filtre si nécessaire
  [key: string]: any; // Pour permettre des paramètres additionnels flexibles
}

// Interface principale pour un établissement (telle que reçue de l'API)
export interface Etablissement {
  id: string; // L'ID est maintenant un string (UUID)
  nom: string;
  adresse: string;
  ville: string;
  pays: string;
  code_postal: string;
  telephone: string;
  email: string;
  site_web?: string; // Optionnel selon le schéma Zod
  description: string;
  type_: "Hotelerie" | "Restauration" | "Hotelerie et Restauration"; // Type strict pour la propriété
  mot_de_passe?: string; // Le mot de passe ne devrait pas être renvoyé par l'API après la création, d'où `?`
  logo?: string; // Optionnel selon le schéma Zod
  statut: "Inactive" | "Activer";
  createdAt?: string; // Dates sous forme de chaîne ISO 8601 (si c'est ainsi que l'API les renvoie)
  updatedAt?: string;
}

// Interface pour les données utilisées lors de la création d'un établissement
// Omit 'id', 'createdAt', 'updatedAt' car ils sont générés par le backend
export type CreateEtablissementData = Omit<Etablissement, 'id' | 'createdAt' | 'updatedAt' | 'statut'> & {
  statut?: "Inactive" | "Activer"; // Le statut peut être défini ou avoir une valeur par défaut
};
// Note: mot_de_passe sera généralement requis à la création, donc il est implicitement requis ici.

// Interface pour les données utilisées lors de la mise à jour d'un établissement
// Partial pour permettre la mise à jour de seulement certains champs
// Omit 'id', 'createdAt', 'updatedAt' car ils ne sont pas modifiables directement par l'utilisateur
export type UpdateEtablissementData = Partial<Omit<Etablissement, 'id' | 'createdAt' | 'updatedAt'>>;
// Note: Le mot de passe ne devrait généralement pas être mis à jour via cette même route,
// mais s'il l'est, il restera facultatif ici.