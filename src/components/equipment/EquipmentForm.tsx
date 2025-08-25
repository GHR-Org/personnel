// src/components/equipment/EquipmentFormModal.tsx
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppStore } from '@/lib/stores/maintenance_store';
import { toast } from 'sonner';

// Schéma de validation conservé
export const equipmentSchema = z.object({
  nom: z.string().min(2, "Nom requis"),
  type: z.string().min(2, "Type requis"),
  localisation: z.string().min(2, "Localisation requise"),
  status: z.enum(["Fonctionnel", "En Maintenance", "Hors service", "En panne"]),
  description: z.string().optional(),
});

export type EquipmentFormValues = z.infer<typeof equipmentSchema>;

interface EquipmentFormProps {
  initialValues?: EquipmentFormValues;
  onSubmit: (data: EquipmentFormValues) => void;
  className?: string;
  onClose: () => void;
}

export function EquipmentForm({
  initialValues,
  onSubmit,
  className,
  onClose,
}: EquipmentFormProps) {
  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: initialValues ?? {
      nom: "",
      type: "",
      localisation: "",
      status: "Fonctionnel",
      description: "",
    },
  });

  const handleFormSubmit = (data: EquipmentFormValues) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className={cn("space-y-6", className)}>
        <Card>
          <CardHeader>
            <CardTitle>Informations de l’équipement</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ... Champs de formulaire inchangés */}
            {/* Champ Nom */}
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'équipement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Champ Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Type de l'équipement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Champ Localisation */}
            <FormField
              control={form.control}
              name="localisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localisation</FormLabel>
                  <FormControl>
                    <Input placeholder="Localisation de l'équipement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Champ Statut */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Fonctionnel">Fonctionnel</SelectItem>
                      <SelectItem value="En Maintenance">En Maintenance</SelectItem>
                      <SelectItem value="Hors service">Hors service</SelectItem>
                      <SelectItem value="En panne">En panne</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Champ Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ajouter une description..." rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </Form>
  );
}

// Le composant de la modale qui contient le formulaire
interface EquipmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EquipmentFormModal({ isOpen, onClose }: EquipmentFormModalProps) {
  // Accédez à l'action addEquipment depuis le store
  const addEquipment = useAppStore((state) => state.addEquipment);
  const establishmentId = useAppStore((state) => state.establishmentId);
  const fetchEquipments = useAppStore((state) => state.fetchEquipments);

  const handleFormSubmit = async (data: EquipmentFormValues) => {
    if (!establishmentId) {
      toast.error("L'ID de l'établissement est manquant. Veuillez vous reconnecter.");
      return;
    }

    try {
      await addEquipment({ ...data, etablissement_id: establishmentId });
      onClose(); // Ferme la modale
      fetchEquipments();
    } catch (error) {
      console.error("Échec de l'ajout de l'équipement depuis le formulaire:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel équipement</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour ajouter un nouvel équipement.
          </DialogDescription>
        </DialogHeader>
        <EquipmentForm onSubmit={handleFormSubmit} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}