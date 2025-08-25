/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/BookingClientForm.tsx

"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

// Importez votre nouveau schéma Client
import { ClientSchema, ClientFormInputs } from "@/schemas/client";
import { Sexe } from "@/lib/enum/Civilite";
import { Loader2 } from "lucide-react";

interface BookingClientFormProps {
  onSubmit: (data: ClientFormInputs) => void;
  initialData?: Partial<ClientFormInputs> | null;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function BookingClientForm({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
}: BookingClientFormProps) {
  const enumSexe = Sexe;
  const form = useForm<ClientFormInputs>({
    resolver: zodResolver(ClientSchema),
    defaultValues: initialData || {},
  });
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-lg font-semibold">Informations du Client</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Champ Civilité */}
          <FormField
            control={form.control}
            name="Sexe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Civilité</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(enumSexe).map((val) => (
                      <SelectItem key={val} value={val}>
                        {val}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ Nom */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du client" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ Prénom */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom du client" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ E-mail */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ Téléphone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="0123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ Adresse */}
          <FormField
            control={form.control}
            name="adresse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="123 Rue de la Paix" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ Ville */}
          <FormField
            control={form.control}
            name="ville"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input placeholder="Paris" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Champ Pays */}
          <FormField
            control={form.control}
            name="pays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays</FormLabel>
                <FormControl>
                  <Input placeholder="France" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Suivant
        </Button>
        </div>
      </form>
    </Form>
  );
}
