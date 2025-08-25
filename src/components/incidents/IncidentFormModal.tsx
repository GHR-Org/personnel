/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/incidents/IncidentFormModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, ArrowLeft, Wrench, Package, PackageX } from 'lucide-react';
import { useAppStore, Equipment, IncidentFormValues } from "@/lib/stores/maintenance_store";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Schéma de validation pour le formulaire d'incident
const incidentSchema = z.object({
  equipement_id: z.string().min(1, "L'ID de l'équipement est requis"),
  title: z.string().min(5, "Le titre doit faire au moins 5 caractères"),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  severity: z.enum(["Faible", "Moyen", "Élevé"]),
  status: z.enum(["Ouvert", "En cours", "Fermé"]),
});

type FormProps = {
  onSubmit: (data: IncidentFormValues) => void;
  onClose: () => void;
  equipement_id: string;
};

// Composant du formulaire d'incident (interne à la modale)
const IncidentForm = ({ onSubmit, onClose, equipement_id }: FormProps) => {
  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      equipement_id: equipement_id,
      title: '',
      description: '',
      severity: 'Moyen',
      status: 'Ouvert',
    },
  });

  const handleFormSubmit = (data: IncidentFormValues) => {
    onSubmit(data);
    form.reset(); // Réinitialise le formulaire après la soumission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="equipement_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID de l&apos;équipement</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ... (le reste de vos champs de formulaire est inchangé) ... */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Problème de climatisation" {...field} />
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
                <Textarea placeholder="Décrivez le problème en détail..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sévérité</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une sévérité" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Faible">Faible</SelectItem>
                  <SelectItem value="Moyen">Moyen</SelectItem>
                  <SelectItem value="Élevé">Élevé</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">Créer l&apos;incident</Button>
        </div>
      </form>
    </Form>
  );
};

// Composant pour afficher une carte d'équipement
const EquipmentCard = ({ equipment, onSelect }: { equipment: Equipment; onSelect: (id: string) => void }) => {
  const getStatusBadge = () => {
    switch (equipment.status) {
      case "Fonctionnel":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Fonctionnel</Badge>;
      case "En Maintenance":
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">En Maintenance</Badge>;
      case "Hors service":
        return <Badge variant="default" className="bg-red-500 hover:bg-red-600">Hors service</Badge>;
      case "En panne":
        return <Badge variant="default" className="bg-red-500 hover:bg-red-600">En panne</Badge>;
      default:
        return <Badge variant="default">Inconnu</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (equipment.status) {
      case "Fonctionnel":
        return <Package className="h-8 w-8 text-green-500" />;
      case "En Maintenance":
      case "En panne":
        return <Wrench className="h-8 w-8 text-yellow-500" />;
      case "Hors service":
        return <PackageX className="h-8 w-8 text-red-500" />;
      default:
        return <Package className="h-8 w-8 text-gray-500" />;
    }
  };
  
  return (
    <Card className="flex flex-col md:flex-row items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onSelect(equipment.id)}>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-shrink-0">{getStatusIcon()}</div>
        <div className="flex-1 text-center md:text-left">
          <CardTitle className="text-base font-semibold">{equipment.nom ?? "Nom inconnu"}</CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            <p className="hidden md:block">Localisation: {equipment.localisation ?? "Inconnue"}</p>
            <p>ID: {equipment.id ?? "Inconnu"}</p>
          </div>
        </div>
      </div>
      <div className="mt-2 md:mt-0">
        {getStatusBadge()}
      </div>
    </Card>
  );
};

// Le composant de la modale qui contient la logique principale
export function IncidentFormModal() {
  const [open, setOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const addIncident = useAppStore((state) => state.addIncident);
  const equipments = useAppStore((state) => state.equipments);
  const fetchEquipments = useAppStore((state) => state.fetchEquipments); // <--- Récupération de la fonction fetchEquipments

  // Effect pour déclencher le fetch des équipements lors de l'ouverture de la modale
  useEffect(() => {
    if (open) {
      fetchEquipments();
    }
  }, [open, fetchEquipments]);

  const handleFormSubmit = (data: IncidentFormValues) => {
    addIncident(data);
    setOpen(false);
    setSelectedEquipmentId(null);
  };

  const handleSelectEquipment = (id: string) => {
    setSelectedEquipmentId(id);
  };

  const handleBack = () => {
    setSelectedEquipmentId(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Signaler un incident
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("sm:max-w-xl", !selectedEquipmentId && "sm:max-w-3xl")}>
        <DialogHeader>
          <DialogTitle>
            {selectedEquipmentId ? "Signaler un incident" : "Sélectionner un équipement"}
          </DialogTitle>
          <DialogDescription>
            {selectedEquipmentId ? 
              "Remplissez les informations ci-dessous pour signaler un incident sur l'équipement sélectionné." :
              "Choisissez l'équipement concerné par l'incident pour continuer."}
          </DialogDescription>
        </DialogHeader>

        {selectedEquipmentId ? (
          <>
            <Button variant="outline" className="w-fit" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <IncidentForm 
              onSubmit={handleFormSubmit} 
              onClose={() => setOpen(false)} 
              equipement_id={selectedEquipmentId}
            />
          </>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4 pr-4">
              {/* Le composant de carte est rendu plus robuste avec l'opérateur de coalescence nulle */}
              {equipments.map((equip) => (
                <EquipmentCard 
                  key={equip.id} 
                  equipment={equip} 
                  onSelect={handleSelectEquipment} 
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}