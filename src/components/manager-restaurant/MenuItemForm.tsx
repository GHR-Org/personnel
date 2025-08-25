// src/app/(manager)/manager/MenuItemForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuItemSchema, MenuItemFormValues } from "@/schemas/MenuItem"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "@/components/ImageUpload";

interface Props {
  open: boolean;
  Etablissement_id: number;
  onClose: () => void;
  onSubmit: (data: MenuItemFormValues) => void;
  initialData?: MenuItemFormValues;
  
}

export function MenuItemForm({ open, onClose, onSubmit, initialData, Etablissement_id }: Props) {
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    // Utiliser une fonction pour defaultValues pour s'assurer que Etablissement_id est toujours disponible
    // et que les valeurs par défaut des champs numériques optionnels sont cohérentes.
    defaultValues: initialData || {
      etablissement_id: Etablissement_id, // Initialise ici avec la prop
      libelle: "",
      description: "",
      image_url: null,
      type: "Boisson",
      ingredients: [],
      prix: 0,
      disponible: true,
      tags: [],
      calories: undefined, // Consistant avec le transform de Zod
      prep_minute: undefined, // Consistant avec le transform de Zod
      note: undefined, // Consistant avec le transform de Zod
    },
  });

  const [ingredientInput, setIngredientInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Réinitialiser le formulaire lorsque la modale s'ouvre ou initialData change
  useEffect(() => {
    if (open) {
      form.reset(initialData || {
        etablissement_id: Etablissement_id, // Assurez-vous que l'ID est toujours défini à la réinitialisation
        libelle: "",
        description: "",
        image_url: null,
        type: "Boisson",
        ingredients: [],
        prix: 0,
        disponible: true,
        tags: [],
        calories: undefined, // Utiliser undefined pour un champ optionnel/nullable vide
        prep_minute: undefined,
        note: undefined,
      });
      setIngredientInput("");
      setTagInput("");
    }
  }, [open, initialData, Etablissement_id, form]); // Ajouter Etablissement_id aux dépendances

  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed) {
      const current = form.getValues("ingredients") || []; // Utiliser || [] pour garantir un tableau
      form.setValue("ingredients", [...current, trimmed], { shouldValidate: true });
      setIngredientInput("");
    }
  };

  const removeIngredient = (indexToRemove: number) => {
    const current = form.getValues("ingredients") || [];
    form.setValue(
      "ingredients",
      current.filter((_, index) => index !== indexToRemove),
      { shouldValidate: true }
    );
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed) {
      const current = form.getValues("tags") || []; // Utiliser || [] pour garantir un tableau
      form.setValue("tags", [...current, trimmed], { shouldValidate: true });
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    const current = form.getValues("tags") || [];
    form.setValue(
      "tags",
      current.filter((_, index) => index !== indexToRemove),
      { shouldValidate: true }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-xl md:max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier un menu" : "Nouveau menu"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="libelle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Libellé</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom du plat" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FastFood">FastFood</SelectItem>
                        <SelectItem value="Boisson">Boisson</SelectItem>
                        <SelectItem value="Dessert">Dessert</SelectItem>
                        <SelectItem value="Entrée">Entrée</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Description optionnelle"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image du plat</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Ingrédients</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addIngredient();
                      }
                    }}
                    placeholder="Ajouter un ingrédient"
                  />
                  <Button
                    type="button"
                    onClick={addIngredient}
                    size="icon"
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(form.watch("ingredients") || []).map((ing, i) => (
                    <Badge
                      key={ing + i}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {ing}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeIngredient(i)}
                      />
                    </Badge>
                  ))}
                </div>
                {/* Il n'y a pas de FormField autour de cette section, donc pas de FormMessage */}
                {/* Si vous voulez des messages de validation pour les tableaux, utilisez useFieldArray */}
              </FormItem>

              <FormItem>
                <FormLabel>Tags</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Ajouter un tag"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    size="icon"
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(form.watch("tags") || []).map((tag, i) => (
                    <Badge
                      key={tag + i}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(i)}
                      />
                    </Badge>
                  ))}
                </div>
                {/* De même, pas de FormField, donc pas de FormMessage par défaut */}
              </FormItem>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="prix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (Ar)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories (kcal)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        // Gérer les valeurs vides pour les champs numériques optionnels
                        value={
                          field.value === undefined || field.value === null
                            ? ""
                            : field.value
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined // Envoyer undefined si le champ est vide
                              : parseInt(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prep_minute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temps de préparation (min)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        // Gérer les valeurs vides
                        value={
                          field.value === undefined || field.value === null
                            ? ""
                            : field.value
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseInt(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (1-5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        // Changez step="0.1" à step="1" si votre schéma Zod attend un entier
                        // Sinon, ajustez le schéma Zod pour z.number().min(1).max(5) sans .int()
                        step="1" // Correction ici, pour correspondre à z.number().int()
                        min="1"
                        max="5"
                        {...field}
                        // Gérer les valeurs vides
                        value={
                          field.value === undefined || field.value === null
                            ? ""
                            : field.value
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value) // Garder parseFloat si le step est 0.1
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="disponible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Disponible ?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {initialData ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}