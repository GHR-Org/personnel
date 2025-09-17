// src/components/PreviewModal.jsx

"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { TableStatus } from "@/types/table";
import { useFurnitureStore } from "@/lib/stores/furniture-store";
import { CommandeForm } from "./CommandForm";

// Fonction pour obtenir les classes CSS en fonction du statut
function getStatusClasses(status: TableStatus): string {
  switch (status) {
    case TableStatus.LIBRE:
      return "bg-green-500 text-white";
    case TableStatus.OCCUPE:
    case TableStatus.RESERVEE:
      return "bg-red-500 text-white";
    case TableStatus.NETTOYAGE:
      return "bg-yellow-500 text-black";
    case TableStatus.HORS_SERVICE:
      return "bg-gray-500 text-white";
    default:
      return "bg-blue-500 text-white"; // Une couleur par défaut pour les statuts inconnus
  }
}

export function PreviewModal() {
  const { previewOpen: open, selectedItem: item, closeDrawer, updateTableStatus } = useFurnitureStore();
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);

  if (!item) return null;

  const safeUpdate = (status: TableStatus) => {
    if (!item) return;
    updateTableStatus(item.id, status);
  };
  const handleOpenForm = () => {
    setIsFormModalOpen(true);
    // On ferme la modale de prévisualisation si nécessaire
    // closeDrawer(); 
  };


  return (
    <>
    <Dialog open={open} onOpenChange={closeDrawer}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item.name ?? "Sans nom"}</DialogTitle>
          {item.status && (
            // On utilise la nouvelle fonction pour générer les classes
            <Badge className={getStatusClasses(item.status)}>{item.status}</Badge>
          )}
          <DialogDescription>Détails de la table sélectionnée</DialogDescription>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <p className="text-muted-foreground">Type : {item.type}</p>

          {item.status === TableStatus.LIBRE && (
            <div className="flex flex-col gap-2">
              <Button variant="default" onClick={handleOpenForm}>
                Réserver
              </Button>
              <Button variant="outline" onClick={() => safeUpdate(TableStatus.OCCUPE)}>
                Occuper
              </Button>
              <Button variant="ghost" onClick={() => safeUpdate(TableStatus.HORS_SERVICE)}>
                Hors Service
              </Button>
            </div>
          )}

          {item.status === TableStatus.RESERVEE && (
            <div className="flex flex-col gap-2">
              <Button variant="secondary" onClick={() => safeUpdate(TableStatus.LIBRE)}>
                Libérer
              </Button>
              <Button variant="destructive" onClick={() => safeUpdate(TableStatus.NETTOYAGE)}>
                Nettoyage
              </Button>
            </div>
          )}

          {item.status === TableStatus.OCCUPE && (
            <div className="flex flex-col gap-2">
              <Button variant="secondary" onClick={() => safeUpdate(TableStatus.LIBRE)}>
                Libérer
              </Button>
              <Button variant="destructive" onClick={() => safeUpdate(TableStatus.NETTOYAGE)}>
                Nettoyage
              </Button>
            </div>
          )}

          {(item.status === TableStatus.NETTOYAGE || item.status === TableStatus.HORS_SERVICE) && (
            <Button variant="secondary" onClick={() => safeUpdate(TableStatus.LIBRE)}>
              Libérer
            </Button>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={closeDrawer}>Fermer</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <CommandeForm 
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        table={item}
      />
      </>
  );
}