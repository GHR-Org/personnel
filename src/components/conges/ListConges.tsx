/* eslint-disable prefer-const */
// src/components/conges/ListeConges.tsx

import React from 'react';
import { Conge, CongeStatut } from '@/types/conge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { format, isWeekend } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ListeCongesProps {
  conges: Conge[];
  onViewDetails: (congeId: string) => void;
  onEditConge: (congeId: string) => void;
  onDeleteConge: (congeId: string) => void;
}

// Fonction pour calculer les jours ouvrés entre deux dates
const calculateWorkingDays = (startDate: Date, endDate: Date): number => {
  let workingDays = 0;
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    if (!isWeekend(currentDate)) {
      workingDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return workingDays;
};

const ListeConges: React.FC<ListeCongesProps> = ({
  conges,
  onViewDetails,
  onEditConge,
  onDeleteConge,
}) => {
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

  return (
    <div className="border w-full rounded-md overflow-hidden">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">ID Personnel</TableHead>
            <TableHead>Type de Congé</TableHead>
            <TableHead>Date Début</TableHead>
            <TableHead>Date Fin</TableHead>
            <TableHead className="text-right">Jours Ouvrés</TableHead>
            <TableHead className="text-center">Statut</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conges.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                Aucun congé ou absence à afficher.
              </TableCell>
            </TableRow>
          ) : (
            conges.map((conge) => (
              <TableRow key={conge.id}>
                <TableCell className="font-medium">{conge.personnel_id}</TableCell>
                <TableCell>{conge.type}</TableCell>
                <TableCell>
                  {format(new Date(conge.dateDebut), "PPP", { locale: fr })}
                </TableCell>
                <TableCell>
                  {format(new Date(conge.dateFin), "PPP", { locale: fr })}
                </TableCell>
                <TableCell className="text-right">
                  {/* Appel de la fonction de calcul ici */}
                  {calculateWorkingDays(new Date(conge.dateDebut), new Date(conge.dateFin))}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={getStatutBadgeVariant(conge.status)}>
                    {conge.status}
                  </Badge>
                </TableCell>
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
                    className="text-red-600 hover:bg-red-100"
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