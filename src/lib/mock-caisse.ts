import { BookingFormData } from "@/schemas/reservation";
import { CaisseTransactionFormData, PaiementItem } from "@/schemas/caisse";
import { InvoiceFormData, InvoiceItem } from "@/schemas/invoice"; // Importez les types de facture

// --- Données Mock pour les réservations ---

export const mockReservations: BookingFormData[] = [
  {
    id: "RES-001-A2B3",
    dateArrivee: new Date('2025-07-20T15:00:00Z'),
    dateDepart: new Date('2025-07-25T11:00:00Z'),
    nbAdultes: 2,
    nbEnfants: 1,
    heurePrevue: "15:00",
    civilite: "Mme",
    nom: "Dupont",
    prenom: "Marie",
    adresse: "10 Rue de Paris",
    codePostal: "75000",
    ville: "Paris",
    pays: "France",
    telephone: "0612345678",
    email: "marie.dupont@example.com",
    chambreDesireeId: "101",
    articles: [
      { libelle: "Nuitée (x5)", prixUnitaire: 50000, quantite: 5 },
      { libelle: "Petit-déjeuner (x5)", prixUnitaire: 10000, quantite: 5 },
      { libelle: "Mini-bar", prixUnitaire: 15000, quantite: 1 },
      { libelle: "Service de blanchisserie", prixUnitaire: 5000, quantite: 2 },
    ],
    montantAttribuer: 50000, // arhee déjà payées
    datePaiementarhee: new Date('2025-03-01'),
    modePaiementarhee: "Virement",
    commentaireSejour: "Client VIP, demande oreillers supplémentaires.",
    typeResa: "Normale",
    media: "Téléphone",
    creditInterdit: false,
    statut: "Confirmée",
  },
  {
    id: "RES-002-C4D5",
    dateArrivee: new Date('2025-07-22T14:00:00Z'),
    dateDepart: new Date('2025-07-24T10:00:00Z'),
    nbAdultes: 1,
    nbEnfants: 0,
    heurePrevue: "14:00",
    civilite: "M.",
    nom: "Martin",
    prenom: "Paul",
    adresse: "22 Avenue des Champs",
    codePostal: "69002",
    ville: "Lyon",
    pays: "France",
    telephone: "0787654321",
    email: "paul.martin@example.com",
    chambreDesireeId: "205",
    articles: [
      { libelle: "Nuitée (x2)", prixUnitaire: 60000, quantite: 2 },
      { libelle: "Dîner au restaurant", prixUnitaire: 25000, quantite: 1 },
    ],
    montantAttribuer: 0, // Pas d'arhee
    datePaiementarhee: undefined,
    modePaiementarhee: undefined,
    commentaireSejour: "Voyage d'affaires.",
    typeResa: "Entreprise",
    media: "Email",
    creditInterdit: false,
    statut: "Confirmée",
  },
  {
    id: "RES-003-E6F7",
    dateArrivee: new Date('2025-07-21T16:00:00Z'),
    dateDepart: new Date('2025-07-28T12:00:00Z'),
    nbAdultes: 4,
    nbEnfants: 2,
    heurePrevue: "16:00",
    civilite: "Mme",
    nom: "Petit",
    prenom: "Sophie",
    adresse: "8 Rue de la Liberté",
    codePostal: "13001",
    ville: "Marseille",
    pays: "France",
    telephone: "0498765432",
    email: "sophie.petit@example.com",
    chambreDesireeId: "302",
    articles: [
      { libelle: "Nuitée (x7)", prixUnitaire: 75000, quantite: 7 },
      { libelle: "Location de vélo (jour 1)", prixUnitaire: 10000, quantite: 1 },
      { libelle: "Location de vélo (jour 2)", prixUnitaire: 10000, quantite: 1 },
      { libelle: "Panier pique-nique", prixUnitaire: 20000, quantite: 2 },
    ],
    montantAttribuer: 100000, // arhee
    datePaiementarhee: new Date('2025-06-15'),
    modePaiementarhee: "Carte Bancaire",
    commentaireSejour: "Famille avec enfants.",
    typeResa: "Famille",
    media: "Booking.com",
    creditInterdit: false,
    statut: "Confirmée",
  },
];

// --- Données Mock pour les transactions de caisse ---

export const mockCaisseTransactions: CaisseTransactionFormData[] = [
  {
    reservationId: "RES-001-A2B3",
    montantTotalDu: 335000,
    montantDejaPaye: 50000,
    paiements: [
      {
        mode: "Carte Bancaire",
        montant: 200000,
        datePaiement: new Date('2025-07-25T11:15:00Z'),
        reference: "CB-XYZ123",
      },
      {
        mode: "Espèces",
        montant: 85000,
        datePaiement: new Date('2025-07-25T11:17:00Z'),
        reference: "",
      },
    ],
    statutCaisse: "Soldée",
    dateTransaction: new Date('2025-07-25T11:20:00Z'),
    notes: "Facture envoyée par email.",
  },
  {
    reservationId: "RES-002-C4D5",
    montantTotalDu: 145000,
    montantDejaPaye: 0,
    paiements: [
      {
        mode: "Virement",
        montant: 145000,
        datePaiement: new Date('2025-07-24T10:30:00Z'),
        reference: "VIR-ABC456",
      },
    ],
    statutCaisse: "Soldée",
    dateTransaction: new Date('2025-07-24T10:35:00Z'),
    notes: "Paiement direct de l'entreprise.",
  },
];


// --- Données Mock pour les factures (nouvel ajout) ---

export const mockInvoices: InvoiceFormData[] = [
  {
    invoiceNumber: "INV-2025-07-001",
    dateIssued: new Date('2025-07-25T11:20:00Z'),
    dueDate: new Date('2025-08-25'),
    clientName: "Madame Marie Dupont",
    clientAddress: "10 Rue de Paris, 75000 Paris, France",
    items: [
      { description: "Nuitée (5 nuits, chambre 101)", quantity: 5, unitPrice: 50000, total: 250000 },
      { description: "Petit-déjeuner", quantity: 5, unitPrice: 10000, total: 50000 },
      { description: "Mini-bar", quantity: 1, unitPrice: 15000, total: 15000 },
      { description: "Service de blanchisserie", quantity: 2, unitPrice: 5000, total: 10000 },
    ],
    subTotal: 325000,
    taxRate: 20, // Exemple de taux de TVA
    taxAmount: 65000, // 20% de 325000
    totalAmount: 390000,
    paymentStatus: "Payée",
    paymentMethod: "Carte Bancaire, Espèces",
    notes: "Facture générée suite au checkout.",
    recordedBy: "Caissier A",
    reservationId: "RES-001-A2B3",
  },
  {
    invoiceNumber: "INV-2025-07-002",
    dateIssued: new Date('2025-07-24T10:35:00Z'),
    dueDate: new Date('2025-08-24'),
    clientName: "Monsieur Paul Martin",
    clientAddress: "22 Avenue des Champs, 69002 Lyon, France",
    items: [
      { description: "Nuitée (2 nuits, chambre 205)", quantity: 2, unitPrice: 60000, total: 120000 },
      { description: "Dîner au restaurant", quantity: 1, unitPrice: 25000, total: 25000 },
    ],
    subTotal: 145000,
    taxRate: 0, // Pas de TVA pour cet exemple
    taxAmount: 0,
    totalAmount: 145000,
    paymentStatus: "Payée",
    paymentMethod: "Virement",
    notes: "Paiement direct de l'entreprise.",
    recordedBy: "Caissier B",
    reservationId: "RES-002-C4D5",
  },
];