import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { 
  getStatsByStatus,
  getTotalSalairePersonnel,
  getBilanEtablissement
} from "@/services/financialApi";
// Temps réel géré via EventBus lorsque disponible
import { StatusReservation } from "@/types";

export interface DashboardFinancialStats {
  montantConfirmees: number;
  montantEnAttente: number;
  nombreConfirmees: number;
  nombreEnAttente: number;
  totalSalairePersonnel: number;
  beneficeNetMoisPrecedent: number;
}

export interface UseDashboardStatsReturn {
  stats: DashboardFinancialStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardFinancialStats>({
    montantConfirmees: 0,
    montantEnAttente: 0,
    nombreConfirmees: 0,
    nombreEnAttente: 0,
    totalSalairePersonnel: 0,
    beneficeNetMoisPrecedent: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const etablissementId = user?.etablissement_id || user?.id;

  // const { data: bilanData, isConnected: bilanWsConnected, lastUpdate: bilanLastUpdate } = useBilanEtablissementWebSocket({
  //   benefice: 0
  // });

  // useEffect(() => {
  //   if (bilanWsConnected && bilanData && typeof (bilanData as { benefice: number }).benefice === "number") {
  //     setStats(prev => ({
  //       ...prev,
  //       beneficeNetMoisPrecedent: (bilanData as { benefice: number }).benefice
  //     }));
  //     console.log(`✅ Mise à jour WebSocket pour beneficeNetMoisPrecedent: ${(bilanData as { benefice: number }).benefice}`);
  //   }
  // }, [bilanData, bilanWsConnected, bilanLastUpdate]);

  const fetchFinancialData = useCallback(async () => {
    if (!etablissementId) {
      setLoading(false);
      setError("ID d'établissement manquant");
      console.error("❌ ID d'établissement manquant", { user });
      return;
    }

    if (!isAuthenticated) {
      setLoading(false);
      setError("Utilisateur non authentifié. Veuillez vous connecter.");
      console.error("❌ Utilisateur non authentifié");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [statsConfirmees, statsEnAttente, totalSalairePersonnel, beneficeNetMoisPrecedent] = await Promise.all([
        getStatsByStatus(StatusReservation.CONFIRMEE, etablissementId),
        getStatsByStatus(StatusReservation.EN_ATTENTE, etablissementId),
        getTotalSalairePersonnel(etablissementId),
        getBilanEtablissement(etablissementId)
      ]);

      console.log("✅ Données initiales récupérées:", {
        statsConfirmees,
        statsEnAttente,
        totalSalairePersonnel,
        beneficeNetMoisPrecedent
      });

      setStats({
        montantConfirmees: statsConfirmees?.prix_total || 0,
        montantEnAttente: statsEnAttente?.prix_total || 0,
        nombreConfirmees: statsConfirmees?.nombres || 0,
        nombreEnAttente: statsEnAttente?.nombres || 0,
        totalSalairePersonnel: totalSalairePersonnel || 0,
        beneficeNetMoisPrecedent: beneficeNetMoisPrecedent || 0
      });
    } catch (err: any) {
      let errorMessage = "Erreur lors de la récupération des données financières";
      if (err.message.includes("Aucun token d'authentification trouvé")) {
        errorMessage = "🚨 Session expirée. Veuillez vous reconnecter.";
      } else if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
        errorMessage = "🚨 Serveur backend non accessible. Vérifiez qu'il est démarré.";
      } else {
        errorMessage = err.message || errorMessage;
      }

      console.error("❌ Erreur dans fetchFinancialData:", err);
      setError(errorMessage);
      setStats({
        montantConfirmees: 0,
        montantEnAttente: 0,
        nombreConfirmees: 0,
        nombreEnAttente: 0,
        totalSalairePersonnel: 0,
        beneficeNetMoisPrecedent: 0
      });
    } finally {
      setLoading(false);
    }
  }, [etablissementId, isAuthenticated]);

  const refetch = useCallback(async () => {
    await fetchFinancialData();
  }, [fetchFinancialData]);

  useEffect(() => {
    fetchFinancialData();
  }, [fetchFinancialData]);

  return {
    stats,
    loading,
    error,
    refetch
  };
}

export function useDashboardAmounts() {
  const { stats, loading, error, refetch } = useDashboardStats();
  return {
    montantConfirmees: stats.montantConfirmees,
    montantEnAttente: stats.montantEnAttente,
    totalSalairePersonnel: stats.totalSalairePersonnel,
    beneficeNetMoisPrecedent: stats.beneficeNetMoisPrecedent,
    loading,
    error,
    refetch
  };
}