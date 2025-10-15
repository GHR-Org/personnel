// ============================================================================
// HOOK RAPPORTS INTÉGRÉ
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { rapportsService } from "@/services/rapports";
import { Rapport, RapportFormData, UseCRUDResult } from "@/types";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useRapports(): UseCRUDResult<Rapport, RapportFormData, Partial<RapportFormData>> {
  const { user } = useAuth();
  const [data, setData] = useState<Rapport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const etablissementId = user?.etablissement_id;

  // Récupérer les rapports
  const fetchRapports = useCallback(async () => {
    if (!etablissementId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rapports = await rapportsService.getByEtablissement(etablissementId);
      setData(rapports);
    } catch (err: any) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [etablissementId]);

  // Créer un rapport
  const create = useCallback(async (formData: RapportFormData): Promise<Rapport | null> => {
    if (!etablissementId) {
      toast.error("Aucun établissement sélectionné");
      return null;
    }

    try {
      const newRapport = await rapportsService.create({
        ...formData,
        etablissement_id: etablissementId,
      });
      
      setData(prev => [...prev, newRapport]);
      toast.success("Rapport créé avec succès");
      return newRapport;
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, [etablissementId]);

  // Mettre à jour un rapport
  const update = useCallback(async (id: number, formData: Partial<RapportFormData>): Promise<Rapport | null> => {
    try {
      const updatedRapport = await rapportsService.update(id, formData);
      
      setData(prev => prev.map(rapport => 
        rapport.id === id ? updatedRapport : rapport
      ));
      
      toast.success("Rapport mis à jour avec succès");
      return updatedRapport;
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, []);

  // Supprimer un rapport
  const remove = useCallback(async (id: number): Promise<boolean> => {
    try {
      await rapportsService.delete(id);
      
      setData(prev => prev.filter(rapport => rapport.id !== id));
      toast.success("Rapport supprimé avec succès");
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  }, []);

  // Changer le statut d'un rapport
  const changeStatut = useCallback(async (id: number, statut: string): Promise<boolean> => {
    try {
      const updatedRapport = await rapportsService.changeStatut(id, statut);
      
      setData(prev => prev.map(rapport => 
        rapport.id === id ? updatedRapport : rapport
      ));
      
      toast.success(`Statut du rapport changé vers ${statut}`);
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  }, []);

  // Charger les données au montage
  useEffect(() => {
    fetchRapports();
  }, [fetchRapports]);

  return {
    data,
    count: data.length,
    loading,
    error,
    refetch: fetchRapports,
    create,
    update,
    remove,
    // Méthodes spécifiques aux rapports
    changeStatut,
  } as any;
}

// Hook pour les statistiques des rapports
export function useRapportsStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const etablissementId = user?.etablissement_id;

  useEffect(() => {
    const fetchStats = async () => {
      if (!etablissementId) {
        setLoading(false);
        return;
      }

      try {
        const data = await rapportsService.getStats(etablissementId);
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
