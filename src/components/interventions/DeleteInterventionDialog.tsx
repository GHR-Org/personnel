// src/components/interventions/DeleteInterventionDialog.tsx
"use client";

import { useAppStore } from '@/lib/stores/maintenance_store';
import { Button } from '@/components/ui/button';
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
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import React from 'react';

interface DeleteInterventionDialogProps {
    id: string;
}

export function DeleteInterventionDialog({ id }: DeleteInterventionDialogProps) {
    const [open, setOpen] = React.useState(false); // Ajout de l'état local
    const deleteIntervention = useAppStore(state => state.deleteIntervention);

    const handleDelete = () => {
        deleteIntervention(id);
        setOpen(false); // Ferme la boîte de dialogue après la suppression
        toast.success("Intervention supprimée avec succès.");
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash className="h-4 w-4" />
                    Supprimer
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Elle supprimera définitivement l&apos;intervention {id} de la liste.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive hover:bg-red-600"
                    >
                        Supprimer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}