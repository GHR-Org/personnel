/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/reservationComponents/ReservationTable.tsx
"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDown, Edit, Eye, MoreHorizontal, Package, Trash } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Composants Shadcn/ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { ReservationStatut } from "@/lib/enum/ReservationStatus"; 
import type { BookingEvent, ArticleItem, arheeAndComment } from "@/types/reservation";
import { ReservationDetailsDrawer } from "./ReservationDetailsDrawer";
import { ViewarheeModal } from "../modals/ViewarheeModal";
import { ViewArticlesModal } from "./ViewArticleModal";

const statusVariants: Record<ReservationStatut, string> = {
  [ReservationStatut.EN_ATTENTE]: "bg-yellow-100 text-yellow-800 border-yellow-300",
  [ReservationStatut.CONFIRMEE]: "bg-green-100 text-green-800 border-green-300",
  [ReservationStatut.ANNULEE]: "bg-red-100 text-red-800 border-red-300",
  [ReservationStatut.ARRIVEE]: "bg-blue-100 text-blue-800 border-blue-300",
  [ReservationStatut.TERMINEE]: "bg-purple-100 text-purple-800 border-purple-300",
  [ReservationStatut.PREVUE]: "bg-indigo-100 text-indigo-800 border-indigo-300",
  [ReservationStatut.NON_RENSEIGNE]: "bg-gray-100 text-gray-800 border-gray-300",
};


interface ReservationsTableProps {
  reservations: BookingEvent[];
}

export function ReservationsTable({ reservations }: ReservationsTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [selectedReservation, setSelectedReservation] = useState<BookingEvent | null>(null); 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
   const [isarheeModalOpen, setIsarheeModalOpen] = useState(false);
   const [isArticlesModalOpen, setIsArticlesModalOpen] = useState(false);

  // Fonction pour gérer la vue des articles
    const handleViewArticles = (reservation: BookingEvent) => {
    setSelectedReservation(reservation);
    setIsArticlesModalOpen(true);
  };
  const handleCloseArticlesModal = () => {
    setIsArticlesModalOpen(false);
    setSelectedReservation(null);
  };
  //  gérer la modale d'arhee
    const handleViewarhee = (reservation: BookingEvent) => {
    setSelectedReservation(reservation);
    setIsarheeModalOpen(true);
  };

  const handleClosearheeModal = () => {
    setIsarheeModalOpen(false);
    setSelectedReservation(null);
  };

  // Fonction pour ouvrir le tiroir et sélectionner la réservation
  const handleViewReservation = (reservation: BookingEvent) => {
    setSelectedReservation(reservation);
    setIsDrawerOpen(true);
  };
  
  // Fonction pour fermer le tiroir et réinitialiser la réservation sélectionnée
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedReservation(null);
  };

  // Fonctions de gestion des actions (vous devez implémenter la logique réelle)
  const handleSendConfirmation = async (id: string) => {
    console.log(`Confirmation envoyée pour la réservation ${id}`);
    // Ici, vous ajouteriez la logique d'appel API pour envoyer l'email de confirmation
  };

  const handleEdit = (reservation: BookingEvent) => {
    console.log("Éditer la réservation:", reservation);
    // Ajoutez votre logique pour ouvrir le formulaire d'édition
  };

  const handleCheckIn = (id: string) => {
    console.log(`Check-in pour la réservation ${id}`);
    // Ajoutez votre logique d'API pour changer le statut
  };

  const handleCheckout = (id: string) => {
    console.log(`Check-out pour la réservation ${id}`);
    // Ajoutez votre logique d'API pour changer le statut
  };

  const handleCancel = (id: string) => {
    console.log(`Annuler la réservation ${id}`);
    // Ajoutez votre logique d'API pour changer le statut
  };

  const handleDelete = (id: string) => {
    console.log("Supprimer la réservation:", id);
    // Ajoutez votre logique d'API pour supprimer la réservation
  };

  const onBookingUpdated = (updatedReservation: BookingEvent) => {
    // Cette fonction sera appelée après une mise à jour réussie
    console.log("Réservation mise à jour :", updatedReservation);
    // Fermez le tiroir si nécessaire
    handleCloseDrawer();
  };

  const onBookingDeleted = () => {
    // Cette fonction sera appelée après une suppression réussie
    console.log("Réservation supprimée.");
    // Fermez le tiroir
    handleCloseDrawer();
  };

  const columns: ColumnDef<BookingEvent>[] = [
    {
      accessorKey: "first_name",
      header: "Client",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.first_name} {row.original.last_name}
        </span>
      ),
    },
    {
      accessorKey: "date_arrivee",
      header: "Arrivée",
      cell: ({ row }) => (
        <span>
          {format(new Date(row.original.date_arrivee), "d MMMM yyyy", { locale: fr })}
        </span>
      ),
    },
    {
      accessorKey: "date_depart",
      header: "Départ",
      cell: ({ row }) => (
        <span>
          {format(new Date(row.original.date_depart), "d MMMM yyyy", { locale: fr })}
        </span>
      ),
    },
    {
      accessorKey: "chambre_id",
      header: "Chambre",
      cell: ({ row }) => <span>Chambre {row.original.chambre_id}</span>,
    },
    {
      accessorKey: "nbr_adultes",
      header: "Adultes / Enfants",
      cell: ({ row }) => (
        <span>
          {row.original.nbr_adultes} / {row.original.nbr_enfants}
        </span>
      ),
    },
    {
      accessorKey: "mode_checkin",
      header: "Mode d'enregistrement",
    },
    {
      accessorKey: "duree",
      header: "Durée",
      cell: ({ row }) => <span>{row.original.duree} jour(s)</span>,
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            statusVariants[row.original.status as ReservationStatut]
          )}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const reservation = row.original;
        const hasArticles = reservation.articles && reservation.articles.length > 0;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewReservation(reservation)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>Voir les détails</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleViewArticles(reservation)}
                disabled={!hasArticles}
              >
                <Package className="mr-2 h-4 w-4" />
                <span>Voir les articles</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleViewarhee(reservation)}
                disabled={!reservation.arhee?.montant}
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>Voir les arhee</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(reservation)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Modifier</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(reservation.id)}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: reservations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <>
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">
            Vue d&lsquo;ensemble
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              Cette semaine <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="flex items-center gap-1">
              Trier par: Date <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between w-full space-x-2 p-4">
          <div className="flex items-center w-1/2 space-x-2">
            <p className="text-sm font-medium">Lignes par page</p>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} sur{" "}
            {table.getPageCount()}
          </div>
          <Pagination>
            <PaginationContent className="w-50">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  aria-label="Aller à la page précédente"
                  disabled={!table.getCanPreviousPage()}
                />
              </PaginationItem>
              {Array.from(
                { length: table.getPageCount() },
                (_, i) =>
                  i < 3 && (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => table.setPageIndex(i)}
                        isActive={table.getState().pagination.pageIndex === i}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
              )}
              {table.getPageCount() > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  aria-label="Aller à la page suivante"
                  disabled={!table.getCanNextPage()}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      
      {selectedReservation && (
        <ReservationDetailsDrawer
          open={isDrawerOpen}
          onClose={handleCloseDrawer}
          reservation={selectedReservation}
          // Passer les fonctions d'action au tiroir
          onSendConfirmation={handleSendConfirmation}
          onEdit={handleEdit}
          onCheckIn={handleCheckIn}
          onCheckout={handleCheckout}
          onCancel={handleCancel}
          onDelete={handleDelete}
          onBookingUpdated={onBookingUpdated}
          onBookingDeleted={onBookingDeleted}
        />
      )}
      {selectedReservation && (
        <ViewarheeModal
          open={isarheeModalOpen}
          onOpenChange={handleClosearheeModal}
          reservation={selectedReservation}
        />
      )}
      {selectedReservation && (
        <ViewArticlesModal
          open={isArticlesModalOpen}
          onOpenChange={handleCloseArticlesModal}
          articles={selectedReservation.articles || []}
        />
      )}
    </>
  );
}