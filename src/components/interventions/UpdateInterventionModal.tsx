/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Intervention, useAppStore } from '@/lib/stores/maintenance_store';
import { Pencil, Loader2, CheckCircle, AlertTriangle, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { InterventionFormValues } from './InterventionFormModal';

// Schéma de validation pour le formulaire de mise à jour
const interventionSchema = z.object({
    incident_Id: z.string().min(1, "Veuillez sélectionner un incident"),
    personnel_Id: z.string().min(1, "L'ID du technicien est requis"),
    scheduledDate: z.string().min(1, "La date est requise"),
    description: z.string().min(10, "La description doit faire au moins 10 caractères"),
    status: z.enum(["Planifiée", "En cours", "Terminée", "Annulée"]),
});

type IncidentSeverity = "Faible" | "Moyen" | "Élevé";

interface Incident {
    id: string;
    title: string;
    equipement_id: string;
    status: string;
    severity: IncidentSeverity;
}

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

interface UpdateInterventionModalProps {
    intervention: Intervention;
}

export function UpdateInterventionModal({ intervention }: UpdateInterventionModalProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const updateIntervention = useAppStore((state) => state.updateIntervention);
    const incidents = useAppStore((state) => state.incidents);

    const technicians = [
        { id: 'TECH-001', nom: 'Lovasoa Nantenaina' },
        { id: 'TECH-002', nom: 'This is the end' },
        { id: 'TECH-003', nom: 'I am the lord' },
    ];

    const form = useForm<InterventionFormValues>({
        resolver: zodResolver(interventionSchema),
        defaultValues: {
            incident_Id: intervention.incident_Id,
            personnel_Id: intervention.personnel_Id,
            scheduledDate: intervention.scheduledDate.substring(0, 10),
            description: intervention.description,
            status: intervention.status,
        },
    });

    const onSubmit = (data: InterventionFormValues) => {
        updateIntervention(intervention.id, data);
        setOpen(false);
        setStep(1); // Réinitialiser l'étape
        toast.success("Intervention mise à jour avec succès.");
    };

    const handleNext = async () => {
        const isValid = await form.trigger("incident_Id");
        if (step === 1 && isValid) {
            setStep((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        setStep((prev) => prev - 1);
    };

    // Filtre les incidents en fonction du statut (par exemple, "Ouvert")
    // Note : Il serait préférable d'utiliser l'incident_Id de l'intervention pour afficher l'incident correct, 
    // et de ne pas se limiter aux incidents ouverts pour une mise à jour.
    const relevantIncidents = incidents.filter(inc => inc.id === intervention.incident_Id || inc.status === "Ouvert");

    return (
        <Dialog open={open} onOpenChange={(openState) => {
            setOpen(openState);
            if (!openState) {
                setStep(1); // Réinitialiser l'étape si la modale est fermée
            }
        }}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Modifier
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Modifier l&apos;intervention {intervention.id}</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Étape {step} sur 2 : {step === 1 ? "Sélection de l'incident" : "Détails de l'intervention"}
                    </p>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Étape 1 : Sélection de l'incident (lecture seule pour la mise à jour) */}
                        {step === 1 && (
                            <FormField
                                control={form.control}
                                name="incident_Id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Incident lié</FormLabel>
                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Affiche uniquement la carte de l'incident lié à l'intervention */}
                                            {relevantIncidents.filter(inc => inc.id === intervention.incident_Id).map(inc => (
                                                <IncidentCard
                                                    key={inc.id}
                                                    incident={inc}
                                                    onClick={() => {}} // Pas d'action de clic pour la mise à jour
                                                    isSelected={true}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Étape 2 : Formulaire détaillé de mise à jour */}
                        {step === 2 && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="personnel_Id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Technicien assigné</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un technicien" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {technicians.map(tech => (
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
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Statut</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Changer le statut" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {["Planifiée", "En cours", "Terminée", "Annulée"].map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        
                        {/* Boutons de navigation du formulaire */}
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
                                    <Button type="submit">Sauvegarder</Button>
                                )}
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}