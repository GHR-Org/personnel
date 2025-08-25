// schemas/invoice.ts
import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "La description de l'article est requise."),
  quantity: z.number().min(1, "La quantité doit être au moins de 1."),
  unitPrice: z.number().min(0.01, "Le prix unitaire doit être positif."),
  total: z.number().min(0.01, "Le total de l'article doit être positif."), // Calculé côté frontend ou backend
});

export const invoiceSchema = z.object({
  id: z.string().optional(), // Sera généré par le backend
  invoiceNumber: z.string().min(1, "Le numéro de facture est requis.").optional(), // Peut être généré
  clientId: z.string().optional(), // ID du client si vous avez une gestion des clients
  clientName: z.string().min(1, "Le nom du client est requis."),
  clientAddress: z.string().optional(),
  dateIssued: z.string().refine((date) => !isNaN(new Date(date).getTime()), "Date d'émission invalide."),
  dueDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), "Date d'échéance invalide.").optional(),
  items: z.array(invoiceItemSchema).min(1, "La facture doit contenir au moins un article."),
  subTotal: z.number().min(0, "Le sous-total ne peut pas être négatif."),
  taxRate: z.number().min(0).max(100).default(0), // Taux de TVA en pourcentage
  taxAmount: z.number().min(0),
  totalAmount: z.number().min(0.01, "Le montant total doit être positif."),
  paymentStatus: z.enum(["En attente", "Payée", "Partiellement payée", "Annulée", "Remboursée"]).default("En attente"),
  paymentMethod: z.enum(["Espèces", "Carte Bancaire", "Virement", "Chèque", "Crédit", "Autre"]).optional(),
  recordedBy: z.string().min(1, "L'enregistreur est requis."),
  notes: z.string().optional(),
  // Vous pouvez ajouter d'autres champs comme:
  // reservationId: z.string().optional(), // Lien vers la réservation si applicable
  // orderId: z.string().optional(), // Lien vers la commande restaurant si applicable
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type InvoiceItemData = z.infer<typeof invoiceItemSchema>;