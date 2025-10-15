/* eslint-disable prefer-const */
// src/components/CommandeForm.jsx

"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

import { ProductSelector } from "../reservationComponents/ProduitSelector";
import { ArticlesDataTable } from "../reservationComponents/ArticlesDataTable";
import { FurnitureItem } from "@/types/table";
import { Produit } from "@/types/Produit";
import { CommandeSchema } from "@/schemas/commande";
import { ArticleCommandeItem } from "@/types/commande";

// Définir les types pour le formulaire en utilisant Zod
type FormValues = z.infer<typeof CommandeSchema>;

interface CommandeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: FurnitureItem;
}

export function CommandeForm({ open, onOpenChange, table }: CommandeFormProps) {
  const [showProductSelector, setShowProductSelector] = React.useState(false);
  const etablissement_id = 1

  const form = useForm<FormValues>({
    resolver: zodResolver(CommandeSchema),
    defaultValues: {
      articles: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "articles",
  });

  // Gère l'ajout d'un article depuis le sélecteur
  const handleAddArticle = (produit: Produit) => {
    // Vérifier si l'article existe déjà pour éviter les doublons dans la DataTable
    const existingIndex = fields.findIndex((article) => article.nom === produit.nom);

    if (existingIndex !== -1) {
      // Si l'article existe, on incrémente la quantité
      const existingArticle = fields[existingIndex];
      const newQuantity = existingArticle.quantite + 1;
      update(existingIndex, {
        ...existingArticle,
        quantite: newQuantity,
        total: newQuantity * existingArticle.prix,
      });
    } else {
      // Sinon, on ajoute un nouvel article
      const newArticle: ArticleCommandeItem = {
        nom: produit.nom,
        prix: produit.prix,
        quantite: 1,
        total: produit.prix,
      };
      append(newArticle);
    }
    setShowProductSelector(false);
  };

  const handleRemoveArticle = (fieldIdToRemove: string) => {
    // 🎯 1. Trouver l'index numérique à partir de l'ID unique de useFieldArray
    const indexToRemove = fields.findIndex(field => field.id === fieldIdToRemove);

    if (indexToRemove !== -1) {
        remove(indexToRemove); // Supprime l'article en utilisant l'index numérique
    } else {
        console.error(`Article avec l'ID ${fieldIdToRemove} non trouvé.`);
    }
};

// La Data Table renvoie l'ID (string) du champ généré par useFieldArray
const handleQuantityChange = (fieldIdToUpdate: string, newQuantity: number) => {
    // 🎯 1. Trouver l'index numérique à partir de l'ID unique de useFieldArray
    const indexToUpdate = fields.findIndex(field => field.id === fieldIdToUpdate);
    
    // 2. Assurez-vous que l'article existe
    if (indexToUpdate === -1) {
        console.error(`Article avec l'ID ${fieldIdToUpdate} non trouvé pour la mise à jour.`);
        return;
    }
    
    const articleToUpdate = fields[indexToUpdate];
    // 3. Assurez-vous que la quantité est toujours >= 1
    const updatedQuantity = Math.max(1, newQuantity);

    // 4. Utiliser l'index numérique pour mettre à jour
    update(indexToUpdate, {
      ...articleToUpdate,
      quantite: updatedQuantity,
      total: updatedQuantity * articleToUpdate.prix,
    });
};

  // Calcul du prix total de la commande
  const calculateTotalPrice = () => {
    return fields.reduce((total, item) => total + item.total, 0);
  };

  // Gère la soumission du formulaire
  const onSubmit = (data: FormValues) => {
    console.log("Données du formulaire soumises:", data);
    console.log("Total de la commande:", calculateTotalPrice());
    // TODO: Ajoutez ici la logique pour envoyer les données à votre API
    // Exemple : postCommande(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Nouvelle commande pour la table {table.name}</DialogTitle>
          </DialogHeader>

          <div className="border p-4 rounded-lg my-4">
            <h2 className="text-lg font-semibold mb-2">Articles</h2>
            {showProductSelector ? (
              <div className="space-y-4">
                <ProductSelector
                  etablissementId={etablissement_id}
                  selectedProduitId={null}
                  onSelectProduit={handleAddArticle}
                />
                <Button type="button" variant="outline" onClick={() => setShowProductSelector(false)}>
                  Annuler l&apos;ajout
                </Button>
              </div>
            ) : (
              <>
                {fields.length > 0 && (
                  <ArticlesDataTable
                    value={fields}
                    onRemove={handleRemoveArticle}
                    onQuantityChange={handleQuantityChange}
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProductSelector(true)}
                  className="mt-4"
                >
                  <IconPlus className="mr-2 h-4 w-4" /> Ajouter un article
                </Button>
              </>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
            <div className="flex-1 text-right sm:text-left text-2xl font-bold">
              Total : {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(calculateTotalPrice())}
            </div>
            <DialogClose asChild>
              <Button type="button" variant="ghost">Annuler</Button>
            </DialogClose>
            <Button type="submit" disabled={fields.length === 0}>
              Enregistrer la commande
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}