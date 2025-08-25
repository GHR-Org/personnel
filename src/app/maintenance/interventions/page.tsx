// src/app/interventions/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Intervention, useAppStore } from '@/lib/stores/maintenance_store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { InterventionFormModal } from '@/components/interventions/InterventionFormModal'; 
import { InterventionsTable } from '@/components/interventions/InterventionsTable';
import { InterventionCalendar } from '@/components/interventions/InterventionCalendar';
import { InterventionDetailsModal } from '@/components/interventions/InterventionDetailsModal'; 

export default function InterventionsPage() {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); 
    const interventions = useAppStore((state) => state.interventions);
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
                <h1 className="text-2xl font-bold">Planification des interventions</h1>
                
                <Button onClick={() => setIsFormModalOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Planifier une intervention
                </Button>
            </div>

            {/* Modale de création d'intervention */}
            <InterventionFormModal 
                open={isFormModalOpen}
                onOpenChange={setIsFormModalOpen}
            />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Liste des interventions</CardTitle>
                    <Button variant="outline" asChild>
                        <Link href="/maintenance/interventions/calendrier">Voir le calendrier complet</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <InterventionsTable interventions={interventions} />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Calendrier</CardTitle>
                </CardHeader>
                <CardContent>
                    <InterventionCalendar 
                        interventions={interventions}
                        onEventClick={handleEventClick} 
                    />
                </CardContent>
            </Card>

            {/* 🟢 Affichage de la modale de détails si une intervention est sélectionnée */}
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