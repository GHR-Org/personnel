/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/equipment/EquipmentDetailsModal.tsx

import React, { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore, Equipment } from "@/lib/stores/maintenance_store";
import { toast } from "sonner";
import { EquipmentUpdateFormModal } from "./EquipmentUpdateForm";

interface EquipmentDetailsModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColorMap: Record<Equipment["status"], string> = {
  Fonctionnel: "bg-green-500",
  "En Maintenance": "bg-yellow-500",
  "Hors service": "bg-blue-800",
  "En panne" : "bg-red-600"
};

export function EquipmentDetailsModal({
  equipment,
  isOpen,
  onClose,
}: EquipmentDetailsModalProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const deleteEquipment = useAppStore((state) => state.deleteEquipment);

  if (!equipment) {
    return null; // Ne rien rendre si aucun équipement n'est sélectionné
  }

  const handleDelete = async () => {
    try {
      await deleteEquipment(equipment.id);
      onClose(); // Ferme le modal après la suppression
      toast.success("Équipement supprimé avec succès.");
    } catch (error) {
      toast.error("Échec de la suppression.");
    } finally {
      setIsAlertOpen(false); // Ferme l'alerte
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-360">
          <DialogHeader>
            <DialogTitle>Détails de l&apos;équipement</DialogTitle>
          </DialogHeader>
          <Card className="shadow-none border-none p-6">
            <CardContent className="p-0">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">ID</h4>
                  <p>{equipment.id}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">Nom</h4>
                  <p>{equipment.nom}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">Type</h4>
                  <p>{equipment.type}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">Emplacement</h4>
                  <p>{equipment.localisation}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">Statut</h4>
                  <Badge className={statusColorMap[equipment.status]}>
                    {equipment.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500">Description</h4>
                  <p>{equipment.description || "Aucune description"}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsUpdateModalOpen(true)}>
                  Modifier
                </Button>
                <Button variant="destructive" onClick={() => setIsAlertOpen(true)}>
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera définitivement l&apos;équipement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Oui, supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EquipmentUpdateFormModal
        equipment={equipment}
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          onClose(); // Ferme aussi le modal de détails
        }}
      />
    </>
  );
}