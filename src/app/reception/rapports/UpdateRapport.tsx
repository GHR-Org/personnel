/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconEdit, IconLoader2 } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateRapport } from "@/func/api/rapports/apiRapports";
import { Rapport } from "./column";

// Schéma de validation Zod
const formSchema = z.object({
  titre: z.string().min(2, {
    message: "Le titre doit contenir au moins 2 caractères.",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  type: z.string().nonempty({
    message: "Veuillez sélectionner un type de rapport.",
  }),
  statut: z.enum(["En Attente", "En Cours", "Terminé"]),
});

const rapportTypes = ["Maintenance", "Plomberie", "Électricité", "Nettoyage"];
const statuts = ["En Attente", "En Cours", "Terminé"];

interface UpdateFormModalProps {
  rapport: Rapport;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UpdateFormModal({ rapport, open, onOpenChange, onSuccess }: UpdateFormModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: rapport.titre,
      description: rapport.description,
      type: rapport.type,
      statut: rapport.statut,
    },
  });

  useEffect(() => {
    // Réinitialiser le formulaire avec les nouvelles valeurs si le rapport change
    if (rapport) {
      form.reset({
        titre: rapport.titre,
        description: rapport.description,
        type: rapport.type,
        statut: rapport.statut,
      });
    }
  }, [rapport, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      await updateRapport(rapport.id, values);
      form.reset();
      onOpenChange(false); // Ferme la modal de mise à jour
      onSuccess(); // Appelle la fonction de rafraîchissement des données
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rapport:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le rapport</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre du rapport" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description détaillée du problème" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rapportTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuts.map((statut) => (
                        <SelectItem key={statut} value={statut}>
                          {statut}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Modifier"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}