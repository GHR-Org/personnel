// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// import * as React from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// // import { useIsMobile } from "@/hooks/use-mobile"; // Commenté car non utilisé dans l'extrait fourni
// import { AddBookingModal } from "@/components/modals/AddBookingModal";
// import { ReservationDetailsDrawer } from "@/components/reservationComponents/ReservationDetailsDrawer";
// import { ViewarheeModal } from "@/components/modals/ViewarheeModal";
// import {
//   ContextMenu,
//   ContextMenuContent,
//   ContextMenuItem,
//   ContextMenuSeparator,
//   ContextMenuTrigger,
// } from "@/components/ui/context-menu";
// import { differenceInDays, format, addDays } from "date-fns";
// import { fr } from "date-fns/locale";
// import { toast } from "sonner";

// import {
//   IconLogin2,
//   IconLogout2,
//   IconEdit,
//   IconTrash,
//   IconX,
// } from "@tabler/icons-react";
// import { cn } from "@/lib/utils";

// import { ReportIncidentModal } from "@/components/modals/ReportIncidentModal";

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useState, useEffect } from "react";

// // Importez vos schémas et enums
// import { BookingManuelSchema, BookingFormInputs } from "@/schemas/reservation";
// import { ReservationStatut } from "@/lib/enum/ReservationStatus";
// import { ModeCheckin } from "@/lib/enum/ModeCheckin"; // Ajoutez si utilisé ailleurs que dans les schémas
// import { Sexe } from "@/lib/enum/Civilite"; // Ajoutez si utilisé ailleurs que dans les schémas
// import { ModePaiment } from "@/lib/enum/ModePaiment"; // Ajoutez si utilisé ailleurs que dans les schémas


// // Type pour une réservation (simplifié pour l'exemple, utilisez votre type Zod pour plus de rigueur)
// // Si vous utilisez `z.infer<typeof BookingManuelSchema>`, assurez-vous que tous les champs attendus par le composant sont bien inclus.
// // J'ai ajouté un 'id' optionnel pour les nouvelles réservations qui n'ont pas encore d'ID.
// interface Reservation extends BookingFormInputs {
//   id: string; // L'ID est requis pour les réservations existantes, mais peut être null pour une nouvelle
//   chambre_id: number; // Renommé de 'chambre_id' pour correspondre à votre utilisation dans le JSX
//   status: ReservationStatut; // Renommé de 'status' pour correspondre à votre utilisation dans le JSX
// }

// interface RoomEntry {
//   room: number;
// }

// const initialRoomData: RoomEntry[] = [
//   { room: 101 },
//   { room: 102 },
//   { room: 103 },
//   { room: 104 },
//   { room: 105 },
//   { room: 106 },
//   { room: 201 },
//   { room: 202 },
//   { room: 203 },
// ];

// function getWeekNumber(d: Date): number {
//   d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
//   d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
//   const yearStart = new Date(Date.UTC(d.getFullYear(), 0, 1));
//   const weekNo = Math.ceil(
//     ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
//   );
//   return weekNo;
// }

// // Styles pour les statuss de réservation
// const reservationStatusStyle: Record<ReservationStatut, string> = {
//   [ReservationStatut.CONFIRMEE]: "bg-blue-500 hover:bg-blue-600 text-white",
//   [ReservationStatut.ARRIVEE]: "bg-green-500 hover:bg-green-600 text-white",
//   [ReservationStatut.EN_ATTENTE]: "bg-yellow-500 hover:bg-yellow-600 text-white",
//   [ReservationStatut.ANNULEE]: "bg-red-500 hover:bg-red-600 text-white line-through opacity-70",
//   [ReservationStatut.TERMINEE]: "bg-gray-500 hover:bg-gray-600 text-white opacity-80",
// };

// // --- Fonctions de simulation d'API ---
// // Remplacez ces fonctions par vos appels API réels
// const fetchReservations = async (startDate: Date, endDate: Date): Promise<Reservation[]> => {
//   console.log(`Simulating fetch from ${startDate.toISOString()} to ${endDate.toISOString()}`);
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // Données de réservation d'exemple
//       const reservations: Reservation[] = [
//         {
//           id: "res-1",
//           chambre_id: 101,
//           date_arrivee: "2025-07-29",
//           date_depart: "2025-08-02",
//           duree: 4,
//           status: ReservationStatut.CONFIRMEE,
//           nbr_adultes: 2,
//           nbr_enfants: 0,
//           client_id: 1,
//           mode_checkin: ModeCheckin.NUMERIQUE,
//           code_checkin: "CODE123",
//           montant: 50,
//           date_paiement: "2025-07-20",
//           mode_paiement: ModePaiment.ESPECES,
//           commentaireSejour: "Vue sur la mer",
//           civilite: Civilite.MADAME,
//           first_name: "Jean",
//           last_name: "Dupont",
//           adresse: "10 Rue Principale",
//           ville: "Paris",
//           pays: "France",
//           phone: "0123456789",
//           email: "jean.dupont@example.com",
//           date_reservation: "2025-07-15"
//         },
//         {
//           id: "res-2",
//           chambre_id: 103,
//           date_arrivee: "2025-07-31",
//           date_depart: "2025-08-01",
//           duree: 1,
//           status: ReservationStatut.ANNULEE,
//           nbr_adultes: 1,
//           nbr_enfants: 0,
//           client_id: 2,
//           mode_checkin: ModeCheckin.NUMERIQUE,
//           code_checkin: "CODE456",
//           montant: 0,
//           date_paiement: "2025-07-25",
//           mode_paiement: ModePaiment.CARTE_CREDIT,
//           civilite: Civilite.MADAME,
//           first_name: "Marie",
//           last_name: "Curie",
//           adresse: "221B Baker Street",
//           ville: "Londres",
//           pays: "Royaume-Uni",
//           phone: "0987654321",
//           email: "marie.curie@example.com",
//           date_reservation: "2025-07-20"
//         },
//         {
//           id: "res-3",
//           chambre_id: 201,
//           date_arrivee: "2025-08-05",
//           date_depart: "2025-08-07",
//           duree: 2,
//           status: ReservationStatut.EN_ATTENTE,
//           nbr_adultes: 3,
//           nbr_enfants: 1,
//           client_id: 3,
//           mode_checkin: ModeCheckin.MANUELLE,
//           code_checkin: "CODE789",
//           montant: 100,
//           date_paiement: "2025-07-28",
//           mode_paiement: ModePaiment.VIREMENT,
//           civilite: Civilite.MADEMOISELLE,
//           first_name: "Ahmed",
//           last_name: "Benali",
//           adresse: "15 Rue de la Liberté",
//           ville: "Casablanca",
//           pays: "Maroc",
//           phone: "0601020304",
//           email: "ahmed.benali@example.com",
//           date_reservation: "2025-07-25"
//         },
//         {
//           id: "res-4",
//           chambre_id: 102,
//           date_arrivee: "2025-07-20",
//           date_depart: "2025-07-25",
//           duree: 5,
//           status: ReservationStatut.TERMINEE, // Exemple de réservation terminée
//           nbr_adultes: 2,
//           nbr_enfants: 0,
//           client_id: 4,
//           mode_checkin: ModeCheckin.MANUELLE,
//           code_checkin: "CODEABC",
//           montant: 0,
//           date_paiement: "2025-07-18",
//           mode_paiement: ModePaiment.ESPECES,
//           civilite: Civilite.MONSIEUR,
//           first_name: "Pierre",
//           last_name: "Durand",
//           adresse: "5 Avenue des Champs",
//           ville: "Lyon",
//           pays: "France",
//           phone: "0712345678",
//           email: "pierre.durand@example.com",
//           date_reservation: "2025-07-10"
//         },
//         {
//           id: "res-5",
//           chambre_id: 104,
//           date_arrivee: "2025-08-01",
//           date_depart: "2025-08-03",
//           duree: 2,
//           status: ReservationStatut.CONFIRMEE,
//           nbr_adultes: 1,
//           nbr_enfants: 1,
//           client_id: 5,
//           mode_checkin: ModeCheckin.MANUELLE,
//           code_checkin: "CODEDEF",
//           montant: 30,
//           date_paiement: "2025-07-29",
//           mode_paiement: ModePaiment.VIREMENT,
//           civilite: Civilite.MADEMOISELLE,
//           first_name: "Sophie",
//           last_name: "Martin",
//           adresse: "8 Rue du Commerce",
//           ville: "Nantes",
//           pays: "France",
//           phone: "0699887766",
//           email: "sophie.martin@example.com",
//           date_reservation: "2025-07-26"
//         },
//         // Réservation qui chevauche aujourd'hui mais se termine aujourd'hui ou avant
//         {
//           id: "res-6",
//           chambre_id: 106,
//           date_arrivee: "2025-07-28",
//           date_depart: "2025-07-31", // Se termine aujourd'hui
//           duree: 3,
//           status: ReservationStatut.ARRIVEE,
//           nbr_adultes: 2,
//           nbr_enfants: 0,
//           client_id: 6,
//           mode_checkin: ModeCheckin.MANUELLE,
//           code_checkin: "CODEGHI",
//           montant: 0,
//           date_paiement: "2025-07-27",
//           mode_paiement: ModePaiment.ESPECES,
//           civilite: Civilite.MONSIEUR,
//           first_name: "Paul",
//           last_name: "Lefevre",
//           adresse: "3 Rue du Port",
//           ville: "Bordeaux",
//           pays: "France",
//           phone: "0755443322",
//           email: "paul.lefevre@example.com",
//           date_reservation: "2025-07-26"
//         },
//         // Réservation annulée (ne devrait pas s'afficher sur le calendrier principal)
//         {
//           id: "res-7",
//           chambre_id: 202,
//           date_arrivee: "2025-08-10",
//           date_depart: "2025-08-12",
//           duree: 2,
//           status: ReservationStatut.ANNULEE,
//           nbr_adultes: 1,
//           nbr_enfants: 0,
//           client_id: 7,
//           mode_checkin: ModeCheckin.MANUELLE,
//           code_checkin: "CODEJKL",
//           montant: 0,
//           date_paiement: "2025-08-01",
//           mode_paiement: ModePaiment.VIREMENT,
//           civilite: Civilite.MONSIEUR,
//           first_name: "Luc",
//           last_name: "Bernard",
//           adresse: "1 Rue des Vignes",
//           ville: "Reims",
//           pays: "France",
//           phone: "0611223344",
//           email: "luc.bernard@example.com",
//           date_reservation: "2025-08-01"
//         },
//       ];

//       // Filtrer les réservations pour qu'elles correspondent à la plage de dates demandée
//       const filtered = reservations.filter(res => {
//         const resArrival = new Date(res.date_arrivee);
//         const resDeparture = new Date(res.date_depart);
//         resArrival.setHours(0, 0, 0, 0);
//         resDeparture.setHours(0, 0, 0, 0);

//         return (
//           (resArrival < endDate && resDeparture > startDate)
//         );
//       });

//       resolve(filtered);
//     }, 500); // Simule un délai de 500ms
//   });
// };

// const createReservationApi = async (data: BookingFormInputs): Promise<Reservation> => {
//   console.log("Simulating API call: createReservation", data);
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const newReservation: Reservation = {
//         ...data,
//         id: `res-${Date.now()}`, 
//         chambre_id: data.chambre_id, 
//         status: data.status, 
//       };
//       resolve(newReservation);
//     }, 500);
//   });
// };

// const updateReservationApi = async (id: string, data: Partial<BookingFormInputs>): Promise<Reservation> => {
//   console.log(`Simulating API call: updateReservation ${id}`, data);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // Dans une vraie app, vous trouveriez la réservation par ID et la mettriez à jour
//       // Ici, on simule juste le retour
//       const updatedReservation: Reservation = {
//         id: id,
//         chambre_id: data.chambre_id !== undefined ? data.chambre_id : 0, // Fallback si non fourni
//         date_arrivee: data.date_arrivee || "",
//         date_depart: data.date_depart || "",
//         duree: data.duree || 0,
//         status: data.status || ReservationStatut.CONFIRMEE, // Fallback
//         nbr_adultes: data.nbr_adultes || 0,
//         nbr_enfants: data.nbr_enfants || 0,
//         client_id: data.client_id,
//         mode_checkin: data.mode_checkin || ModeCheckin.MANUELLE,
//         code_checkin: data.code_checkin || "",
//         montant: data.montant || 0,
//         date_paiement: data.date_paiement || "",
//         mode_paiement: data.mode_paiement || ModePaiment.ESPECES,
//         commentaireSejour: data.commentaireSejour,
//         civilite: data.civilite || Civilite.MONSIEUR,
//         first_name: data.first_name || "",
//         last_name: data.last_name || "",
//         adresse: data.adresse || "",
//         ville: data.ville || "",
//         pays: data.pays || "",
//         phone: data.phone || "",
//         email: data.email || "",
//         date_reservation: data.date_reservation || format(new Date(), 'yyyy-MM-dd'),
//         // Ajoutez d'autres champs si nécessaire
//       };
//       resolve(updatedReservation);
//     }, 500);
//   });
// };

// const deleteReservationApi = async (id: string): Promise<void> => {
//   console.log(`Simulating API call: deleteReservation ${id}`);
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, 500);
//   });
// };

// const updateReservationStatusApi = async (id: string, status: ReservationStatut): Promise<void> => {
//   console.log(`Simulating API call: updateReservationStatus ${id} to ${status}`);
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, 500);
//   });
// };


// export function RoomCalendar() {
//   const queryClient = useQueryClient();

//   // --- États pour la logique du calendrier et des modales ---
//   const [timeRange, setTimeRange] = useState<string>("30d"); // Valeur par défaut pour la plage de temps
//   const [currentRoomData, setCurrentRoomData] = useState<RoomEntry[]>(initialRoomData);

//   // États pour les modales
//   const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
//   const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
//   const [isarheeModalOpen, setIsarheeModalOpen] = useState(false);
//   const [isReportIncidentModalOpen, setIsReportIncidentModalOpen] = useState(false);

//   const [prefilledDataForNewReservation, setPrefilledDataForNewReservation] = useState<{ roomNumber: number; date: Date } | null>(null);
//   const [reservationToEdit, setReservationToEdit] = useState<Reservation | null>(null);
//   const [reservationToView, setReservationToView] = useState<Reservation | null>(null);
//   const [arheeToView, setarheeToView] = useState<Reservation | null>(null);
//   const [reservationForReport, setReservationForReport] = useState<Reservation | null>(null);

//   // --- Calcul de la plage de dates ---
//   const today = new Date();
//   today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour les comparaisons
//   const todayFormatted = format(today, "yyyy-MM-dd");

//   const rangeInDays = React.useMemo(() => {
//     switch (timeRange) {
//       case "7d":
//         return 7;
//       case "30d":
//         return 30;
//       case "90d":
//         return 90;
//       default:
//         return 30; // Par défaut
//     }
//   }, [timeRange]);

//   const displayDateRange = React.useMemo(() => {
//     return Array.from({ length: rangeInDays }).map((_, i) => addDays(today, i));
//   }, [rangeInDays, today]);

//   const startDateForQuery = displayDateRange[0];
//   const endDateForQuery = addDays(displayDateRange[displayDateRange.length - 1], 1); // Inclure le dernier jour complet


//   // --- Queries TanStack Query pour les réservations ---
//   const { data: currentReservations = [], isLoading, isError, error } = useQuery<Reservation[], Error>({
//     queryKey: ["reservations", format(startDateForQuery, "yyyy-MM-dd"), format(endDateForQuery, "yyyy-MM-dd")],
//     queryFn: () => fetchReservations(startDateForQuery, endDateForQuery),
//     staleTime: 5 * 60 * 1000, // Les données sont "stale" après 5 minutes
//     refetchOnWindowFocus: false, // Ne pas refetch quand la fenêtre regagne le focus
//   });


//   // --- Mutations TanStack Query ---
//   const createReservationMutation = useMutation({
//     mutationFn: createReservationApi,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["reservations"] }); // Invalide le cache pour rafraîchir les données
//       toast.success("Réservation ajoutée avec succès !");
//       handleCloseReservationSheet();
//     },
//     onError: (err) => {
//       toast.error(`Erreur lors de l'ajout de la réservation : ${err.message}`);
//     },
//   });

//   const updateReservationMutation = useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Partial<BookingFormInputs> }) => updateReservationApi(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["reservations"] });
//       toast.success("Réservation mise à jour avec succès !");
//       handleCloseReservationSheet();
//     },
//     onError: (err) => {
//       toast.error(`Erreur lors de la mise à jour de la réservation : ${err.message}`);
//     },
//   });

//   const deleteReservationMutation = useMutation({
//     mutationFn: deleteReservationApi,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["reservations"] });
//       toast.success("Réservation supprimée avec succès !");
//       handleCloseReservationSheet();
//     },
//     onError: (err) => {
//       toast.error(`Erreur lors de la suppression de la réservation : ${err.message}`);
//     },
//   });

//   const updateReservationStatusMutation = useMutation({
//     mutationFn: ({ id, status }: { id: string; status: ReservationStatut }) => updateReservationStatusApi(id, status),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["reservations"] });
//       toast.success("Statut de la réservation mis à jour !");
//       handleCloseReservationSheet();
//     },
//     onError: (err) => {
//       toast.error(`Erreur lors de la mise à jour du status : ${err.message}`);
//     },
//   });


//   // --- Fonctions de gestion des modales et actions ---
//   const openAddReservationModal = (roomNumber: number, date: Date) => {
//     setPrefilledDataForNewReservation({ roomNumber, date });
//     setReservationToEdit(null); // S'assurer que ce n'est pas un mode édition
//     setIsReservationModalOpen(true);
//   };

//   const openEditReservationModal = (reservation: Reservation) => {
//     setReservationToEdit(reservation);
//     setPrefilledDataForNewReservation(null);
//     setIsReservationModalOpen(true);
//     setIsDetailsDrawerOpen(false); // Ferme le tiroir si ouvert
//   };

//   const openDetailsDrawer = (reservation: Reservation) => {
//     setReservationToView(reservation);
//     setIsDetailsDrawerOpen(true);
//   };

//   const openarheeModal = (reservation: Reservation) => {
//     setarheeToView(reservation);
//     setIsarheeModalOpen(true);
//     setIsDetailsDrawerOpen(false); // Ferme le tiroir si ouvert
//   };

//   const openReportIncidentModal = (reservation: Reservation) => {
//     setReservationForReport(reservation);
//     setIsReportIncidentModalOpen(true);
//     setIsDetailsDrawerOpen(false); // Ferme le tiroir si ouvert
//   };

//   const handleCloseReservationSheet = () => {
//     setIsReservationModalOpen(false);
//     setIsDetailsDrawerOpen(false);
//     setIsarheeModalOpen(false);
//     setIsReportIncidentModalOpen(false);
//     setPrefilledDataForNewReservation(null);
//     setReservationToEdit(null);
//     setReservationToView(null);
//     setarheeToView(null);
//     setReservationForReport(null);
//   };

//   const handleSaveReservation = async (data: BookingFormInputs) => {
//     if (reservationToEdit) {
//       // Mode édition
//       await updateReservationMutation.mutateAsync({ id: reservationToEdit.id, data });
//     } else {
//       // Mode nouvelle réservation
//       await createReservationMutation.mutateAsync(data);
//     }
//   };

//   const handleDeleteReservation = async (id: string) => {
//     if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
//       await deleteReservationMutation.mutateAsync(id);
//     }
//   };

//   const handleCheckInClient = async (id: string) => {
//     await updateReservationStatusMutation.mutateAsync({ id, status: ReservationStatut.ARRIVEE });
//   };

//   const handleCheckoutReservation = async (id: string) => {
//     await updateReservationStatusMutation.mutateAsync({ id, status: ReservationStatut.TERMINEE });
//   };

//   const handleCancelReservation = async (id: string) => {
//     if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
//       await updateReservationStatusMutation.mutateAsync({ id, status: ReservationStatut.ANNULEE });
//     }
//   };

//   const handleRequestCleaning = (roomNumber: string) => {
//     toast.info(`Demande de nettoyage envoyée pour la chambre ${roomNumber}. (Fonctionnalité à implémenter)`);
//     // Implémentez ici la logique pour envoyer la demande de nettoyage
//   };

//   // Fonctions de rappel pour les mises à jour et suppressions depuis les modales/tiroirs
//   const handleBookingUpdated = (updatedReservation: Reservation) => {
//     // Cela invalidera le cache et forcera un refetch
//     queryClient.invalidateQueries({ queryKey: ["reservations"] });
//     // Si le tiroir de détails est toujours ouvert, mettez à jour la réservation affichée
//     setReservationToView(updatedReservation);
//   };

//   const handleBookingDeleted = () => {
//     queryClient.invalidateQueries({ queryKey: ["reservations"] });
//     handleCloseReservationSheet();
//   };

//   if (isLoading) {
//     return (
//       <Card className="mx-auto w-full max-w-full overflow-hidden shadow-sm border @container/card">
//         <CardContent className="p-8 text-center">Chargement des réservations...</CardContent>
//       </Card>
//     );
//   }

//   if (isError) {
//     return (
//       <Card className="mx-auto w-full max-w-full overflow-hidden shadow-sm border @container/card">
//         <CardContent className="p-8 text-center text-red-600">
//           Erreur lors du chargement des réservations: {error?.message || "Une erreur inconnue est survenue."}
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <>
//       <Card className="mx-auto w-full max-w-full overflow-hidden shadow-sm border @container/card">
//         <CardHeader className="flex flex-col justify-between gap-4 border-b px-6 py-4 sm:flex-row sm:items-center">
//           <div>
//             <CardTitle className="text-2xl font-bold text-foreground">
//               Calendrier des Chambres
//             </CardTitle>
//             <CardDescription className="mt-1 text-base text-muted-foreground">
//               Visualisez l’occupation à partir d&apos;aujourd&apos;hui, le{" "}
//               {new Date().toLocaleDateString("fr-FR", {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//               .
//             </CardDescription>
//           </div>
//           <div className="mt-4 flex flex-col items-center justify-end gap-3 sm:mt-0 @[767px]/card:flex-row">
//             <ToggleGroup
//               type="single"
//               value={timeRange}
//               onValueChange={setTimeRange}
//               variant="outline"
//               className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
//             >
//               <ToggleGroupItem value="90d">90 jours</ToggleGroupItem>
//               <ToggleGroupItem value="30d">30 jours</ToggleGroupItem>
//               <ToggleGroupItem value="7d">7 jours</ToggleGroupItem>
//             </ToggleGroup>
//             <Select value={timeRange} onValueChange={setTimeRange}>
//               <SelectTrigger className="w-40 @[767px]/card:hidden" size="sm">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="90d">90 jours</SelectItem>
//                 <SelectItem value="30d">30 jours</SelectItem>
//                 <SelectItem value="7d">7 jours</SelectItem>
//               </SelectContent>
//             </Select>
//             <Button
//               onClick={() => {
//                 setReservationToEdit(null);
//                 setPrefilledDataForNewReservation(null);
//                 setIsReservationModalOpen(true);
//               }}
//             >
//               Ajouter une nouvelle réservation
//             </Button>
//           </div>
//         </CardHeader>

//         <CardContent className="p-4">
//           <div className="relative min-h-[400px] overflow-x-auto rounded-md border">
//             <div
//               className="grid gap-px rounded-t-md border-b bg-background sticky top-0 z-20"
//               style={{
//                 gridTemplateColumns: `auto repeat(${rangeInDays}, minmax(80px, 1fr))`,
//               }}
//             >
//               <div className="sticky left-0 z-10 w-20 rounded-tl-md border-b border-r bg-background px-4 py-3 text-left font-semibold">
//                 Chambre
//               </div>
//               {displayDateRange.map((dateObj, index) => {
//                 const dateFormatted = dateObj.toISOString().split("T")[0];
//                 const isTodayColumn = dateFormatted === todayFormatted;

//                 return (
//                   <div
//                     key={dateFormatted}
//                     className={cn(
//                       `px-3 py-2 text-center text-xs font-semibold border-b border-r`,
//                       isTodayColumn ? "bg-primary/10" : "bg-background"
//                     )}
//                   >
//                     <span className="block text-muted-foreground">
//                       {dateObj.toLocaleDateString("fr-FR", {
//                         weekday: "short",
//                       })}
//                     </span>
//                     <span className="block font-bold">
//                       {format(dateObj, "dd")}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>

//             <div
//               className="relative grid gap-px bg-border"
//               style={{
//                 gridTemplateColumns: `auto repeat(${rangeInDays}, minmax(80px, 1fr))`,
//                 gridAutoRows: "minmax(60px, auto)",
//               }}
//             >
//               {currentRoomData.map((room, rowIndex) => (
//                 <React.Fragment key={room.room}>
//                   <div
//                     className={`sticky left-0 z-10 flex w-20 items-center border-b border-r bg-card px-4 py-3 font-medium`}
//                     style={{ gridColumn: "1", gridRow: rowIndex + 1 }}
//                   >
//                     {room.room}
//                   </div>

//                   {displayDateRange.map((dateObj, colIndex) => {
//                     const dateFormatted = format(dateObj, "yyyy-MM-dd");
//                     const isTodayCell = dateFormatted === todayFormatted;

//                     // Normaliser les dates pour les comparaisons (ignorer l'heure)
//                     const normalizeDate = (d: Date | string) => {
//                       const date = typeof d === 'string' ? new Date(d) : d;
//                       const normalized = new Date(date);
//                       normalized.setHours(0, 0, 0, 0);
//                       return normalized;
//                     };

//                     const isCellOccupiedByExistingBooking =
//                       currentReservations.some(
//                         (r) =>
//                           r.chambre_id === room.room &&
//                           r.status !== ReservationStatut.ANNULEE && // Ignorer les annulées
//                           r.status !== ReservationStatut.TERMINEE && // Ignorer les terminées
//                           normalizeDate(r.date_arrivee) <= normalizeDate(dateObj) &&
//                           normalizeDate(r.date_depart) > normalizeDate(dateObj) // La date de départ est exclusive
//                       );

//                     return (
//                       <div
//                         key={`${room.room}-${dateFormatted}-cell`}
//                         className={cn(
//                           `relative p-0.5 border-b border-r min-h-[60px]`,
//                           isTodayCell ? "bg-primary/5" : "bg-white dark:bg-card-foreground/5",
//                           isCellOccupiedByExistingBooking ? "cursor-not-allowed" : "cursor-pointer" // Visuel pour les cellules occupées
//                         )}
//                         style={{ gridRow: rowIndex + 1 }}
//                         onClick={() => {
//                           if (!isCellOccupiedByExistingBooking) {
//                             openAddReservationModal(room.room, dateObj);
//                           } else {
//                             toast.info(
//                               "Cette cellule est déjà occupée ou fait partie d'une réservation existante. Faites un clic droit sur la réservation pour plus d'options."
//                             );
//                           }
//                         }}
//                       >
//                       </div>
//                     );
//                   })}
//                 </React.Fragment>
//               ))}

//               {currentReservations.map((reservation) => {
//                 // Filtrer les réservations qui sont annulées ou terminées pour ne pas les afficher directement sur le calendrier
//                 if (
//                   reservation.status === ReservationStatut.ANNULEE ||
//                   reservation.status === ReservationStatut.TERMINEE
//                 ) {
//                   return null;
//                 }

//                 const roomIndex = currentRoomData.findIndex(
//                   (r) => r.room === reservation.chambre_id
//                 );
//                 if (roomIndex === -1) return null; // Ne pas afficher si la chambre n'est pas dans la liste

//                 const startDate = new Date(reservation.date_arrivee);
//                 startDate.setHours(0, 0, 0, 0);
//                 const endDate = new Date(reservation.date_depart);
//                 endDate.setHours(0, 0, 0, 0);

//                 const startIndex = displayDateRange.findIndex(
//                   (d) =>
//                     format(d, "yyyy-MM-dd") === format(startDate, "yyyy-MM-dd")
//                 );

//                 // Si la date de début de la réservation est au-delà de la plage affichée, ne pas l'afficher
//                 if (startIndex === -1 && startDate > displayDateRange[displayDateRange.length - 1]) return null;

//                 // Calcul du nombre de jours à afficher pour la réservation
//                 // La date de départ est exclusive, donc la durée est (endDate - startDate)
//                 let durationInDays = differenceInDays(endDate, startDate);

//                 // Si la réservation commence avant la plage affichée, ajuster startIndex et durationInDays
//                 let actualStartIndex = startIndex;
//                 if (startIndex === -1 && startDate < displayDateRange[0]) {
//                   actualStartIndex = 0; // Commencer au début de la plage affichée
//                   durationInDays = differenceInDays(endDate, displayDateRange[0]);
//                 }


//                 // S'assurer que la durée est au moins 1 jour visible
//                 const durationInCells = Math.max(1, durationInDays);

//                 // Calcul des colonnes dans le grid CSS
//                 const gridColumnStart = actualStartIndex + 2; // +1 pour la colonne 'Room', +1 pour l'index 0-based
//                 let gridColumnEnd = gridColumnStart + durationInCells;

//                 // Si la réservation dépasse la fin de la plage affichée, la tronquer visuellement
//                 if (gridColumnEnd > rangeInDays + 2) {
//                   gridColumnEnd = rangeInDays + 2;
//                 }

//                 // Ne pas afficher si la réservation est entièrement en dehors de la plage visible
//                 if (gridColumnStart >= rangeInDays + 2 || gridColumnEnd <= 1) return null;

                
//                 const gridRow = rowIndex + 1;

//                 return (
//                   <ContextMenu key={`reservation-${reservation.id}-grid`}>
//                     <ContextMenuTrigger asChild>
//                       <button
//                         className={cn(
//                           `p-1 rounded-md text-xs font-medium overflow-hidden whitespace-nowrap text-ellipsis flex items-center justify-center cursor-pointer shadow-sm z-20 absolute`,
//                           reservationStatusStyle[reservation.status] ||
//                             "bg-gray-400 hover:bg-gray-500 text-white"
//                         )}
//                         style={{
//                           gridColumn: `${gridColumnStart} / ${gridColumnEnd}`,
//                           gridRow: gridRow,
//                           alignSelf: "stretch",
//                           justifySelf: "stretch",
//                           margin: "0",
//                           left: "0.5px", // Ajustement pour le gap
//                           right: "0.5px", // Ajustement pour le gap
//                           height: "calc(100% - 1px)", // Ajustement pour le gap
//                         }}
//                         onClick={() => openDetailsDrawer(reservation)}
//                       >
//                         {reservation.first_name}{" "}
//                         {reservation.last_name
//                           ? reservation.last_name.charAt(0) + "."
//                           : ""}
//                       </button>
//                     </ContextMenuTrigger>
//                     <ContextMenuContent>
//                       <ContextMenuItem
//                         onClick={() => openEditReservationModal(reservation)}
//                       >
//                         <IconEdit className="mr-2 h-4 w-4" /> Modifier la fiche réservation
//                       </ContextMenuItem>
//                       <ContextMenuItem onClick={handleCloseReservationSheet}>
//                         <IconX className="mr-2 h-4 w-4" /> Quitter la fiche
//                       </ContextMenuItem>
//                       <ContextMenuItem
//                         onClick={() => handleCheckInClient(reservation.id!)}
//                         disabled={
//                           reservation.status === ReservationStatut.ARRIVEE // Désactiver si déjà arrivée
//                         }
//                       >
//                         <IconLogin2 className="mr-2 h-4 w-4" /> Faire arriver le client
//                       </ContextMenuItem>
//                       <ContextMenuItem
//                         onClick={() => openarheeModal(reservation)}
//                       >
//                         Voir les arhee
//                       </ContextMenuItem>
//                       <ContextMenuItem
//                         onClick={() => openDetailsDrawer(reservation)}
//                       >
//                         Détails de la réservation
//                       </ContextMenuItem>
//                       <ContextMenuSeparator />
//                       <ContextMenuItem
//                         onClick={() => handleCancelReservation(reservation.id!)}
//                         disabled={
//                           reservation.status === ReservationStatut.ANNULEE.toString() || // Désactiver si déjà annulée
//                           reservation.status === ReservationStatut.TERMINEE.toString() // Ne peut annuler une réservation terminée
//                         }
//                       >
//                         <IconX className="mr-2 h-4 w-4" /> Annulation
//                       </ContextMenuItem>
//                       <ContextMenuItem
//                         onClick={() => handleCheckoutReservation(reservation.id!)}
//                         disabled={
//                           reservation.status !== ReservationStatut.ARRIVEE // Ne peut dégager si pas "Arrivé"
//                         }
//                       >
//                         <IconLogout2 className="mr-2 h-4 w-4" /> Dégagement automatique
//                       </ContextMenuItem>
//                       <ContextMenuSeparator />
//                       <ContextMenuItem
//                         onClick={() => handleRequestCleaning(reservation.chambre_id.toString())}
//                       >
//                         Demander nettoyage
//                       </ContextMenuItem>
//                       <ContextMenuItem
//                         onClick={() => openReportIncidentModal(reservation)}
//                       >
//                         Rapport & Incidents
//                       </ContextMenuItem>
//                       <ContextMenuItem
//                         onClick={() => {
//                           toast.info(
//                             "Fonctionnalité 'Imprimer' à implémenter."
//                           );
//                         }}
//                       >
//                         Imprimer
//                       </ContextMenuItem>
//                         <ContextMenuSeparator />
//                       <ContextMenuItem
//                         onClick={() => handleDeleteReservation(reservation.id!)}
//                         className="text-red-600 focus:bg-red-50 focus:text-red-600"
//                       >
//                         <IconTrash className="mr-2 h-4 w-4" /> Supprimer la réservation
//                       </ContextMenuItem>
//                     </ContextMenuContent>
//                   </ContextMenu>
//                 );
//               })}
//             </div>

//             <div
//               className="grid gap-px rounded-b-md bg-border mt-4"
//               style={{
//                 gridTemplateColumns: `auto repeat(${rangeInDays}, minmax(80px, 1fr))`,
//               }}
//             >
//               <div className="sticky left-0 z-10 rounded-bl-md border-r bg-background px-4 py-2 text-left font-semibold">
//                 Semaine
//               </div>
//               {displayDateRange.map((dateObj, index) => (
//                 <div
//                   key={`week-num-${format(dateObj, "yyyy-MM-dd")}`}
//                   className={`border-r px-3 py-2 text-center text-xs font-semibold text-muted-foreground`}
//                 >
//                   {getWeekNumber(dateObj)}{" "}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <AddBookingModal
//         isOpen={isReservationModalOpen}
//         onClose={handleCloseReservationSheet}
//         onSave={handleSaveReservation}
//         initialData={prefilledDataForNewReservation}
//         reservationToEdit={reservationToEdit}
//       />

//       <ReservationDetailsDrawer
//         open={isDetailsDrawerOpen}
//         onclose={handleCloseReservationSheet}
//         reservation={reservationToView}
//         onEdit={openEditReservationModal}
//         onCheckIn={handleCheckInClient}
//         onCheckout={handleCheckoutReservation}
//         onCancel={handleCancelReservation}
//         onDelete={handleDeleteReservation}
//         onBookingUpdated={handleBookingUpdated}
//         onBookingDeleted={handleBookingDeleted}
//       />

//       <ViewarheeModal
//         open={isarheeModalOpen}
//         onClose={handleCloseReservationSheet}
//         reservation={arheeToView}
//       />

//       {/* Modale pour le rapport d'incident */}
//       {isReportIncidentModalOpen && reservationForReport && (
//         <ReportIncidentModal
//           open={isReportIncidentModalOpen}
//           onClose={handleCloseReservationSheet}
//           reservation={reservationForReport}
//         />
//       )}
//     </>
//   );
// }
export default function RoomCalendar(){
  return <div>RoomCalendar Component</div>
}