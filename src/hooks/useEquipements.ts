import { useState, useEffect, useCallback } from "react";
import { equipementsService, Equipement, EquipementFormData } from "@/services/equipements";
import { useAuth } from "@/hooks/useAuth";
import { eventBus } from "@/utils/eventBus";

export function useEquipements() {
  const { user } = useAuth();
  const [data, setData] = useState<Equipement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const etablissementId = user?.etablissement_id || user?.id;

  const fetchEquipements = useCallback(async () => {
    if (!etablissementId) { setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const items = await equipementsService.getByEtablissement(etablissementId);
      setData(items);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des équipements");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [etablissementId]);

  useEffect(() => { fetchEquipements(); }, [fetchEquipements]);

  // WebSocket (désactivé par défaut pour éviter boucles d'updates). Activez si events disponibles.
  // useEffect(() => {
  //   const offAny = eventBus.on("*", ({ event }: any) => {
  //     if (["equipement_create", "equipement_delete", "equipement_update"].includes(event)) {
  //       fetchEquipements();
  //     }
  //   });
  //   return () => offAny();
  // }, [fetchEquipements]);

  const create = useCallback(async (form: EquipementFormData): Promise<Equipement> => {
    if (!etablissementId) throw new Error("Etablissement manquant");
    const created = await equipementsService.create({ ...form, etablissement_id: etablissementId });
    setData(prev => [...prev, created]);
    return created;
  }, [etablissementId]);

  const update = useCallback(async (id: string, form: EquipementFormData): Promise<Equipement> => {
    if (!etablissementId) throw new Error("Etablissement manquant");
    const updated = await equipementsService.update(id, { ...form, etablissement_id: etablissementId });
    setData(prev => prev.map(e => e.id === id ? updated : e));
    return updated;
  }, [etablissementId]);

  const remove = useCallback(async (id: string): Promise<void> => {
    await equipementsService.delete(id);
    setData(prev => prev.filter(e => e.id !== id));
  }, []);

  return { data, loading, error, refetch: fetchEquipements, create, update, remove };
}

export default useEquipements;
