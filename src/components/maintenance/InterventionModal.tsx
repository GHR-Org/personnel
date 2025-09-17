"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Assurez-vous d'avoir ce composant
import { Intervention } from "@/lib/stores/maintenance_store"; // Importe le type Intervention
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: string | null;
  interventions: Intervention[];
}

export const InterventionModal = ({
  isOpen,
  onClose,
  status,
  interventions,
}: InterventionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Détails des interventions :{" "}
            <span
              className={`font-bold ${
                status === "Terminée"
                  ? "text-green-600"
                  : status === "Annulée"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              {status}
            </span>
          </DialogTitle>
          <DialogDescription>
            Liste des interventions avec le statut {status}.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72">
          <div className="space-y-4">
            {interventions.length > 0 ? (
              interventions.map((interv) => (
                <div key={interv.id} className="p-4 border rounded-md">
                  <div className="font-semibold">{`Incident ${interv.incident_Id}`}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Description : {interv.description}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Planifiée le : {new Date(interv.scheduledDate).toLocaleDateString()}
                  </div>
                  <div className="mt-2">
                    <Badge variant="secondary">{interv.status}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Aucune intervention trouvée pour ce statut.
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};