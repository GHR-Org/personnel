// src/data/roomCalendarTestData.ts

import { addDays } from "date-fns";
import { Civilite } from "../enum/Civilite";
import { ModeCheckin } from "../enum/ModeCheckin";
import { ReservationStatut } from "../enum/ReservationStatus";
import { Room } from "./RoomCalendar";
import { BookingEvent } from "@/types/reservation";
import {format} from "date-fns";


const today = new Date();
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

// Exemple de chambres
export const rooms: Room[] = [
  { id: 101, name: "Chambre 101" },
  { id: 102, name: "Chambre 102" },
  { id: 103, name: "Chambre 103" },
  { id: 104, name: "Chambre 104" },
  { id: 105, name: "Chambre 105" },
];

// Exemple de réservations diverses avec statuts variés et durées différentes
export const reservations: BookingEvent[] = [
  {
    id: "r1",
    chambre_id: 101,
    client_id: 1,
    first_name: "Alice",
    last_name: "Dupont",
    date_arrivee: formatDate(today),
    date_depart: formatDate(addDays(today, 2)),
    duree: 3,
    status: ReservationStatut.CONFIRMEE,
    nbr_adultes: 2,
    nbr_enfants: 0,
    mode_checkin: ModeCheckin.NUMERIQUE,
    code_checkin: "CHK123",
    date_reservation: formatDate(addDays(today, -5)),
    civilite: Civilite.MADAME,
  },
  {
    id: "r2",
    chambre_id: 102,
    first_name: "Bob",
    client_id : 2,
    last_name: "Martin",
    date_arrivee: formatDate(addDays(today, 1)),
    date_depart: formatDate(addDays(today, 1)),
    duree: 1,
    status: ReservationStatut.EN_ATTENTE,
    nbr_adultes: 1,
    nbr_enfants: 1,
    mode_checkin: ModeCheckin.MANUELLE,
    code_checkin: "CHK456",
    date_reservation: formatDate(addDays(today, -2)),
    civilite: Civilite.MONSIEUR,
  },
  {
    id: "r3",
    chambre_id: 103,
    first_name: "Claire",
    client_id : 3,
    last_name: "Lemoine",
    date_arrivee: formatDate(addDays(today, 3)),
    date_depart: formatDate(addDays(today, 7)),
    duree: 5,
    status: ReservationStatut.ARRIVEE,
    nbr_adultes: 1,
    nbr_enfants: 0,
    mode_checkin: ModeCheckin.NUMERIQUE,
    code_checkin: "CHK789",
    date_reservation: formatDate(addDays(today, -7)),
    civilite: Civilite.MADEMOISELLE,
  },
  {
    id: "r4",
    chambre_id: 101,
    client_id: 4,
    first_name: "David",
    last_name: "Nguyen",
    date_arrivee: formatDate(addDays(today, 5)),
    date_depart: formatDate(addDays(today, 6)),
    duree: 2,
    status: ReservationStatut.ANNULEE,
    nbr_adultes: 2,
    nbr_enfants: 0,
    mode_checkin: ModeCheckin.TELEPHONE,
    code_checkin: "CHK101",
    date_reservation: formatDate(addDays(today, -1)),
    civilite: Civilite.MONSIEUR,
  },
  {
    id: "r5",
    chambre_id: 105,
    client_id : 5,
    first_name: "Eva",
    last_name: "Moreau",
    date_arrivee: formatDate(addDays(today, -1)),
    date_depart: formatDate(today),
    duree: 2,
    status: ReservationStatut.TERMINEE,
    nbr_adultes: 1,
    nbr_enfants: 0,
    mode_checkin: ModeCheckin.NUMERIQUE,
    code_checkin: "CHK202",
    date_reservation: formatDate(addDays(today, -10)),
    civilite: Civilite.MADAME,
  },
];
