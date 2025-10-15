// adminstration_etablissement/src/components/conge-detail.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, FileText, Clock, MapPin } from "lucide-react";
import { Conge } from "@/types";
import { congesService } from "@/services/conges";

interface CongeDetailProps {
  conge: Conge;
  onClose: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  canEdit?: boolean;
  canApprove?: boolean;
}

export default function CongeDetail({
  conge,
  onClose,
  onEdit,
  onApprove,
  onReject,
  canEdit = false,
  canApprove = false,
}: CongeDetailProps) {
  const isEnCours = congesService.isCongeEnCours(conge);
  const isAVenir = congesService.isCongeAVenir(conge);
  const isTermine = new Date(conge.dateFin) < new Date();

  const getStatusBadgeVariant = () => {
    switch (conge.status) {
      case "En Attente":
        return "secondary";
      case "Approuvé":
        return "default";
      case "Refusé":
        return "destructive";
      case "Annulé":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPeriodStatus = () => {
    if (isEnCours)
      return { text: "En cours", color: "text-green-600", bg: "bg-green-50" };
    if (isAVenir)
      return { text: "À venir", color: "text-blue-600", bg: "bg-blue-50" };
    if (isTermine)
      return { text: "Terminé", color: "text-gray-600", bg: "bg-gray-50" };
    return { text: "Inconnu", color: "text-gray-600", bg: "bg-gray-50" };
  };

  const periodStatus = getPeriodStatus();

  // Fonction pour obtenir le nom complet du personnel
  const getPersonnelName = (personnel: any) => {
    if (!personnel) return "Inconnu";

    // Le backend utilise 'nom' et 'prenom' (français)
    const firstName = personnel.nom || personnel.first_name || "";
    const lastName = personnel.prenom || personnel.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Inconnu";
  };

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      {/* En-tête avec statut */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Détails du congé</h2>
            <p className="text-sm text-gray-500">Demande #{conge.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant()}>
            {congesService.getStatusIcon(conge.status)} {conge.status}
          </Badge>
          <Badge
            variant="outline"
            className={`${periodStatus.color} ${periodStatus.bg}`}
          >
            {periodStatus.text}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personnel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Personnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {conge.personnel ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  {getPersonnelName(conge.personnel)}
                </p>
                <p className="text-sm text-gray-500">
                  ID: {conge.personnel_id}
                </p>
                {conge.personnel.email && (
                  <p className="text-sm text-gray-500 break-words">
                    {conge.personnel.email}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">
                Personnel non défini (ID: {conge.personnel_id})
              </p>
            )}
          </CardContent>
        </Card>

        {/* Type de congé */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Type de congé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {congesService.getTypeIcon(conge.type)}
              </span>
              <div>
                <p className="text-lg font-semibold">{conge.type}</p>
                <p className="text-sm text-gray-500">Type de demande</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Période */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Période
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Date de début</p>
                <p className="font-semibold">
                  {new Date(conge.dateDebut).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date de fin</p>
                <p className="font-semibold">
                  {new Date(conge.dateFin).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Durée totale</p>
                <p className="font-semibold text-lg">
                  {congesService.calculateDuration(
                    conge.dateDebut,
                    conge.dateFin
                  )}{" "}
                  jours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates importantes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Dates importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Date de demande</p>
                <p className="font-semibold">
                  {new Date(conge.dateDmd).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut actuel</p>
                <Badge variant={getStatusBadgeVariant()} className="mt-1">
                  {congesService.getStatusIcon(conge.status)} {conge.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motif */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Motif de la demande
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words">
            {conge.raison || "Aucun motif spécifié"}
          </p>
        </CardContent>
      </Card>

      {/* Fichier joint */}
      {conge.fichierJoin && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Fichier joint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg min-w-0">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="flex-1 max-w-full truncate break-all text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                {conge.fichierJoin}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button onClick={onEdit} variant="outline">
              Modifier
            </Button>
          )}
          {canApprove && conge.status === "En Attente" && (
            <>
              <Button
                onClick={onApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                Approuver
              </Button>
              <Button onClick={onReject} variant="destructive">
                Refuser
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
