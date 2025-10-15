import { useState, useEffect, useCallback } from "react";
import { reservationsService } from "@/services/reservations";
import { Reservation, ReservationFormData, UseCRUDResult } from "@/types";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { eventBus } from "@/utils/eventBus";
import { debounce } from "lodash";

export function useReservations(): UseCRUDResult<
  Reservation,
  ReservationFormData,
  Partial<ReservationFormData>
> {
  const { user } = useAuth();
  const [data, setData] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const etablissementId = user?.etablissement_id || user?.id;

  const fetchReservations = useCallback(
    debounce(async () => {
      if (!etablissementId) {
        setData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const reservations = await reservationsService.getByEtablissement(etablissementId);
        setData(reservations);
      } catch (err: any) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [etablissementId]
  );

  useEffect(() => {
    const offCreate = eventBus.on("reservation_create", (p: any) => {
      setData((prev) => (prev.find((r) => r.id === p.id) ? prev : [...prev, p]));
    });
    const offUpdate = eventBus.on("reservation_update", (p: any) => {
      setData((prev) => prev.map((r) => (r.id === p.id ? { ...r, ...p } : r)));
    });
    const offPatch = eventBus.on("reservation_patch", (p: any) => {
      setData((prev) => prev.map((r) => (r.id === p.id ? { ...r, ...p } : r)));
    });
    const offDelete = eventBus.on("reservation_delete", (p: any) => {
      setData((prev) => prev.filter((r) => r.id !== p.id));
    });

    return () => {
      offCreate();
      offUpdate();
      offPatch();
      offDelete();
    };
  }, []);

  const create = useCallback(
    async (formData: ReservationFormData): Promise<Reservation | null> => {
      if (!etablissementId) {
        toast.error("Aucun établissement sélectionné");
        return null;
      }

      try {
        const newReservation = await reservationsService.create({
          ...formData,
          etablissement_id: etablissementId,
        });
        setData((prev) => [...prev, newReservation]);
        toast.success("Réservation créée avec succès");
        return newReservation;
      } catch (err: any) {
        toast.error(err.message);
        return null;
      }
    },
    [etablissementId]
  );

  const update = useCallback(
    async (id: number, formData: Partial<ReservationFormData>): Promise<Reservation | null> => {
      try {
        const updatedReservation = await reservationsService.update(id, formData);
        setData((prev) =>
          prev.map((reservation) =>
            reservation.id === id ? updatedReservation : reservation
          )
        );
        toast.success("Réservation mise à jour avec succès");
        return updatedReservation;
      } catch (err: any) {
        toast.error(err.message);
        return null;
      }
    },
    []
  );

  const remove = useCallback(async (id: number): Promise<boolean> => {
    try {
      await reservationsService.delete(id);
      setData((prev) => prev.filter((reservation) => reservation.id !== id));
      toast.success("Réservation supprimée avec succès");
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return {
    data,
    count: data.length,
    loading,
    error,
    refetch: fetchReservations,
    create,
    update,
    remove,
  };
}

export function useReservationsStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const etablissementId = user?.etablissement_id || user?.id;

  useEffect(() => {
    const fetchStats = async () => {
      if (!etablissementId) {
        setLoading(false);
        return;
      }

      try {
        const data = await reservationsService.getStats(etablissementId);
        setStats(data);
      } catch (err: any) {
        setError(err.message);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [etablissementId]);

  return { stats, loading, error };
}

export function useReservationsRevenue() {
  const { user } = useAuth();
  const etablissementId = user?.etablissement_id || user?.id;

  const [revenuJournalier, setRevenuJournalier] = useState<null | {
    revenu_total: number;
    data: Array<{
      date: string;
      revenu_total: number;
      details: Array<{
        revenu: number;
        chambre: { numero: string; tarif: number; status: string };
      }>;
    }>;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyRevenue = useCallback(
    debounce(async (dateStr: string) => {
      if (!etablissementId) return;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        setError("Format de date invalide. Utilisez YYYY-MM-DD");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await reservationsService.getDailyRevenue(etablissementId, dateStr);
        setRevenuJournalier(data);
      } catch (err: any) {
        setError(err.message);
        setRevenuJournalier(null);
      } finally {
        setLoading(false);
      }
    }, 300),
    [etablissementId]
  );

  return { revenuJournalier, loading, error, fetchDailyRevenue };
}