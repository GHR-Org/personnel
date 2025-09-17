/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/manager-restaurant/MobileOrderTracker.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { getOrders } from "@/func/api/commande/APICommande";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { getClientById } from "@/func/api/clients/apiclient";
import { Client } from "@/types/client";

// En cours, Acceptée, Livrée, Réfusée, Payée
export type StatusComd = "En cours" | "Acceptée" | "Livrée" | "Réfusée" | "Payée";

// Définition des types pour les données de commande
export type Commande = {
  id: number;
  montant: number;
  description: string;
  date: string;
  status: StatusComd;
  client_id: number;
  details: {
    id: number;
    prix_unitaire: number;
    commande_id: number;
    quantite: number;
    plat_id: number;
  }[];
};

// Type combiné pour la DataTable
type OrderWithClient = Commande & {
  clientName: string;
};

export function MobileOrderTracker() {
  const [data, setData] = useState<OrderWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Commande | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const orders = await getOrders();
      
      // On récupère tous les IDs de clients uniques pour éviter de faire plusieurs requêtes pour le même client
      const uniqueClientIds = Array.from(new Set(orders.map(order => order.client_id)));

      // On crée une promesse pour chaque client
      const clientPromises = uniqueClientIds.map(clientId => getClientById(clientId));

      // On attend que toutes les promesses de clients soient résolues en parallèle
      const clients = await Promise.all(clientPromises);

      // On crée une map pour un accès rapide aux clients par leur ID
      const clientMap = new Map<number, Client>();
      clients.forEach(client => clientMap.set(client.id, client));

      // On associe les noms des clients aux commandes
      const ordersWithClients: OrderWithClient[] = orders.map(order => {
        const client = clientMap.get(order.client_id);
        const clientName = client ? `${client.first_name} ${client.last_name}` : "Client inconnu";
        return {
          ...order,
          clientName,
        };
      });

      setData(ordersWithClients);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (order: Commande) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<OrderWithClient>[] = [
    {
      accessorKey: "clientName",
      header: "Nom du Client",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ getValue }) => {
        const statut = getValue<string>();
        let color = "secondary";

        switch (statut) {
          case "En cours":
            color = "secondary";
            break;
          case "Acceptée":
          case "Livrée":
          case "Payée":
            color = "success";
            break;
          case "Réfusée":
            color = "destructive";
            break;
          default:
            color = "default";
            break;
        }
        return <Badge variant={color as any}>{statut}</Badge>;
      },
    },
    {
      accessorKey: "montant",
      header: "Montant (Ar)",
      cell: ({ getValue }) => {
        const montant = getValue<number>();
        return montant.toLocaleString("fr-FR") + " Ar";
      },
    },
    {
      accessorKey: "date",
      header: "Date & Heure",
      cell: ({ getValue }) => {
        const date = new Date(getValue<string>());
        return date.toLocaleDateString("fr-FR") + " " + date.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const originalOrder = data.find(order => order.id === row.original.id);
        return (
          <Button variant="ghost" size="icon" onClick={() => originalOrder && openModal(originalOrder)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Chargement des commandes...</div>;
  }

  const allStatuts = Array.from(new Set(data.map(d => d.status)));

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        filterable={[
          { id: "status", title: "Statut", options: allStatuts },
        ]}
        searchable={["clientName", "description"]}
      />
      <OrderDetailsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        order={selectedOrder}
        onRefresh={fetchData}
      />
    </>
  );
}