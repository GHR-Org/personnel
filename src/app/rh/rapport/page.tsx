/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/rh/page.tsx

"use client";

import { RealTimePersonnelActivity } from '@/components/personnel/RealTimePersonnelActivity'
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'sonner';
import {Report} from "@/components/modals/Report"

export default function Page () {
    // Initialisez statistics directement avec les données mockées
    // Cela garantit que "statistics" a une valeur dès le SSR et pour l'hydratation.
    const mockPersonnelStats = {
        nouveaux_enregistrements: [
            { nom: "Dupont", prenom: "Jean", fonction: "Développeur", date_enregistrement: "2025-07-21T14:30:00Z" },
            { nom: "Martin", prenom: "Sophie", fonction: "Designer", date_enregistrement: "2025-07-20T10:00:00Z" },
        ],
        demandes_conges_recentes: [
            { employe: "Jean Dupont", type: "Vacances", statut: "En attente", date_demande: "2025-07-21 14:40:00" },
            { employe: "Marie Curie", type: "Maladie", statut: "Approuvé", date_demande: "2025-07-21 13:15:00" },
            { employe: "Pierre Dubois", type: "RTT", statut: "Refusé", date_demande: "2025-07-20 16:00:00" },
        ],
    };
    const [statistics, setStatistics] = useState<any>(mockPersonnelStats); // MODIFIÉ ICI

    const [isOpen, setIsOpen] = useState(false)
    
    // Le useEffect précédent n'est plus nécessaire pour l'initialisation de statistics
    // Si vous aviez une logique de fetch de données réelles ici, elle devrait y rester.
    // useEffect(()=>{
    //     // Ici, vous pourriez fetcher vos données réelles
    //     // Si les données réelles sont fetched, assurez-vous de les traiter pour éviter les mismatches temporels
    //     // setStatistics(fetchedRealData);
    // }, [])

    const handleReport = ()=>{
        setIsOpen(true)
    }

    return (
        <>
        <section className="container mx-auto bg-background p-8 text-foreground min-h-screen" >
            <div className="container flex flex-row relative justify-between mx-auto bg-background text-foreground ">
                <div>
                    <h1 className="text-3xl font-bold mb-8">
                        Rapport d&apos;activité
                    </h1>
                </div>
                <div>
                    <Button variant={"secondary"}
                    onClick={handleReport}
                    > 
                        <IconPlus />
                        <p>Ajouter un rapport</p> 
                    </Button>
                </div>
            </div>
            
            <Report open={isOpen} onOpenChange={function (open: boolean): void {
                setIsOpen(false);
            }} />
            
            {/* Passer les statistiques directement, elles sont déjà initialisées */}
            {statistics && <RealTimePersonnelActivity statsPersonnel={statistics} />}
        </section>
        <Toaster /> {/* S'assurer que Toaster est rendu quelque part, souvent dans RootLayout */}
        </>
    )
}