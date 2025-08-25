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
// <== N'oublie pas l'import ici !

function getStatusVariant(
  status: TableStatus
): "outline" | "destructive" | "default" | "secondary" {
  switch (status) {
    case TableStatus.LIBRE:
      return "outline";
    case TableStatus.OCCUPE:
    case TableStatus.RESERVEE:
      return "destructive";
    case TableStatus.NETTOYAGE:
      return "secondary";
    default:
      return "default";
  }
}

export function PreviewModal() {
  const { previewOpen: open, selectedItem: item, closeDrawer, updateTableStatus } = useFurnitureStore();


  if (!item) return null;

  const safeUpdate = (status: TableStatus) => {
    if (!item) return;
    updateTableStatus(item.id, status);
  };

  return (
    <Dialog open={open} onOpenChange={closeDrawer}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item.name ?? "Sans nom"}</DialogTitle>
          {item.status && (
            <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
          )}
          <DialogDescription>Détails de la table sélectionnée</DialogDescription>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <p className="text-muted-foreground">Type : {item.type}</p>

          {item.status === TableStatus.LIBRE && (
            <div className="flex flex-col gap-2">
              <Button variant="default" onClick={() => safeUpdate(TableStatus.RESERVEE)}>
                Réserver
              </Button>
              <Button variant="secondary" onClick={() => safeUpdate(TableStatus.OCCUPE)}>
                Occuper
              </Button>
              <Button variant="destructive" onClick={() => safeUpdate(TableStatus.HORS_SERVICE)}>
                Hors Service
              </Button>
            </div>
          )}

          {item.status === TableStatus.RESERVEE && (
            <div className="flex flex-col gap-2">
              <Button variant="secondary" onClick={() => safeUpdate(TableStatus.LIBRE)}>
                Régler le paiement
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
  );
}
