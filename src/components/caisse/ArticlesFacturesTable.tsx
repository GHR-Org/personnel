// src/components/caisse/ArticlesFacturesTable.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookingManuel } from "@/schemas/reservation"; // Pour le type Articles

interface ArticlesFacturesTableProps {
  articles: BookingManuel['articles'];
}

export function ArticlesFacturesTable({ articles }: ArticlesFacturesTableProps) {
  const listeArticles = articles ?? [];
  const calculateTotal = () => {
    return listeArticles.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
  };

  return (
    <Card className="col-span-full h-full">
      <CardHeader>
        <CardTitle>Articles et Services Facturés</CardTitle>
      </CardHeader>
      <CardContent>
        {listeArticles.length === 0 ? (
          <p className="text-muted-foreground">Aucun article facturé.</p>
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
              {listeArticles.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nom}</TableCell>
                  <TableCell className="text-right">{item.quantite}</TableCell>
                  <TableCell className="text-right">{item.prix.toFixed(2)} Ar</TableCell>
                  <TableCell className="text-right">{(item.prix * item.quantite).toFixed(2)} Ar</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">TOTAL DES ARTICLES:</TableCell>
                <TableCell className="text-right font-bold">{calculateTotal().toFixed(2)} Ar</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}