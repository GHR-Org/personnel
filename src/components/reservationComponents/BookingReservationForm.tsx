/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { format, startOfDay, addDays, addHours } from "date-fns";
import { fr } from "date-fns/locale";

// Composants Shadcn UI
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Icônes et utilitaires
import { IconCalendar, IconPlus } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";

// Les composants qui restent les mêmes
import { ArticlesDataTable } from "./ArticlesDataTable";
import { RoomSelector } from "./RoomSelector";
import { ProductSelector } from "./ProduitSelector";

// Les Types et Enum
import { ReservationStatut } from "@/lib/enum/ReservationStatus";
import { ModePaiment } from "@/lib/enum/ModePaiment";
import { ModeCheckin } from "@/lib/enum/ModeCheckin";
import { useEtablissementId } from "@/hooks/useEtablissementId";

// IMPORTS pour React Hook Form et Zod
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// DÉFINITION DU SCHÉMA AVEC ZOD (le même que celui de l'étape 2)
const ArticleItemSchema = z.object({
  id: z.string(),
  nom: z.string(),
  quantite: z
    .number()
    .int()
    .positive("La quantité doit être un nombre positif."),
  prix: z.number().positive("Le prix doit être un nombre positif."),
  total: z.number().positive("Le total doit être un nombre positif."),
});

const arheeSchema = z.object({
  montant: z.number().min(0, "Le montant ne peut pas être négatif.").optional(),
  date_paiement: z.string().optional(),
  mode_paiement: z.string().optional(),
  commentaire: z.string().optional(),
});
export type ArticleItem = z.infer<typeof ArticleItemSchema>;

export const bookingFormSchema = z
  .object({
    date_arrivee: z.string().min(1, "La date d'arrivée est requise."),
    date_depart: z.string().min(1, "La date de départ est requise."),
    duree: z.number().int().min(1, "La durée doit être d'au moins 1 nuit."),
    client_id: z.number(),
    nbr_adultes: z.number().int().min(1, "Il doit y avoir au moins 1 adulte."),
    nbr_enfants: z.number().int().min(0).optional(),
    status: z.nativeEnum(ReservationStatut),
    chambre_id: z.number().int().min(1, "Veuillez sélectionner une chambre."),
    mode_checkin: z.nativeEnum(ModeCheckin),
    code_checkin: z.string().optional(),
    articles: z.array(ArticleItemSchema).default([]),
    arhee: arheeSchema.optional(),
  })
  .refine((data) => new Date(data.date_depart) > new Date(data.date_arrivee), {
    message: "La date de départ doit être après la date d'arrivée.",
    path: ["date_depart"],
  });

type BookingFormInputs = z.infer<typeof bookingFormSchema>;

interface BookingReservationFormProps {
  clientId: number;
  initialData: Partial<BookingFormInputs> | null;
  onSubmit: (data: BookingFormInputs) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function BookingReservationForm({
  clientId,
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}: BookingReservationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<BookingFormInputs>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      client_id: clientId,
      date_arrivee:
        initialData?.date_arrivee ?? format(new Date(), "yyyy-MM-dd"),
      date_depart:
        initialData?.date_depart ??
        format(addDays(new Date(), 1), "yyyy-MM-dd"),
      duree: initialData?.duree ?? 1,
      nbr_adultes: initialData?.nbr_adultes ?? 1,
      nbr_enfants: initialData?.nbr_enfants ?? 0,
      status: initialData?.status ?? ReservationStatut.EN_ATTENTE,
      chambre_id: initialData?.chambre_id ?? 1,
      mode_checkin: initialData?.mode_checkin ?? ModeCheckin.MANUELLE,
      code_checkin: initialData?.code_checkin ?? "",
      articles: initialData?.articles ?? [],
      arhee: {
        montant: initialData?.arhee?.montant ?? 0,
        date_paiement:
          initialData?.arhee?.date_paiement ??
          format(addHours(new Date(), 24), "yyyy-MM-dd"),
        mode_paiement: initialData?.arhee?.mode_paiement ?? undefined,
        commentaire: initialData?.arhee?.commentaire ?? "",
      },
    },
  });

  const [showProductSelector, setShowProductSelector] = useState(false);
  const [roomPrice, setRoomPrice] = useState<number>(0);
  const { etablissementId } = useEtablissementId();

  // On écoute les valeurs des champs pour les calculs
  const formValues = watch();

  const numberOfNights = useMemo(() => {
    if (formValues.date_arrivee && formValues.date_depart) {
      const start = startOfDay(new Date(formValues.date_arrivee));
      const end = startOfDay(new Date(formValues.date_depart));
      if (end <= start) return 0;
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setValue("duree", nights);
      return nights;
    }
    return 0;
  }, [formValues.date_arrivee, formValues.date_depart, setValue]);

  const articlesTotal = useMemo(() => {
    return (formValues.articles || []).reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
  }, [formValues.articles]);

  const totalSejour = roomPrice * numberOfNights;
  const grandTotal = totalSejour + articlesTotal;
  const arheeAttendu = grandTotal > 0 ? grandTotal / 2 : 0;

  // Fonctions de gestion des articles, adaptées pour utiliser setValue
  const handleAddArticle = (produit: any) => {
    const newArticle: ArticleItem = {
      id: crypto.randomUUID(),
      nom: produit.nom,
      prix: produit.prix,
      quantite: 1,
      total: produit.prix,
    };
    const currentArticles = formValues.articles ?? [];
    setValue("articles", [...currentArticles, newArticle]);
    setShowProductSelector(false);
  };

  const handleRemoveArticle = (idToRemove: string) => {
    const updatedArticles = (formValues.articles || []).filter(
      (article) => article.id !== idToRemove
    );
    setValue("articles", updatedArticles);
  };

  const handleQuantityChange = (idToUpdate: string, newQuantity: number) => {
    const updatedArticles = (formValues.articles || []).map((article) =>
      article.id === idToUpdate
        ? {
            ...article,
            quantite: Math.max(1, newQuantity),
            total: Math.max(1, newQuantity) * article.prix,
          }
        : article
    );
    setValue("articles", updatedArticles);
  };

  const handleSelectRoom = (roomId: number, price: number) => {
    setValue("chambre_id", roomId);
    setRoomPrice(price);
  };

  const onValidSubmit: SubmitHandler<BookingFormInputs> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6">
      {/*... le reste de ton code JSX, en remplaçant les props "value" et "onChange" par "register" */}
      {/* et en utilisant l'objet "errors" pour afficher les messages d'erreur */}
      <h2 className="text-lg font-semibold">Détails de la réservation</h2>
      <p className="text-sm text-gray-500">
        Client ID sélectionné : **`{clientId}`**
      </p>

      {/* ... (Section Séjour) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border p-4 rounded-lg">
        <h2 className="col-span-full text-lg font-semibold mb-2">Séjour</h2>
        <div>
          <Label htmlFor="date_arrivee">Date d&apos;arrivée</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[140px] pl-3 text-left font-normal",
                  !formValues.date_arrivee && "text-muted-foreground"
                )}
              >
                {formValues.date_arrivee ? (
                  format(new Date(formValues.date_arrivee), "PPP", {
                    locale: fr,
                  })
                ) : (
                  <span>Choisissez une date</span>
                )}
                <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  formValues.date_arrivee
                    ? new Date(formValues.date_arrivee)
                    : undefined
                }
                onSelect={(date) =>
                  setValue(
                    "date_arrivee",
                    date ? format(date, "yyyy-MM-dd") : ""
                  )
                }
                disabled={(date) => startOfDay(date) < startOfDay(new Date())}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
          {errors.date_arrivee && (
            <p className="text-sm font-medium text-red-500 mt-1">
              {errors.date_arrivee.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="date_depart">Date de départ</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[140px] pl-3 text-left font-normal",
                  !formValues.date_depart && "text-muted-foreground"
                )}
              >
                {formValues.date_depart ? (
                  format(new Date(formValues.date_depart), "PPP", {
                    locale: fr,
                  })
                ) : (
                  <span>Choisissez une date</span>
                )}
                <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  formValues.date_depart
                    ? new Date(formValues.date_depart)
                    : undefined
                }
                onSelect={(date) =>
                  setValue(
                    "date_depart",
                    date ? format(date, "yyyy-MM-dd") : ""
                  )
                }
                disabled={(date) =>
                  startOfDay(date) <=
                  startOfDay(new Date(formValues.date_arrivee))
                }
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
          {errors.date_depart && (
            <p className="text-sm font-medium text-red-500 mt-1">
              {errors.date_depart.message}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <Label>Nombre de nuits</Label>
          <Input value={numberOfNights} readOnly className="w-[100px]" />
        </div>
        <div>
          <Label htmlFor="nbr_adultes">Nombre d&apos;adultes</Label>
          <Input
            type="number"
            {...register("nbr_adultes", { valueAsNumber: true })}
            className="w-[80px]"
          />
          {errors.nbr_adultes && (
            <p className="text-sm font-medium text-red-500 mt-1">
              {errors.nbr_adultes.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="nbr_enfants">Nombre d&apos;enfants</Label>
          <Input
            type="number"
            {...register("nbr_enfants", { valueAsNumber: true })}
            className="w-[80px]"
          />
        </div>
      </div>

      {/* ... (Sections Articles, Récapitulatif, etc.) */}

      {/* Section Chambres désirées */}
      <div className="w-full flex flex-row flex-wrap gap-4 border p-4 rounded-lg">
        <h2 className="col-span-full text-lg font-semibold mb-2">
          Chambres désirées
        </h2>
        <div>
          <Label className="sr-only">Sélectionner une chambre</Label>
          <RoomSelector
            etablissementId={1}
            selectedRoomId={formValues.chambre_id}
            onSelectRoom={(roomId, price) => {
              handleSelectRoom(roomId, price);
            }}
          />
          {errors.chambre_id && (
            <p className="text-sm font-medium text-red-500 mt-1">
              {errors.chambre_id.message}
            </p>
          )}
        </div>
        <div className="col-span-full flex gap-2">
          <Button type="button" variant="outline">
            <span className="font-bold">F3</span> - Chambres
          </Button>
          <Button type="button" variant="outline">
            <span className="font-bold">F4</span> - Rooming
          </Button>
        </div>
      </div>

      {/* Section Articles */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Articles</h2>
        {showProductSelector ? (
          <div className="space-y-4">
            <ProductSelector
              etablissementId={etablissementId!}
              selectedProduitId={null}
              onSelectProduit={handleAddArticle}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowProductSelector(false)}
            >
              Annuler l&apos;ajout
            </Button>
          </div>
        ) : (
          <>
            {(formValues.articles || []).length > 0 && (
              <ArticlesDataTable
                value={formValues.articles}
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

      {/* Section Récapitulatif des coûts */}
      <div className="border p-4 rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Récapitulatif des coûts</h2>
        <div className="flex justify-between items-center text-gray-700">
          <span>
            Prix de la chambre ({roomPrice.toFixed(2)} €) x {numberOfNights}{" "}
            nuit(s)
          </span>
          <span className="font-medium">{totalSejour.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <span>Articles additionnels</span>
          <span className="font-medium">{articlesTotal.toFixed(2)} €</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between items-center text-lg font-bold text-gray-900">
          <span>Total de la réservation</span>
          <span>{grandTotal.toFixed(2)} €</span>
        </div>
      </div>

      {/* Section Arhée */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
        <h2 className="col-span-full text-lg font-semibold mb-2">arhee</h2>
        <div>
          <Label>Montant attendu</Label>
          <Input value={`${arheeAttendu.toFixed(2)} Ar`} readOnly />
        </div>
        <div>
          <Label htmlFor="arhee.montant">Montant à attribuer (Ar)</Label>
          <Input
            type="number"
            {...register("arhee.montant", { valueAsNumber: true })}
            placeholder="0.00"
          />
          {errors.arhee?.montant && (
            <p className="text-sm font-medium text-red-500 mt-1">
              {errors.arhee.montant.message}
            </p>
          )}
        </div>
        <div>
          <Label>Date de paiement des arhee</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[200px] pl-3 text-left font-normal",
                  !formValues.arhee?.date_paiement && "text-muted-foreground"
                )}
              >
                {formValues.arhee?.date_paiement ? (
                  format(new Date(formValues.arhee.date_paiement), "PPP", {
                    locale: fr,
                  })
                ) : (
                  <span>Choisir une date</span>
                )}
                <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  formValues.arhee?.date_paiement
                    ? new Date(formValues.arhee.date_paiement)
                    : undefined
                }
                onSelect={(date) =>
                  setValue(
                    "arhee.date_paiement",
                    date ? format(date, "yyyy-MM-dd") : ""
                  )
                }
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="arhee.mode_paiement">Mode de paiement</Label>
          <Select
            value={formValues.arhee?.mode_paiement ?? ""}
            onValueChange={(value) => setValue("arhee.mode_paiement", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un mode de paiement" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ModePaiment).map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-full">
          <Label htmlFor="arhee.commentaire">Commentaire sur le paiement</Label>
          <Textarea
            {...register("arhee.commentaire")}
            placeholder="Ajouter un commentaire..."
          />
        </div>
      </div>

      {/* Section Statut et Check-in */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
        <h2 className="col-span-full text-lg font-semibold mb-2">
          Statut et Check-in
        </h2>
        <div>
          <Label htmlFor="status">Statut de la réservation</Label>
          <Select
            value={formValues.status ?? ""}
            onValueChange={(value) =>
              setValue("status", value as ReservationStatut)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ReservationStatut).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="mode_checkin">Mode de Check-in</Label>
          <Select
            value={formValues.mode_checkin ?? ""}
            onValueChange={(value) =>
              setValue("mode_checkin", value as ModeCheckin)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un mode" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ModeCheckin).map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="code_checkin">Code Check-in</Label>
          <Input {...register("code_checkin")} placeholder="Code..." />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Précédent
        </Button>
        <Button type="submit" disabled={isLoading || !isValid}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Sauvegarder la réservation"
          )}
        </Button>
      </div>
    </form>
  );
}
