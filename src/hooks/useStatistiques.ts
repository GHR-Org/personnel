// ============================================================================
// HOOK STATISTIQUES FINANCIÈRES - Gestion des métriques business
// ============================================================================

import { useState, useEffect } from "react";
import { statistiquesService, StatistiquesFinancieres } from "@/services/statistiques";

export interface UseStatistiquesReturn {
  statistiques: StatistiquesFinancieres | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStatistiques(etablissementId: number, typeEtablissement: string): UseStatistiquesReturn {
  const [statistiques, setStatistiques] = useState<StatistiquesFinancieres | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistiques = async () => {
    if (!etablissementId) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log("[useStatistiques] Fetching statistiques for:", { etablissementId, typeEtablissement });
      
      const data = await statistiquesService.getStatistiquesFinancieres(etablissementId, typeEtablissement);
      
      console.log("[useStatistiques] Statistiques fetched:", data);
      setStatistiques(data);
    } catch (err) {
      console.error("[useStatistiques] Error fetching statistiques:", err);
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistiques();
  }, [etablissementId, typeEtablissement]);

  const refetch = async () => {
    await fetchStatistiques();
  };

  return {
    statistiques,
    loading,
    error,
    refetch
  };
}
