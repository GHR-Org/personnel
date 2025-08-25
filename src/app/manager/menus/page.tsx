/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Importations pour le DropdownMenu et les icônes
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockMenuItems } from "@/types/MenuItem";

// Importez MenuItemType si vous voulez la typer explicitement
// import { MenuItemType } from "@/lib/mock-menu"; // Chemin vers votre type MenuItemType

// --- MISE À JOUR DE L'INTERFACE ICI ---
export interface MenuItem {
  id: string;
  libelle: string;
  description?: string;
  imageUrl?: string;
  type: string; // Vous pouvez le typer avec MenuItemType si vous l'importez
  ingredients: string[];
  prix: number; // Le prix est maintenant en Ariary
  disponible: boolean;
  tags?: string[];
  calories?: number;
  preparationMinutes?: number;
  rating?: number; // NOUVEAU: Ajout de la propriété rating
}

// Fonction export CSV simple (pas de changement nécessaire pour la devise, c'est juste la valeur numérique)
function exportToCsv<T>(filename: string, rows: T[], columns: (keyof T)[]) {
  if (!rows || !rows.length) return;
  const separator = ",";
  const csvContent =
    columns.join(separator) +
    "\n" +
    rows
      .map((row) =>
        columns
          .map((col) => {
            const cell = row[col];
            const cellStr = cell !== undefined && cell !== null ? cell.toString() : "";
            return `"${cellStr.replace(/"/g, '""')}"`;
          })
          .join(separator)
      )
      .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  link.click();
}

export default function PageMenus() {
  // Données initiales exemple - Mettez à jour ces prix si vous les utilisez initialement
  // Ou mieux : importez vos mockMenuItems si vous voulez les 100 éléments
  // import { mockMenuItems } from "@/lib/mock-menu";
  // const [menus, setMenus] = useState<MenuItem[]>(mockMenuItems);

  const [menus, setMenus] = useState<MenuItem[]>(mockMenuItems);

  // États modales et sélection
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  // Ouverture modale détail
  const openDetail = useCallback((menu: MenuItem) => {
    setSelectedMenu(menu);
    setIsDetailOpen(true);
  }, []);

  // Ouvrir modale ajout ou édition
  const openForm = useCallback((menu?: MenuItem) => {
    setEditingMenu(menu ?? null);
    setIsFormOpen(true);
  }, []);

  // Confirmation suppression
  const openDelete = useCallback((menu: MenuItem) => {
    setSelectedMenu(menu);
    setIsDeleteOpen(true);
  }, []);

  // Supprimer menu
  const confirmDelete = useCallback(() => {
    if (selectedMenu) {
      setMenus((prev) => prev.filter((m) => m.id !== selectedMenu.id));
    }
    setIsDeleteOpen(false);
    setSelectedMenu(null);
  }, [selectedMenu]);

  // Soumettre formulaire ajout/édition
  const onSubmitMenu = useCallback((menu: MenuItem) => {
    if (editingMenu) {
      setMenus((prev) => prev.map((m) => (m.id === menu.id ? menu : m)));
    } else {
      // Assurez-vous d'ajouter un ID unique pour le nouveau menu
      // Si vous n'utilisez pas mockMenuItems, utilisez uuidv4() ici
      setMenus((prev) => [...prev, { ...menu, id: (menus.length + 1).toString() }]);
    }
    setIsFormOpen(false);
    setEditingMenu(null);
  }, [editingMenu, menus.length]);

  // Colonnes DataTable
  const columns = useMemo(
    () => [
      {
        accessorKey: "libelle",
        header: "Libellé",
        cell: (info: any) => info.getValue(),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: (info: any) => (
          <Badge variant="outline" className="capitalize">
            {info.getValue()}
          </Badge>
        ),
      },
      {
        accessorKey: "prix",
        // --- MODIFICATION ICI : En-tête de la colonne et formatage ---
        header: "Prix (Ar)",
        cell: (info: any) => {
          const prix = info.getValue() as number;
          // Utilise toLocaleString pour un formatage adapté à la locale malagasy (ou française)
          // 'mg-MG' pour Madagascar, 'fr-FR' si vous voulez le format français standard (avec espace pour milliers)
          return `${prix.toLocaleString('fr-FR')} Ar`;
        },
      },
      {
        accessorKey: "disponible",
        header: "Disponible",
        cell: (info: any) =>
          info.getValue() ? (
            <Badge variant="default">Oui</Badge>
          ) : (
            <Badge variant="destructive">Non</Badge>
          ),
      },
      // --- NOUVEAU : Colonne Rating (optionnel, si vous voulez l'afficher dans la table) ---
      {
        accessorKey: "rating",
        header: "Note",
        cell: ({ row }: any) => {
          const rating = row.original.rating;
          // Assurez-vous d'importer StarRatingDisplay si vous voulez l'utiliser ici
          // import StarRatingDisplay from "@/components/ui/StarRatingDisplay";
          // return rating !== undefined && rating !== null ? <StarRatingDisplay rating={rating} size={14} /> : "-";
          return rating !== undefined && rating !== null ? `${rating.toFixed(1)} / 5` : "-";
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }: any) => {
          const menu = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => openDetail(menu)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openForm(menu)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => openDelete(menu)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [openDetail, openForm, openDelete]
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Gestion des Menus</h1>
          <p className="text-sm text-muted-foreground">Gérez les menus de votre restaurant</p>
        </div>
        <div className="flex items-center gap-2 space-x-2">
          <Button onClick={() => openForm()}>Ajouter un menu</Button>
          <Button onClick={() => exportToCsv("menus.csv", menus, ["id", "libelle", "description", "type", "prix", "disponible", "rating"])}>
            Export CSV
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={menus.filter((menu) =>
          Object.values(menu)
            .join(" ")
            .toLowerCase()
            .includes(globalFilter.toLowerCase())
        )}
        filterColumnId="libelle"
        filterPlaceholder="Filtrer par libellé..."
      />

      {/* Modale Détail */}
      <Dialog open={isDetailOpen} onOpenChange={() => setIsDetailOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du menu</DialogTitle>
          </DialogHeader>
          {selectedMenu && (
            <>
              {selectedMenu.imageUrl && (
                <img
                  src={selectedMenu.imageUrl}
                  alt={selectedMenu.libelle}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <p><strong>Libellé :</strong> {selectedMenu.libelle}</p>
              <p><strong>Description :</strong> {selectedMenu.description || "-"}</p>
              <p><strong>Type :</strong> {selectedMenu.type}</p>
              {/* --- MODIFICATION ICI : Affichage du prix en Ariary --- */}
              <p><strong>Prix :</strong> {selectedMenu.prix.toLocaleString('fr-FR')} Ar</p>
              <p><strong>Disponible :</strong> {selectedMenu.disponible ? "Oui" : "Non"}</p>
              <p><strong>Ingrédients :</strong> {selectedMenu.ingredients.join(", ")}</p>
              <p><strong>Tags :</strong> {(selectedMenu.tags || []).join(", ") || "-"}</p>
              <p><strong>Calories :</strong> {selectedMenu.calories ?? "-"}</p>
              <p><strong>Préparation (min) :</strong> {selectedMenu.preparationMinutes ?? "-"}</p>
              {/* --- NOUVEAU : Affichage du rating dans la modale --- */}
              {selectedMenu.rating !== undefined && selectedMenu.rating !== null && (
                <p><strong>Note :</strong> {selectedMenu.rating.toFixed(1)} / 5</p>
                // Ou si vous voulez les étoiles visuelles ici aussi:
                // <p className="flex items-center"><strong>Note :</strong> <StarRatingDisplay rating={selectedMenu.rating} size={16} className="ml-2" /></p>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => { openForm(selectedMenu); setIsDetailOpen(false); }}>
                  Modifier
                </Button>
                <Button variant="destructive" onClick={() => { openDelete(selectedMenu); setIsDetailOpen(false); }}>
                  Supprimer
                </Button>
                <Button onClick={() => setIsDetailOpen(false)}>Fermer</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modale Formulaire Ajout / Édition - AJOUT DU CHAMP RATING ET MODIFICATION PRIX*/}
      <Dialog open={isFormOpen} onOpenChange={() => setIsFormOpen(false)}>
        <DialogContent className="sm:max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMenu ? "Modifier un menu" : "Ajouter un menu"}</DialogTitle>
          </DialogHeader>
          <MenuForm
            defaultValues={editingMenu}
            onCancel={() => setIsFormOpen(false)}
            onSubmit={onSubmitMenu}
          />
        </DialogContent>
      </Dialog>

      {/* Modale Confirmation Suppression */}
      <Dialog open={isDeleteOpen} onOpenChange={() => setIsDeleteOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>Voulez-vous vraiment supprimer le menu <strong>{selectedMenu?.libelle}</strong> ?</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmDelete}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Formulaire simple pour menu (tu peux remplacer par react-hook-form + zod)
// Minimaliste, avec gestion locale d’état
function MenuForm({ defaultValues, onSubmit, onCancel }: {
  defaultValues?: MenuItem | null;
  onSubmit: (data: MenuItem) => void;
  onCancel: () => void;
}) {
  const [libelle, setLibelle] = useState(defaultValues?.libelle || "");
  const [description, setDescription] = useState(defaultValues?.description || "");
  const [imageUrl, setImageUrl] = useState(defaultValues?.imageUrl || "");
  const [type, setType] = useState(defaultValues?.type || "");
  const [ingredients, setIngredients] = useState(defaultValues?.ingredients.join(", ") || "");
  const [prix, setPrix] = useState(defaultValues?.prix.toString() || "0"); // Prix comme chaîne pour l'input
  const [disponible, setDisponible] = useState(defaultValues?.disponible || false);
  const [tags, setTags] = useState(defaultValues?.tags?.join(", ") || "");
  const [calories, setCalories] = useState(defaultValues?.calories?.toString() || "");
  const [preparationMinutes, setPreparationMinutes] = useState(defaultValues?.preparationMinutes?.toString() || "");
  const [rating, setRating] = useState(defaultValues?.rating?.toString() || ""); // NOUVEAU: État pour le rating

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      id: defaultValues?.id || Date.now().toString(), // Ou uuidv4() si vous l'importez ici
      libelle,
      description,
      imageUrl,
      type,
      ingredients: ingredients.split(",").map((i) => i.trim()).filter(Boolean),
      prix: parseFloat(prix) || 0, // Convertir en nombre avant de soumettre
      disponible,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      calories: calories ? parseInt(calories) : undefined,
      preparationMinutes: preparationMinutes ? parseInt(preparationMinutes) : undefined,
      rating: rating ? parseFloat(rating) : undefined, // NOUVEAU: Convertir en nombre
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[calc(50%-1rem)]">
          <label className="block text-sm font-medium mb-1">Libellé *</label>
          <Input
            type="text"
            required
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="flex-1 min-w-[calc(50%-1rem)]">
          <Label className="block text-sm font-medium mb-1">Type *</Label>
          <Input
            type="text"
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Ex: Entrée, Plat, Dessert"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border px-3 py-2"
            rows={3}
          />
        </div>
        <div className="w-full">
          <Label className="block text-sm font-medium mb-1">Image URL</Label>
          <Input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="flex-1 min-w-[calc(50%-1rem)]">
          {/* --- MODIFICATION ICI : Label du prix --- */}
          <Label className="block text-sm font-medium mb-1">Prix (Ar) *</Label>
          <Input
            type="number"
            required
            min={0}
            step={1} // Les prix en Ariary sont généralement des entiers
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="flex-1 min-w-[calc(50%-1rem)]">
            {/* NOUVEAU: Champ pour le rating */}
            <Label className="block text-sm font-medium mb-1">Note (1-5)</Label>
            <Input
              type="number"
              min={1}
              max={5}
              step={0.1} // Permet les décimales comme 3.5
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
        </div>
        <div className="flex-1 min-w-[calc(50%-1rem)] flex items-center pt-5">
          <input
            id="disponible"
            type="checkbox"
            checked={disponible}
            onChange={(e) => setDisponible(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="disponible" className="ml-2 select-none text-sm font-medium">Disponible</label>
        </div>
        <div className="w-full">
          <Label className="block text-sm font-medium mb-1">Ingrédients (séparés par des virgules)</Label>
          <Input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="w-full">
          <Label className="block text-sm font-medium mb-1">Tags (séparés par des virgules)</Label>
          <Input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="flex-1 min-w-[calc(50%-1rem)]">
          <Label className="block text-sm font-medium mb-1">Calories</Label>
          <Input
            type="number"
            min={0}
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="flex-1 min-w-[calc(50%-1rem)]">
          <Label className="block text-sm font-medium mb-1">Préparation (minutes)</Label>
          <Input
            type="number"
            min={0}
            value={preparationMinutes}
            onChange={(e) => setPreparationMinutes(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}