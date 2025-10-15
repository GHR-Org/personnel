// ============================================================================
// HOOK PLATS INTÉGRÉ
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { platsService } from "@/services/plats";
import { Plat, PlatFormData, UseCRUDResult } from "@/types";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { eventBus } from "@/utils/eventBus";

export function usePlats(): UseCRUDResult<Plat, PlatFormData, Partial<PlatFormData>> {
  const { user } = useAuth();
  const [data, setData] = useState<Plat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pour un établissement connecté, l'ID est user.id
  // Pour un personnel connecté, l'ID est user.etablissement_id
  const etablissementId = user?.etablissement_id || user?.id;

  // Temps réel via EventBus (supporte plusieurs variantes d'événements backend)
  useEffect(() => {
    const handlers: Array<() => void> = [];

    const onCreate = (p: any) => {
      const id = Number(p?.id);
      if (!Number.isFinite(id)) return;
      setData(prev => (prev.find(x => Number(x.id) === id) ? prev : [...prev, { ...p, id }]));
    };
    const onUpdate = (p: any) => {
      const id = Number(p?.id);
      if (!Number.isFinite(id)) return;
      setData(prev => prev.map(x => (Number(x.id) === id ? { ...x, ...p, id } : x)));
    };
    const onDelete = (p: any) => {
      const id = Number(p?.id);
      if (!Number.isFinite(id)) return;
      setData(prev => prev.filter(x => Number(x.id) !== id));
    };

    // Variantes possibles côté backend
    const eventsCreate = ["plat_created", "plat_create"];
    const eventsUpdate = ["plat_updated", "plat_update", "plat_patch"];
    const eventsDelete = ["plat_deleted", "plat_delete"];

    eventsCreate.forEach(evt => handlers.push(eventBus.on(evt, onCreate)));
    eventsUpdate.forEach(evt => handlers.push(eventBus.on(evt, onUpdate)));
    eventsDelete.forEach(evt => handlers.push(eventBus.on(evt, onDelete)));

    // Wildcard listener: capture any plat-related event
    const offAll = eventBus.on('*', (msg: any) => {
      try {
        const event: string = (msg?.event || '').toString().toLowerCase();
        const payload: any = msg?.payload ?? msg; // some emitters pass payload directly
        if (!event.includes('plat')) return;

        // Extract a usable id and data
        const id = Number(payload?.id ?? payload?.plat?.id ?? payload?.plat_id);
        const data = payload?.plat ?? payload;
        if (!Number.isFinite(id)) return;

        if (event.includes('create')) {
          onCreate({ ...data, id });
        } else if (event.includes('update') || event.includes('patch')) {
          onUpdate({ ...data, id });
        } else if (event.includes('delete')) {
          onDelete({ id });
        }
      } catch {}
    });
    handlers.push(offAll);

    return () => { handlers.forEach(off => { try { off(); } catch {} }); };
  }, []);

  // Récupérer les plats
  const fetchPlats = useCallback(async () => {
    if (!etablissementId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const plats = await platsService.getByEtablissement(etablissementId);
      setData(plats);
    } catch (err: any) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [etablissementId]);

  // Créer un plat
  const create = useCallback(async (formData: PlatFormData): Promise<Plat | null> => {
    if (!etablissementId) {
      toast.error("Aucun établissement sélectionné");
      return null;
    }

    try {
      const newPlat = await platsService.create({
        ...formData,
        etablissement_id: etablissementId,
      });
      
      setData(prev => [...prev, newPlat]);
      toast.success("Plat créé avec succès");
      return newPlat;
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, [etablissementId]);

  // Mettre à jour un plat
  const update = useCallback(async (id: number, formData: Partial<PlatFormData>): Promise<Plat | null> => {
    try {
      const updatedPlat = await platsService.update(id, formData);
      
      setData(prev => prev.map(plat => 
        plat.id === id ? updatedPlat : plat
      ));
      
      toast.success("Plat mis à jour avec succès");
      return updatedPlat;
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, []);

  // Supprimer un plat
  const remove = useCallback(async (id: number): Promise<boolean> => {
    try {
      await platsService.delete(id);
      
      setData(prev => prev.filter(plat => plat.id !== id));
      toast.success("Plat supprimé avec succès");
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  }, []);

  // Basculer la disponibilité
  const toggleDisponibilite = useCallback(async (id: number): Promise<boolean> => {
    try {
      const updatedPlat = await platsService.toggleDisponibilite(id);
      
      setData(prev => prev.map(plat => 
        plat.id === id ? updatedPlat : plat
      ));
      
      toast.success(`Plat ${updatedPlat.disponible ? 'activé' : 'désactivé'}`);
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  }, []);

  // Récupérer par catégorie
  const getByCategorie = useCallback(async (categorie: string): Promise<Plat[]> => {
    if (!etablissementId) return [];

    try {
      return await platsService.getByCategorie(etablissementId, categorie);
    } catch (err: any) {
      toast.error(err.message);
      return [];
    }
  }, [etablissementId]);

  // Charger les données au montage
  useEffect(() => {
    fetchPlats();
  }, [fetchPlats]);

  return {
    data,
    count: data.length,
    loading,
    error,
    refetch: fetchPlats,
    create,
    update,
    remove,
    // Méthodes spécifiques aux plats
    toggleDisponibilite,
    getByCategorie,
  } as any;
}

// Hook pour les statistiques des plats
export function usePlatsStats() {
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
        const data = await platsService.getStats(etablissementId);
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
