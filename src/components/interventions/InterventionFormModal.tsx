"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle, AlertTriangle, Flame } from "lucide-react";
import { useAppStore } from "@/lib/stores/maintenance_store";

// Définition des types de sévérité
type IncidentSeverity = "Faible" | "Moyen" | "Élevé";

// Mise à jour de l'interface des incidents pour inclure la sévérité
interface Incident {
  id: string;
  title: string;
  equipement_id: string;
  status: string;
  severity: IncidentSeverity;
}

const interventionSchema = z.object({
  incident_Id: z.string().min(1, "Veuillez sélectionner un incident"),
  personnel_Id: z.string().min(1, "L'ID du technicien est requis"),
  scheduledDate: z.string().min(1, "La date est requise"),
  description: z
    .string()
    .min(10, "La description doit faire au moins 10 caractères"),
  status: z.enum(["Planifiée", "En cours", "Terminée", "Annulée"]),
});

export type InterventionFormValues = z.infer<typeof interventionSchema>;

interface InterventionFormProps {
  onSubmit: (data: InterventionFormValues) => void;
  incidents: Incident[];
  setOpen: (open: boolean) => void;
}

// Configuration pour les icônes et les couleurs de sévérité
const severityConfig: Record<IncidentSeverity, { icon: React.ElementType; color: string }> = {
  "Faible": { icon: CheckCircle, color: "text-green-500" },
  "Moyen": { icon: AlertTriangle, color: "text-yellow-500" },
  "Élevé": { icon: Flame, color: "text-red-500" },
};

interface IncidentCardProps {
  incident: Incident;
  onClick: () => void;
  isSelected: boolean;
}

// Composant pour l'affichage d'une carte d'incident
const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onClick,
  isSelected,
}) => {
  const IconComponent = severityConfig[incident.severity]?.icon;
  const colorClass = severityConfig[incident.severity]?.color;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-colors hover:bg-muted",
        isSelected && "border-primary bg-accent"
      )}
    >
      <CardHeader className="p-4 flex flex-row items-start justify-between">
        <div className="flex flex-col">
          <CardTitle className="text-sm">{incident.title}</CardTitle>
          <CardDescription>ID: {incident.id}</CardDescription>
        </div>
        {IconComponent && (
          <IconComponent className={cn("h-6 w-6", colorClass)} />
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xs text-muted-foreground">
          Équipement: {incident.equipement_id}
        </p>
        <p className={cn("text-xs font-semibold", colorClass)}>
          Sévérité: {incident.severity}
        </p>
      </CardContent>
    </Card>
  );
};

const InterventionFormStepper: React.FC<InterventionFormProps> = ({
  onSubmit,
  incidents,
  setOpen,
}) => {
  const [step, setStep] = useState(1);
  const form = useForm<InterventionFormValues>({
    resolver: zodResolver(interventionSchema),
    defaultValues: {
      incident_Id: "",
      personnel_Id: "",
      scheduledDate: "",
      description: "",
      status: "Planifiée",
    },
  });

  const technicians = [
    { id: "TECH-001", nom: "Lovasoa Nantenaina" },
    { id: "TECH-002", nom: "Rakoto Charles" },
    { id: "TECH-003", nom: "Rabemananjara Dieu Donné" },
  ];

  const handleNext = async () => {
    const isValid = await form.trigger("incident_Id");
    if (step === 1 && isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinalSubmit = (data: InterventionFormValues) => {
    onSubmit(data);
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFinalSubmit)}
        className="space-y-4"
      >
        {/* Étape 1 : Sélection d'incident */}
        {step === 1 && (
          <FormField
            control={form.control}
            name="incident_Id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sélectionner un incident</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
                  {incidents.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      incident={incident}
                      onClick={() => field.onChange(incident.id)}
                      isSelected={field.value === incident.id}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Étape 2 : Formulaire détaillé */}
        {step === 2 && (
          <>
            <FormField
              control={form.control}
              name="personnel_Id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technicien assigné</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un technicien" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.nom}
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
              name="scheduledDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date planifiée</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                    <Textarea
                      placeholder="Décrivez l'intervention à effectuer..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Boutons navigation */}
        <div className="flex justify-between">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handlePrev}>
              Retour
            </Button>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            {step < 2 && (
              <Button type="button" onClick={handleNext}>
                Suivant
              </Button>
            )}
            {step === 2 && (
              <Button type="submit"> Créer</Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};

export function InterventionFormModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addIntervention = useAppStore((state) => state.addIntervention);
  const fetchIncidents = useAppStore((state) => state.fetchIncidents);
  // Simulez les données d'incidents avec la propriété de sévérité
  const incidents = useAppStore((state) => state.incidents);
  const isLoadingIncidents = useAppStore((state) => state.isLoadingIncidents);

  useEffect(() => {
    if (open) {
      fetchIncidents();
    }
  }, [open, fetchIncidents]);

  const handleFormSubmit = (data: InterventionFormValues) => {
    addIntervention(data);
    onOpenChange(false);
  };

  const openIncidents = incidents.filter(
    (incident) => incident.status === "Ouvert"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Planifier une intervention</DialogTitle>
          <DialogDescription>
            Étape 1 : Sélection d&apos;incident → Étape 2 : Informations
            détaillées
          </DialogDescription>
        </DialogHeader>

        {isLoadingIncidents ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="text-gray-500">Chargement des incidents...</p>
          </div>
        ) : openIncidents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Aucun incident ouvert n&apos;est disponible pour le moment.
          </div>
        ) : (
          <InterventionFormStepper
            onSubmit={handleFormSubmit}
            incidents={openIncidents}
            setOpen={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}