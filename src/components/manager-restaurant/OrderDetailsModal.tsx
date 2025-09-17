/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/manager-restaurant/OrderDetailsModal.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Commande, StatusComd } from "./MobileOrderTracker";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/func/api/personnel/apipersonnel";
import { Loader2, Trash2, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { MenuItem } from "@/types/MenuItem";
import { getPlatByIdPlat } from "@/func/api/plat/APIplat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Types pour les actions API
import {
  deleteCommande,
  updateCommandeStatus,
} from "@/func/api/commande/APICommande";
import { getClientById } from "@/func/api/clients/apiclient";
import { Client } from "@/types/client";

// Fonction pour déterminer la couleur du statut
const getStatusColor = (status: StatusComd) => {
  switch (status) {
    case "En cours":
      return "secondary";
    case "Acceptée":
    case "Livrée":
    case "Payée":
      return "success";
    case "Réfusée":
      return "destructive";
    default:
      return "default";
  }
};

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Commande | null;
  onRefresh: () => void;
}

export function OrderDetailsModal({
  open,
  onOpenChange,
  order,
  onRefresh,
}: OrderDetailsModalProps) {
  const [plats, setPlats] = useState<MenuItem[]>([]);
  const [client, setClient] = useState<Client | null>(null); // <-- 3. Nouvel état pour le client
  const [loading, setLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusComd>(
    order?.status || "En cours"
  );
  const API_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  useEffect(() => {
    const fetchData = async () => {
      if (!order || !open) {
        setPlats([]);
        setClient(null);
        return;
      }

      setLoading(true);
      try {
        const user = await getCurrentUser();
        const etablissement_id = user?.etablissement_id;
        if (!etablissement_id) {
          throw new Error("ID d'établissement non trouvé.");
        }

        // Récupération des plats
        const fetchedPlatsPromises = order.details.map(async (detail) => {
          const response = await getPlatByIdPlat(
            detail.plat_id.toString(),
            etablissement_id.toString()
          );
          return response.plat;
        });
        const fetchedPlats = await Promise.all(fetchedPlatsPromises);
        setPlats(fetchedPlats);

        // <-- 4. On appelle la fonction pour récupérer le client
        const fetchedClient = await getClientById(order.client_id);
        setClient(fetchedClient);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données :",
          error
        );
        toast.error("Erreur lors du chargement des détails de la commande.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [order, open]);

  const handleUpdateStatus = async () => {
    if (!order || !selectedStatus) return;
    setIsUpdatingStatus(true);
    try {
      const user = await getCurrentUser();
      const etablissement_id = user?.etablissement_id;
      if (!etablissement_id) throw new Error("ID d'établissement manquant.");
      await updateCommandeStatus(order.id.toString(), selectedStatus);
      toast.success(`Statut de la commande #${order.id} mis à jour.`);
      onOpenChange(false);
      onRefresh();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      toast.error("Échec de la mise à jour du statut.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteCommande = async () => {
    if (!order) return;
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?"))
      return;
    setIsDeleting(true);
    try {
      const user = await getCurrentUser();
      const etablissement_id = user?.etablissement_id;
      if (!etablissement_id) throw new Error("ID d'établissement manquant.");
      await deleteCommande(order.id.toString(), etablissement_id.toString());
      toast.success(`Commande #${order.id} supprimée.`);
      onOpenChange(false);
      onRefresh();
    } catch (error) {
      console.error("Erreur lors de la suppression de la commande :", error);
      toast.error("Échec de la suppression de la commande.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = (value: string) => {
    if (
      ["En cours", "Acceptée", "Livrée", "Réfusée", "Payée"].includes(value)
    ) {
      setSelectedStatus(value as StatusComd);
    } else {
      console.error("Statut invalide sélectionné :", value);
    }
  };

  if (!order) {
    return null;
  }

  const statutColor = getStatusColor(order.status);
  const hasChanges = selectedStatus !== order.status;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Détails de la commande #{order.id}</DialogTitle>
          <DialogDescription>
            Informations détaillées sur la commande.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Statut :</span>
            <div className="flex items-center gap-2">
              <Badge variant={statutColor as any}>{order.status}</Badge>
              <Select onValueChange={handleStatusChange} value={selectedStatus}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Changer le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Acceptée">Acceptée</SelectItem>
                  <SelectItem value="Livrée">Livrée</SelectItem>
                  <SelectItem value="Réfusée">Réfusée</SelectItem>
                  <SelectItem value="Payée">Payée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p>
            <span className="font-semibold">Montant Total : </span>
            {order.montant.toLocaleString("fr-FR")} Ar
          </p>
          <p>
            <span className="font-semibold">Date : </span>
            {new Date(order.date).toLocaleString("fr-FR")}
          </p>
          {/* <-- 5. Affichage du nom du client */}
          {client && (
            <p>
              <span className="font-semibold">Client : </span>
              {client.first_name} {client.last_name}
            </p>
          )}
          <Separator className="my-2" />
          <h3 className="font-bold">Articles commandés :</h3>
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Chargement des plats...
            </div>
          ) : (
            <ScrollArea className="h-60 rounded-md border p-4">
              <ul className="space-y-4">
                {order.details.map((detail, index) => {
                  const plat = plats.find((p) => p.id === detail.plat_id);
                  if (!plat) {
                    return null;
                  }
                  return (
                    <li
                      key={index}
                      className="flex items-center gap-4 p-2 border rounded-md"
                    >
                      {plat.image_url && (
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image
                            src={`${API_URL}/${plat.image_url}`}
                            alt={plat.libelle}
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-md"
                          />
                        </div>
                      )}
                      <div className="flex flex-col flex-1">
                        <div className="font-semibold">{plat.libelle}</div>
                        <div className="text-sm text-muted-foreground">
                          {detail.quantite}x -{" "}
                          {plat.prix.toLocaleString("fr-FR")} Ar
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          )}
        </div>
        <DialogFooter className="flex-row items-center justify-between">
          <Button
            variant="outline"
            onClick={handleDeleteCommande}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Supprimer
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <XCircle className="mr-2 h-4 w-4" /> Fermer
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={!hasChanges || isUpdatingStatus}
            >
              {isUpdatingStatus ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Sauvegarder
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}