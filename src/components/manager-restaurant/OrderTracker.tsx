// src/components/manager-restaurant/OrderTracker.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

type Commande = {
  id: number
  client: {
    nom: string
    chambre?: string
  }
  table?: string
  statut: "en cours" | "acceptée" | "livrée" | "refusée" | "payée"
  montant: number
  date: string
}

// ✅ Exemple de données factices
const data: Commande[] = [
  {
    id: 1,
    client: { nom: "Jean Dupont", chambre: "202" },
    statut: "en cours",
    montant: 25.5,
    date: "2025-07-25T12:30:00Z"
  },
  {
    id: 2,
    client: { nom: "Marie Curie", chambre: "303" },
    statut: "livrée",
    montant: 42.0,
    date: "2025-07-25T13:15:00Z"
  },
  {
    id: 3,
    client: { nom: "Extern", chambre: undefined },
    table: "B12",
    statut: "payée",
    montant: 33.75,
    date: "2025-07-25T14:00:00Z"
  }
]

// ✅ Définition des colonnes
const columns: ColumnDef<Commande>[] = [
  {
    accessorKey: "client.nom",
    header: "Client",
    cell: ({ row }) => {
      const client = row.original.client
      return (
        <div>
          <p>{client.nom}</p>
          {client.chambre && (
            <span className="text-xs text-muted-foreground">Chambre {client.chambre}</span>
          )}
          {row.original.table && (
            <span className="text-xs text-muted-foreground">Table {row.original.table}</span>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: "statut",
    header: "Statut",
    cell: ({ getValue }) => {
      const statut = getValue<Commande["statut"]>()
      let color = "default"

      switch (statut) {
        case "en cours":
          color = "secondary"
          break
        case "acceptée":
          color = "default"
          break
        case "livrée":
          color = "success"
          break
        case "refusée":
          color = "destructive"
          break
        case "payée":
          color = "success"
          break
      }

      return <Badge variant={color as any}>{statut}</Badge>
    }
  },
  {
    accessorKey: "montant",
    header: "Montant (€)",
    cell: ({ getValue }) => {
      const montant = getValue<number>()
      return montant.toFixed(2) + " €"
    }
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => {
      const date = new Date(getValue<string>())
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
      })
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )
    }
  }
]

// ✅ Composant final
export function OrderTracker() {
  // Extraction des options de filtre uniques
  const allStatuts = Array.from(new Set(data.map(d => d.statut)))
  const allChambres = Array.from(new Set(data.filter(d => d.client.chambre).map(d => `Chambre ${d.client.chambre}`)))
  const allTables = Array.from(new Set(data.filter(d => d.table).map(d => `Table ${d.table}`)))

  return (
    <DataTable
      columns={columns}
      data={data}
      filterable={[
        { id: "statut", title: "Statut", options: allStatuts },
        { id: "client.chambre", title: "Chambre", options: allChambres },
        { id: "table", title: "Table", options: allTables },
      ]}
      // La prop `searchable` prend simplement un tableau de chaînes, comme défini
      searchable={["client.nom", "table", "client.chambre"]}
    />
  )
}