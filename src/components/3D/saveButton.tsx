// src/components/SaveButton.jsx

"use client";

import { Button } from "@/components/ui/button";
import { useFurnitureStore } from "@/lib/stores/furniture-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

export function SaveButton() {
  const furniture = useFurnitureStore((state) => state.furniture);
  const router = useRouter();

  const handleSave = () => {
    // La logique de sauvegarde reste la même
    const json = JSON.stringify(furniture);
    localStorage.setItem("room-state", json);
    toast.success("Enregistré avec succès");
    router.push("/manager/restaurant");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full">
          Enregistrer la disposition
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir enregistrer ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action mettra à jour la disposition de votre restaurant. Assurez-vous que tous les meubles sont bien positionnés avant de continuer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>Confirmer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}