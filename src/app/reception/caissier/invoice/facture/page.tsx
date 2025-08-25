// app/dashboard/invoices/page.tsx
"use client";

import * as React from "react";
import { useState, useMemo } from "react"; // Importez useMemo
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconPlus, IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { InvoiceModal } from "@/components/caissierComponents/InvoiceModal";
import { InvoiceDetailsDrawer } from "@/components/caissierComponents/InvoiceDetailsDrawer";
import { InvoiceFormData } from "@/schemas/invoice";
import { mockInvoices } from "@/lib/mock-invoices"; // Importez vos données mockées
import { RealTimeActivity } from "@/components/receptionComponents/RealTimeActivityReception";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceFormData[]>(mockInvoices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceFormData | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceFormData | undefined>(undefined);

  // Utilisez useMemo pour filtrer les factures et optimiser les performances
  // Le filtre ne s'exécutera à nouveau que si 'invoices' change.
  const paidInvoices = useMemo(() => {
    return invoices.filter(invoice => invoice.paymentStatus === "Payée");
  }, [invoices]);


  // Générateur de numéro de facture simple pour les données mockées
  const generateInvoiceNumber = (): string => {
    const lastInvoiceNumber = invoices.length > 0
      ? invoices[invoices.length - 1].invoiceNumber
      : "INV-2025-000";
    const lastNumber = parseInt(lastInvoiceNumber?.split('-')[2] || "0");
    const newNumber = (lastNumber + 1).toString().padStart(3, '0');
    return `INV-2025-${newNumber}`;
  };

  const handleCreateOrUpdateInvoice = (data: InvoiceFormData) => {
    if (editingInvoice) {
      // Logique de mise à jour
      setInvoices(invoices.map(inv =>
        inv.invoiceNumber === editingInvoice.invoiceNumber ? { ...data, invoiceNumber: editingInvoice.invoiceNumber } : inv
      ));
      setEditingInvoice(undefined); // Réinitialise l'état d'édition
    } else {
      // Logique de création
      const newInvoiceNumber = generateInvoiceNumber();
      setInvoices([...invoices, { ...data, invoiceNumber: newInvoiceNumber }]);
    }
    setIsModalOpen(false); // Ferme la modale
  };

  const handleEditInvoice = (invoice: InvoiceFormData) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleViewInvoiceDetails = (invoice: InvoiceFormData) => {
    setSelectedInvoice(invoice);
    setIsDrawerOpen(true);
  };

  const handleDeleteInvoice = (invoiceNumber: string | undefined) => {
    if (invoiceNumber && confirm(`Êtes-vous sûr de vouloir supprimer la facture N° ${invoiceNumber} ?`)) {
      setInvoices(invoices.filter(inv => inv.invoiceNumber !== invoiceNumber));
      // Optionnel: fermer le drawer si la facture supprimée était affichée
      if (selectedInvoice?.invoiceNumber === invoiceNumber) {
        setIsDrawerOpen(false);
        setSelectedInvoice(null);
      }
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Factures Payées</h2> {/* Mis à jour le titre */}
        <div className="flex items-center space-x-2">
          {/* Le bouton "Nouvelle Facture" peut rester, mais la facture créée n'apparaîtra ici que si son statut est "Payée" */}
          <Button onClick={() => { setEditingInvoice(undefined); setIsModalOpen(true); }}>
            <IconPlus className="mr-2 h-4 w-4" /> Nouvelle Facture
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Factures Payées</CardTitle> {/* Mis à jour le titre */}
          <CardDescription>
            Visualisez et gérez uniquement les factures dont le statut est "Payée".
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paidInvoices.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Aucune facture payée enregistrée.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Facture</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date Émise</TableHead>
                    <TableHead className="text-right">Montant Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paidInvoices.map((invoice) => ( 
                    <TableRow key={invoice.invoiceNumber}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell>{format(new Date(invoice.dateIssued), "dd/MM/yyyy", { locale: fr })}</TableCell>
                      <TableCell className="text-right">{invoice.totalAmount.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>
                          {/* Le statut est forcément "Payée" ici */}
                          {invoice.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewInvoiceDetails(invoice)}>
                            <IconEye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditInvoice(invoice)}>
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteInvoice(invoice.invoiceNumber)}>
                            <IconTrash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <section>
        <RealTimeActivity stats={{
          etablissements_recents: [],
          alertes: []
        }} />
      </section>

      <InvoiceModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSaveInvoice={handleCreateOrUpdateInvoice}
        initialData={editingInvoice}
      />

      <InvoiceDetailsDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        invoice={selectedInvoice}
      />
    </div>
  );
}