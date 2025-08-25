// components/caissierComponents/InvoicePrintLayout.tsx
import * as React from "react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { InvoiceFormData } from "@/schemas/invoice"; // Assurez-vous du chemin correct

interface InvoicePrintLayoutProps {
  invoice: InvoiceFormData;
}

// Définissez des styles CSS spécifiques pour l'impression ici
// Ceci est un exemple simple, vous pourriez vouloir un fichier CSS séparé pour cela.
// Pourrait être inline ou un bloc <style> si vous êtes en 'use client'
const printStyles = `
  .invoice-document {
    font-family: 'Arial', sans-serif;
    color: #000; /* Force le texte noir */
    padding: 20mm; /* Marges pour l'impression */
    box-sizing: border-box;
    width: 210mm; /* Largeur A4 */
    min-height: 297mm; /* Hauteur A4 */
  }
  .invoice-pdf-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }
  .invoice-pdf-title {
    font-size: 28px;
    font-weight: bold;
    color: #0000FF; /* Exemple: Utilisez un bleu RVB au lieu d'oklch */
  }
  /* Remplacez toutes les variables oklch par des valeurs hex/rgb ici */
  .text-primary { color: #0000FF !important; } /* Par exemple, remplacer la couleur primaire par un hex */
  .text-muted-foreground { color: #555555 !important; }
  .bg-gray-50 { background-color: #F8F8F8 !important; }
  .dark\\:bg-gray-900 { background-color: white !important; }
  .dark\\:text-gray-100 { color: black !important; }
  .dark\\:text-gray-400 { color: #333333 !important; }

  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 8px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  .separator {
    border-top: 1px dashed #ccc;
    margin: 20px 0;
  }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }
`;

export const InvoicePrintLayout = React.forwardRef<HTMLDivElement, InvoicePrintLayoutProps>(({ invoice }, ref) => {
  return (
    <div ref={ref} className="invoice-document" style={{ position: 'absolute', left: '-9999px', top: '-9999px', zIndex: -1 }}>
      {/* Ajoutez les styles inline ou un bloc style ici pour override les couleurs oklch */}
      <style>{printStyles}</style>

      <div className="invoice-pdf-header">
        <div>
          <h1 className="invoice-pdf-title">FACTURE</h1>
          <p className="text-sm text-muted-foreground">N°: <span className="font-semibold">{invoice.invoiceNumber}</span></p>
          <p className="text-sm text-muted-foreground">Date d'émission: <span className="font-semibold">{format(new Date(invoice.dateIssued), "dd MMMM yyyy", { locale: fr })}</span></p>
          {invoice.dueDate && (
            <p className="text-sm text-muted-foreground">Date d'échéance: <span className="font-semibold">{format(new Date(invoice.dueDate), "dd MMMM yyyy", { locale: fr })}</span></p>
          )}
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">Votre Entreprise</h2>
          <p className="text-sm text-muted-foreground">Votre Adresse, Votre Ville</p>
          <p className="text-sm text-muted-foreground">Votre Téléphone, Votre Email</p>
          <p className="text-sm text-muted-foreground">NIF: XXX-XXX-XXX | STAT: YYYY</p>
        </div>
      </div>

      <div className="separator"></div> {/* Utiliser une classe spécifique */}

      <div className="mb-6">
        <h3 className="text-md font-semibold text-muted-foreground">Facturé à:</h3>
        <p className="font-semibold">{invoice.clientName}</p>
        {invoice.clientAddress && <p className="text-sm text-muted-foreground">{invoice.clientAddress}</p>}
      </div>

      <div className="mb-6 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th scope="col">Description</th>
              <th scope="col" style={{ textAlign: 'right' }}>Qté</th>
              <th scope="col" style={{ textAlign: 'right' }}>Prix Unitaire</th>
              <th scope="col" style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="font-medium">{item.description}</td>
                <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{item.unitPrice.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</td>
                <td className="font-semibold" style={{ textAlign: 'right' }}>{item.total.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
        <div style={{ width: '50%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span className="text-sm text-muted-foreground">Sous-total:</span>
            <span className="text-sm font-semibold">{invoice.subTotal.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span className="text-sm text-muted-foreground">TVA ({invoice.taxRate}%):</span>
            <span className="text-sm font-semibold">{invoice.taxAmount.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</span>
          </div>
          <div className="separator" style={{ margin: '8px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
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
            <p style={{ whiteSpace: 'pre-wrap' }}>{invoice.notes}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '10px', color: '#555555' }}>
        <p>Merci pour votre confiance !</p>
        <p>Enregistré par: {invoice.recordedBy}</p>
      </div>
    </div>
  );
});

// Important pour le débogage et l'affichage dans React Dev Tools
InvoicePrintLayout.displayName = "InvoicePrintLayout";