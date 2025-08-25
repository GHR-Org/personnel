// src/components/caisse/CheckoutActions.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Exemple d'icône de chargement

interface CheckoutActionsProps {
  onFinalize: () => void;
  onPrintFacture: () => void;
  onCancelTransaction: () => void;
  isSubmitting: boolean;
  canFinalize: boolean; // Pour activer/désactiver le bouton de finalisation
}

export function CheckoutActions({ onFinalize, onPrintFacture, onCancelTransaction, isSubmitting, canFinalize }: CheckoutActionsProps) {
  return (
    <div className="flex justify-end gap-3 p-4 border-t mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancelTransaction}
        disabled={isSubmitting}
      >
        Annuler Transaction
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={onPrintFacture}
        disabled={isSubmitting}
      >
        Imprimer Facture
      </Button>
      <Button
        type="submit" // Changé en type submit pour déclencher le handleSubmit du formulaire parent
        disabled={isSubmitting || !canFinalize}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Finaliser la Caisse
      </Button>
    </div>
  );
}