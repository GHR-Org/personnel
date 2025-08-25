"use client";

import * as React from "react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"; // Pour le bouton d'impression
import { IconPrinter } from "@tabler/icons-react"; // Pour l'icône d'impression
import { InvoiceFormData } from "@/schemas/invoice";

interface InvoiceDetailsCardProps {
  invoice: InvoiceFormData | null; // La facture à afficher
  onPrint?: () => void; // Optionnel : pour déclencher l'impression depuis l'extérieur
}

export function InvoiceDetailsCard({ invoice, onPrint }: InvoiceDetailsCardProps) {
  // Utilisez useRef pour cibler la zone d'impression si nécessaire,
  // ou laissez le `onPrint` du parent gérer la logique d'impression globale.

  if (!invoice) {
    return (
      <Card className="flex-1 min-h-[400px] flex flex-col justify-center items-center text-muted-foreground p-6">
        <p>Générez ou sélectionnez une facture pour afficher les détails.</p>
        <p>Le solde à payer doit être nul ou négatif pour finaliser et générer la facture.</p>
      </Card>
    );
  }

  return (
    <Card className="flex-1 overflow-y-auto max-h-[700px] relative"> {/* Ajoutez max-h et overflow-y */}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Aperçu Facture</CardTitle>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <p>N°: <span className="font-semibold">{invoice.invoiceNumber}</span></p>
          <p>Date: <span className="font-semibold">{format(new Date(invoice.dateIssued), "dd MMMM yyyy", { locale: fr })}</span></p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Facturé à:</h3>
          <p className="font-semibold text-base">{invoice.clientName}</p>
          {invoice.clientAddress && <p className="text-xs text-muted-foreground">{invoice.clientAddress}</p>}
        </div>

        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">PU</th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.description}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">{item.quantity}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                    {(item.unitPrice).toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right font-semibold">
                    {(item.total).toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <div className="w-full max-w-[200px] text-right">
            <div className="flex justify-between py-1 text-sm">
              <span className="text-muted-foreground">Sous-total:</span>
              <span className="font-semibold">{invoice.subTotal.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-1 text-sm">
                <span className="text-muted-foreground">TVA ({invoice.taxRate}%):</span>
                <span className="font-semibold">{invoice.taxAmount.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</span>
              </div>
            )}
            <Separator className="my-1" />
            <div className="flex justify-between py-1 text-base">
              <span className="font-bold">TOTAL:</span>
              <span className="font-bold text-primary">{invoice.totalAmount.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground border-t pt-4">
          <p>Statut de Paiement: <span className="font-semibold">{invoice.paymentStatus}</span></p>
          {invoice.paymentMethod && <p>Méthode de Paiement: <span className="font-semibold">{invoice.paymentMethod}</span></p>}
          {invoice.notes && (
            <div className="mt-2">
              <p className="font-semibold">Notes:</p>
              <p className="whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
      {/* Bouton d'impression en bas de la card si nécessaire */}
      {onPrint && (
        <div className="sticky bottom-0 bg-background/90 backdrop-blur-sm p-4 border-t flex justify-end">
          <Button variant="outline" onClick={onPrint} className="w-full">
            <IconPrinter className="mr-2 h-4 w-4" /> Imprimer la Facture
          </Button>
        </div>
      )}
    </Card>
  );
}