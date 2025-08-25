// src/components/conges/DetailsConge.tsx

import React from 'react';
import { Conge } from '@/types/conge';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator'; // Pour les séparateurs visuels
import { format } from 'date-fns';

// Ajoutez le composant Separator si vous ne l'avez pas
// npx shadcn-ui@latest add separator

interface DetailsCongeProps {
  conge: Conge;
}

const DetailsConge: React.FC<DetailsCongeProps> = ({ conge }) => {
  const getStatutBadgeVariant = (statut: Conge['statut']) => {
    switch (statut) {
      case 'Approuvé':
        return 'default';
      case 'En attente':
        return 'secondary';
      case 'Refusé':
        return 'destructive';
      case 'Annulé':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{conge.nomEmploye} ({conge.typeConge})</h3>
        <Badge variant={getStatutBadgeVariant(conge.statut)}>{conge.statut}</Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">ID Employé :</p>
          <p className="font-medium">{conge.employeId}</p>
        </div>
        <div>
          <p className="text-muted-foreground">ID Congé :</p>
          <p className="font-medium">{conge.id}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Date de début :</p>
          <p className="font-medium">{format(new Date(conge.dateDebut), 'dd/MM/yyyy')}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Date de fin :</p>
          <p className="font-medium">{format(new Date(conge.dateFin), 'dd/MM/yyyy')}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Jours ouvrés :</p>
          <p className="font-medium">{conge.dureeJoursOuvres}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Date de demande :</p>
          <p className="font-medium">{format(new Date(conge.dateDemande), 'dd/MM/yyyy')}</p>
        </div>
      </div>

      {(conge.raison || conge.commentaireManager || (conge.fichiersJoints && conge.fichiersJoints.length > 0)) && (
        <>
          <Separator />
          <div className="space-y-2 text-sm">
            {conge.raison && (
              <div>
                <p className="text-muted-foreground">Raison :</p>
                <p>{conge.raison}</p>
              </div>
            )}
            {conge.commentaireManager && (
              <div>
                <p className="text-muted-foreground">Commentaire Manager :</p>
                <p>{conge.commentaireManager}</p>
              </div>
            )}
            {conge.fichiersJoints && conge.fichiersJoints.length > 0 && (
              <div>
                <p className="text-muted-foreground">Fichiers joints :</p>
                <ul className="list-disc list-inside">
                  {conge.fichiersJoints.map((file, index) => (
                    <li key={index}>
                      <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {file.split('/').pop()} {/* Affiche juste le nom du fichier */}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DetailsConge;