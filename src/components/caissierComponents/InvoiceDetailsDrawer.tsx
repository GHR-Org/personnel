// components/caissierComponents/InvoiceDetailsDrawer.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale'; // Assurez-vous d'avoir la locale française si vous l'utilisez

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; // Pour une meilleure mise en page
import { InvoiceFormData } from "@/schemas/invoice"; // Assurez-vous du chemin correct
import { IconPrinter } from "@tabler/icons-react";

interface InvoiceDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceFormData | null; // La facture à afficher
}

export function InvoiceDetailsDrawer({
  open,
  onOpenChange,
  invoice,
}: InvoiceDetailsDrawerProps) {
  const printRef = React.useRef<HTMLDivElement>(null);

  if (!invoice) {
    return null; // Ne rien afficher si aucune facture n'est passée
  }

  const handlePrint = () => {
    // Cette approche est simple : elle imprime la page actuelle.
    // Pour un contrôle plus fin et un layout d'impression dédié,
    // vous devriez créer un composant spécifique pour l'impression
    // et potentiellement l'ouvrir dans une nouvelle fenêtre/tab
    // ou utiliser une bibliothèque comme 'react-to-print'.

    // Pour l'exemple, nous allons juste imprimer le contenu du Drawer
    // en utilisant des styles CSS pour cacher ce qui ne doit pas être imprimé.
    window.print();
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <div className="mx-auto w-16 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground my-2 print:hidden" /> {/* Cacher à l'impression */}
        <DrawerHeader className="px-4 text-left print:hidden"> {/* Cacher à l'impression */}
          <DrawerTitle className="text-lg font-semibold">Détails de la Facture</DrawerTitle>
          <DrawerDescription>Consultez les informations détaillées de la facture N° {invoice.invoiceNumber}</DrawerDescription>
        </DrawerHeader>

        {/* Contenu de la facture à imprimer */}
        <div ref={printRef} className="flex-1 overflow-y-auto p-4 print:p-0 print:m-0 print:overflow-visible">
          <div className="invoice-print-area p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg print:shadow-none print:rounded-none">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-primary">FACTURE</h1>
                <p className="text-sm text-muted-foreground">N°: <span className="font-semibold">{invoice.invoiceNumber}</span></p>
                <p className="text-sm text-muted-foreground">Date d&apos;émission: <span className="font-semibold">{format(new Date(invoice.dateIssued), "dd MMMM yyyy", { locale: fr })}</span></p>
                {invoice.dueDate && (
                  <p className="text-sm text-muted-foreground">Date d&apos;échéance: <span className="font-semibold">{format(new Date(invoice.dueDate), "dd MMMM yyyy", { locale: fr })}</span></p>
                )}
              </div>
              <div className="text-right">
                <h2 className="text-xl font-semibold">Nom de l&apos;hotel</h2> {/* Mettez le nom de votre entreprise ici */}
                <p className="text-sm text-muted-foreground">Adresse et Ville de l&apos;hotel</p>
                <p className="text-sm text-muted-foreground">Telephone et email</p>
                <p className="text-sm text-muted-foreground">NIF: XXX-XXX-XXX | STAT: YYYY</p> {/* Informations légales */}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-md font-semibold text-muted-foreground">Facturé à:</h3>
              <p className="font-semibold">{invoice.clientName}</p>
              {invoice.clientAddress && <p className="text-sm text-muted-foreground">{invoice.clientAddress}</p>}
            </div>

            <div className="mb-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prix Unitaire</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{item.unitPrice.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right font-semibold">{item.total.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-8">
              <div className="w-1/2">
                <div className="flex justify-between py-1">
                  <span className="text-sm text-muted-foreground">Sous-total:</span>
                  <span className="text-sm font-semibold">{invoice.subTotal.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm text-muted-foreground">TVA ({invoice.taxRate}%):</span>
                  <span className="text-sm font-semibold">{invoice.taxAmount.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between py-1">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold text-primary">{invoice.totalAmount.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-sm text-muted-foreground">
              <p>Statut de Paiement: <span className="font-semibold">{invoice.paymentStatus}</span></p>
              {invoice.paymentMethod && <p>Méthode de Paiement: <span className="font-semibold">{invoice.paymentMethod}</span></p>}
              {invoice.notes && (
                <div className="mt-4">
                  <p className="font-semibold">Notes:</p>
                  <p className="whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-8 text-center text-xs text-muted-foreground print:mt-12">
              <p>Merci pour votre confiance !</p>
              <p>Enregistré par: {invoice.recordedBy}</p>
            </div>
          </div>
        </div>

        <DrawerFooter className="flex-shrink-0 mt-4 border-t p-4 bg-background flex flex-row justify-end gap-2 print:hidden"> {/* Cacher à l'impression */}
          <Button variant="outline" onClick={handlePrint}>
            <IconPrinter className="mr-2 h-4 w-4" /> Imprimer
          </Button>
          <DrawerClose asChild>
            <Button variant="default">Fermer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}