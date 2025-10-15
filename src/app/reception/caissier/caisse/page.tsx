// "use client";

// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'sonner';

// // Importez vos composants de caisse
// import { CaisseHeader } from '@/components/caisse/CaisseHeader';
// import { ReservationDetailsCard } from '@/components/caisse/ReservationDetailsCard';
// import { ArticlesFacturesTable } from '@/components/caisse/ArticlesFacturesTable';
// import { PaymentSection } from '@/components/caisse/PaymentSection';
// import { CheckoutActions } from '@/components/caisse/CheckoutActions';
// import { InvoiceDetailsCard } from '@/components/caisse/InvoiceDetailsCard';
// import { CaisseSummaryCard } from '@/components/caisse/CaisseSummaryCard';

// // Importez vos schémas et types
// import { BookingFormData } from '@/schemas/reservation';
// import { CaisseTransactionFormData, caisseTransactionSchema} from '@/schemas/caisse';
// import { InvoiceFormData } from '@/schemas/invoice';

// // Importez le composant Form de shadcn/ui
// import { Form } from '@/components/ui/form';
// import { Card, CardContent } from '@/components/ui/card';

// // Importez les données mock
// import { mockReservations, mockCaisseTransactions, mockInvoices } from '@/lib/mock-caisse';

// // Importez la DataTable et les colonnes
// import { DataTable } from '@/components/ui/data-table';
// import { createReservationColumns } from '@/components/caisse/Column';
// import { Button } from '@/components/ui/button';
// import { IconPrinter } from '@tabler/icons-react';

// export default function CaissePage() {
//   const [selectedReservation, setSelectedReservation] = React.useState<BookingFormData | null>(null);
//   const [currentInvoice, setCurrentInvoice] = React.useState<InvoiceFormData | null>(null);
//   const [isSearching, setIsSearching] = React.useState(false);
//   const [isSubmittingCaisse, setIsSubmittingCaisse] = React.useState(false);
//   const [isReservationSolded, setIsReservationSolded] = React.useState(false); // <-- NOUVEL ÉTAT

//   const form = useForm<CaisseTransactionFormData>({
//     resolver: zodResolver(caisseTransactionSchema),
//     defaultValues: {
//       reservationId: "",
//       montantTotalDu: 0,
//       montantDejaPaye: 0,
//       paiements: [],
//       statutCaisse: "Ouverte",
//       dateTransaction: new Date(),
//       notes: "",
//     },
//     mode: "onTouched",
//   });

//   const handleSelectReservationFromTable = (reservation: BookingFormData) => {
//     const transaction = mockCaisseTransactions.find(
//       (trans) => trans.reservationId === reservation.id
//     );
//     const solded = transaction?.statutCaisse === "Soldée";

//     setSelectedReservation(reservation);
//     setIsReservationSolded(solded); // <-- Met à jour le nouvel état

//     if (solded) {
//       toast.info(`La réservation ${reservation.id} est déjà soldée. Affichage de la facture.`);
//       // Si soldée, réinitialiser le formulaire pour éviter des valeurs en conflit,
//       // mais garder la réservation sélectionnée et charger la facture.
//       form.reset({
//         reservationId: reservation.id || "",
//         montantTotalDu: 0, // Ou le montant total de la facture soldée si vous voulez l'afficher
//         montantDejaPaye: 0,
//         paiements: [],
//         statutCaisse: "Soldée",
//         dateTransaction: transaction?.dateTransaction || new Date(),
//         notes: transaction?.notes || "",
//       });
//     } else {
//       toast.success(`Réservation ${reservation.id} sélectionnée.`);
//     }
//   };

//   const columns = createReservationColumns({
//     onSelectReservation: handleSelectReservationFromTable,
//   });

//   React.useEffect(() => {
//     if (selectedReservation) {
//       const articlesTotal = selectedReservation.articles.reduce((sum, item) => sum + (item.prixUnitaire * item.quantite), 0);
//       const arheePayees = selectedReservation.montantAttribuer || 0;

//       const existingCaisseTransaction = mockCaisseTransactions.find(
//         (trans) => trans.reservationId === selectedReservation.id
//       );

//       const soldedStatus = existingCaisseTransaction?.statutCaisse === "Soldée";
//       setIsReservationSolded(soldedStatus); // <-- Met à jour l'état au chargement de l'effet

//       // Si la réservation est soldée, ne pas réinitialiser le formulaire avec des valeurs "ouvertes"
//       // mais charger la transaction existante pour le résumé.
//       if (soldedStatus) {
//         form.reset({
//           reservationId: selectedReservation.id || "",
//           montantTotalDu: existingCaisseTransaction?.montantTotalDu || articlesTotal,
//           montantDejaPaye: existingCaisseTransaction?.montantDejaPaye || arheePayees,
//           paiements: existingCaisseTransaction?.paiements || [],
//           statutCaisse: existingCaisseTransaction?.statutCaisse || "Soldée",
//           dateTransaction: existingCaisseTransaction?.dateTransaction || new Date(),
//           notes: existingCaisseTransaction?.notes || selectedReservation.commentaireSejour || "",
//         });
//       } else {
//         // Logique normale pour une réservation non soldée
//         form.reset({
//           reservationId: selectedReservation.id || "",
//           montantTotalDu: articlesTotal,
//           montantDejaPaye: arheePayees,
//           paiements: existingCaisseTransaction ? existingCaisseTransaction.paiements : [],
//           statutCaisse: existingCaisseTransaction ? existingCaisseTransaction.statutCaisse : "Ouverte",
//           dateTransaction: existingCaisseTransaction ? existingCaisseTransaction.dateTransaction : new Date(),
//           notes: existingCaisseTransaction ? existingCaisseTransaction.notes : (selectedReservation.commentaireSejour || ""),
//         });
//       }

//       const existingInvoice = mockInvoices.find(inv => inv.reservationId === selectedReservation.id);
//       setCurrentInvoice(existingInvoice || null);

//     } else {
//       form.reset();
//       setCurrentInvoice(null);
//       setIsReservationSolded(false); // <-- Réinitialiser aussi cet état
//     }
//   }, [selectedReservation, form]);

//   const currentPaiements = form.watch("paiements");
//   const montantTotalDu = form.watch("montantTotalDu");
//   const montantDejaPaye = form.watch("montantDejaPaye");
//   const statutCaisse = form.watch("statutCaisse");

//   const totalPaiementsActuels = currentPaiements.reduce((sum, p) => sum + (p.montant || 0), 0);
//   const soldeFinal = montantTotalDu - montantDejaPaye - totalPaiementsActuels;
//   const canFinalize = soldeFinal <= 0;

//   const handleSearchReservation = async (query: string) => {
//     setIsSearching(true);
//     await new Promise(resolve => setTimeout(resolve, 500));

//     const foundReservation = mockReservations.find(
//       (res) =>
//         res.id?.toLowerCase().includes(query.toLowerCase()) ||
//         res.nom.toLowerCase().includes(query.toLowerCase()) ||
//         res.prenom.toLowerCase().includes(query.toLowerCase()) ||
//         res.chambreDesireeId.toLowerCase().includes(query.toLowerCase())
//     );

//     if (foundReservation) {
//       const transaction = mockCaisseTransactions.find(
//         (trans) => trans.reservationId === foundReservation.id
//       );
//       const solded = transaction?.statutCaisse === "Soldée";

//       setSelectedReservation(foundReservation);
//       setIsReservationSolded(solded); // <-- Met à jour l'état ici aussi

//       if (solded) {
//         toast.info(`La réservation ${foundReservation.id} est déjà soldée. Affichage de la facture.`);
//         // Si soldée, réinitialiser le formulaire mais charger la transaction existante pour le résumé.
//         form.reset({
//           reservationId: foundReservation.id || "",
//           montantTotalDu: transaction?.montantTotalDu || 0,
//           montantDejaPaye: transaction?.montantDejaPaye || 0,
//           paiements: transaction?.paiements || [],
//           statutCaisse: "Soldée",
//           dateTransaction: transaction?.dateTransaction || new Date(),
//           notes: transaction?.notes || "",
//         });
//       } else {
//         toast.success(`Réservation ${foundReservation.id} trouvée.`);
//       }
//     } else {
//       setSelectedReservation(null);
//       setCurrentInvoice(null);
//       setIsReservationSolded(false); // <-- Réinitialiser aussi cet état
//       toast.error("Aucune réservation trouvée pour cette recherche.");
//     }
//     setIsSearching(false);
//   };

//   const onSubmitCaisse = async (data: CaisseTransactionFormData) => {
//     if (!selectedReservation) {
//       toast.error("Veuillez sélectionner une réservation avant de finaliser.");
//       return;
//     }
//     if (soldeFinal > 0) {
//       toast.warning(`Solde restant de ${soldeFinal.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}. Veuillez collecter le montant avant de finaliser.`);
//       return;
//     }

//     setIsSubmittingCaisse(true);
//     console.log("Données de caisse à soumettre:", data);

//     await new Promise(resolve => setTimeout(resolve, 2000));

//     const generatedInvoice: InvoiceFormData = {
//       invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
//       dateIssued: new Date(),
//       dueDate: new Date(),
//       clientName: `${selectedReservation.civilite} ${selectedReservation.prenom} ${selectedReservation.nom}`,
//       clientAddress: `${selectedReservation.adresse}, ${selectedReservation.codePostal} ${selectedReservation.ville}, ${selectedReservation.pays}`,
//       items: selectedReservation.articles.map(article => ({
//         description: article.libelle,
//         quantity: article.quantite,
//         unitPrice: article.prixUnitaire,
//         total: article.prixUnitaire * article.quantite,
//       })),
//       subTotal: montantTotalDu,
//       taxRate: 0,
//       taxAmount: 0,
//       totalAmount: montantTotalDu,
//       paymentStatus: "Payée",
//       paymentMethod: data.paiements.map(p => p.mode).join(", ") || "Non spécifié",
//       notes: data.notes || "Transaction finalisée.",
//       recordedBy: "Caissier Actuel",
//       reservationId: selectedReservation.id || "",
//     };

//     setCurrentInvoice(generatedInvoice);

//     // Mettre à jour la transaction mock (simuler l'enregistrement en DB)
//     const existingTransactionIndex = mockCaisseTransactions.findIndex(
//       (trans) => trans.reservationId === selectedReservation.id
//     );

//     const finalCaisseData: CaisseTransactionFormData = {
//       ...data,
//       statutCaisse: "Soldée",
//       dateTransaction: new Date(),
//     };

//     if (existingTransactionIndex !== -1) {
//       mockCaisseTransactions[existingTransactionIndex] = finalCaisseData;
//     } else {
//       mockCaisseTransactions.push(finalCaisseData);
//     }
    
//     // Mettre à jour l'état de la facture mock (simuler l'enregistrement en DB)
//     const existingInvoiceIndex = mockInvoices.findIndex(inv => inv.reservationId === selectedReservation.id);
//     if (existingInvoiceIndex !== -1) {
//         mockInvoices[existingInvoiceIndex] = generatedInvoice;
//     } else {
//         mockInvoices.push(generatedInvoice);
//     }


//     form.setValue("statutCaisse", "Soldée");
//     setIsReservationSolded(true); // La réservation est maintenant soldée

//     setIsSubmittingCaisse(false);
//     toast.success("Transaction de caisse finalisée et facture générée !");
//   };

//   const handlePrintFacture = () => {
//     if (!currentInvoice) {
//       toast.info("Aucune facture à imprimer.");
//       return;
//     }
//     // Pour imprimer uniquement la card de facture (vous devrez peut-être affiner cela avec une librairie d'impression)
//     // Ici, on fait une impression générale de la page, qui inclura la card.
//     window.print();
//     toast.info("Impression de la facture...");
//   };

//   const handleCancelTransaction = () => {
//     setSelectedReservation(null);
//     setCurrentInvoice(null);
//     setIsReservationSolded(false); // Réinitialiser l'état soldé
//     form.reset();
//     toast.info("Transaction de caisse annulée.");
//   };

//   return (
//     <div className="container mx-auto py-8 px-6">
//       <CaisseHeader onSearchReservation={handleSearchReservation} isLoading={isSearching} />

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmitCaisse)} className="space-y-6 mt-6">
//           {/* Section DataTable pour choisir une réservation */}
//           {!selectedReservation && (
//             <Card>
//               <CardContent className="pt-4">
//                 <h2 className="text-xl font-semibold mb-4">Sélectionner une Réservation</h2>
//                 <DataTable
//                   columns={columns}
//                   data={mockReservations}
//                   filterColumnId="nom"
//                   filterPlaceholder="Filtrer par nom ou ID..."
//                 />
//               </CardContent>
//             </Card>
//           )}

//           {/* Section du formulaire de caisse ou de la vue soldée, visible seulement si une réservation est sélectionnée */}
//           {selectedReservation && (
//             <>
//               {isReservationSolded ? (
//                 // Layout pour une réservation soldée
//                 <div className="grid grid-cols-2 gap-6">
//                   {/* Colonne Gauche: Articles Facturés */}
//                   <div className=" h-full">
//                     <ArticlesFacturesTable articles={selectedReservation.articles} />
//                   </div>

//                   {/* Colonne Droite: Facture Finale */}
//                   <div className="">
//                     <InvoiceDetailsCard
//                       invoice={currentInvoice}
//                       onPrint={handlePrintFacture}
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 // Layout pour une réservation non soldée (transaction en cours)
//                 <div className="flex flex-col md:flex-row gap-6">
//                   {/* Colonne 1: Réservation et Articles */}
//                   <div className="flex-1 flex flex-col gap-6">
//                     <ReservationDetailsCard reservation={selectedReservation} />
//                     <ArticlesFacturesTable articles={selectedReservation.articles} />
//                   </div>

//                   {/* Colonne 2: Paiements et Facture */}
//                   <div className="flex-1 flex flex-col gap-6">
//                     <PaymentSection
//                       montantTotalDu={montantTotalDu}
//                       montantDejaPaye={montantDejaPaye}
//                       existingPayments={currentPaiements}
//                       onAddPayment={() => {}}
//                       onRemovePayment={() => {}}
//                       control={form.control}
//                     />

//                     <InvoiceDetailsCard
//                       invoice={currentInvoice}
//                       onPrint={handlePrintFacture}
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* La carte de résumé est toujours affichée quand une réservation est sélectionnée */}
//               <CaisseSummaryCard
//                 montantTotalDu={montantTotalDu}
//                 montantDejaPaye={montantDejaPaye}
//                 totalPaiementsActuels={totalPaiementsActuels}
//                 soldeFinal={soldeFinal}
//                 statutCaisse={statutCaisse}
//               />
//             </>
//           )}

//           {selectedReservation && !isReservationSolded && ( // N'afficher les actions que si pas soldé
//             <CheckoutActions
//               onFinalize={form.handleSubmit(onSubmitCaisse)}
//               onPrintFacture={handlePrintFacture}
//               onCancelTransaction={handleCancelTransaction}
//               isSubmitting={isSubmittingCaisse}
//               canFinalize={canFinalize}
//             />
//           )}

//           {selectedReservation && isReservationSolded && ( // Afficher seulement le bouton d'annulation et d'impression pour les soldées
//             <div className="flex justify-end space-x-4 mt-6">
//               <Button
//                 variant="outline"
//                 onClick={handlePrintFacture}
//                 disabled={!currentInvoice}
//                 className="text-primary-foreground hover:bg-primary/90"
//               >
//                 <IconPrinter className="mr-2 h-4 w-4" /> Imprimer la Facture
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={handleCancelTransaction}
//                 disabled={isSubmittingCaisse}
//               >
//                 Annuler la Sélection
//               </Button>
//             </div>
//           )}
//         </form>
//       </Form>
//     </div>
//   );
// }
"use client";

import NotFound404 from "@/components/404";



export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Caisse</h1>
      <NotFound404 />
    </div>
  );
}