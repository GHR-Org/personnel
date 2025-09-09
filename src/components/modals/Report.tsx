// src/components/modals/ReportIncidentModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createRapport } from "@/func/api/rapports/apiRapports";
 // Assurez-vous que le chemin est correct

interface ReportIncidentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void ;
  
}

export function Report({
  open,
  onOpenChange,
}: ReportIncidentModalProps) {
  const [reportTitle, setReportTitle] = React.useState("");
  const [reportDescription, setReportDescription] = React.useState("");

  const handleSubmitReport = () => {
    if (!reportTitle.trim() || !reportDescription.trim()) {
      toast.error("Veuillez remplir tous les champs du rapport.");
      return;
    }

    const payload = {
        titre: reportTitle,
        description: reportDescription,
        type: "Personnel", // Remplacer par la valeur appropriée
        personnel_id: 1, 
        etablissement_id: 1,
        statut: "En Attente" as const,
    };

    try {
        createRapport(payload);
        toast.success(`Rapport envoyé avec succès : (${reportTitle}) !`);

        // Réinitialiser les champs et fermer la modale
        setReportTitle("");
        setReportDescription("");
        onOpenChange(false);
    } catch (error) {
        toast.error("Échec de l'envoi du rapport. Veuillez réessayer.");
        console.error("Erreur lors de la soumission du rapport:", error);
    }
    
    
    toast.success(
     `Rapport envoyé avec succès : (${reportTitle}) !`
    );

    // Réinitialiser les champs et fermer la modale
    setReportTitle("");
    setReportDescription("");
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (!open) {
      // Réinitialiser quand la modale est fermée
      setReportTitle("");
      setReportDescription("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rapport & Incidents</DialogTitle>
          <DialogDescription>
            Rédigez un rapport 
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="report-title" className="text-right">
              Titre
            </Label>
            <Input
              id="report-title"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="col-span-3"
              placeholder="Absence ou retard, ou autre remarque ou autre besoin"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="report-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="report-description"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="col-span-3 min-h-[100px]"
              placeholder="Détaillez le sujet ou le rapport ici..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmitReport}>Soumettre le rapport</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}