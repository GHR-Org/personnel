import { apiService, handleApiError } from "./api";

export interface Reservation {
  id: number;
  client_id: number;
  chambre_id: number;
  date_debut: string;
  date_fin: string;
  statut: string;
  prix_total: number;
  etablissement_id: number;
  created_at: string;
  client_name?: string;
}

export interface ReservationFormData {
  date_debut: string;
  date_fin: string;
  statut: string;
  client_id: number;
  chambre_id: number;
  prix_total: number;
}

export interface Chambre {
  id: number;
  numero: string;
  tarif: number;
  etat: EtatChambre;
}

export enum EtatChambre {
  HORSSERVICE = "HORSSERVICE",
  NETTOYAGE = "NETTOYAGE",
  LIBRE = "LIBRE",
}

interface BackendReservationCreate {
  date_arrivee: string;
  date_depart: string;
  duree: number;
  statut: string;
  nbr_adultes: number;
  nbr_enfants: number;
  client_id: number;
  chambre_id: number;
  mode_checkin: string;
  code_checkin?: string;
  articles: Array<{
    nom: string;
    quantite: number;
    prix: number;
  }>;
  arhee: {
    montant: number;
  };
}

export class ReservationsService {
  private readonly baseUrl = "/reservation";

  async getByEtablissement(etablissementId: number): Promise<Reservation[]> {
    try {
      const response = await apiService.get<{ reservations: any[] }>(
        `${this.baseUrl}/etablissement/${etablissementId}`
      );
      return (response.reservations || []).map(this.transformBackendReservation);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getById(id: number): Promise<Reservation> {
    try {
      const response = await apiService.get<{ reservation: any }>(
        `${this.baseUrl}/${id}`
      );
      return this.transformBackendReservation(response.reservation);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async create(
    data: ReservationFormData & { etablissement_id: number }
  ): Promise<Reservation> {
    try {
      const dateDebut = new Date(data.date_debut);
      const dateFin = new Date(data.date_fin);
      const duree = Math.ceil(
        (dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24)
      );

      const backendData: BackendReservationCreate = {
        date_arrivee: data.date_debut,
        date_depart: data.date_fin,
        duree,
        statut: data.statut,
        nbr_adultes: 2,
        nbr_enfants: 0,
        client_id: data.client_id,
        chambre_id: data.chambre_id,
        mode_checkin: "MANUEL",
        articles: [],
        arhee: { montant: data.prix_total },
      };

      const response = await apiService.post<{ reservation: any }>(
        this.baseUrl,
        backendData
      );
      return this.transformBackendReservation(response.reservation);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async update(id: number, data: Partial<ReservationFormData>): Promise<Reservation> {
    try {
      const response = await apiService.patch<{ reservation: any }>(
        `${this.baseUrl}/${id}`,
        data
      );
      return this.transformBackendReservation(response.reservation);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getStats(etablissementId: number): Promise<{
    total: number;
    en_attente: number;
    confirmees: number;
    en_cours: number;
    terminees: number;
    annulees: number;
    revenus_mois: number;
  }> {
    try {
      const reservations = await this.getByEtablissement(etablissementId);
      return {
        total: reservations.length,
        en_attente: reservations.filter((r) => r.statut === "EN_ATTENTE").length,
        confirmees: reservations.filter((r) => r.statut === "CONFIRMEE").length,
        en_cours: reservations.filter((r) => r.statut === "EN_COURS").length,
        terminees: reservations.filter((r) => r.statut === "TERMINEE").length,
        annulees: reservations.filter((r) => r.statut === "ANNULEE").length,
        revenus_mois: reservations
          .filter((r) => r.statut === "CONFIRMEE" || r.statut === "TERMINEE")
          .reduce((total, r) => total + r.prix_total, 0),
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getDailyRevenue(
    etablissementId: number,
    dateStr: string
  ): Promise<{
    revenu_total: number;
    data: Array<{
      date: string;
      revenu_total: number;
      details: Array<{
        revenu: number;
        chambre: { numero: string; tarif: number; status: string };
      }>;
    }>;
  }> {
    try {
      const response = await apiService.get<{
        revenu_total: number;
        data: Array<{
          date: string;
          revenu_total: number;
          details: Array<{
            revenu: number;
            chambre: { numero: string; tarif: number; status: string };
          }>;
        }>;
      }>(
        `${this.baseUrl}/revenu/journalier/${etablissementId}/${dateStr}`
      );
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  private transformBackendReservation(backendReservation: any): Reservation {
    return {
      id: backendReservation.id,
      client_id: backendReservation.client_id,
      chambre_id: backendReservation.chambre_id,
      date_debut: backendReservation.date_arrivee,
      date_fin: backendReservation.date_depart,
      statut: backendReservation.statut,
      prix_total: backendReservation.arhee?.montant || 0,
      etablissement_id: backendReservation.etablissement_id || 1,
      created_at: backendReservation.created_at || new Date().toISOString(),
      client_name: backendReservation.client_name,
    };
  }
}

export const reservationsService = new ReservationsService();