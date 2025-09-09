// src/components/conges/DetailsConge.tsx

import React from 'react';
import { Conge, CongeStatut } from '@/types/conge';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText } from 'lucide-react'; // Importation de l'icône pour les fichiers

interface DetailsCongeProps {
  conge: Conge;
}

const DetailsConge: React.FC<DetailsCongeProps> = ({ conge }) => {
  const getStatutBadgeVariant = (statut: CongeStatut) => {
    switch (statut) {
      case CongeStatut.APPROUVER:
        return 'default';
      case CongeStatut.EN_ATTENTE:
        return 'secondary';
      case CongeStatut.REFUSER:
        return 'destructive';
      case CongeStatut.ANNULER:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return "Non spécifiée";
    }
    const formattedDateString = dateString.includes('T') ? dateString : `${dateString}T00:00:00`;
    const date = new Date(formattedDateString);

    if (isNaN(date.getTime())) {
      return "Date invalide";
    }

    return format(date, 'PPP', { locale: fr });
  };
  
  // Fonction pour extraire le nom du fichier de l'URL
  const getFileNameFromUrl = (url: string) => {
    try {
        const urlObj = new URL(url);
        // Récupère le dernier segment du chemin
        const pathSegments = urlObj.pathname.split('/');
        return pathSegments.pop() || 'Fichier joint';
    } catch (e) {
        // En cas d'URL invalide, renvoie un nom par défaut
        console.log(e)
        return 'Fichier joint';
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* En-tête avec titre et statut */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          Détails du congé
        </h3>
        <Badge variant={getStatutBadgeVariant(conge.status)}>{conge.status}</Badge>
      </div>

      <Separator />

      {/* Section des informations générales */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-700">Informations Générales</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div>
            <p className="text-muted-foreground">ID Personnel :</p>
            <p className="font-medium">{conge.personnel_id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type de Congé :</p>
            <p className="font-medium">{conge.type}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date de demande :</p>
            <p className="font-medium">{formatDate(conge.dateDmd)}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Section des dates */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-700">Période du Congé</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div>
            <p className="text-muted-foreground">Date de début :</p>
            <p className="font-medium">{formatDate(conge.dateDebut)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date de fin :</p>
            <p className="font-medium">{formatDate(conge.dateFin)}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Section des détails supplémentaires (raison et fichier) */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-700">Détails Supplémentaires</h4>
        {/* Afficher la raison si elle existe */}
        {conge.raison && (
          <div>
            <p className="text-muted-foreground">Raison de la demande :</p>
            <p className="text-sm italic">{conge.raison}</p>
          </div>
        )}
        {/* Afficher le fichier joint si l'URL existe */}
        {conge.fichierJoin && conge.fichierJoin.trim() !== '' && (
          <div className="mt-4">
            <p className="text-muted-foreground">Fichier joint :</p>
            <div className="flex items-center gap-2 mt-1">
              <FileText className="h-5 w-5 text-blue-500" />
              <a 
                href={conge.fichierJoin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline break-all"
              >
                {getFileNameFromUrl(conge.fichierJoin)}
              </a>
            </div>
          </div>
        )}
        {!conge.raison && (!conge.fichierJoin || conge.fichierJoin.trim() === '') && (
            <p className="text-sm text-muted-foreground italic">Aucun détail supplémentaire fourni.</p>
        )}
      </div>
    </div>
  );
};

export default DetailsConge;