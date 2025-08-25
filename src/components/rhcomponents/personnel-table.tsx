/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/personnel-table.tsx
"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, ArrowUpDown, Search, Filter, MoreHorizontal, Copy, Edit, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PersonnelForm } from "@/components/form/personnelForm"; // Assurez-vous que le chemin est correct et le type est PersonnelFormData
import { Personnel, PersonnelFormData } from "@/types/personnel";

// Nous allons déplacer la définition des colonnes ici pour qu'elle puisse être exportée
// et utilisée par la page principale si elle le souhaite, ou définie directement dans la page.
// Pour la simplicité, nous la laisserons ici pour le moment.

export const getColumns = (
  onEdit: (data: PersonnelFormData & { id: number }) => void,
  onDelete: (id: number) => void
): ColumnDef<Personnel>[] => [ // Utilisez l'interface Personnel complète
  {
    accessorKey: "nom",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nom
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("nom")}</div>,
  },
  {
    accessorKey: "prenom",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Prénom
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("prenom")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "telephone",
    header: "Téléphone",
    cell: ({ row }) => <div>{row.getValue("telephone")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rôle
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
  },
  {
    accessorKey: "poste",
    header: "Poste",
    cell: ({ row }) => <div>{row.getValue("poste") || "-"}</div>,
  },
  {
    accessorKey: "date_embauche",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Embauche
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("date_embauche") as string;
      try {
        return <div>{format(new Date(date), "dd MMMM yyyy", { locale: fr })}</div>;
      } catch (e) {
        console.error("Erreur de formatage de date:", date, e);
        return <div>{date}</div>; // Affiche la date brute en cas d'erreur
      }
    },
  },
  {
    accessorKey: "statut_compte",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Statut
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("statut_compte") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
      let text = status;

      switch (status) {
        case "active":
          variant = "default";
          text = "Actif";
          break;
        case "inactive":
          variant = "secondary";
          text = "Inactif";
          break;
        case "suspended":
          variant = "destructive";
          text = "Suspendu";
          break;
        default:
          variant = "outline"; // Pour tout statut inconnu
          break;
      }

      return <Badge variant={variant}>{text}</Badge>;
    },
    filterFn: (row, id, value) => {
        // Gère le filtrage multiple pour les statuts
        return (value as string[]).includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const personnel = row.original;
      const [isOpen, setIsOpen] = useState(false);

      // Adaptation pour le type attendu par PersonnelForm (PersonnelFormData)
      const initialFormData: PersonnelFormData = {
        nom: personnel.nom,
        prenom: personnel.prenom,
        telephone: personnel.telephone,
        email: personnel.email,
        // Ne pas passer le mot de passe réel ici pour la sécurité
        mot_de_passe: "", // Ou undefined si votre schéma Zod le permet
        role: personnel.role as "Receptionniste" | "Technicien" | "Manager" | "RH" | "Caissier" | "Directeur", // Cast nécessaire pour enum
        poste: personnel.poste,
        date_embauche: personnel.date_embauche,
        statut_compte: personnel.statut_compte as "active" | "inactive" | "suspended", // Cast nécessaire pour enum
      };

      const handleFormSubmit = (data: PersonnelFormData) => {
        // Appelle la fonction onEdit passée via props, en ajoutant l'ID
        onEdit({ ...data, id: personnel.id });
        setIsOpen(false);
      };

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(personnel.email)}>
                <Copy className="mr-2 h-4 w-4" /> Copier l&apos;email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <DialogTrigger className="w-full text-left cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" /> Modifier
                </DialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(personnel.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le personnel</DialogTitle>
              <DialogDescription>
                Modifiez les informations du personnel ici. Cliquez sur enregistrer lorsque vous avez terminé.
              </DialogDescription>
            </DialogHeader>
            <PersonnelForm initialData={initialFormData} onSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];

interface PersonnelTableProps {
  data: Personnel[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  onEdit: (data: PersonnelFormData & { id: number }) => void;
  onDelete: (id: number) => void;
  onAddPersonnel: (data: PersonnelFormData) => void; // Ajout pour le formulaire d'ajout
}

export function PersonnelTable({
  data,
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  selectedStatus,
  setSelectedStatus,
  onEdit,
  onDelete,
  onAddPersonnel,
}: PersonnelTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [isAddFormDialogOpen, setIsAddFormDialogOpen] = useState(false); // État pour la modale d'ajout

  // Définir les colonnes avec les fonctions de callback
  const columns = getColumns(onEdit, onDelete);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: searchTerm, // Utiliser searchTerm pour le filtre global
    },
    onGlobalFilterChange: setSearchTerm, // Lier setSearchTerm au filtre global
    globalFilterFn: (row, columnId, filterValue: string) => {
        // Fonction de filtre global sur nom, prénom, email
        const nom = row.getValue("nom") as string;
        const prenom = row.getValue("prenom") as string;
        const email = row.getValue("email") as string;
        const search = filterValue.toLowerCase();
        return nom.toLowerCase().includes(search) || prenom.toLowerCase().includes(search) || email.toLowerCase().includes(search);
    },
  });

  // Mettre à jour les filtres de colonne quand les props changent
  React.useEffect(() => {
    table.getColumn("role")?.setFilterValue(selectedRole === "all" ? undefined : selectedRole);
  }, [selectedRole, table]);

  React.useEffect(() => {
    table.getColumn("statut_compte")?.setFilterValue(selectedStatus === "all" ? undefined : selectedStatus);
  }, [selectedStatus, table]);


  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2 flex-wrap">
        {/* Barre de recherche globale */}
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher personnel..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-9"
          />
        </div>

        {/* Bouton Ajouter un personnel */}
        <Dialog open={isAddFormDialogOpen} onOpenChange={setIsAddFormDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 transition-colors ml-auto">
              <Plus className="mr-2 h-4 w-4" /> Ajouter Personnel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau personnel</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous pour ajouter un nouveau membre du personnel.
              </DialogDescription>
            </DialogHeader>
            <PersonnelForm onSubmit={(data) => { onAddPersonnel(data); setIsAddFormDialogOpen(false); }} />
          </DialogContent>
        </Dialog>

        {/* Dropdown pour la visibilité des colonnes */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              Colonnes <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
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
                    {column.id.replace(/_/g, ' ')} {/* Pour un affichage plus propre */}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
      
      {/* Filtres avancés (pourra être intégré si besoin) */}
      {/* Ceci est un exemple, vous l'avez déjà dans PersonnelPage avec les Select */}
      {/* <div className="flex items-center gap-2 mb-4">
        <Select
          value={selectedRole}
          onValueChange={setSelectedRole}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="Receptionniste">Réceptionniste</SelectItem>
            <SelectItem value="Technicien">Technicien</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="RH">RH</SelectItem>
            <SelectItem value="Caissier">Caissier</SelectItem>
            <SelectItem value="Directeur">Directeur</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedStatus}
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="suspended">Suspendu</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      <div className="rounded-md border animate-fadeIn">
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
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {/* Affiche le nombre d'éléments filtrés/sélectionnés */}
          {table.getFilteredRowModel().rows.length} ligne(s) affichée(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}