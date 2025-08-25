/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { RapportStatut, RapportFormData, rapportFormSchema } from "@/schemas/rapport"
import { rapportSchema } from "@/schemas/rapport"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"

interface DialogRapportProps {
  open: boolean
  setOpen: (val: boolean) => void
  onSubmit: (data: RapportFormData) => void
  auteur?: string // Nom de l'utilisateur connecté (optionnel)
  role?: string   // Rôle du personnel (ex: "Réceptionniste", "Cuisinier", etc.)
}

export function DialogRapport({ open, setOpen, onSubmit, auteur = "", role = "" }: DialogRapportProps) {
  const form = useForm<RapportFormData>({
    resolver: zodResolver(rapportFormSchema),
    defaultValues: {
      auteur,
      role,
      contenu: "",
      statut: RapportStatut.BROUILLON,
    },
  })

  function handleFormSubmit(data: RapportFormData) {
    onSubmit(data)
    form.reset() // réinitialise le formulaire
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Écrire un nouveau rapport</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contenu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez ici votre rapport..."
                      rows={6}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(RapportStatut).map((statut) => (
                          <SelectItem key={statut} value={statut}>
                            {statut.charAt(0).toUpperCase() + statut.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Envoyer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
