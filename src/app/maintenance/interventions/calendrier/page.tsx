"use client";

import React, { useState } from 'react';
import { useAppStore, Intervention } from '@/lib/stores/maintenance_store';
import { InterventionCalendar } from '@/components/interventions/InterventionCalendar';
import { InterventionDetailsModal } from '@/components/interventions/InterventionDetailsModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CalendarPage() {
    const interventions = useAppStore(state => state.interventions);
    
    // État pour la modale de détails
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);

    // Fonction pour gérer le clic sur un événement du calendrier
    const handleEventClick = (interventionId: string) => {
        const intervention = interventions.find(int => int.id === interventionId);
        
        if (intervention) {
            setSelectedIntervention(intervention);
            setIsDetailsModalOpen(true);
        }
    };

    // Fonction pour fermer la modale de détails
    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedIntervention(null);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Calendrier des interventions</h1>
                
                {/* Bouton de retour vers la page principale des interventions */}
                <Button variant="outline" asChild>
                    <Link href="/interventions">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour à la liste
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vue Calendrier</CardTitle>
                </CardHeader>
                <CardContent>
                    <InterventionCalendar 
                        interventions={interventions}
                        onEventClick={handleEventClick} 
                    />
                </CardContent>
            </Card>

            {/* Affichage de la modale de détails si une intervention est sélectionnée */}
            {selectedIntervention && (
                <InterventionDetailsModal 
                    intervention={selectedIntervention}
                    open={isDetailsModalOpen}
                    onClose={handleCloseDetailsModal}
                />
            )}
        </div>
    );
}