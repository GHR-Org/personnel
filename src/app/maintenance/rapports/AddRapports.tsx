"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";
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
import { createRapport } from "@/func/api/rapports/apiRapports";
import { getCurrentUser } from "@/func/api/personnel/apipersonnel";

// Schéma de validation avec Zod
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
  // Le personnel sera géré automatiquement, pas besoin de le valider
  // personnel_id: z.string().nonempty({
  //   message: "Veuillez assigner un membre du personnel.",
  // }),
});

const rapportTypes = ["Maintenance", "Plomberie", "Électricité", "Nettoyage"];

export function AddFormModal() {
  type Personnel = {
    id: number;
    nom: string;
    etablissement_id: number;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<Personnel | null>(null);

  useEffect(() => {
    // Récupérer l'utilisateur courant au montage du composant
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: "",
      description: "",
      type: "Maintenance",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser) {
      console.error("Erreur: Utilisateur non trouvé.");
      return;
    }

    setLoading(true);

    try {
      const rapportData = {
        ...values,
        etablissement_id: currentUser.etablissement_id, // Utiliser l'ID de l'établissement de l'utilisateur
        personnel_id: currentUser.id, // Utiliser l'ID de l'utilisateur actuel comme créateur
        statut: "En Attente" as const,
      };

      await createRapport(rapportData);

      form.reset();
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la création du rapport:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Button disabled>
        <IconPlus className="mr-2 h-4 w-4" />
        Ajouter un nouveau rapport
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Ajouter un nouveau rapport
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau rapport</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-sm text-gray-500 font-medium col-span-1">Créé par</p>
                <p className="col-span-3 font-semibold">{currentUser.nom}</p>
            </div>
            {/* ... (champs Titre et Description) */}
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

            {/* Champ Type - Pas de changement nécessaire */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
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

            {/* Boutons d'action */}
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}