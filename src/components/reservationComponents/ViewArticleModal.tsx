// src/components/modals/ViewArticlesModal.tsx
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArticleItem } from "@/types/reservation"; // Importez votre type d'article

interface ViewArticlesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articles: ArticleItem[] | null;
}

export function ViewArticlesModal({ open, onOpenChange, articles }: ViewArticlesModalProps) {
  const articleList = articles ?? [];
  
  const calculateTotal = () => {
    return articleList.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Articles et Services de la Réservation</DialogTitle>
          <DialogDescription>
            Liste des articles facturés pour cette réservation.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {articleList.length === 0 ? (
            <p className="text-muted-foreground text-center">Aucun article enregistré pour cette réservation.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Libellé</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Prix Unitaire</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articleList.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.nom}</TableCell>
                    <TableCell className="text-right">{item.quantite}</TableCell>
                    <TableCell className="text-right">
                      {item.prix.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}
                    </TableCell>
                    <TableCell className="text-right">
                      {(item.prix * item.quantite).toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell colSpan={3} className="text-right">Total des articles:</TableCell>
                  <TableCell className="text-right">
                    {calculateTotal().toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}