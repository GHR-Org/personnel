// ============================================================================
// HOOK TABLES INTÉGRÉ
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { tablesService } from "@/services/tables";
import { Table, TableFormData, UseCRUDResult } from "@/types";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { eventBus } from "@/utils/eventBus";

export function useTables(): UseCRUDResult<Table, TableFormData, Partial<TableFormData>> {
  const { user } = useAuth();
  const [data, setData] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const etablissementId = user?.etablissement_id;

  // Abonnements temps réel via EventBus
  useEffect(() => {
    const offCreate = eventBus.on("table_created", (t: any) => {
      setData(prev => (prev.find(x => x.id === t.id) ? prev : [...prev, t]));
    });
    const offUpdate = eventBus.on("table_updated", (t: any) => {
      setData(prev => prev.map(x => (x.id === t.id ? { ...x, ...t } : x)));
    });
    const offDelete = eventBus.on("table_deleted", (t: any) => {
      setData(prev => prev.filter(x => x.id !== t.id));
    });
    return () => { offCreate(); offUpdate(); offDelete(); };
  }, []);

  // Récupérer les tables
  const fetchTables = useCallback(async () => {
    if (!etablissementId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tables = await tablesService.getByEtablissement(etablissementId);
      setData(tables);
    } catch (err: any) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [etablissementId]);

  // Créer une table
  const create = useCallback(async (formData: TableFormData): Promise<Table | null> => {
    if (!etablissementId) {
      toast.error("Aucun établissement sélectionné");
      return null;
    }

    try {
      const newTable = await tablesService.create({
        ...formData,
        etablissement_id: etablissementId,
      });
      
      setData(prev => [...prev, newTable]);
      toast.success("Table créée avec succès");
      return newTable;
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, [etablissementId]);

  // Mettre à jour une table
  const update = useCallback(async (id: number, formData: Partial<TableFormData>): Promise<Table | null> => {
    try {
      const updatedTable = await tablesService.update(id, formData);
      
      setData(prev => prev.map(table => 
        table.id === id ? updatedTable : table
      ));
      
      toast.success("Table mise à jour avec succès");
      return updatedTable;
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, []);

  // Supprimer une table
  const remove = useCallback(async (id: number): Promise<boolean> => {
    try {
      await tablesService.delete(id);
      
      setData(prev => prev.filter(table => table.id !== id));
      toast.success("Table supprimée avec succès");
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  }, []);

  // Changer le statut d'une table
  const changeStatut = useCallback(async (id: number, statut: string): Promise<boolean> => {
    try {
      const updatedTable = await tablesService.changeStatut(id, statut);
      
      setData(prev => prev.map(table => 
        table.id === id ? updatedTable : table
      ));
      
      toast.success(`Statut de la table changé vers ${statut}`);
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  }, []);

  // Récupérer les tables disponibles
  const getDisponibles = useCallback(async (capaciteMin?: number): Promise<Table[]> => {
    if (!etablissementId) return [];

    try {
      return await tablesService.getDisponibles(etablissementId, capaciteMin);
    } catch (err: any) {
      toast.error(err.message);
      return [];
    }
  }, [etablissementId]);

  // Charger les données au montage
  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return {
    data,
    count: data.length,
    loading,
    error,
    refetch: fetchTables,
    create,
    update,
    remove,
    // Méthodes spécifiques aux tables
    changeStatut,
    getDisponibles,
  } as any;
}

// Hook pour les statistiques des tables
export function useTablesStats() {
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
        const data = await tablesService.getStats(etablissementId);
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
