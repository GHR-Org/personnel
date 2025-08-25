/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/planning-personnel/page.tsx
"use client";

import PersonnelPlanning from '@/components/planning/PlaningPersonnel';

import React, { useState, useEffect } from 'react';
import PersonnelPlanningCalendar from '@/components/planning/PersonnelPlanningCalendar';
import initialPlanningData from '../../../../../public/data/PlanningData' // Import des données de planning
import { PlanningEvent, PlanningEventStatus } from '@/types/planning';
import { format } from 'date-fns';

const PlanningPersonnelPage: React.FC = () => {
  // Utilisons un état pour les données de planning pour pouvoir les modifier
  const [planningEvents, setPlanningEvents] = useState<PlanningEvent[]>(initialPlanningData);

  // Fonctions de gestion CRUD
  const handleAddEvent = (eventData: Omit<PlanningEvent, 'id' | 'status'>) => {
     const newId = Math.max(0, ...initialPlanningData.map(e => e.id)) + 1; // Trouve le plus grand ID existant et ajoute 1

  const newEvent: PlanningEvent = {
    ...eventData,
    id: newId, // Attribuez l'ID généré ici
    status: PlanningEventStatus.EN_ATTENTE, // Statut par défaut pour un nouvel événement
  };
    // Mettre à jour les données initiales (simulées)
    initialPlanningData.push(newEvent);
    setPlanningEvents([...initialPlanningData]); // Forcer la mise à jour de l'état
    alert(`Nouvel événement ajouté (simulé) : ${newEvent.titre}`);
  };

  const handleUpdateEvent = (id: number, eventData: Omit<PlanningEvent, 'id' | 'status'>) => {
    // const index = initialPlanningData.findIndex(e => e.id === id);
    // if (index !== -1) {
    //   initialPlanningData[index] = {
    //     ...initialPlanningData[index],
    //     ...eventData,
    //   };
    //   setPlanningEvents([...initialPlanningData]); // Forcer la mise à jour de l'état
    //   alert(`Événement ${id} modifié (simulé).`);
    // }
  };

  const handleDeleteEvent = (id: number) => {
    // const updatedEvents = initialPlanningData.filter(e => e.id !== id);
    // // Mettre à jour les données initiales (simulées)
    // initialPlanningData.splice(0, initialPlanningData.length, ...updatedEvents);
    // setPlanningEvents([...initialPlanningData]); // Forcer la mise à jour de l'état
    // alert(`Événement ${id} supprimé (simulé).`);
  };

  return (
    <>
    <section className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Planning Interne du Personnel</h1>
      <PersonnelPlanningCalendar
        allPlanningEvents={planningEvents}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </section>
    </>
  );
};

export default PlanningPersonnelPage;