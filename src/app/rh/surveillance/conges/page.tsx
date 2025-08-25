// src/app/conges/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import ListeConges from '@/components/conges/ListConges';
import FiltresConges, { CongeFilters } from '@/components/conges/FiltresConges';
import initialConges from '../../../../../public/data/CongesData';
import { Conge } from '@/types/conge';

// Importez les composants pour les actions (à créer ensuite)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// TODO: Créer ces composants ci-dessous
import  FormulaireConge from '@/components/conges/FormulaireConges'; // Pour ajouter/modifier
import DetailsConge from '@/components/conges/DetailsConge';     // Pour voir les détails
import { format } from 'date-fns';

const CongesPage: React.FC = () => {
  const [conges, setConges] = useState<Conge[]>(initialConges);
  const [currentFilters, setCurrentFilters] = useState<CongeFilters>({});

  // États pour les modales d'action
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedCongeId, setSelectedCongeId] = useState<string | null>(null); // Pour modifier ou voir les détails
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // Pour la confirmation de suppression
  const [congeToDeleteId, setCongeToDeleteId] = useState<string | null>(null);

  // LOGIQUE DE FILTRAGE (inchangée, mais rappel)
  const applyFilters = (filters: CongeFilters) => {
    setCurrentFilters(filters);
  };
 

  useEffect(() => {
    let filteredData = initialConges; // Toujours partir des données initiales pour filtrer

    if (currentFilters.nomEmploye) {
      filteredData = filteredData.filter(conge =>
        conge.nomEmploye.toLowerCase().includes(currentFilters.nomEmploye!.toLowerCase())
      );
    }
    if (currentFilters.typeConge && currentFilters.typeConge !== 'Tous') {
      filteredData = filteredData.filter(conge =>
        conge.typeConge === currentFilters.typeConge
      );
    }
    if (currentFilters.statut && currentFilters.statut !== 'Tous') {
      filteredData = filteredData.filter(conge =>
        conge.statut === currentFilters.statut
      );
    }
    if (currentFilters.dateDebutPeriode) {
      const debutPeriode = currentFilters.dateDebutPeriode.getTime();
      filteredData = filteredData.filter(conge =>
        new Date(conge.dateDebut).getTime() >= debutPeriode
      );
    }
    if (currentFilters.dateFinPeriode) {
      const finPeriode = currentFilters.dateFinPeriode.getTime();
      // Pour inclure la date de fin, il faut s'assurer que le début du congé est AVANT ou égal à la fin de la période
      // Et la fin du congé est AVANT ou égale à la fin de la période
      filteredData = filteredData.filter(conge =>
        new Date(conge.dateFin).getTime() <= finPeriode
      );
    }

    setConges(filteredData);
  }, [currentFilters]);

  // --- Fonctions de gestion des actions ---

  // Ajout de congé
  const handleAddConge = () => {
    setSelectedCongeId(null); // S'assurer qu'il n'y a pas d'ID sélectionné pour un ajout
    setIsAddEditModalOpen(true);
  };

  // Modification de congé
  const handleEditConge = (id: string) => {
    setSelectedCongeId(id);
    setIsAddEditModalOpen(true);
  };

  // Voir les détails du congé
  const handleViewDetails = (id: string) => {
    setSelectedCongeId(id);
    setIsDetailsModalOpen(true);
  };

  // Demande de suppression (ouvre la modale de confirmation)
  const handleDeleteRequest = (id: string) => {
    setCongeToDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  // Confirmation de suppression (logique réelle de suppression)
  const handleConfirmDelete = () => {
    if (congeToDeleteId) {
      // En production: Appeler une API pour supprimer le congé
      // Ici: Filtrer la liste des données de test
      const updatedCongesData = initialConges.filter(c => c.id !== congeToDeleteId);
      // Mettre à jour les données initiales pour que les filtres fonctionnent correctement par la suite
      initialConges.splice(0, initialConges.length, ...updatedCongesData); // Met à jour l'array original
      
      // Réappliquer les filtres pour rafraîchir la liste affichée
      applyFilters(currentFilters);
      
      setCongeToDeleteId(null);
      setIsDeleteConfirmOpen(false);
      alert(`Congé ${congeToDeleteId} supprimé (simulé).`); // Notification simple
    }
  };

  // Enregistrement d'un nouveau congé ou d'une modification
  const handleSaveConge = (congeData: Conge) => {
    if (selectedCongeId) {
      // Modification
      const index = initialConges.findIndex(c => c.id === selectedCongeId);
      if (index !== -1) {
        initialConges[index] = { ...congeData, id: selectedCongeId }; // Conserver l'ID original
      }
      alert(`Congé ${selectedCongeId} modifié (simulé).`);
    } else {
      // Ajout
      const newId = `cge_${(initialConges.length + 1).toString().padStart(3, '0')}`; // Générer un ID simple
      const newConge = { ...congeData, id: newId, dateDemande: format(new Date(), 'yyyy-MM-dd'),  statut: 'En attente' };
      initialConges.push(newConge);
      alert(`Nouveau congé ajouté (simulé) : ${newId}`);
    }
    
    // Réappliquer les filtres pour rafraîchir la liste affichée
    applyFilters(currentFilters);
    
    setIsAddEditModalOpen(false); // Fermer la modale après sauvegarde
    setSelectedCongeId(null); // Réinitialiser
  };

  // Trouver le congé sélectionné pour les détails ou la modification
  const selectedConge = selectedCongeId
    ? initialConges.find(c => c.id === selectedCongeId)
    : undefined;


  return (
    <div className="w-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Congés et Absences</h1>

      <FiltresConges onFilterChange={applyFilters} onAddConge={handleAddConge} />

      <ListeConges
        conges={conges}
        onViewDetails={handleViewDetails}
        onEditConge={handleEditConge}
        onDeleteConge={handleDeleteRequest} // Appelle la demande de suppression
      />

      {/* Modale d'ajout/modification de congé */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedCongeId ? "Modifier le congé" : "Ajouter un nouveau congé"}</DialogTitle>
          </DialogHeader>
          <FormulaireConge
            initialData={selectedConge} // Passe les données pour modification, sinon undefined pour ajout
            onSave={handleSaveConge}
            onCancel={() => setIsAddEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modale de détails du congé */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails du Congé</DialogTitle>
          </DialogHeader>
          {selectedConge && <DetailsConge conge={selectedConge} />}
          {/* Un bouton de fermeture peut être ajouté ici si le DialogContent ne fournit pas déjà un X */}
        </DialogContent>
      </Dialog>

      {/* Modale de confirmation de suppression */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Elle supprimera définitivement ce congé de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setCongeToDeleteId(null); setIsDeleteConfirmOpen(false); }}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default CongesPage;