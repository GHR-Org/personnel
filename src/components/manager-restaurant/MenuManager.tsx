// src/app/(manager)/manager/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil } from "lucide-react"; // Importez l'icône Pencil pour l'édition
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StarRatingDisplay from "@/components/ui/StarRatingDisplay";

import { MenuItem } from "@/types/MenuItem";
import { toast } from "sonner";
// Assurez-vous d'importer updatePlat en plus de createPlat
import {
  getPlatsByEtablissement,
  createPlat,
  updatePlat,
} from "@/func/api/plat/APIplat";
import { MenuItemForm } from "./MenuItemForm";
import { MenuItemFormValues } from "@/schemas/MenuItem";
import { IMAGE_URL } from "@/lib/constants/constant";
import Image from "next/image";
import { deletePlat } from "../../func/api/plat/APIplat";
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog";
import { useEtablissementId } from "@/hooks/useEtablissementId";
import { motion } from "framer-motion";

export default function MenuManager() {
  const ETABLISSEMENT_ID = useEtablissementId().etablissementId;

  const [openFormDialog, setOpenFormDialog] = useState(false); // Renommé pour clarté
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  // Nouvel état pour gérer le menu en cours d'édition (sera passé à MenuItemForm)
  const [menuToEdit, setMenuToEdit] = useState<MenuItemFormValues | undefined>(
    undefined
  );

  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [idplat, setIdPlat] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fonction pour ouvrir le formulaire en mode création
  const handleOpenCreateForm = () => {
    setMenuToEdit(undefined); // S'assurer que le formulaire est en mode création
    setOpenFormDialog(true);
  };
  const handleDelete = () => {
    try {
      deletePlat(idplat);
      toast.success(`Plat numéro ${idplat} supprimé avec succès`);
      setIsDetailModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.log("Erreur lors de la suppression :", err);
    }
  };

  // Fonction pour ouvrir le formulaire en mode édition
  const handleOpenEditForm = (menu: MenuItem) => {
    const formValues: MenuItemFormValues = {
      etablissement_id: menu.etablissement_id,
      libelle: menu.libelle,
      description: menu.description || "", // Assurez-vous d'avoir une chaîne vide si null/undefined
      image_url: menu.image_url || null, // Image peut être une URL (string) ici
      type: menu.type,
      ingredients: Array.isArray(menu.ingredients) ? menu.ingredients : [],
      prix: menu.prix,
      disponible: menu.disponible,
      tags: Array.isArray(menu.tags) ? menu.tags : [],
      calories: menu.calories,
      prep_minute: menu.prep_minute,
      note: menu.note,
      livrable : menu.livrable
      // L'ID est stocké dans l'état `menuToEdit` pour être utilisé par `handleSubmitMenu`
      // Il n'est pas directement un champ du formulaire `MenuItemFormValues` mais c'est l'ID du plat à modifier
      // On peut l'ajouter si `MenuItemFormValues` avait un champ `id` optionnel, ou le gérer ici.
    };
    setMenuToEdit(formValues);
    setSelectedMenu(menu); // Conserver le menu complet pour son ID
    setOpenFormDialog(true);
  };

  // Fonction générique pour la soumission du formulaire (création ou mise à jour)
  const handleSubmitMenu = async (formData: MenuItemFormValues) => {
    try {
      const payload: FormData = new FormData();

      payload.append("libelle", formData.libelle);
      if (formData.description)
        payload.append("description", formData.description);
      payload.append("type", formData.type);
      payload.append("prix", formData.prix.toString());
      payload.append("disponible", formData.disponible.toString());
      payload.append("livrable", formData.livrable.toString());

      payload.append("ingredients", JSON.stringify(formData.ingredients || []));
      payload.append("tags", JSON.stringify(formData.tags || []));

      if (formData.calories !== undefined && formData.calories !== null) {
        payload.append("calories", formData.calories.toString());
      }
      if (formData.prep_minute !== undefined && formData.prep_minute !== null) {
        payload.append("prep_minute", formData.prep_minute.toString());
      }
      if (formData.note !== undefined && formData.note !== null) {
        payload.append("note", formData.note.toString());
      }

      // Gestion de l'image:
      // Si c'est un File (nouvelle image sélectionnée), l'ajouter au payload
      if (formData.image_url instanceof File) {
        payload.append("image", formData.image_url);
      }
      // Si c'est une chaîne (URL d'image existante) et qu'on est en mode édition,
      // on ne l'envoie pas au backend si l'image n'a pas été modifiée.
      // Le backend gère la non-modification de l'image si le champ "image" est absent ou vide.

      payload.append("etablissement_id", ETABLISSEMENT_ID.toString());

      let responseMenu: MenuItem;

      if (selectedMenu && menuToEdit) {
        // Si `selectedMenu` et `menuToEdit` sont présents, c'est une modification
        // Assurez-vous que selectedMenu.id est défini pour la mise à jour
        if (selectedMenu.id === undefined || selectedMenu.id === null) {
          throw new Error("Impossible de mettre à jour : ID du plat manquant.");
        }
        responseMenu = await updatePlat(selectedMenu.id, payload);
        // Mettre à jour le menu dans la liste `menus`
        setMenus((prev) =>
          prev.map((menu) =>
            menu.id === responseMenu.id ? responseMenu : menu
          )
        );
      } else {
        // Sinon, c'est une création
        responseMenu = await createPlat(payload);
        setMenus((prev) => [...prev, responseMenu]);
        toast.success(
          `Le plat "${responseMenu.libelle}" a été ajouté avec succès !`
        );
      }

      setOpenFormDialog(false);
      setMenuToEdit(undefined); // Réinitialiser l'état du menu en édition après soumission
      setSelectedMenu(null); // Réinitialiser le menu sélectionné aussi
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Erreur lors de l'opération sur le plat:", error);
      toast.error("Échec de l'opération sur le plat. Veuillez réessayer.");
      // Garder la modale ouverte ou la fermer selon la préférence en cas d'erreur
      // setOpenFormDialog(false);
    }
  };

  const handleViewDetails = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setIdPlat(menu.id as number);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailModalOpen(false);
    setSelectedMenu(null);
  };

  useEffect(() => {
    const fetchMenus = async () => {
      setIsLoading(true);
      try {
        const fetchedMenus = await getPlatsByEtablissement(ETABLISSEMENT_ID);
        if (Array.isArray(fetchedMenus)) {
          const formattedMenus = fetchedMenus.map((menu) => ({
            ...menu,
            // Assurez-vous que ingredients et tags sont des tableaux, même si l'API les renvoie comme chaînes JSON
            ingredients:
              typeof menu.ingredients === "string"
                ? JSON.parse(menu.ingredients)
                : menu.ingredients,
            tags:
              typeof menu.tags === "string" ? JSON.parse(menu.tags) : menu.tags,
          }));
          setMenus(formattedMenus);
        } else {
          console.error(
            "L'API n'a pas renvoyé un tableau valide:",
            fetchedMenus
          );
          setMenus([]);
          toast.error("Format de données inattendu de l'API.");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des menus:", error);
        toast.error("Échec du chargement des menus.");
        setMenus([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenus();
  }, [ETABLISSEMENT_ID, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg text-gray-500">
        Chargement des menus...
      </div>
    );
  }

  return (
    <>
      {menus.length === 0 && !isLoading ? (
  // AUCUN MENU DISPONIBLE
  <div className="flex flex-col items-center justify-center text-center py-20 px-6">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center"
    >
      <Image
        src="/empty-menu.svg" // 💡 Mets ici une belle illustration SVG
        alt="Aucun menu"
        width={240}
        height={240}
        className="mb-6 opacity-80"
      />
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
        Aucun menu disponible
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
        Commencez à construire votre carte dès maintenant et faites découvrir vos plats à vos clients.
      </p>

      <Button
        onClick={handleOpenCreateForm}
        size="lg"
        className="flex items-center gap-2 px-6 py-3 text-base font-semibold shadow-lg hover:scale-105 transition-all duration-300"
      >
        <Plus className="w-5 h-5" />
        Ajouter un menu
      </Button>
    </motion.div>
  </div>
) : (
  // LISTE DES MENUS DISPONIBLES
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10"
  >
    {/* Bouton + Ajouter */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-2xl p-6 cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all duration-300"
      onClick={handleOpenCreateForm}
    >
      <Plus className="w-10 h-10 text-muted-foreground mb-3" />
      <span className="text-base font-semibold text-muted-foreground">
        Ajouter un menu
      </span>
    </motion.div>

    {/* Liste dynamique des menus */}
    {menus.map((menu) => (
      <motion.div
        key={menu.id}
        whileHover={{ scale: 1.03 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col overflow-hidden"
        onClick={() => handleViewDetails(menu)}
      >
        {menu.image_url && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={`${IMAGE_URL}/${menu.image_url}`}
              alt={menu.libelle}
              fill
              className="object-cover hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}

        <div className="p-5 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold leading-tight text-gray-800 dark:text-gray-100">
                {menu.libelle}
              </h3>
              {menu.type && (
                <Badge variant="secondary" className="text-xs">
                  {menu.type}
                </Badge>
              )}
            </div>

            {menu.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
                {menu.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-base font-medium mb-3">
            <span className="text-muted-foreground">Prix</span>
            <span className="text-primary font-semibold">
              {menu.prix?.toLocaleString("mg-MG", {
                style: "currency",
                currency: "MGA",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            {menu.note !== undefined && (
              <div className="flex items-center gap-1">
                <StarRatingDisplay rating={menu.note} />
                <span className="text-xs text-gray-400">
                  ({menu.note.toFixed(1)}/5)
                </span>
              </div>
            )}

            {menu.disponible ? (
              <Badge variant="default" className="bg-green-500 hover:bg-green-500/80">
                Disponible
              </Badge>
            ) : (
              <Badge variant="destructive">Indisponible</Badge>
            )}
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
)}


      {/* MenuItemForm pour la création et la modification */}
      <MenuItemForm
        open={openFormDialog}
        onClose={() => {
          setOpenFormDialog(false);
          setMenuToEdit(undefined); // Réinitialise l'état d'édition à la fermeture
          setSelectedMenu(null); // S'assure de nettoyer aussi le menu sélectionné si on ferme la form
        }}
        onSubmit={handleSubmitMenu} // Cette fonction gérera création ou modification
        initialData={menuToEdit} // Passe les données pour l'édition
        Etablissement_id={ETABLISSEMENT_ID}
      />

      {/* Modale de détails du menu */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMenu?.libelle}</DialogTitle>
          </DialogHeader>
          {selectedMenu && (
            <div className="flex flex-col md:flex-row gap-6 py-4">
              <div className="flex-1 space-y-4">
                {selectedMenu.image_url && (
                  <div className="relative h-64 w-full rounded-md overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${selectedMenu.image_url}`}
                      alt={selectedMenu.libelle}
                      sizes="100vw"
                      fill={true}
                      className="object-cover h-full w-full"
                    />
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  <strong>Description:</strong>{" "}
                  {selectedMenu.description || "Aucune description."}
                </p>
              </div>
              <div className="flex-1 grid gap-3">
                <p className="text-sm">
                  <strong>Type:</strong>{" "}
                  <Badge variant="secondary">{selectedMenu.type}</Badge>
                </p>
                <p className="text-sm">
                  <strong>Prix:</strong>{" "}
                  {selectedMenu.prix?.toLocaleString("mg-MG", {
                    style: "currency",
                    currency: "MGA",
                    minimumFractionDigits: 0,
                  })}
                </p>
                <p className="text-sm">
                  <strong>Statut:</strong>{" "}
                  {selectedMenu.disponible ? (
                    <Badge
                      variant="default"
                      className="bg-green-500 hover:bg-green-500/80"
                    >
                      Disponible
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Non disponible</Badge>
                  )}
                </p>
                {selectedMenu.ingredients && (
                  <div className="text-sm">
                    <strong>Ingrédients:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.isArray(selectedMenu.ingredients) &&
                        selectedMenu.ingredients.map((ing, idx) => (
                          <Badge key={idx} variant="outline">
                            {ing}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
                {selectedMenu.tags && (
                  <div className="text-sm">
                    <strong>Tags:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.isArray(selectedMenu.tags) &&
                        selectedMenu.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
                {selectedMenu.calories !== undefined &&
                  selectedMenu.calories !== null && (
                    <p className="text-sm">
                      <strong>Calories:</strong> {selectedMenu.calories} kcal
                    </p>
                  )}
                {selectedMenu.prep_minute !== undefined &&
                  selectedMenu.prep_minute !== null && (
                    <p className="text-sm">
                      <strong>Temps de préparation:</strong>{" "}
                      {selectedMenu.prep_minute} min
                    </p>
                  )}
                {selectedMenu.note !== undefined &&
                  selectedMenu.note !== null && (
                    <div className="text-sm flex items-center gap-2">
                      <strong>Note:</strong>{" "}
                      <StarRatingDisplay rating={selectedMenu.note} /> (
                      {selectedMenu.note.toFixed(1)}/5)
                    </div>
                  )}
              </div>
            </div>
          )}
          <DialogFooter className="sticky bottom-0 bg-background pb-2 mx-6 flex justify-end gap-2">
            {selectedMenu && ( // Bouton Modifier visible uniquement si un menu est sélectionné
              <Button
                variant="outline"
                onClick={() => {
                  handleOpenEditForm(selectedMenu); // Ouvre le formulaire en mode édition
                  setIsDetailModalOpen(false); // Ferme la modale de détails
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
            <Button variant="destructive" onClick={(() =>{
              setIsDetailModalOpen(false)
              setIsDeleteConfirmOpen(true)
            })}>
              {" "}
              Supprimer le nourriture
            </Button>
            <Button onClick={handleCloseDetails}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Elle supprimera définitivement ce
              congé de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                
                setIsDeleteConfirmOpen(false);
              }}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
