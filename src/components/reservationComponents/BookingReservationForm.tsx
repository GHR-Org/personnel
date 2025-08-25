/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/BookingReservationForm.tsx

"use client";

import * as React from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfDay, addDays, addHours } from "date-fns";
import { fr } from "date-fns/locale";

// Mise à jour de l'import pour le schéma Zod et les types
import {
  BookingManuelSchema,
  BookingFormInputs,
  ArrhesSchema,
} from "@/schemas/reservation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { IconCalendar, IconPlus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ArticlesDataTable } from "./ArticlesDataTable";
import { ReservationStatut } from "@/lib/enum/ReservationStatus";
import { ModePaiment } from "@/lib/enum/ModePaiment";
import { ModeCheckin } from "@/lib/enum/ModeCheckin";
import { RoomSelector } from "./RoomSelector";
import { ProductSelector } from "./ProduitSelector";
import { Produit } from "@/types/Produit";
import { ArticleItem } from "@/types/reservation";
import { Loader2 } from "lucide-react";

interface BookingReservationFormProps {
  clientId: number | undefined;
  initialData?: Partial<BookingFormInputs> | null;
  onSubmit: (data: BookingFormInputs) => void;
  onBack: () => void;
  onClose?: () => void;
  isLoading?: boolean;
}

export function BookingReservationForm({
  clientId,
  initialData,
  onSubmit,
  onBack,
  onClose,
  isLoading = false,
}: BookingReservationFormProps) {
  const [showProductSelector, setShowProductSelector] =
    React.useState(false);
  const [etablissementId, setEtablissementId] = React.useState(1);

  const [roomPrice, setRoomPrice] = React.useState<number>(0);

  const enumModePaiement = ModePaiment;

  const form = useForm<Partial<BookingFormInputs>>({
    resolver: zodResolver(BookingManuelSchema),
    defaultValues: React.useMemo(() => {
      const today = new Date();
      const todayYYYYMMDD = format(today, "yyyy-MM-dd");
      
      const paymentDate = addHours(today, 24); // Date de paiement = 24h après la réservation
      const paymentDateYYYYMMDD = format(paymentDate, "yyyy-MM-dd");

      const baseDefaults: Partial<BookingFormInputs> = {
        id: initialData?.id || crypto.randomUUID(),
        date_arrivee: todayYYYYMMDD,
        date_depart: format(addDays(today, 1), "yyyy-MM-dd"),
        duree: 1,
        nbr_adultes: 1,
        nbr_enfants: 0,
        status: ReservationStatut.EN_ATTENTE,
        chambre_id: 0,
        mode_checkin: ModeCheckin.MANUELLE,
        code_checkin: "",
        articles: [],
        arrhes: {
          montant: 0,
          date_paiement: paymentDateYYYYMMDD, // Utilisation de la date calculée
          mode_paiement: undefined,
          commentaire: "",
        },
      };

      if (initialData) {
        return {
          ...baseDefaults,
          ...initialData,
          arrhes: {
            ...baseDefaults.arrhes,
            ...initialData.arrhes,
          },
          date_arrivee: initialData.date_arrivee || todayYYYYMMDD,
          date_depart:
            initialData.date_depart || format(addDays(today, 1), "yyyy-MM-dd"),
        };
      }
      return baseDefaults;
    }, [initialData]),
    mode: "onTouched",
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "articles",
  });

  const watchedRoomId = form.watch("chambre_id");
  const watchedArticles = form.watch("articles");
  const startDateValue = form.watch("date_arrivee");
  const endDateValue = form.watch("date_depart");

  // Calcule le nombre de nuits
  const numberOfNights = React.useMemo(() => {
    if (startDateValue && endDateValue) {
      const start = startOfDay(new Date(startDateValue));
      const end = startOfDay(new Date(endDateValue));

      if (end <= start) {
        form.setValue("date_depart", startDateValue);
        return 0;
      }
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  }, [startDateValue, endDateValue, form]);

  // Calcule le prix total des articles
  const articlesTotal = React.useMemo(() => {
    if (!watchedArticles || watchedArticles.length === 0) {
      return 0;
    }
    return watchedArticles.reduce((sum, item) => sum + (item.total || 0), 0);
  }, [watchedArticles]);

  // Mettre à jour le total du séjour dès que le prix de la chambre ou le nombre de nuits change
  React.useEffect(() => {
    form.setValue("duree", numberOfNights);
  }, [numberOfNights, form]);

  const totalSejour = roomPrice * numberOfNights;

  // Calcule le grand total de la réservation
  const grandTotal = totalSejour + articlesTotal;

  // Calcule le montant des arrhes attendu
  const arrhesAttendu = grandTotal > 0 ? grandTotal / 2 : 0;
  
  // Fonction pour gérer la sélection de la chambre et mettre à jour le prix
  const handleSelectRoom = (roomId: number, price: number) => {
    form.setValue("chambre_id", roomId);
    setRoomPrice(price);
  };
  
  const handleAddArticle = (produit: Produit) => {
    const newArticle: ArticleItem = {
      nom: produit.nom,
      prix: produit.prix,
      quantite: 1,
      total: produit.prix,
    };
    append(newArticle);
    setShowProductSelector(false);
  };

  const handleRemoveArticle = (idToRemove: string) => {
    const index = fields.findIndex((article) => article.id === idToRemove);
    if (index !== -1) {
      remove(index);
    }
  };

  const handleQuantityChange = (idToUpdate: string, newQuantity: number) => {
    const index = fields.findIndex((article) => article.id === idToUpdate);
    if (index !== -1) {
      const articleToUpdate = fields[index];
      const updatedQuantity = Math.max(1, newQuantity);
      update(index, {
        ...articleToUpdate,
        quantite: updatedQuantity,
        total: updatedQuantity * articleToUpdate.prix,
      });
    }
  };

  const handleShowSelector = () => {
    setShowProductSelector(true);
  };

  const handleHideSelector = () => {
    setShowProductSelector(false);
  };

  const onSubmitHandler: SubmitHandler<Partial<BookingFormInputs>> = (data) => {
    if (!clientId) {
      console.error("L'ID client est manquant.");
      return;
    }

    const finalData = {
      ...data,
      client_id: clientId,
      date_arrivee: data.date_arrivee!,
      date_depart: data.date_depart!,
      duree: data.duree!,
      nbr_adultes: data.nbr_adultes!,
      chambre_id: data.chambre_id!,
      articles: data.articles,
      arrhes: data.arrhes,
      status: data.status,
      mode_checkin: data.mode_checkin,
      // Ajout de la valeur par défaut pour les arrhes si le champ n'est pas rempli
      arrhes: {
        ...data.arrhes,
        montant: data.arrhes?.montant || 0,
      }
    };
    
    onSubmit(finalData as BookingFormInputs);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6">
        <h2 className="text-lg font-semibold">Détails de la réservation</h2>
        <p className="text-sm text-gray-500">
          Client ID sélectionné : **`{clientId}`**
        </p>

        {/* Section Séjour */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border p-4 rounded-lg">
          <h2 className="col-span-full text-lg font-semibold mb-2">Séjour</h2>
          <FormField
            control={form.control}
            name="date_arrivee"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date d&apos;arrivée</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[140px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP", { locale: fr })
                        ) : (
                          <span>Choisissez une date</span>
                        )}
                        <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      disabled={(date) =>
                        startOfDay(date) < startOfDay(new Date())
                      }
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date_depart"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de départ</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[140px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP", { locale: fr })
                        ) : (
                          <span>Choisissez une date</span>
                        )}
                        <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      disabled={(date) => {
                        if (!startDateValue) {
                          return startOfDay(date) < startOfDay(new Date());
                        }
                        return (
                          startOfDay(date) <=
                          startOfDay(new Date(startDateValue))
                        );
                      }}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Nombre de nuits</FormLabel>
            <Input value={numberOfNights} readOnly className="w-[100px]" />
          </FormItem>
          <FormField
            control={form.control}
            name="nbr_adultes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre d&apos;adultes</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    min={1}
                    className="w-[80px]"
                    onChange={(event) =>
                      field.onChange(parseInt(event.target.value, 10) || 1)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nbr_enfants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre d&apos;enfants</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    min={0}
                    className="w-[80px]"
                    onChange={(event) =>
                      field.onChange(parseInt(event.target.value, 10) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section Chambres désirées */}
        <div className=" w-full flex flex-row flex-wrap gap-4 border p-4 rounded-lg">
          <h2 className="col-span-full text-lg font-semibold mb-2">
            Chambres désirées
          </h2>
          <FormField
            control={form.control}
            name="chambre_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">
                  Sélectionner une chambre
                </FormLabel>
                <FormControl>
                  <RoomSelector
                    etablissementId={etablissementId}
                    selectedRoomId={field.value ?? null}
                    onSelectRoom={handleSelectRoom}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                etablissementId={etablissementId}
                selectedProduitId={null}
                onSelectProduit={handleAddArticle}
              />
              <Button type="button" variant="outline" onClick={handleHideSelector}>
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
                onClick={handleShowSelector}
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
            <span>Prix de la chambre ({roomPrice.toFixed(2)} €) x {numberOfNights} nuit(s)</span>
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
        
        {/* Section Arrhes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
          <h2 className="col-span-full text-lg font-semibold mb-2">Arrhes</h2>
          <FormItem>
            <FormLabel>Montant attendu</FormLabel>
            <Input value={`${arrhesAttendu.toFixed(2)} Ar`} readOnly />
          </FormItem>
          <FormField
            control={form.control}
            name="arrhes.montant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant à attribuer (Ar)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(event) => {
                      field.onChange(
                        event.target.value === "" ? 0 : parseFloat(event.target.value)
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arrhes.date_paiement"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de paiement des arrhes</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[200px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arrhes.mode_paiement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mode de paiement</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un mode de paiement" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(enumModePaiement).map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arrhes.commentaire"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Commentaire sur le paiement</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ajouter un commentaire..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section Statut et Check-in */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
          <h2 className="col-span-full text-lg font-semibold mb-2">
            Statut et Check-in
          </h2>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut de la réservation</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ReservationStatut).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mode_checkin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mode de Check-in</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ModeCheckin).map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code_checkin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code Check-in</FormLabel>
                <FormControl>
                  <Input placeholder="Code..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onBack} >
            Précédent
          </Button>
          <Button type="submit" disabled={isLoading}>
            { isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sauvegarder la réservation
          </Button>
        </div>
      </form>
    </Form>
  );
}