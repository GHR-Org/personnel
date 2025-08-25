/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/interventions/InterventionDetailsModal.tsx

"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Intervention, useAppStore } from "@/lib/stores/maintenance_store";
import { Badge } from "@/components/ui/badge";
import { UpdateInterventionModal } from "./UpdateInterventionModal";
import { DeleteInterventionDialog } from "./DeleteInterventionDialog";
import { CalendarDays, User, Wrench, Info } from "lucide-react";

interface InterventionDetailsModalProps {
  intervention: Intervention;
  open: boolean;
  onClose: () => void;
}

// Les couleurs de statut sont désormais conditionnelles au thème pour une meilleure visibilité.
const statusColorMap = (theme: string | undefined | null) => ({
  Planifiée: theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white",
  "En cours": theme === "dark" ? "bg-yellow-600 text-black" : "bg-yellow-500 text-black",
  Terminée: theme === "dark" ? "bg-green-600 text-white" : "bg-green-500 text-white",
  Annulée: theme === "dark" ? "bg-red-600 text-white" : "bg-red-500 text-white",
});

export function InterventionDetailsModal({
  intervention,
  open,
  onClose,
}: InterventionDetailsModalProps) {
  // 1. Intégration de next-themes : Utilisation du hook useTheme pour récupérer le thème actuel.
  const { theme } = useTheme();

  const incidents = useAppStore((state) => state.incidents);
  const equipments = useAppStore((state) => state.equipments);

  const technicians = [
    { id: "TECH-001", nom: "Lovasoa Nantenaina" },
    { id: "TECH-002", nom: "This is the end" },
    { id: "TECH-003", nom: "i am the lord " },
  ];

  const incident = incidents.find((inc) => inc.id === intervention.incident_Id);
  const equipment = equipments.find(
    (eq) => eq.id === incident?.equipement_id
  );

  const getTechnicianName = (id: string | undefined): string => {
    const technician = technicians.find((tech) => tech.id === id);
    return technician?.nom || "Technicien non trouvé";
  };

  // Phrase dynamique sous le titre
  const subtitle = `${equipment?.nom || "Équipement inconnu"} — ${
    getTechnicianName(intervention.personnel_Id)
  } — ${new Date(intervention.scheduledDate).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* 2. Personnalisation du style du DialogContent pour une meilleure cohérence visuelle. */}
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 transition-colors duration-200">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Détails de l’intervention
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400 mt-1">
            {subtitle}
          </DialogDescription>
        </DialogHeader>

        {/* Corps du modal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          {/* Bloc gauche */}
          <div className="space-y-5">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Informations générales
              </h4>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-50">Équipement :</span>
                  {equipment?.nom || "Non trouvé"}
                </div>
                {/* 3. Ajout d'un lien vers l'équipement pour plus de navigation. */}
                {equipment?.nom && (
                  <div className="pl-6 text-xs text-gray-500 dark:text-gray-400">
                    ID: <span className="font-mono">{incident?.equipement_id}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-50">Technicien :</span>
                  {getTechnicianName(intervention.personnel_Id)}
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    Date planifiée :
                  </span>
                  {new Date(intervention.scheduledDate).toLocaleDateString(
                    "fr-FR",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-gray-50">Statut :</span>
                  {/* 4. Utilisation de statusColorMap avec le thème pour la badge */}
                  <Badge
                    className={`${statusColorMap(theme)[intervention.status]} px-3 py-1 text-xs font-semibold rounded-full`}
                  >
                    {intervention.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Bloc droit */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Description
            </h4>
            {/* 5. Personnalisation de la description pour un meilleur contraste dans les deux thèmes. */}
            <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300 leading-relaxed border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              {intervention.description || "Aucune description fournie."}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <UpdateInterventionModal intervention={intervention} />
          <DeleteInterventionDialog id={intervention.id} />
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}