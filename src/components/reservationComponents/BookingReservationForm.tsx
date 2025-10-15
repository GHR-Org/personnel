"use client";

import React, { useState, useMemo } from "react";
import { format, startOfDay, addDays, addHours } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

// SHADCN UI
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

// ICONS
import { IconCalendar, IconPlus } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";

// CUSTOM COMPONENTS
import { ArticlesDataTable } from "./ArticlesDataTable";
import { RoomSelector } from "./RoomSelector";
import { ProductSelector } from "./ProduitSelector";

// ENUMS & HOOKS
import { ReservationStatut } from "@/lib/enum/ReservationStatus";
import { ModePaiment } from "@/lib/enum/ModePaiment";
import { ModeCheckin } from "@/lib/enum/ModeCheckin";
import { useEtablissementId } from "@/hooks/useEtablissementId";

// FORMS
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// === FORM SCHEMA (inchangé) ===
const ArticleItemSchema = z.object({
  id: z.string(),
  nom: z.string(),
  quantite: z.number().int().positive(),
  prix: z.number().positive(),
  total: z.number().positive(),
});

const arheeSchema = z.object({
  montant: z.number().min(0).optional(),
  date_paiement: z.string().optional(),
  mode_paiement: z.string().optional(),
  commentaire: z.string().optional(),
});

export const bookingFormSchema = z
  .object({
    date_arrivee: z.string().min(1),
    date_depart: z.string().min(1),
    duree: z.number().int().min(1),
    client_id: z.number(),
    nbr_adultes: z.number().int().min(1),
    nbr_enfants: z.number().int().min(0).optional(),
    status: z.nativeEnum(ReservationStatut),
    chambre_id: z.number().int().min(1),
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

  const handleAddArticle = (produit: any) => {
    const newArticle = {
      id: crypto.randomUUID(),
      nom: produit.nom,
      prix: produit.prix,
      quantite: 1,
      total: produit.prix,
    };
    const current = formValues.articles ?? [];
    setValue("articles", [...current, newArticle]);
    setShowProductSelector(false);
  };

  const onValidSubmit: SubmitHandler<BookingFormInputs> = (data) =>
    onSubmit(data);

  // === ANIMATIONS ===
  const fadeIn = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onValidSubmit)}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="relative space-y-8 p-8 rounded-3xl 
      bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl 
      border border-white/20 shadow-2xl
      transition hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.2)]"
    >
      {/* <motion.div variants={fadeIn} className="text-center mb-6">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Détails du séjour et paiement pour le client #{clientId}
        </p>
      </motion.div> */}

      {/* Section Séjour */}
      <motion.div
        variants={fadeIn}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="flex flex-col gap-2">
          <Label>Date d'arrivée</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                {formValues.date_arrivee
                  ? format(new Date(formValues.date_arrivee), "PPP", {
                      locale: fr,
                    })
                  : "Choisir..."}
                <IconCalendar size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={new Date(formValues.date_arrivee)}
                onSelect={(d) =>
                  setValue("date_arrivee", format(d!, "yyyy-MM-dd"))
                }
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Date de départ</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between">
                {formValues.date_depart
                  ? format(new Date(formValues.date_depart), "PPP", {
                      locale: fr,
                    })
                  : "Choisir..."}
                <IconCalendar size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={new Date(formValues.date_depart)}
                onSelect={(d) =>
                  setValue("date_depart", format(d!, "yyyy-MM-dd"))
                }
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Nombre de nuits</Label>
          <Input
            readOnly
            value={numberOfNights}
            className="text-center font-semibold"
          />
        </div>
      </motion.div>

      {/* Section Chambres */}
      <motion.div variants={fadeIn} className="space-y-4">
        <Label className="font-semibold text-lg">Chambres désirées</Label>
        <RoomSelector
          etablissementId={1}
          selectedRoomId={formValues.chambre_id}
          onSelectRoom={(id, price) => {
            setValue("chambre_id", id);
            setRoomPrice(price);
          }}
        />
      </motion.div>

      {/* Section Articles */}
      <motion.div variants={fadeIn} className="space-y-4">
        <Label className="font-semibold text-lg">Articles</Label>
        {showProductSelector ? (
          <ProductSelector
            etablissementId={etablissementId!}
            selectedProduitId={null}
            onSelectProduit={handleAddArticle}
          />
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowProductSelector(true)}
            className="hover:scale-[1.02] transition-transform"
          >
            <IconPlus className="mr-2" /> Ajouter un article
          </Button>
        )}
      </motion.div>
      {/* === Section Arhée === */}
      <motion.div
        variants={fadeIn}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl 
    bg-white/50 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 shadow-lg"
      >
        <h2 className="col-span-full text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Arhée
        </h2>

        <div className="flex flex-col gap-2">
          <Label>Montant attendu</Label>
          <Input
            value={`${arheeAttendu.toFixed(2)} Ar`}
            readOnly
            className="bg-white/30 dark:bg-gray-700/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="arhee.montant">Montant à attribuer (Ar)</Label>
          <Input
            type="number"
            {...register("arhee.montant", { valueAsNumber: true })}
            placeholder="0.00"
            className="bg-white/30 dark:bg-gray-700/30"
          />
          {errors.arhee?.montant && (
            <p className="text-sm font-medium text-red-500 mt-1">
              {errors.arhee.montant.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Date de paiement des Arhée</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !formValues.arhee?.date_paiement && "text-muted-foreground"
                )}
              >
                {formValues.arhee?.date_paiement
                  ? format(new Date(formValues.arhee.date_paiement), "PPP", {
                      locale: fr,
                    })
                  : "Choisir une date"}
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

        <div className="flex flex-col gap-2">
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

        <div className="col-span-full flex flex-col gap-2">
          <Label htmlFor="arhee.commentaire">Commentaire sur le paiement</Label>
          <Textarea
            {...register("arhee.commentaire")}
            placeholder="Ajouter un commentaire..."
            className="bg-white/30 dark:bg-gray-700/30"
          />
        </div>
      </motion.div>

      {/* === Section Statut & Check-in === */}
      <motion.div
        variants={fadeIn}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl 
    bg-white/50 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 shadow-lg"
      >
        <h2 className="col-span-full text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Statut et Check-in
        </h2>

        <div className="flex flex-col gap-2">
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

        <div className="flex flex-col gap-2">
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="code_checkin">Code Check-in</Label>
          <Input
            {...register("code_checkin")}
            placeholder="Code..."
            className="bg-white/30 dark:bg-gray-700/30"
          />
        </div>
      </motion.div>

      {/* Récapitulatif */}
      <motion.div
        variants={fadeIn}
        className="rounded-2xl bg-gradient-to-r from-blue-100/60 to-white/30 
        dark:from-gray-700/40 dark:to-gray-800/30 
        p-6 shadow-inner"
      >
        <h3 className="font-semibold text-lg mb-3">Récapitulatif</h3>
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>
            Chambre ({roomPrice.toFixed(2)} €) x {numberOfNights} nuit(s)
          </span>
          <span>{totalSejour.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Articles</span>
          <span>{articlesTotal.toFixed(2)} €</span>
        </div>
        <hr className="my-2 border-white/30" />
        <div className="flex justify-between font-bold text-lg text-blue-600 dark:text-blue-400">
          <span>Total</span>
          <span>{grandTotal.toFixed(2)} €</span>
        </div>
      </motion.div>

      {/* Boutons */}
      <motion.div
        variants={fadeIn}
        className="flex justify-end gap-3 pt-6 border-t border-white/20"
      >
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !isValid}
          className="px-6 text-white bg-blue-600 hover:bg-blue-700 shadow-md"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Confirmer"
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}
