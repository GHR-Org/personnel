"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IconTrash, IconX } from "@tabler/icons-react";
import { Rapport } from "./column";
import { getPersonnelById } from "@/func/api/personnel/apipersonnel";
import { UpdateFormModal } from "./UpdateRapport";

interface DetailsModalProps {
  rapport: Rapport;
  onUpdate: () => void;
  onDelete: () => void;
}

export function DetailsModal({ rapport, onUpdate, onDelete }: DetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [personnelName, setPersonnelName] = useState<string>("Chargement...");
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    if (open && rapport.personnel_id) {
      const fetchPersonnelName = async () => {
        const personnel = await getPersonnelById(rapport.personnel_id);
        if (personnel) {
          setPersonnelName(personnel.nom);
        } else {
          setPersonnelName("Inconnu");
        }
      };
      fetchPersonnelName();
    }
  }, [open, rapport.personnel_id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-sm">
          {rapport.titre}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du Rapport : {rapport.titre}</DialogTitle>
          <DialogDescription>
            Informations détaillées sur le rapport de maintenance.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div>
            <span className="font-semibold">Titre :</span> {rapport.titre}
          </div>
          <div>
            <span className="font-semibold">Description :</span> {rapport.description}
          </div>
          <div>
            <span className="font-semibold">Type :</span> {rapport.type}
          </div>
          <div>
            <span className="font-semibold">Statut :</span> {rapport.statut}
          </div>
          <div>
            <span className="font-semibold">Établissement (ID) :</span> {rapport.etablissement_id}
          </div>
          <div>
            <span className="font-semibold">Créé par :</span> {personnelName}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <DialogClose asChild>
            <Button variant="outline">
              <IconX className="mr-2 h-4 w-4" />
              Annuler
            </Button>
          </DialogClose>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <IconTrash className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce rapport ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Toutes les données liées à ce rapport seront définitivement supprimées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Non</AlertDialogCancel>
                  <AlertDialogAction onClick={() => { onDelete(); setOpen(false); }}>Oui, supprimer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
      {isUpdateModalOpen && (
        <UpdateFormModal
          rapport={rapport}
          open={isUpdateModalOpen}
          onOpenChange={setIsUpdateModalOpen}
          onSuccess={onUpdate}
        />
      )}
    </Dialog>
  );
}