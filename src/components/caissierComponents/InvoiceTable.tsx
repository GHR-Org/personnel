// components/caissierComponents/InvoiceTable.tsx
"use client";

import * as React from "react";
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
import { format } from "date-fns";
import {
  IconCalendarCheck,
  IconClock,
  IconInvoice,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
  IconPlus,
  IconX,
  IconEye, // Nouvelle icône pour "Voir les détails"
} from "@tabler/icons-react";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { InvoiceFormData } from "@/schemas/invoice";
import { InvoiceModal } from "./InvoiceModal"; // Pour la création/édition
import {InvoiceDetailsDrawer} from "./InvoiceDetailsDrawer";
 // <-- NOUVEAU pour les détails

// Données de démonstration (inchangées)
const demoInvoiceData: InvoiceFormData[] = [
  {
    id: "INV001",
    invoiceNumber: "INV202507001",
    clientName: "Jean Dupont",
    clientAddress: "123 Rue de la Paix, Antananarivo",
    dateIssued: "2025-07-15",
    dueDate: "2025-07-22",
    items: [
      { description: "Nuitée Chambre Deluxe (2 nuits)", quantity: 2, unitPrice: 100000, total: 200000 },
      { description: "Dîner au restaurant", quantity: 1, unitPrice: 50000, total: 50000 },
    ],
    subTotal: 250000,
    taxRate: 20,
    taxAmount: 50000,
    totalAmount: 300000,
    paymentStatus: "En attente",
    paymentMethod: undefined,
    recordedBy: "Nom du Caissier",
    notes: "Acompte de 100 000 Ar déjà versé."
  },
  {
    id: "INV002",
    invoiceNumber: "INV202507002",
    clientName: "Marie Dubois",
    clientAddress: "456 Avenue des Roses, Fianarantsoa",
    dateIssued: "2025-07-14",
    dueDate: "2025-07-14",
    items: [
      { description: "Service traiteur événement", quantity: 1, unitPrice: 500000, total: 500000 },
    ],
    subTotal: 500000,
    taxRate: 20,
    taxAmount: 100000,
    totalAmount: 600000,
    paymentStatus: "Payée",
    paymentMethod: "Virement",
    recordedBy: "Nom du Caissier",
    notes: ""
  },
];

type InvoiceEntry = InvoiceFormData;

const columns: ColumnDef<InvoiceEntry>[] = [
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
    accessorKey: "invoiceNumber",
    header: "N° Facture",
    cell: ({ row }) => row.original.invoiceNumber,
  },
  {
    accessorKey: "clientName",
    header: "Client",
    cell: ({ row }) => row.original.clientName,
  },
  {
    accessorKey: "dateIssued",
    header: "Date Émission",
    cell: ({ row }) => format(new Date(row.original.dateIssued), "dd/MM/yyyy"),
  },
  {
    accessorKey: "dueDate",
    header: "Date Échéance",
    cell: ({ row }) => row.original.dueDate ? format(new Date(row.original.dueDate), "dd/MM/yyyy") : "-",
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right">Montant Total</div>,
    cell: ({ row }) => (
      <div className="text-right">{row.original.totalAmount.toLocaleString('mg-MG', { style: 'currency', currency: 'MGA' })}</div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Statut Paiement",
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      let badgeColor: "outline" | "default" | "secondary" | "destructive";
      let icon = null;

      switch (status) {
        case "Payée":
          badgeColor = "default";
          icon = <IconCalendarCheck className="mr-1 size-4" />;
          break;
        case "En attente":
          badgeColor = "secondary";
          icon = <IconClock className="mr-1 size-4" />;
          break;
        case "Partiellement payée":
          badgeColor = "outline";
          icon = <IconClock className="mr-1 size-4" />;
          break;
        case "Annulée":
        case "Remboursée":
          badgeColor = "destructive";
          icon = <IconX className="mr-1 size-4" />;
          break;
        default:
          badgeColor = "outline";
          icon = null;
      }

      return (
        <Badge variant={badgeColor} className="text-muted-foreground px-1.5 flex items-center justify-center">
          {icon}
          {status}
        </Badge>
      );
    },
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
    cell: ({ row, table }) => {
        const meta = table.options.meta as {
            onViewInvoice: (data: InvoiceEntry) => void, // <-- NOUVEAU
            onEditInvoice: (data: InvoiceEntry) => void,
            onTriggerDeleteInvoice: (id: string) => void
        };

        return (
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
                    <DropdownMenuItem onClick={() => meta?.onViewInvoice(row.original)}>
                        <IconEye className="mr-2 h-4 w-4" /> Voir les détails
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => meta?.onEditInvoice(row.original)}>
                        Modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => meta?.onTriggerDeleteInvoice(row.original.id!)}
                    >
                        Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
    enableHiding: false,
  },
];

export function InvoiceTable() {
  const [data, setData] = React.useState<InvoiceEntry[]>(demoInvoiceData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState(false); // Pour créer/éditer
  const [editingInvoice, setEditingInvoice] = React.useState<InvoiceFormData | undefined>(undefined);

  const [isInvoiceDetailsDrawerOpen, setIsInvoiceDetailsDrawerOpen] = React.useState(false); // <-- NOUVEAU pour les détails
  const [selectedInvoiceForDetails, setSelectedInvoiceForDetails] = React.useState<InvoiceFormData | null>(null); // <-- NOUVEAU

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [invoiceToDeleteId, setInvoiceToDeleteId] = React.useState<string | null>(null);


  const handleSaveInvoice = (formData: InvoiceFormData) => {
    if (editingInvoice) {
      setData((prevData) =>
        prevData.map((inv) => (inv.id === editingInvoice.id ? { ...formData, id: inv.id } : inv))
      );
      // TODO: Envoyer la requête PUT au backend
    } else {
      const newInvoice: InvoiceEntry = {
        ...formData,
        id: `INV${data.length > 0 ? Math.max(...data.map(e => parseInt(e.id!.replace("INV", "")))) + 1 : 1}`,
        invoiceNumber: `INV${format(new Date(), "yyyyMM")}${(data.length + 1).toString().padStart(3, '0')}`,
      };
      setData((prevData) => [...prevData, newInvoice]);
      // TODO: Envoyer la requête POST au backend
    }
    setIsInvoiceModalOpen(false);
  };

  const handleEditInvoice = (invoice: InvoiceEntry) => {
    setEditingInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  // Nouvelle fonction pour afficher les détails
  const handleViewInvoice = (invoice: InvoiceEntry) => {
    setSelectedInvoiceForDetails(invoice);
    setIsInvoiceDetailsDrawerOpen(true);
  };

  const handleTriggerDeleteInvoice = (id: string) => {
    setInvoiceToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (invoiceToDeleteId) {
      setData((prevData) => prevData.filter((inv) => inv.id !== invoiceToDeleteId));
      console.log(`Facture ${invoiceToDeleteId} supprimée (localement).`)
      setInvoiceToDeleteId(null);
      setIsDeleteDialogOpen(false);
    }
  };


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
    getRowId: (row) => row.id!,
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
    meta: {
        onViewInvoice: handleViewInvoice, // <-- Ajout de la fonction
        onEditInvoice: handleEditInvoice,
        onTriggerDeleteInvoice: handleTriggerDeleteInvoice,
    }
  });

  const [paymentStatusFilter, setPaymentStatusFilter] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (paymentStatusFilter.length > 0 && paymentStatusFilter[0] !== "all") {
      table.getColumn("paymentStatus")?.setFilterValue(paymentStatusFilter);
    } else {
      table.getColumn("paymentStatus")?.setFilterValue(undefined);
    }
  }, [paymentStatusFilter, table]);

  return (
    <>
      <Tabs
        defaultValue="invoice-list"
        className="w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between px-4 lg:px-6">
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select defaultValue="invoice-list"
            onValueChange={() => { /* Logique si plusieurs vues */ }}
          >
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Sélectionner une vue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="invoice-list">Liste des Factures</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
            <TabsTrigger value="invoice-list">Liste des Factures</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select onValueChange={(value) => setPaymentStatusFilter(value ? [value] : [])}>
              <SelectTrigger
                className="w-fit"
                size="sm"
              >
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Payée">Payée</SelectItem>
                <SelectItem value="Partiellement payée">Partiellement payée</SelectItem>
                <SelectItem value="Annulée">Annulée</SelectItem>
                <SelectItem value="Remboursée">Remboursée</SelectItem>
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
                        {column.id === "invoiceNumber" ? "N° Facture" :
                         column.id === "clientName" ? "Client" :
                         column.id === "dateIssued" ? "Date Émission" :
                         column.id === "dueDate" ? "Date Échéance" :
                         column.id === "totalAmount" ? "Montant Total" :
                         column.id === "paymentStatus" ? "Statut Paiement" :
                         column.id === "recordedBy" ? "Enregistré par" :
                         column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="default" size="sm" onClick={() => { setEditingInvoice(undefined); setIsInvoiceModalOpen(true); }}>
              <IconPlus className="mr-2" /> Créer Facture
            </Button>
          </div>
        </div>
        <TabsContent
          value="invoice-list"
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
                      Aucune facture trouvée.
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

      {/* La Modal/Drawer de Facture pour l'ajout et l'édition */}
      <InvoiceModal
        open={isInvoiceModalOpen}
        onOpenChange={(open) => {
          setIsInvoiceModalOpen(open);
          if (!open) {
            setEditingInvoice(undefined);
          }
        }}
        onSaveInvoice={handleSaveInvoice}
        initialData={editingInvoice}
      />

      {/* La Boîte de Dialogue de Confirmation de Suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement la facture sélectionnée de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmed}>Continuer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Le Drawer pour voir les détails de la facture */}
      <InvoiceDetailsDrawer
        open={isInvoiceDetailsDrawerOpen}
        onOpenChange={(open) => {
          setIsInvoiceDetailsDrawerOpen(open);
          if (!open) {
            setSelectedInvoiceForDetails(null); // Réinitialise la facture sélectionnée lors de la fermeture
          }
        }}
        invoice={selectedInvoiceForDetails}
      />
    </>
  );
}