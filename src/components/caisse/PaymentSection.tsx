// src/components/caisse/PaymentSection.tsx
import React from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { CaisseTransactionFormData, caisseTransactionSchema, PaiementItem } from "@/schemas/caisse";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { IconCalendar } from '@tabler/icons-react';

interface PaymentSectionProps {
  montantTotalDu: number;
  montantDejaPaye: number;
  existingPayments: PaiementItem[];
  onAddPayment: (newPayment: PaiementItem) => void;
  onRemovePayment: (index: number) => void;
  // `control` du formulaire parent pour une meilleure intégration
  control: any; // Utiliser le type Control<CaisseTransactionFormData> si disponible
}

export function PaymentSection({
  montantTotalDu,
  montantDejaPaye,
  existingPayments,
  onAddPayment,
  onRemovePayment,
  control // Passer le control du formulaire parent
}: PaymentSectionProps) {
  // Utilisez useFieldArray avec le control du formulaire parent
  const { fields, append, remove } = useFieldArray({
    control,
    name: "paiements", // Le nom du champ array dans le schéma parent
  });

  const soldeRestant = montantTotalDu - montantDejaPaye - fields.reduce((sum, p: any) => sum + (p.montant || 0), 0);

  const handleAddPayment = () => {
    append({ mode: "Espèces", montant: 0, datePaiement: new Date(), reference: "" });
  };

  return (
    <Card className="col-span-full w-2xl md:col-span-1">
      <CardHeader>
        <CardTitle>Paiements</CardTitle>
        <CardDescription>Enregistrez les paiements pour cette réservation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-lg font-semibold border-b pb-2">
          <span>Total Dû:</span>
          <span>{montantTotalDu.toFixed(2)} Ar</span>
        </div>
        <div className="flex justify-between items-center text-lg font-semibold border-b pb-2">
          <span>Déjà Payé (Arrhes):</span>
          <span>{montantDejaPaye.toFixed(2)} Ar</span>
        </div>
        <div className="flex justify-between items-center text-lg font-semibold border-b pb-2">
          <span>Solde à Payer:</span>
          <span className={soldeRestant > 0 ? "text-red-500" : "text-green-600"}>{soldeRestant.toFixed(2)} Ar</span>
        </div>

        <h3 className="text-md font-semibold mt-4">Nouveaux Paiements</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 border p-3 rounded-md relative">
            <FormField
              control={control}
              name={`paiements.${index}.mode`}
              render={({ field: paymentField }) => (
                <FormItem>
                  <FormLabel>Mode</FormLabel>
                  <Select onValueChange={paymentField.onChange} defaultValue={paymentField.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Mode de paiement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Espèces">Espèces</SelectItem>
                      <SelectItem value="Carte Bancaire">Carte Bancaire</SelectItem>
                      <SelectItem value="Virement">Virement</SelectItem>
                      <SelectItem value="Chèque">Chèque</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`paiements.${index}.montant`}
              render={({ field: paymentField }) => (
                <FormItem>
                  <FormLabel>Montant (Ar)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...paymentField}
                      onChange={e => paymentField.onChange(parseFloat(e.target.value) || 0)}
                      value={paymentField.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`paiements.${index}.datePaiement`}
              render={({ field: paymentField }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !paymentField.value && "text-muted-foreground"
                          )}
                        >
                          {paymentField.value ? (
                            format(paymentField.value, "PPP", { locale: fr })
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                          <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={paymentField.value}
                        onSelect={paymentField.onChange}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`paiements.${index}.reference`}
              render={({ field: paymentField }) => (
                <FormItem className="col-span-full sm:col-span-2">
                  <FormLabel>Référence (facultatif)</FormLabel>
                  <FormControl>
                    <Input placeholder="Réf. chèque, transaction..." {...paymentField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={() => remove(index)}
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={handleAddPayment}>
          <IconPlus className="mr-2 h-4 w-4" /> Ajouter un paiement
        </Button>
      </CardContent>
    </Card>
  );
}