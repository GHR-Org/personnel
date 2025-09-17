// // src/components/DataTable.tsx (ou l'emplacement de votre DataTable)

// "use client";

// import * as React from "react";
// import {
//   IconCalendarCheck,
//   IconClock,
//   IconDoorEnter,
//   IconDoorExit,
//   IconX,
//   IconChevronDown,
//   IconChevronLeft,
//   IconChevronRight,
//   IconChevronsLeft,
//   IconChevronsRight,
//   IconDotsVertical,
//   IconLayoutColumns,
//   IconPlus,
// } from "@tabler/icons-react";
// import { AddBookingModal } from "../modals/AddBookingModal"; // Chemin vers le composant AddBookingModal

// // --- Import des fonctions d'API et des types ---
// import {
//   getBookings,
//   createBooking,
//   deleteBooking,
// } from "@/func/api/reservation/apireservation";
// import { bookingSchema, CreateBookingData } from "@/schemas/reservation";
// import { Booking, ReservationStatut } from "@/types/reservation";

// import {
//   ColumnDef,
//   ColumnFiltersState,
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   SortingState,
//   useReactTable,
//   VisibilityState,
// } from "@tanstack/react-table";
// import { format, isValid } from "date-fns"; // Importez isValid de date-fns

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import { toast } from "sonner";

// // --- Type pour les données de la table ---
// export type DataTableBooking = Booking & {
//   nights: number;
//   total: number;
//   roomDisplay: string;
// };

// export function DataTable() {
//   const [data, setData] = React.useState<DataTableBooking[]>([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState<string | null>(null);
//   const [rowSelection, setRowSelection] = React.useState({});
//   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [pagination, setPagination] = React.useState({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const [isAddBookingModalOpen, setIsAddBookingModalOpen] = React.useState(false);

//   // Fonction de suppression, elle a accès à `setData` et `data`
//   const handleDelete = async (bookingToDelete: DataTableBooking) => {
//     if (!confirm(`Êtes-vous sûr de vouloir supprimer la réservation ${bookingToDelete.id} de ${bookingToDelete.prenom} ${bookingToDelete.nom} ?`)) {
//       return;
//     }
//     try {
//       await deleteBooking(bookingToDelete.id);
//       setData((prevData) => prevData.filter((item) => item.id !== bookingToDelete.id));
//       toast.success("La réservation a été supprimée avec succès !");
//     } catch (error) {
//       console.error("Erreur lors de la suppression de la réservation :", error);
//       toast.error("Une erreur est survenue lors de la suppression de la réservation.");
//     }
//   };

//   // Fonction d'édition
//   const handleEdit = (bookingToEdit: DataTableBooking) => {
//     console.log("Modifier la réservation :", bookingToEdit);
//     toast("Fonctionnalité en développement", {
//         description: "La modification des réservations n'est pas encore implémentée.",
//     });
//   };

//   // Colonnes de la table - Définies à l'intérieur du composant pour accéder à `handleDelete`
//   const columns: ColumnDef<DataTableBooking>[] = [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <div className="flex items-center justify-center">
//           <Checkbox
//             checked={
//               table.getIsAllPageRowsSelected() ||
//               (table.getIsSomePageRowsSelected() && "indeterminate")
//             }
//             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//             aria-label="Select all"
//           />
//         </div>
//       ),
//       cell: ({ row }) => (
//         <div className="flex items-center justify-center">
//           <Checkbox
//             checked={row.getIsSelected()}
//             onCheckedChange={(value) => row.toggleSelected(!!value)}
//             aria-label="Select row"
//           />
//         </div>
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//     { accessorKey: "prenom", header: "Prénom", cell: ({ row }) => row.original.prenom, enableHiding: false },
//     { accessorKey: "nom", header: "Nom", cell: ({ row }) => row.original.nom, enableHiding: false },
//     { accessorKey: "id_chambre", header: "Chambre", cell: ({ row }) => row.original.id_chambre ? `Chambre ${row.original.id_chambre}` : "Non assignée" },
//     {
//       accessorKey: "dateArrivee",
//       header: "Date d'arrivée",
//       cell: ({ row }) => {
//         const date = new Date(row.original.dateArrivee);
//         return isValid(date) ? format(date, "dd/MM/yyyy") : "Date invalide";
//       },
//     },
//     {
//       accessorKey: "dateDepart",
//       header: "Date de départ",
//       cell: ({ row }) => {
//         const date = new Date(row.original.dateDepart);
//         return isValid(date) ? format(date, "dd/MM/yyyy") : "Date invalide";
//       },
//     },
//     { accessorKey: "nights", header: () => <div className="text-right">Nuits</div>, cell: ({ row }) => <div className="text-right">{row.original.nights}</div> },
//     { accessorKey: "total", header: () => <div className="text-right">Total</div>, cell: ({ row }) => <div className="text-right">{(row.original.total || 0).toFixed(2)} €</div> },
//     {
//       accessorKey: "statut",
//       header: "Statut",
//       cell: ({ row }) => {
//         const status = row.original.statut;
//         let icon = null;
//         type AllowedBadgeVariant = "outline" | "secondary" | "destructive" | "default";
//         let badgeColor: AllowedBadgeVariant = "outline";

//         switch (status) {
//           case ReservationStatut.CONFIRMEE: icon = <IconCalendarCheck className="mr-1 size-4 fill-green-500" />; badgeColor = "default"; break;
//           case ReservationStatut.EN_ATTENTE: icon = <IconClock className="mr-1 size-4 text-yellow-500" />; badgeColor = "outline"; break;
//           case ReservationStatut.ARRIVEE: icon = <IconDoorEnter className="mr-1 size-4 text-blue-500" />; badgeColor = "secondary"; break;
//           case ReservationStatut.TERMINEE: icon = <IconDoorExit className="mr-1 size-4 text-purple-500" />; badgeColor = "secondary"; break;
//           case ReservationStatut.ANNULEE: icon = <IconX className="mr-1 size-4 text-red-500" />; badgeColor = "destructive"; break;
//           default: icon = null; badgeColor = "outline";
//         }

//         return (
//           <Badge variant={badgeColor} className="text-muted-foreground px-1.5 flex items-center justify-center">
//             {icon}
//             {status}
//           </Badge>
//         );
//       },
//       filterFn: (row, id, value) => value.includes(row.getValue(id)),
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => {
//         const booking = row.original;
//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
//                 <IconDotsVertical />
//                 <span className="sr-only">Open menu</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-32">
//               <DropdownMenuItem onClick={() => alert("Voir les détails de la réservation")}>Voir les détails</DropdownMenuItem>
//               <DropdownMenuItem onClick={() => handleEdit(booking)}>Modifier</DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 className="text-red-600 focus:text-red-600"
//                 onClick={() => handleDelete(booking)}
//               >
//                 Supprimer
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//       enableHiding: false,
//     },
//   ];

//   // --- Effet pour charger les réservations au montage du composant ---
//   React.useEffect(() => {
//     const fetchBookings = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const bookings = await getBookings();
//         const formattedBookings: DataTableBooking[] = bookings.map((booking) => {
//           const startDate = new Date(booking.dateArrivee);
//           const endDate = new Date(booking.dateDepart);

//           // Vérifier si les dates sont valides avant de calculer nights
//           const nights = isValid(startDate) && isValid(endDate)
//             ? Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
//             : 0; // Ou une autre valeur par défaut / gestion d'erreur

//           return {
//             ...booking,
//             nights: nights,
//             total: booking.montantAttribuer || 0,
//             roomDisplay: booking.id_chambre ? `Chambre ${booking.id_chambre}` : "N/A",
//           };
//         });
//         setData(formattedBookings);
//       } catch (err) {
//         console.error("Failed to fetch bookings:", err);
//         if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
//           setError("Veuillez vérifier votre connexion internet.");
//           toast.error("Échec de la connexion. Veuillez vérifier votre connexion internet.");
//         } else {
//           setError("Erreur lors du chargement des réservations.");
//           toast.error("Impossible de charger les réservations. Veuillez réessayer.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   const handleAddBooking = async (formData: CreateBookingData) => {
//     console.log("Données de formulaire reçues par handleAddBooking (avant conversion) :", formData);

//     try {
//         const validatedData = bookingSchema.parse(formData);

//         // Assurez-vous que les dates sont des strings ISO ici,
//         // car votre API les attend probablement comme ça.
//         // Si bookingSchema.parse garantit déjà des strings ISO pour les dates,
//         // les assertions de type 'as string' ne sont pas strictement nécessaires
//         // mais ne nuisent pas si vous voulez être explicite.
//         const dataToSend: CreateBookingData = {
//             ...validatedData, // Utilisez le validatedData directement si les types sont corrects
//             // Assurez-vous que datePaiementarhee, dateArrivee, dateDepart sont des strings ici
//             // Si votre schéma Zod les transforme en Date objets, vous devrez les reconvertir en ISO string
//             // Exemple: dateArrivee: validatedData.dateArrivee instanceof Date ? validatedData.dateArrivee.toISOString() : validatedData.dateArrivee,
//         };

//         console.log("Données formatées à envoyer à l'API (createBooking) :", dataToSend);

//         const newBookingFromApi = await createBooking(dataToSend);

//         const startDate = new Date(newBookingFromApi.dateArrivee);
//         const endDate = new Date(newBookingFromApi.dateDepart);

//         const nights = isValid(startDate) && isValid(endDate)
//           ? Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
//           : 0;

//         const newBookingForTable: DataTableBooking = {
//             ...newBookingFromApi,
//             nights: nights,
//             total: newBookingFromApi.montantAttribuer || 0,
//             roomDisplay: newBookingFromApi.id_chambre ? `Chambre ${newBookingFromApi.id_chambre}` : "N/A",
//         };

//         setData((prevData) => [...prevData, newBookingForTable]);
//         setIsAddBookingModalOpen(false);
//         toast.success(`La réservation ${newBookingFromApi.id} a été ajoutée avec succès.`);

//     } catch (error) {
//         console.error("Erreur lors de l'ajout de la réservation :", error);
//         toast.error("Une erreur est survenue lors de l'ajout de la réservation.");
//     }
// };

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnVisibility,
//       rowSelection,
//       columnFilters,
//       pagination,
//     },
//     getRowId: (row) => row.id.toString(),
//     enableRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//   });

//   const [statusFilter, setStatusFilter] = React.useState<string[]>([]);

//   React.useEffect(() => {
//     if (statusFilter.length > 0 && statusFilter[0] !== "all") {
//       table.getColumn("statut")?.setFilterValue(statusFilter);
//     } else {
//       table.getColumn("statut")?.setFilterValue(undefined);
//     }
//   }, [statusFilter, table]);

//   return (
//     <>
//       <Tabs
//         defaultValue="reservations"
//         className="w-full flex-col justify-start gap-6"
//       >
//         <div className="flex items-center justify-between px-4 lg:px-6">
//           <Label htmlFor="view-selector" className="sr-only">
//             View
//           </Label>
//           <Select defaultValue="reservations"
//             onValueChange={() => {
//               // Logique si vous avez plusieurs vues de tableau et souhaitez basculer
//             }}
//           >
//             <SelectTrigger
//               className="flex w-fit @4xl/main:hidden"
//               size="sm"
//               id="view-selector"
//             >
//               <SelectValue placeholder="Sélectionner une vue" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="reservations">Réservations</SelectItem>
//             </SelectContent>
//           </Select>
//           <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
//             <TabsTrigger value="reservations">Réservations</TabsTrigger>
//           </TabsList>
//           <div className="flex items-center gap-2">
//             {/* Filtre par statut (Select) */}
//             <Select onValueChange={(value) => setStatusFilter(value ? [value] : [])}>
//               <SelectTrigger
//                 className="w-fit"
//                 size="sm"
//               >
//                 <SelectValue placeholder="Filtrer par statut" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Tous les statuts</SelectItem>
//                 <SelectItem value={ReservationStatut.CONFIRMEE}>Confirmée</SelectItem>
//                 <SelectItem value={ReservationStatut.EN_ATTENTE}>En attente</SelectItem>
//                 <SelectItem value={ReservationStatut.ARRIVEE}>Arrivé</SelectItem>
//                 <SelectItem value={ReservationStatut.TERMINEE}>Terminée</SelectItem>
//                 <SelectItem value={ReservationStatut.ANNULEE}>Annulée</SelectItem>
//               </SelectContent>
//             </Select>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm">
//                   <IconLayoutColumns />
//                   <span className="hidden lg:inline">Personnaliser les colonnes</span>
//                   <span className="lg:hidden">Colonnes</span>
//                   <IconChevronDown />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 {table
//                   .getAllColumns()
//                   .filter(
//                     (column) =>
//                       typeof column.accessorFn !== "undefined" &&
//                       column.getCanHide()
//                   )
//                   .map((column) => {
//                     return (
//                       <DropdownMenuCheckboxItem
//                         key={column.id}
//                         className="capitalize"
//                         checked={column.getIsVisible()}
//                         onCheckedChange={(value) =>
//                           column.toggleVisibility(!!value)
//                         }
//                       >
//                         {column.id === "prenom" ? "Prénom" :
//                           column.id === "nom" ? "Nom" :
//                           column.id === "id_chambre" ? "Chambre" :
//                           column.id === "dateArrivee" ? "Date d'arrivée" :
//                           column.id === "dateDepart" ? "Date de départ" :
//                           column.id === "nights" ? "Nuits" :
//                           column.id === "total" ? "Total" :
//                           column.id === "statut" ? "Statut" :
//                           column.id}
//                       </DropdownMenuCheckboxItem>
//                     );
//                   })}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <Button variant="default" size="sm" onClick={() => setIsAddBookingModalOpen(true)}>
//               <IconPlus className="mr-2" /> Ajouter
//             </Button>
//           </div>
//         </div>
//         <TabsContent
//           value="reservations"
//           className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
//         >
//           <div className="overflow-hidden rounded-lg border">
//             <Table>
//               <TableHeader className="bg-muted sticky top-0 z-10">
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => {
//                       return (
//                         <TableHead key={header.id} colSpan={header.colSpan}>
//                           {header.isPlaceholder
//                             ? null
//                             : flexRender(
//                                 header.column.columnDef.header,
//                                 header.getContext()
//                               )}
//                         </TableHead>
//                       );
//                     })}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody className="**:data-[slot=table-cell]:first:w-8">
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center">
//                       Chargement des réservations...
//                     </TableCell>
//                   </TableRow>
//                 ) : error ? (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
//                       {error}
//                     </TableCell>
//                   </TableRow>
//                 ) : table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id}>
//                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center">
//                       Aucune donnée disponible pour le moment.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//           <div className="flex items-center justify-between px-4">
//             <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
//               {table.getFilteredSelectedRowModel().rows.length} sur{" "}
//               {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
//             </div>
//             <div className="flex w-full items-center gap-8 lg:w-fit">
//               <div className="hidden items-center gap-2 lg:flex">
//                 <Label htmlFor="rows-per-page" className="text-sm font-medium">
//                   Lignes par page
//                 </Label>
//                 <Select
//                   value={`${table.getState().pagination.pageSize}`}
//                   onValueChange={(value) => {
//                     table.setPageSize(Number(value));
//                   }}
//                 >
//                   <SelectTrigger size="sm" className="w-20" id="rows-per-page">
//                     <SelectValue placeholder={table.getState().pagination.pageSize}/>
//                   </SelectTrigger>
//                   <SelectContent side="top">
//                     {[10, 20, 30, 40, 50].map((pageSize) => (
//                       <SelectItem key={pageSize} value={`${pageSize}`}>
//                         {pageSize}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex w-fit items-center justify-center text-sm font-medium">
//                 Page {table.getState().pagination.pageIndex + 1} sur{" "}
//                 {table.getPageCount()}
//               </div>
//               <div className="ml-auto flex items-center gap-2 lg:ml-0">
//                 <Button
//                   variant="outline"
//                   className="hidden h-8 w-8 p-0 lg:flex"
//                   onClick={() => table.setPageIndex(0)}
//                   disabled={!table.getCanPreviousPage()}
//                 >
//                   <span className="sr-only">Aller à la première page</span>
//                   <IconChevronsLeft />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="size-8"
//                   size="icon"
//                   onClick={() => table.previousPage()}
//                   disabled={!table.getCanPreviousPage()}
//                 >
//                   <span className="sr-only">Aller à la page précédente</span>
//                   <IconChevronLeft />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="size-8"
//                   size="icon"
//                   onClick={() => table.nextPage()}
//                   disabled={!table.getCanNextPage()}
//                 >
//                   <span className="sr-only">Aller à la page suivante</span>
//                   <IconChevronRight />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="hidden size-8 lg:flex"
//                   size="icon"
//                   onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//                   disabled={!table.getCanNextPage()}
//                 >
//                   <span className="sr-only">Aller à la dernière page</span>
//                   <IconChevronsRight />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>

//       <AddBookingModal
//         open={isAddBookingModalOpen}
//         onOpenChange={setIsAddBookingModalOpen}
//         onAddBooking={handleAddBooking}
//       />
//     </>
//   );
// }