// src/app/conges/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import ListeConges from "@/components/conges/ListConges";
import FiltresConges, { CongeFilters } from "@/components/conges/FiltresConges";
import { Conge } from "@/types/conge"; // Assurez-vous que ce type inclut l'id? : string;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import DetailsConge from "@/components/conges/DetailsConge";
import FormulaireConge from "@/components/conges/FormulaireConges";
import {
  getAllConges,
  getCongeById,
  deleteConge,
  updateConge,
  createConge,
} from "@/func/api/conge/apiConge";

// Type pour les données du formulaire, qui ne sont pas l'objet Conge complet
// Il exclut l'ID car il est généré par le backend, et le statut et la dateDmd
// car ils sont gérés par l'API.
type FormCongeData = Omit<Conge, "id" | "status" | "dateDmd" | "dureeJoursOuvres">;

const CongesPage: React.FC = () => {
  const [conges, setConges] = useState<Conge[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<CongeFilters>({});

  // États pour les modales d'action
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  // selectedConge doit être de type Conge (avec l'ID) ou null
  const [selectedConge, setSelectedConge] = useState<Conge | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [congeToDeleteId, setCongeToDeleteId] = useState<string | null>(null);

  const fetchConges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllConges();
      setConges(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des congés.");
      toast.error("Impossible de charger la liste des congés.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConges();
  }, []);

  const applyFilters = (filters: CongeFilters) => {
    setCurrentFilters(filters);
  };

  const handleAddConge = () => {
    setSelectedConge(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditConge = async (congeId: string) => {
    const congeToEdit = await getCongeById(congeId);
    if (congeToEdit) {
      setSelectedConge(congeToEdit);
      setIsAddEditModalOpen(true);
    } else {
      toast.error("Congé introuvable pour la modification.");
    }
  };

  const handleViewDetails = async (congeId: string) => {
    const congeDetails = await getCongeById(congeId);
    if (congeDetails) {
      setSelectedConge(congeDetails);
      setIsDetailsModalOpen(true);
    } else {
      toast.error("Impossible de charger les détails du congé.");
    }
  };

  const handleDeleteRequest = (congeId: string) => {
    setCongeToDeleteId(congeId);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (congeToDeleteId) {
      const success = await deleteConge(congeToDeleteId);
      if (success) {
        toast.success("Le congé a été supprimé avec succès.");
        fetchConges();
      } else {
        toast.error("Échec de la suppression du congé.");
      }
    }
    setIsDeleteConfirmOpen(false);
    setCongeToDeleteId(null);
  };

  const handleSaveConge = async (congeData: FormCongeData) => {
    let success = false;
    console.table(congeData);

    if (selectedConge) {
      // Modification
      // Les données envoyées pour la modification doivent inclure toutes les
      // propriétés requises par le schéma du backend.
      const updatedCongeData = {
        ...congeData,
        status: selectedConge.status,
        dateDmd: selectedConge.dateDmd,
      };
      const updatedConge = await updateConge(selectedConge.id!, updatedCongeData);

      if (updatedConge) {
        toast.success("Congé mis à jour avec succès. ✨");
        success = true;
      } else {
        toast.error("Échec de la mise à jour du congé.");
      }
    } else {
      // Ajout
      const newConge = await createConge(congeData);

      if (newConge) {
        toast.success("Nouveau congé ajouté avec succès. ✅");
        success = true;
      } else {
        toast.error("Échec de l'ajout du congé.");
      }
    }

    if (success) {
      setIsAddEditModalOpen(false);
      setSelectedConge(null);
      await fetchConges();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Chargement des congés...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  const filteredConges = conges.filter((conge) => {
    let matches = true;
    if (
      currentFilters.nomEmploye &&
      !conge.personnel_id.toString().includes(currentFilters.nomEmploye)
    )
      matches = false;
    if (
      currentFilters.typeConge &&
      currentFilters.typeConge !== "Tous" &&
      conge.type !== currentFilters.typeConge
    )
      matches = false;
    if (
      currentFilters.statut &&
      currentFilters.statut !== "Tous" &&
      conge.status !== currentFilters.statut
    )
      matches = false;
    return matches;
  });

  return (
    <div className="w-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Gestion des Congés et Absences
      </h1>

      <FiltresConges
        onFilterChange={applyFilters}
        onAddConge={handleAddConge}
      />

      <ListeConges
        conges={filteredConges}
        onViewDetails={handleViewDetails}
        onEditConge={handleEditConge}
        onDeleteConge={handleDeleteRequest}
      />

      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedConge ? "Modifier le congé" : "Ajouter un nouveau congé"}
            </DialogTitle>
          </DialogHeader>
          <FormulaireConge
            initialData={selectedConge || undefined}
            onSave={handleSaveConge}
            onCancel={() => setIsAddEditModalOpen(false)}
            etablissementId={1}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails du Congé</DialogTitle>
          </DialogHeader>
          {selectedConge && <DetailsConge conge={selectedConge} />}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Elle supprimera définitivement ce
              congé de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setCongeToDeleteId(null);
                setIsDeleteConfirmOpen(false);
              }}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CongesPage;