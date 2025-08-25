/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import {
  IconCalendarCheck,
  IconClock,
  IconArrowUpRight, 
  IconArrowDownLeft, 
  IconX,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react";

// Importez les nouvelles modales et les types de données des formulaires
import { AddEncaissementModal } from "./AddEncaissementModal";
import { AddDecaissementModal } from "./AddDecaissementModal";
import { EncaissementFormData, DecaissementFormData } from "@/schemas/cashRegister"; // Assurez-vous du chemin correct

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";
import { format } from "date-fns"; // Pour formater les dates

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";


// --- Schéma pour les données du journal de caisse (inchangé)
export const cashLogSchema = z.object({
  id: z.number(),
  date: z.string(), 
  time: z.string(), 
  description: z.string(), 
  type: z.enum(["Encaissement", "Décaissement"]), 
  amount: z.number(), 
  paymentMethod: z.enum(["Espèces", "Carte Bancaire", "Virement", "Chèque"]), 
  recordedBy: z.string(), 
});

// Type pour les données du tableau (inchangé)
type CashLogEntry = z.infer<typeof cashLogSchema>;

// Données de démonstration pour le journal de caisse (inchangé, mais vous ajouterez via les modales)
const demoCashLogData: CashLogEntry[] = [
  {
    id: 1,
    date: "2025-07-10",
    time: "09:15",
    description: "Vente de chambre N°101",
    type: "Encaissement",
    amount: 150000,
    paymentMethod: "Espèces",
    recordedBy: "Ratiarimanana",
  },
  {
    id: 2,
    date: "2025-07-10",
    time: "10:30",
    description: "Achat de fournitures de bureau",
    type: "Décaissement",
    amount: 25000,
    paymentMethod: "Espèces",
    recordedBy: "Ratiarimanana",
  },
  {
    id: 3,
    date: "2025-07-10",
    time: "11:00",
    description: "Vente de chambre N°203",
    type: "Encaissement",
    amount: 200000,
    paymentMethod: "Carte Bancaire",
    recordedBy: "Ratiarimanana",
  },
  {
    id: 4,
    date: "2025-07-09",
    time: "16:45",
    description: "Remboursement client (erreur)",
    type: "Décaissement",
    amount: 50000,
    paymentMethod: "Espèces",
    recordedBy: "Rakoto",
  },
  {
    id: 5,
    date: "2025-07-09",
    time: "14:20",
    description: "Vente bar/restaurant",
    type: "Encaissement",
    amount: 75000,
    paymentMethod: "Espèces",
    recordedBy: "Rakoto",
  },
];

// Colonnes de la table (inchangées)
const columns: ColumnDef<CashLogEntry>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => row.original.date,
    enableHiding: false,
  },
  {
    accessorKey: "time",
    header: "Heure",
    cell: ({ row }) => row.original.time,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      let icon = null;
      type AllowedBadgeVariant = "outline" | "default" | "secondary" | "destructive";
      let badgeColor: AllowedBadgeVariant = "outline";

      switch (type) {
        case "Encaissement":
          icon = <IconArrowUpRight className="mr-1 size-4 text-green-500" />;
          badgeColor = "default";
          break;
        case "Décaissement":
          icon = <IconArrowDownLeft className="mr-1 size-4 text-red-500" />;
          badgeColor = "destructive";
          break;
        default:
          icon = null;
      }

      return (
        <Badge variant={badgeColor} className="text-muted-foreground px-1.5 flex items-center justify-center">
          {icon}
          {type}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Montant</div>,
    cell: ({ row }) => (
      <div className="text-right">{row.original.amount.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</div>
    ), 
  },
  {
    accessorKey: "paymentMethod",
    header: "Méthode de paiement",
    cell: ({ row }) => row.original.paymentMethod,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "recordedBy",
    header: "Enregistré par",
    cell: ({ row }) => row.original.recordedBy,
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Voir les détails</DropdownMenuItem>
          <DropdownMenuItem>Modifier</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 focus:text-red-600">Supprimer</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableHiding: false,
  },
];

export function CashRegisterLogTable() { 
  const [data, setData] = React.useState<CashLogEntry[]>(demoCashLogData); 
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Nouveaux états pour les modales d'encaissement et de décaissement
  const [isAddEncaissementModalOpen, setIsAddEncaissementModalOpen] = React.useState(false);
  const [isAddDecaissementModalOpen, setIsAddDecaissementModalOpen] = React.useState(false);

  // Fonctions pour ajouter les données aux logs
  const handleAddEncaissement = (formData: EncaissementFormData) => {
    const newEntry: CashLogEntry = {
      id: data.length > 0 ? Math.max(...data.map(e => e.id)) + 1 : 1,
      date: format(new Date(), "yyyy-MM-dd"), // Date actuelle
      time: format(new Date(), "HH:mm"),     // Heure actuelle
      description: formData.description,
      type: "Encaissement",
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      recordedBy: formData.recordedBy,
    };
    setData((prevData) => [...prevData, newEntry]);
    setIsAddEncaissementModalOpen(false); // Ferme la modale
  };

  const handleAddDecaissement = (formData: DecaissementFormData) => {
    const newEntry: CashLogEntry = {
      id: data.length > 0 ? Math.max(...data.map(e => e.id)) + 1 : 1,
      date: format(new Date(), "yyyy-MM-dd"), // Date actuelle
      time: format(new Date(), "HH:mm"),     // Heure actuelle
      description: formData.description,
      type: "Décaissement",
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      recordedBy: formData.recordedBy,
    };
    setData((prevData) => [...prevData, newEntry]);
    setIsAddDecaissementModalOpen(false); // Ferme la modale
  };


  // États pour les filtres (type de transaction, méthode de paiement)
  const [typeFilter, setTypeFilter] = React.useState<string[]>([]);
  const [paymentMethodFilter, setPaymentMethodFilter] = React.useState<string[]>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Met à jour les filtres de colonne lorsque typeFilter ou paymentMethodFilter changent
  React.useEffect(() => {
    if (typeFilter.length > 0 && typeFilter[0] !== "all") {
      table.getColumn("type")?.setFilterValue(typeFilter);
    } else {
      table.getColumn("type")?.setFilterValue(undefined); 
    }
  }, [typeFilter, table]);

  React.useEffect(() => {
    if (paymentMethodFilter.length > 0 && paymentMethodFilter[0] !== "all") {
      table.getColumn("paymentMethod")?.setFilterValue(paymentMethodFilter);
    } else {
      table.getColumn("paymentMethod")?.setFilterValue(undefined); 
    }
  }, [paymentMethodFilter, table]);

  return (
    <>
      <Tabs
        defaultValue="cash-log" 
        className="w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between px-4 lg:px-6">
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select defaultValue="cash-log"
            onValueChange={() => {
              // Logique si vous avez plusieurs vues de tableau et souhaitez basculer
            }}
          >
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Sélectionner une vue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash-log">Journal de Caisse</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
            <TabsTrigger value="cash-log">Journal de Caisse</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {/* Filtre par Type de Transaction */}
            <Select onValueChange={(value) => setTypeFilter(value ? [value] : [])}>
              <SelectTrigger
                className="w-fit"
                size="sm"
              >
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Encaissement">Encaissement</SelectItem>
                <SelectItem value="Décaissement">Décaissement</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtre par Méthode de Paiement */}
            <Select onValueChange={(value) => setPaymentMethodFilter(value ? [value] : [])}>
              <SelectTrigger
                className="w-fit"
                size="sm"
              >
                <SelectValue placeholder="Filtrer par paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les méthodes</SelectItem>
                <SelectItem value="Espèces">Espèces</SelectItem>
                <SelectItem value="Carte Bancaire">Carte Bancaire</SelectItem>
                <SelectItem value="Virement">Virement</SelectItem>
                <SelectItem value="Chèque">Chèque</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Personnaliser les colonnes</span>
                  <span className="lg:hidden">Colonnes</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id === "date" ? "Date" :
                         column.id === "time" ? "Heure" :
                         column.id === "description" ? "Description" :
                         column.id === "type" ? "Type" :
                         column.id === "amount" ? "Montant" :
                         column.id === "paymentMethod" ? "Méthode de Paiement" :
                         column.id === "recordedBy" ? "Enregistré par" :
                         column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Boutons pour ouvrir les modales d'ajout */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                  <IconPlus className="mr-2" /> Ajouter Transaction
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsAddEncaissementModalOpen(true)}>
                  Nouvel Encaissement
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAddDecaissementModalOpen(true)}>
                  Nouveau Décaissement
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
        <TabsContent
          value="cash-log"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
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
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
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
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Aucun résultat.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} sur{" "}
              {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Lignes par page
                </Label>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} sur{" "}
                {table.getPageCount()}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Aller à la première page</span>
                  <IconChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Aller à la page précédente</span>
                  <IconChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Aller à la page suivante</span>
                  <IconChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Aller à la dernière page</span>
                  <IconChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modales d'encaissement et de décaissement */}
      <AddEncaissementModal
        open={isAddEncaissementModalOpen}
        onOpenChange={setIsAddEncaissementModalOpen}
        onAddEncaissement={handleAddEncaissement}
      />

      <AddDecaissementModal
        open={isAddDecaissementModalOpen}
        onOpenChange={setIsAddDecaissementModalOpen}
        onAddDecaissement={handleAddDecaissement}
      />
    </>
  );
}