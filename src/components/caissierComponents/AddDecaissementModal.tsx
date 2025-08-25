import * as React from "react";
import { useForm } from "react-hook-form";
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
import { DecaissementFormData, decaissementFormSchema } from "@/schemas/cashRegister";

interface AddDecaissementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDecaissement: (data: DecaissementFormData) => void;
}

export function AddDecaissementModal({
  open,
  onOpenChange,
  onAddDecaissement,
}: AddDecaissementModalProps) {
  const form = useForm<DecaissementFormData>({
    resolver: zodResolver(decaissementFormSchema),
    defaultValues: {
      description: "",
      amount: 0,
      paymentMethod: "Espèces", // Valeur par défaut
      recordedBy: "",
    },
  });

  const onSubmit = (data: DecaissementFormData) => {
    onAddDecaissement(data);
    form.reset(); // Réinitialise le formulaire après soumission
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouveau Décaissement</DialogTitle>
          <DialogDescription>
            Enregistrez un nouveau décaissement dans le journal de caisse.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description du décaissement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant (Ar)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Montant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode de paiement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez la méthode de paiement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Espèces">Espèces</SelectItem>
                      <SelectItem value="Virement">Virement</SelectItem>
                      <SelectItem value="Chèque">Chèque</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              <Button type="submit">Ajouter Décaissement</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}