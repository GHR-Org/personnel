/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/equipment/EquipmentUpdateFormModal.tsx
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EquipmentForm, EquipmentFormValues } from "@/components/equipment/EquipmentForm";
import { useAppStore, Equipment } from '@/lib/stores/maintenance_store';
import { toast } from 'sonner';

interface EquipmentUpdateFormModalProps {
  equipment: Equipment;
  isOpen: boolean;
  onClose: () => void;
}

export function EquipmentUpdateFormModal({
  equipment,
  isOpen,
  onClose,
}: EquipmentUpdateFormModalProps) {
  const updateEquipment = useAppStore((state) => state.updateEquipment);

  const initialValues: EquipmentFormValues = {
    nom: equipment.nom,
    type: equipment.type,
    localisation: equipment.localisation,
    status: equipment.status,
    description: equipment.description || "",
  };

  const handleUpdate = async (data: EquipmentFormValues) => {
    try {
      await updateEquipment(equipment.id, data);
      onClose(); // Ferme le modal après la mise à jour
      toast.success("Équipement mis à jour avec succès.");
    } catch (error : any) {
      toast.error("Échec de la mise à jour de l'équipement.", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Mettre à jour l&apos;équipement</DialogTitle>
        </DialogHeader>
        <EquipmentForm
          initialValues={initialValues}
          onSubmit={handleUpdate}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}