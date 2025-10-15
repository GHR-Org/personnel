"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getBilanEtablissementAnnuel, getBilanEtablissementAll } from "@/services/financialApi";
// Temps réel géré via EventBus lorsque disponible

export type TypeFiltre = "tous" | "annee";

interface MonthlyData {
  periode: string;
  revenu_previsionnel: number;
  depenses: number;
  benefice: number;
}

interface AnnualData {
  annee: string;
  revenu_previsionnel: number;
  depenses: number;
  benefice: number;
}

interface UseGraphiquesReturn {
  donneesMensuelles: MonthlyData[];
  donneesAnnuelles: AnnualData[];
  loading: boolean;
  error: string | null;
  typeFiltre: TypeFiltre;
  anneeSelectionnee: number;
  anneesDisponibles: number[];
  setTypeFiltre: (type: TypeFiltre) => void;
  setAnneeSelectionnee: (annee: number) => void;
}

export function useGraphiques(etablissementId: number): UseGraphiquesReturn {
  const { user, isAuthenticated } = useAuth();
  const [donneesMensuelles, setDonneesMensuelles] = useState<MonthlyData[]>([]);
  const [donneesAnnuelles, setDonneesAnnuelles] = useState<AnnualData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFiltre, setTypeFiltre] = useState<TypeFiltre>("annee");
  const [anneeSelectionnee, setAnneeSelectionnee] = useState<number>(new Date().getFullYear());
  const [anneesDisponibles, setAnneesDisponibles] = useState<number[]>([]);

  // const { data: bilanData, isConnected: bilanWsConnected, lastUpdate: bilanLastUpdate } = useBilanEtablissementAnnuelWebSocket({
  //   bilan: {}
  // });

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const fetchBilanAnnuel = useCallback(async (annee: number) => {
    if (!etablissementId || !isAuthenticated) {
      setError("ID d'établissement manquant ou utilisateur non authentifié");
      setLoading(false);
      console.error("❌ Échec fetchBilanAnnuel: etablissementId ou isAuthenticated manquant", { etablissementId, isAuthenticated });
      return;
    }

    setLoading(true);
    try {
      const data = await getBilanEtablissementAnnuel(etablissementId, annee);
      console.log(`🔍 Réponse API brute pour ${annee}:`, data);
      if (!data || !data.bilan) {
        setError("Aucune donnée disponible pour cette année");
        setDonneesMensuelles([]);
        console.warn(`⚠️ Aucune donnée bilan pour ${annee}`);
        return;
      }

      const monthlyData: MonthlyData[] = Object.keys(data.bilan)
        .sort()
        .map((monthKey, index) => ({
          periode: monthNames[index],
          revenu_previsionnel: data.bilan[monthKey].revenu,
          depenses: data.bilan[monthKey].depenses,
          benefice: data.bilan[monthKey].benefice,
        }));

      setDonneesMensuelles(monthlyData);
      setError(null);
      console.log(`✅ Données mensuelles récupérées pour ${annee}:`, monthlyData);
    } catch (err) {
      console.error("❌ Erreur lors de la récupération du bilan annuel:", err);
      setError("Erreur lors de la récupération des données financières");
      setDonneesMensuelles([]);
    } finally {
      setLoading(false);
    }
  }, [etablissementId, isAuthenticated]);

  const fetchBilanAll = useCallback(async () => {
    if (!etablissementId || !isAuthenticated) {
      setError("ID d'établissement manquant ou utilisateur non authentifié");
      setLoading(false);
      console.error("❌ Échec fetchBilanAll: etablissementId ou isAuthenticated manquant", { etablissementId, isAuthenticated });
      return;
    }

    setLoading(true);
    try {
      const data = await getBilanEtablissementAll(etablissementId);
      console.log(`🔍 Réponse API brute pour tous:`, data);
      if (!data || !data.bilan) {
        setError("Aucune donnée disponible pour toutes les années");
        setDonneesAnnuelles([]);
        console.warn(`⚠️ Aucune donnée bilan pour tous`);
        return;
      }

      const annualData: AnnualData[] = Object.keys(data.bilan)
        .sort()
        .map((yearKey) => ({
          annee: yearKey,
          revenu_previsionnel: data.bilan[yearKey].revenu,
          depenses: data.bilan[yearKey].depenses,
          benefice: data.bilan[yearKey].benefice,
        }));

      setDonneesAnnuelles(annualData);
      setAnneesDisponibles(Object.keys(data.bilan).map(Number).sort((a, b) => b - a));
      setError(null);
      console.log(`✅ Données annuelles récupérées:`, annualData);
    } catch (err) {
      console.error("❌ Erreur lors de la récupération du bilan tous:", err);
      setError("Erreur lors de la récupération des données financières");
      setDonneesAnnuelles([]);
    } finally {
      setLoading(false);
    }
  }, [etablissementId, isAuthenticated]);

  // Effet WebSocket legacy supprimé (migré vers EventBus si nécessaire)

  useEffect(() => {
    if (typeFiltre === "annee") {
      fetchBilanAnnuel(anneeSelectionnee);
    } else {
      fetchBilanAll();
    }
  }, [fetchBilanAnnuel, fetchBilanAll, typeFiltre, anneeSelectionnee]);

  return {
    donneesMensuelles,
    donneesAnnuelles,
    loading,
    error,
    typeFiltre,
    setTypeFiltre,
    anneeSelectionnee,
    setAnneeSelectionnee,
    anneesDisponibles,
  };
}