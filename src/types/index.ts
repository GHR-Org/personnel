// ============================================================================
// TYPES PRINCIPAUX - Basés sur le backend FastAPI
// adminstration_etablissement/src/types/index.ts
// ============================================================================

// Enums correspondant au backend
export enum EtatChambre {
  LIBRE = "Libre",
  OCCUPEE = "Occupée",  // ✅ Correspond au backend enum
  NETTOYAGE = "En Nettoyage",
  HORSSERVICE = "Hors Service"
}

// ✅ Mapping pour gérer les incohérences de la DB
export const EtatChambreMapping: Record<string, EtatChambre> = {
  "Libre": EtatChambre.LIBRE,
  "Occupée": EtatChambre.OCCUPEE,
  "Occupées": EtatChambre.OCCUPEE,  // ✅ Gère le cas avec 's'
  "En Nettoyage": EtatChambre.NETTOYAGE,
  "Hors Service": EtatChambre.HORSSERVICE,
};

// ✅ Fonction pour normaliser les états venant du backend
export const normalizeEtatChambre = (etat: string): EtatChambre => {
  return EtatChambreMapping[etat] || EtatChambre.LIBRE;
};

// ============================================================================
// ENUMS PLATS - Correspondance avec le backend
// ============================================================================

export enum TypePlat {
  FASTFOOD = "FastFood",
  BOISSON = "Boisson",
  DESSERT = "Dessert",
  ENTREE = "Entrée",  // ✅ Avec accent comme le backend
  AUTRE = "Autre"
}

// ✅ Mapping pour gérer les incohérences de la DB plats
export const TypePlatMapping: Record<string, TypePlat> = {
  // Canonical labels
  "FastFood": TypePlat.FASTFOOD,
  "Boisson": TypePlat.BOISSON,
  "Dessert": TypePlat.DESSERT,
  "Entrée": TypePlat.ENTREE,
  "Autre": TypePlat.AUTRE,
  // Without accent
  "Entree": TypePlat.ENTREE,
  // Uppercase variants
  "FASTFOOD": TypePlat.FASTFOOD,
  "BOISSON": TypePlat.BOISSON,
  "DESSERT": TypePlat.DESSERT,
  "ENTREE": TypePlat.ENTREE,
  "AUTRE": TypePlat.AUTRE,
  // Lowercase variants
  "fastfood": TypePlat.FASTFOOD,
  "boisson": TypePlat.BOISSON,
  "dessert": TypePlat.DESSERT,
  "entrée": TypePlat.ENTREE,
  "entree": TypePlat.ENTREE,
  "autre": TypePlat.AUTRE,
};

// ✅ Fonction pour normaliser les types de plats
export const normalizeTypePlat = (type: string): TypePlat => {
  if (!type) return TypePlat.AUTRE;
  const key = type.trim();
  if (TypePlatMapping[key]) return TypePlatMapping[key];
  const l = key.toLowerCase();
  if (l.includes("fast")) return TypePlat.FASTFOOD;      // ex: "fast food", "fast-food"
  if (l.includes("bois")) return TypePlat.BOISSON;       // ex: "boissons"
  if (l.includes("dess")) return TypePlat.DESSERT;       // ex: "desserts"
  if (l.includes("entr")) return TypePlat.ENTREE;        // ex: "entree", "entrée"
  return TypePlat.AUTRE;
};

// ============================================================================
// ENUMS TABLES - Correspondance avec le backend
// ============================================================================

export enum StatusTable {
  LIBRE = "Libre",
  OCCUPE = "Occupée",  // ✅ Avec accent comme le backend
  RESERVEE = "Reservé",
  NETTOYAGE = "Nettoyage",
  HORS_SERVICE = "Hors-service"
}

export enum TypeTable {
  CHAISE = "chaise",
  TABLE = "table",
  COUPLE = "couple",
  FAMILY = "family",
  EXTERIEUR = "exterieur"
}

// ✅ Mapping pour gérer les incohérences de la DB tables
export const StatusTableMapping: Record<string, StatusTable> = {
  "Libre": StatusTable.LIBRE,
  "Occupée": StatusTable.OCCUPE,
  "Occupee": StatusTable.OCCUPE,  // ✅ Gère le cas sans accent
  "OCCUPE": StatusTable.OCCUPE,   // ✅ Gère le cas majuscules
  "Reservé": StatusTable.RESERVEE,
  "Reserve": StatusTable.RESERVEE, // ✅ Gère le cas sans accent
  "RESERVEE": StatusTable.RESERVEE,
  "Nettoyage": StatusTable.NETTOYAGE,
  "NETTOYAGE": StatusTable.NETTOYAGE,
  "Hors-service": StatusTable.HORS_SERVICE,
  "Hors service": StatusTable.HORS_SERVICE,
  "HORS_SERVICE": StatusTable.HORS_SERVICE,
};

export const TypeTableMapping: Record<string, TypeTable> = {
  "chaise": TypeTable.CHAISE,
  "table": TypeTable.TABLE,
  "couple": TypeTable.COUPLE,
  "family": TypeTable.FAMILY,
  "exterieur": TypeTable.EXTERIEUR,
  "CHAISE": TypeTable.CHAISE,
  "TABLE": TypeTable.TABLE,
  "COUPLE": TypeTable.COUPLE,
  "FAMILY": TypeTable.FAMILY,
  "EXTERIEUR": TypeTable.EXTERIEUR,
};

// ✅ Fonctions pour normaliser les données tables
export const normalizeStatusTable = (status: string): StatusTable => {
  return StatusTableMapping[status] || StatusTable.LIBRE;
};

export const normalizeTypeTable = (type: string): TypeTable => {
  return TypeTableMapping[type] || TypeTable.TABLE;
};

// ============================================================================
// ENUMS RAPPORTS - Correspondance avec le backend
// ============================================================================

export enum TypeRapport {
  INCIDENT = "Incident",
  MAINTENANCE = "Maintenance",
  NETTOYAGE = "Nettoyage",
  RESTAURATION = "Restauration",
  RESSOURCES_HUMAINES = "Ressources Humaines",
  AUTRE = "Autre"
}

export enum StatusRapport {
  EN_ATTENTE = "En Attente",
  TRAITER = "Traiter",
  CLOTURER = "Clôturé"
}

// ✅ Mapping pour gérer les incohérences de la DB rapports
export const TypeRapportMapping: Record<string, TypeRapport> = {
  "Incident": TypeRapport.INCIDENT,
  "Maintenance": TypeRapport.MAINTENANCE,
  "Nettoyage": TypeRapport.NETTOYAGE,
  "Restauration": TypeRapport.RESTAURATION,
  "Ressources Humaines": TypeRapport.RESSOURCES_HUMAINES,
  "Autre": TypeRapport.AUTRE,
};

export const StatusRapportMapping: Record<string, StatusRapport> = {
  "En Attente": StatusRapport.EN_ATTENTE,
  "Traiter": StatusRapport.TRAITER,
  "Traité": StatusRapport.TRAITER,    // ✅ Gère le cas avec accent
  "TRAITER": StatusRapport.TRAITER,   // ✅ Gère le cas majuscules
  "Clôturé": StatusRapport.CLOTURER,
  "Cloturer": StatusRapport.CLOTURER,  // ✅ Gère le cas sans accent
  "CLOTURER": StatusRapport.CLOTURER,
};

// ✅ Fonctions pour normaliser les données rapports
export const normalizeTypeRapport = (type: string): TypeRapport => {
  return TypeRapportMapping[type] || TypeRapport.AUTRE;
};

export const normalizeStatusRapport = (status: string): StatusRapport => {
  return StatusRapportMapping[status] || StatusRapport.EN_ATTENTE;
};

// ============================================================================
// INTERFACES RAPPORTS
// ============================================================================

// Interface Personnel supprimée - voir plus bas pour l'interface principale

export interface Rapport {
  id: number;
  date: string;                    // Date du rapport
  created_at: string;
  updated_at: string;
  personnel: Personnel;            // Relation avec le personnel
  type: TypeRapport;              // Type du rapport
  titre: string;                  // Titre du rapport
  description: string;            // Description détaillée
  reponse_responsable?: string;   // Réponse du responsable
  statut: StatusRapport;          // Statut du rapport
}

export interface RapportFormData {
  personnel_id: number;
  etablissement_id: number;
  type: TypeRapport;
  titre: string;
  description: string;
}

export interface RapportStats {
  total: number;
  en_attente: number;
  traiter: number;
  cloturer: number;
}

export enum TypeChambre {
  STANDARD = "Standard",
  DELUXE = "Deluxe",
  SUITE = "Suite",
  FAMILIALE = "Familiale"
}

export enum StatusReservation {
  EN_ATTENTE = "EN_ATTENTE",
  CONFIRMEE = "CONFIRMEE",
  EN_COURS = "EN_COURS",
  TERMINEE = "TERMINEE",
  ANNULEE = "ANNULEE"
}

// ============================================================================
// MAPPING STATUTS RÉSERVATION - Correspondance API Backend
// ============================================================================

/**
 * Mapping entre les valeurs utilisées par l'API backend et les enums frontend
 * L'API backend utilise des valeurs différentes de nos enums
 */
export const StatusReservationApiMapping: Record<StatusReservation, string> = {
  [StatusReservation.EN_ATTENTE]: "En Attente",
  [StatusReservation.CONFIRMEE]: "Confirmé",
  [StatusReservation.EN_COURS]: "En Cours",
  [StatusReservation.TERMINEE]: "Terminée",
  [StatusReservation.ANNULEE]: "Annulée"
};

/**
 * Mapping inverse pour convertir les valeurs API vers nos enums
 */
export const ApiToStatusReservationMapping: Record<string, StatusReservation> = {
  "En Attente": StatusReservation.EN_ATTENTE,
  "Confirmé": StatusReservation.CONFIRMEE,
  "En Cours": StatusReservation.EN_COURS,
  "Terminée": StatusReservation.TERMINEE,
  "Annulée": StatusReservation.ANNULEE
};

/**
 * Constantes pour les statuts API les plus utilisés
 */
export const API_STATUS_RESERVATION = {
  EN_ATTENTE: "En Attente",
  CONFIRMEE: "Confirmé",
  EN_COURS: "En Cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée"
} as const;



export enum TypeEtablissement {
  HOTELERIE = "Hotelerie",
  RESTAURATION = "Restauration",
  HOTELERIE_RESTAURATION = "Hotelerie et Restauration"
}

export enum StatusEtablissement {
  ACTIF = "ACTIF",
  INACTIF = "INACTIF",
  SUSPENDU = "SUSPENDU"
}

export enum AccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended"
}



// Interfaces principales
export interface User {
  id: number;
  email: string;
  nom?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  etablissement_id?: number;
  type_?: TypeEtablissement | string;
  created_at?: string;
  account_status?: AccountStatus;
  logo?: string;
}

export interface Etablissement {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  pays: string;
  telephone: string;
  email: string;
  type_: TypeEtablissement;
  description?: string;
  photo_url?: string;
  created_at: string;
  statut: StatusEtablissement;
}

export interface Chambre {
  id: number;
  numero: string;
  categorie: TypeChambre;
  tarif: number;
  capacite: number;
  description?: string;
  etat: EtatChambre;
  equipements: string[];
  id_etablissement: number;
  photo_url?: string;
  created_at?: string;
}

export interface Reservation {
  id: number;
  client_id: number;
  chambre_id: number;
  date_debut: string;
  date_fin: string;
  statut: StatusReservation;
  prix_total: number;
  etablissement_id: number;
  created_at: string;
}

export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  pays: string;
  // created_at: string;
  account_status: AccountStatus;
}

export interface Personnel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  poste: string;
  departement: string;
  salaire: number;
  date_embauche: string;
  statut: string;
  etablissement_id: number;
  created_at: string;
}

export interface Plat {
  id: number;
  nom: string;                    // libelle dans le backend
  description: string;
  prix: number;
  categorie: TypePlat;           // type_ dans le backend
  disponible: boolean;
  livrable?: boolean;            // ✅ aligné avec le backend
  etablissement_id: number;
  photo_url?: string;            // image dans le backend
  created_at: string;
  // ✅ Nouveaux champs correspondant au backend
  note: number;                  // Note de 0 à 5
  ingredients: string[];         // JSON array dans le backend
  tags: string[];               // JSON array dans le backend
  calories: number;             // Calories
  prep_minute: number;          // Temps de préparation en minutes
}

export interface Table {
  id: number;
  numero: string;
  capacite: number;
  statut: StatusTable;
  type: TypeTable;  // ✅ Ajout du type de table
  etablissement_id: number;
  created_at: string;
}



// Types pour les formulaires
export interface ChambreFormData {
  numero: string;
  categorie: TypeChambre;
  tarif: number;
  capacite: number;
  description?: string;
  etat: EtatChambre;
  equipements: string[];
  photo?: File;
}

export interface ReservationFormData {
  client_id: number;
  chambre_id: number;
  date_debut: string;
  date_fin: string;
  statut: StatusReservation;
  prix_total: number;
}

export interface PersonnelFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  poste: string;
  departement: string;
  salaire: number;
  date_embauche: string;
  statut: string;
  password?: string;
  etablissement_id?: number;
}

export interface PlatFormData {
  nom: string;                    // libelle dans le backend
  description: string;
  prix: number;
  categorie: TypePlat;           // type_ dans le backend
  disponible: boolean;
  livrable?: boolean;            // ✅ requis par le backend
  photo?: File;                  // image dans le backend
  // ✅ Nouveaux champs correspondant au backend
  note: number;                  // Note de 0 à 5
  ingredients: string[];         // JSON array dans le backend
  tags: string[];               // JSON array dans le backend
  calories: number;             // Calories
  prep_minute: number;          // Temps de préparation en minutes
  etablissement_id?: number;    // Requis par le backend
}

// ============================================================================
// TYPES PRODUITS - Basés sur le backend FastAPI
// ============================================================================

export enum TypeMouvementStock {
  ENTREE = "Entrer",
  SORTIE = "Sortie"
}

export interface Produit {
  id: number;
  nom: string;
  quantite: number;
  prix: number;
  seuil_stock: number;
  etablissement_id: number;
  created_at?: string;
}

export interface ProduitFormData {
  nom: string;
  quantite: number;
  prix: number;
  seuil_stock: number;
  etablissement_id?: number;
  personnel_id?: number;
}

export interface MouvementStock {
  id: number;
  produit_id: number;
  personnel_id: number;
  quantite: number;
  type: TypeMouvementStock;
  raison: string;
  created_at: string;
}

// ============================================================================
// TYPES CONGES - Basés sur le backend FastAPI
// ============================================================================

export enum TypeConge {
  VACANCE = "Vacance",
  MALADIE = "Maladie",
  RTT = "RTT",
  PARENTALE = "Congé parentale",
  FORMATION = "Formation",
  AUTRE = "Autre"
}

export enum StatusConge {
  EN_ATTENTE = "En Attente",
  APPROUVER = "Approuvé",
  REFUSER = "Refusé",
  ANNULER = "Annulé"
}

export interface Conge {
  id: number;
  type: TypeConge;
  status: StatusConge;
  dateDebut: string;
  dateDmd: string;
  dateFin: string;
  raison: string;
  fichierJoin: string;
  personnel_id: number;
  etablissement_id: number;
  personnel?: Personnel; // Made optional to align with backend behavior
}


export interface CongeFormData {
  type: TypeConge;
  status: StatusConge;
  dateDebut: string;
  dateDmd: string;
  dateFin: string;
  raison: string;
  fichierJoin?: string;
  personnel_id?: number;
  etablissement_id?: number;
}

export interface TableFormData {
  numero: string;
  capacite: number;
  statut: StatusTable;
  type: TypeTable;  // ✅ Ajout du type de table
}



export interface EtablissementFormData {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  type: TypeEtablissement;
  description?: string;
  site_web?: string;
  logo?: File;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Types pour les statistiques
export interface DashboardStats {
  total_chambres: number;
  chambres_occupees: number;
  total_reservations: number;
  reservations_confirmees: number;
  total_clients: number;
  total_personnel: number;
  revenus_mois: number;
  taux_occupation: number;
}

// Types pour les hooks
export interface UseDataResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseListDataResult<T> extends UseDataResult<T[]> {
  count: number;
}

export interface UseCRUDResult<T, CreateData, UpdateData> extends UseListDataResult<T> {
  create: (data: CreateData) => Promise<T>;
  update: (id: number, data: UpdateData) => Promise<T>;
  remove: (id: number) => Promise<void>;
}

// ============================================================================
// CONSTANTES ET TYPES UTILITAIRES
// ============================================================================

export const ETABLISSEMENT_TYPES = {
  HOTELERIE: "Hotelerie",
  RESTAURATION: "Restauration",
  HOTELERIE_RESTAURATION: "Hotelerie et Restauration"
} as const;

export type EtablissementType = typeof ETABLISSEMENT_TYPES[keyof typeof ETABLISSEMENT_TYPES];

// Fonction pour normaliser le type d'établissement
export const normalizeType = (type: string | undefined): EtablissementType => {
  if (!type) return ETABLISSEMENT_TYPES.HOTELERIE;
  const normalized = type.trim().toLowerCase();
  switch (normalized) {
    case "hotelerie":
    case "hôtel":
    case "hotel":
      return ETABLISSEMENT_TYPES.HOTELERIE;
    case "restauration":
    case "restaurant":
      return ETABLISSEMENT_TYPES.RESTAURATION;
    case "hotelerie et restauration":
    case "hôtel et restaurant":
    case "hotel et restaurant":
    case "hotelerie-restauration":
    case "hôtel-restaurant":
      return ETABLISSEMENT_TYPES.HOTELERIE_RESTAURATION;
    default:
      return ETABLISSEMENT_TYPES.HOTELERIE; // Valeur par défaut
  }
};

// ============================================================================
// TYPES D'AUTHENTIFICATION
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  adresse: string;
  ville: string;
  pays: string;
  code_postal?: string;
  telephone?: string;
  email: string;
  site_web?: string;
  description?: string;
  type_: TypeEtablissement;
  mot_de_passe: string;
  logo?: File | string | null;
  statut?: string;
}


// Type web socket
// export interface Notification