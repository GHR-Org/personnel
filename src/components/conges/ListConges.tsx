// src/components/conges/ListeConges.tsx

import React from 'react';
import { Conge } from '@/types/conge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import du composant Button
import { Eye, Edit, Trash2 } from 'lucide-react'; // Icônes pour les actions

interface ListeCongesProps {
  conges: Conge[];
  onViewDetails: (congeId: string) => void; // Nouveau: Callback pour voir les détails
  onEditConge: (congeId: string) => void;   // Nouveau: Callback pour modifier
  onDeleteConge: (congeId: string) => void; // Nouveau: Callback pour supprimer
  // Vous pouvez ajouter des permissions ici si nécessaire pour masquer/afficher les boutons
  // canEdit?: boolean;
  // canDelete?: boolean;
}

const ListeConges: React.FC<ListeCongesProps> = ({
  conges,
  onViewDetails,
  onEditConge,
  onDeleteConge,
}) => {

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
    <div className="border w-full rounded-md overflow-hidden">
      <Table className="w-full ">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Employé</TableHead>
            <TableHead>Type de Congé</TableHead>
            <TableHead>Date Début</TableHead>
            <TableHead>Date Fin</TableHead>
            <TableHead className="text-right">Jours Ouvrés</TableHead>
            <TableHead className="text-center">Statut</TableHead>
            <TableHead className="text-center">Actions</TableHead> {/* Nouvelle colonne */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {conges.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground"> {/* colSpan ajusté */}
                Aucun congé ou absence à afficher.
              </TableCell>
            </TableRow>
          ) : (
            conges.map((conge) => (
              <TableRow key={conge.id}>
                <TableCell className="font-medium">{conge.nomEmploye}</TableCell>
                <TableCell>{conge.typeConge}</TableCell>
                <TableCell>{conge.dateDebut}</TableCell>
                <TableCell>{conge.dateFin}</TableCell>
                <TableCell className="text-right">{conge.dureeJoursOuvres}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={getStatutBadgeVariant(conge.statut)}>
                    {conge.statut}
                  </Badge>
                </TableCell>
                {/* Cellule des actions */}
                <TableCell className="flex justify-center items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(conge.id)}
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditConge(conge.id)}
                    title="Modifier le congé"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteConge(conge.id)}
                    title="Supprimer le congé"
                    className="text-red-600 hover:bg-red-100" // Couleur pour la suppression
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListeConges;