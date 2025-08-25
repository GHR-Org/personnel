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
import { BookingFormInputs } from "@/schemas/reservation"; // Assurez-vous que le chemin est correct

interface ReportIncidentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: BookingFormInputs | null;
}

export function ReportIncidentModal({
  open,
  onOpenChange,
  reservation
}: ReportIncidentModalProps) {
  const [reportTitle, setReportTitle] = React.useState("");
  const [reportDescription, setReportDescription] = React.useState("");

  const handleSubmitReport = () => {
    if (!reportTitle.trim() || !reportDescription.trim()) {
      toast.error("Veuillez remplir tous les champs du rapport.");
      return;
    }

    // Ici, vous enverriez les données à votre backend
    // Pour l'instant, nous allons juste afficher un toast
    console.log("Rapport soumis :", {
      reservationId: reservation?.id,
      room: reservation?.chambre_id,
      title: reportTitle,
      description: reportDescription,
    });
    toast.success(
      `Rapport/Incident soumis pour la chambre ${reservation?.chambre_id} (${reportTitle}) !`
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
            Rédigez un rapport ou signalez un incident pour la chambre{" "}
            <span className="font-semibold">
              {reservation?.chambre_id}
            </span>{" "}
            (Réservation: {reservation?.first_name} {reservation?.last_name}).
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
              placeholder="Ex: Fuite d'eau, Objet oublié"
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
              placeholder="Détaillez l'incident ou le rapport ici..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            Annuler
          </Button>
          <Button onClick={handleSubmitReport}>Soumettre le rapport</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}