// adminstration_etablissement/src/hooks/useRevenu.ts
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { revenuService, DailyRevenue, RevenueStats, DailyEstablishmentRevenue } from "@/services/revenuService";
import { toast } from "sonner";

export function useRevenu() {
  const { user } = useAuth();
  const [data, setData] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dailyRevenueData, setDailyRevenueData] = useState<DailyEstablishmentRevenue | null>(null);
  const [dailyRevenueLoading, setDailyRevenueLoading] = useState(false);
  const [dailyRevenueError, setDailyRevenueError] = useState<string | null>(null);

  const etablissementId = user?.etablissement_id || user?.id;

  const fetchRevenue = useCallback(async (dateStr: string = new Date().toISOString().split('T')[0].substring(0, 7)) => {
    if (!etablissementId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const revenueData = await revenuService.getMonthlyRevenue(etablissementId, dateStr);
      setData(revenueData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue lors du chargement des revenus";
      setError(errorMessage);
      toast.error("Erreur lors du chargement des revenus");
    } finally {
      setLoading(false);
    }
  }, [etablissementId]);

  const fetchDailyRevenue = useCallback(async (etablissementId: number, dateStr: string) => {
    if (!etablissementId || !dateStr) {
      setDailyRevenueLoading(false);
      return;
    }

    setDailyRevenueLoading(true);
    setDailyRevenueError(null);

    try {
      const revenueData = await revenuService.getDailyRevenue(etablissementId, dateStr);
      setDailyRevenueData(revenueData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue lors du chargement des revenus journaliers";
      setDailyRevenueError(errorMessage);
      toast.error("Erreur lors du chargement des revenus journaliers");
    } finally {
      setDailyRevenueLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return {
    data,
    loading,
    error,
    refetch: fetchRevenue,
    dailyRevenueData,
    dailyRevenueLoading,
    dailyRevenueError,
    fetchDailyRevenue,
  };
}

export { type DailyRevenue, type RevenueStats, type DailyEstablishmentRevenue };
export default useRevenu;
