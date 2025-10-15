"use client";

import NotFound404 from "@/components/404";

// import React, { useState } from "react";
// import RoomCalendar from "@/lib/test/RoomCalendar";
// import { rooms, reservations as initialReservations } from "@/lib/test/roomCalendarTestData";
// import type { BookingEvent } from "@/types/reservation";

// export default function CalendarPage() {
//   const [reservations, setReservations] = useState<BookingEvent[]>(initialReservations);
//   const todayStr = new Date().toISOString().slice(0, 10);

//   // Callbacks à compléter ou mocker pour les interactions
//   const handleReservationMove = ({ id, new_arrivee, new_depart }: { id: string; new_arrivee: string; new_depart: string }) => {
//     setReservations((current) =>
//       current.map((r) => (r.id === id ? { ...r, date_arrivee: new_arrivee, date_depart: new_depart } : r))
//     );
//   };

//   const handleReservationResize = ({ id, new_arrivee, new_depart }: { id: string; new_arrivee: string; new_depart: string }) => {
//     setReservations((current) =>
//       current.map((r) => (r.id === id ? { ...r, date_arrivee: new_arrivee, date_depart: new_depart } : r))
//     );
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Calendrier des chambres</h1>
//       <RoomCalendar
//         rooms={rooms}
//         reservations={reservations}
//         startDate={todayStr}
//         onSelectSlot={({ date_arrivee, date_depart, chambre_id }) =>
//           alert(`Création réservation: chambre ${chambre_id} du ${date_arrivee} au ${date_depart}`)
//         }
//         openDetailsDrawer={(res) => alert(`Détails réservation: ${res.first_name} ${res.last_name}`)}
//         openEditReservationModal={(res) => alert(`Modifier réservation: ${res.id}`)}
//         handleCheckInClient={(id) => alert(`Check-in client réservation ${id}`)}
//         openarheeModal={(res) => alert(`arhee réservation: ${res.id}`)}
//         handleCancelReservation={(id) => alert(`Annuler réservation: ${id}`)}
//         handleCheckoutReservation={(id) => alert(`Checkout réservation: ${id}`)}
//         handleRequestCleaning={(roomId) => alert(`Demande nettoyage chambre: ${roomId}`)}
//         openReportIncidentModal={(res) => alert(`Incident réservation: ${res.id}`)}
//         handleDeleteReservation={(id) =>
//           confirm("Confirmer suppression ?") && setReservations((current) => current.filter((r) => r.id !== id))
//         }
//         onReservationMove={handleReservationMove}
//         onReservationResize={handleReservationResize}
//         enableVirtualization={true}
//       />
//     </div>
//   );
// }
export default function Page(){
  return(
    <>
    <NotFound404 />
    </>
  )
}