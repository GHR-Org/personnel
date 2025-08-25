// components/caissierComponents/InvoiceModal.tsx
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceFormData, invoiceSchema } from "@/schemas/invoice";
import { Textarea } from "@/components/ui/textarea";
import { IconPlus, IconTrash } from "@tabler/icons-react";

interface InvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveInvoice: (data: InvoiceFormData) => void;
  initialData?: InvoiceFormData; // Optional: for editing
}

export function InvoiceModal({
  open,
  onOpenChange,
  onSaveInvoice,
  initialData,
}: InvoiceModalProps) {
  const isEditing = !!initialData; // Détermine si c'est une édition

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: initialData || {
      // Pour la création, invoiceNumber n'est pas renseigné, il sera généré par le backend
      // Pour l'édition, il vient de initialData
      invoiceNumber: initialData?.invoiceNumber || undefined, // S'assure qu'il est undefined si non présent
      clientName: "",
      clientAddress: "",
      dateIssued: new Date().toISOString().split('T')[0], // Date du jour
      dueDate: undefined, // Initialisé à undefined pour être optionnel
      items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
      subTotal: 0,
      taxRate: 20, // Exemple: TVA à 20%
      taxAmount: 0,
      totalAmount: 0,
      paymentStatus: "En attente",
      paymentMethod: undefined, // Initialisé à undefined pour être optionnel
      recordedBy: "Nom du Caissier", // À pré-remplir via l'utilisateur connecté
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Calcul du sous-total, taxes et total en temps réel
  React.useEffect(() => {
    const items = form.watch("items");
    const taxRate = form.watch("taxRate");

    let newSubTotal = 0;
    items.forEach((item, index) => {
      const itemTotal = item.quantity * item.unitPrice;
      form.setValue(`items.${index}.total`, itemTotal); // Met à jour le total de l'article
      newSubTotal += itemTotal;
    });

    const newTaxAmount = (newSubTotal * taxRate) / 100;
    const newTotalAmount = newSubTotal + newTaxAmount;

    form.setValue("subTotal", newSubTotal);
    form.setValue("taxAmount", newTaxAmount);
    form.setValue("totalAmount", newTotalAmount);
  }, [form.watch("items"), form.watch("taxRate"), form]);

  // Réinitialiser le formulaire quand la modale se ferme ou s'ouvre pour une nouvelle entrée
  React.useEffect(() => {
    if (!open) {
      form.reset(initialData || {
        invoiceNumber: undefined,
        clientName: "",
        clientAddress: "",
        dateIssued: new Date().toISOString().split('T')[0],
        dueDate: undefined,
        items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
        subTotal: 0,
        taxRate: 20,
        taxAmount: 0,
        totalAmount: 0,
        paymentStatus: "En attente",
        paymentMethod: undefined,
        recordedBy: "Nom du Caissier",
        notes: "",
      });
    } else if (open && initialData) {
      form.reset(initialData); // Si c'est pour l'édition et que la modale s'ouvre, on reset avec initialData
    }
  }, [open, initialData, form]);


  const onSubmit = (data: InvoiceFormData) => {
    // Si c'est une nouvelle facture, le `invoiceNumber` sera probablement généré côté serveur.
    // Si c'est une modification, `data.invoiceNumber` devrait déjà être présent.
    // Vous pouvez ajouter ici une logique de validation supplémentaire si nécessaire
    // Par exemple: si isEditing est true, alors data.invoiceNumber doit exister
    if (isEditing && !data.invoiceNumber) {
      // Gérer l'erreur si invoiceNumber est manquant en mode édition
      form.setError("invoiceNumber", { type: "manual", message: "Le numéro de facture est requis pour la modification." });
      return;
    }
    onSaveInvoice(data);
    onOpenChange(false); // Ferme la modale après soumission réussie
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] w-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la Facture" : "Nouvelle Facture"}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Modifiez les détails de la facture N° ${initialData?.invoiceNumber || ''}.` : "Créez une nouvelle facture pour un client."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {isEditing && ( // Affiche le champ numéro de facture seulement en mode édition
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de Facture</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={true} className="cursor-not-allowed bg-gray-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du Client</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse du Client (Optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse du client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateIssued"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'Émission</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'Échéance (Optionnel)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold mt-4 mb-2">Articles</h3>
            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-6 gap-2 items-end border-b justify-around pb-2 mb-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className={index === 0 ? "block" : "sr-only"}>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Article ou service" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel className={index === 0 ? "block" : "sr-only"}>Qté</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Qté"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.unitPrice`}
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel className={index === 0 ? "block" : "sr-only"}>Prix U.</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Prix U."
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2 flex items-center justify-end">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {form.watch(`items.${index}.total`).toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="ml-2"
                  >
                    <IconTrash className="size-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ description: "", quantity: 1, unitPrice: 0, total: 0 })}
              className="mt-2"
            >
              <IconPlus className="mr-2" /> Ajouter un article
            </Button>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                {/* Notes de facture */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optionnel)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ajouter des notes importantes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2 text-right">
                <p>Sous-total: <span className="font-bold">{form.watch("subTotal").toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</span></p>
                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">TVA (%)</FormLabel>
                      <div className="flex justify-end items-center">
                        <span className="mr-2">TVA:</span>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Taux TVA"
                            className="w-20 text-right"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <span className="ml-1">%</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p>Montant TVA: <span className="font-bold">{form.watch("taxAmount").toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</span></p>
                <h4 className="text-xl font-extrabold">Total: <span className="text-primary">{form.watch("totalAmount").toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</span></h4>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut de Paiement</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}> {/* Utilisez value au lieu de defaultValue pour un contrôle total */}
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="Payée">Payée</SelectItem>
                        <SelectItem value="Partiellement payée">Partiellement payée</SelectItem>
                        <SelectItem value="Annulée">Annulée</SelectItem>
                        <SelectItem value="Remboursée">Remboursée</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Méthode de Paiement (si Payée)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""} disabled={form.watch("paymentStatus") !== "Payée"}> {/* Utilisez value et désactivez si non payée */}
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez la méthode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Espèces">Espèces</SelectItem>
                        <SelectItem value="Carte Bancaire">Carte Bancaire</SelectItem>
                        <SelectItem value="Virement">Virement</SelectItem>
                        <SelectItem value="Chèque">Chèque</SelectItem>
                        <SelectItem value="Crédit">Crédit</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="recordedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enregistré par</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'enregistreur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">{isEditing ? "Enregistrer les modifications" : "Créer la Facture"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}