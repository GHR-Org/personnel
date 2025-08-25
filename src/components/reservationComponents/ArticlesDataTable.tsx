/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/reservationComponents/ArticlesDataTable.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Mise à jour du type de l'ID pour être compatible avec useFieldArray
export interface FormArticle {
  id: string; // L'ID généré par useFieldArray est une chaîne de caractères
  nom: string;
  prix: number;
  quantite: number;
  total: number;
  seuil_stock?: number;
}

interface ArticlesDataTableProps {
  value: FormArticle[];
  onRemove: (idToRemove: string) => void;
  onQuantityChange: (id: string, quantite: number) => void;
}

export function ArticlesDataTable({
  value,
  onRemove,
  onQuantityChange,
}: ArticlesDataTableProps) {
  const formatPrix = (prix: number) => {
    // Adapter le format monétaire si nécessaire (Ar pour Ariary)
    return prix.toFixed(2) + " Ar";
  };

  const totalArticles = value.reduce((sum, article) => sum + article.total, 0);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead className="w-[120px] text-center">Quantité</TableHead>
            <TableHead className="text-right">Prix Unitaire</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[60px] text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {value.length > 0 ? (
            value.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.nom}</TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    value={article.quantite}
                    onChange={(e) =>
                      onQuantityChange(article.id, Number(e.target.value))
                    }
                    min={1}
                    className="w-[70px] text-center"
                  />
                </TableCell>
                <TableCell className="text-right">
                  {formatPrix(article.prix)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrix(article.total)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(article.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                Aucun article ajouté.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="border-t p-4 flex justify-end font-bold">
        Total des articles: {formatPrix(totalArticles)}
      </div>
    </div>
  );
}