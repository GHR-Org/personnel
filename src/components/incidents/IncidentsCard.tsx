// src/components/incidents/IncidentCard.tsx
"use client";

import { Incident } from "@/lib/stores/maintenance_store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { InterventionFormModal } from "@/components/interventions/InterventionFormModal";

interface IncidentCardProps {
    incident: Incident;
    onSelect: (incidentId: string) => void;
    isSelected: boolean;
}

const severityColorMap: Record<Incident["severity"], string> = {
    Faible: "bg-green-500",
    Moyen: "bg-yellow-500",
    Élevé: "bg-red-700",
};

export function IncidentCard({ incident, onSelect, isSelected }: IncidentCardProps) {
    const borderColorClass = isSelected ? "border-primary ring-2 ring-primary" : "border-gray-200 hover:border-primary/50";
    
    // Le statut d'intervention est planifié si au moins une intervention existe pour cet incident.
    const isInterventionPlanned = (incident.status === 'En cours' || incident.status === 'Fermé');

    return (
        <Card
            className={`w-full cursor-pointer transition-all duration-200 ease-in-out ${borderColorClass}`}
            onClick={() => onSelect(incident.id)}
        >
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Badge className={severityColorMap[incident.severity]}>
                        {incident.severity}
                    </Badge>
                    <p className="text-sm text-gray-500">Signalé le {new Date(incident.reportedAt).toLocaleDateString()}</p>
                </div>
                <CardTitle className="text-xl mt-2">{incident.title}</CardTitle>
                <CardDescription>Équipement : {incident.equipement_id}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-2">{incident.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Badge variant="outline" className={`py-1 px-3 rounded-full ${incident.status === 'Ouvert' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                    {incident.status}
                </Badge>
                {incident.status === 'Ouvert' && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="secondary" size="sm" className="space-x-2">
                                <Wrench className="w-4 h-4" />
                                <span>Planifier</span>
                            </Button>
                        </DialogTrigger>
                        <InterventionFormModal incidentId={incident.id} />
                    </Dialog>
                )}
                {isInterventionPlanned && (
                    <Button variant="outline" size="sm" disabled>
                        Intervention planifiée
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}