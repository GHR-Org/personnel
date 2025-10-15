// ============================================================================
// ============================================================================
// HOOK PERSONNELS OPTIMISÉ
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { personnelsService } from "@/services/personnels";
import { Personnel, PersonnelFormData, UseCRUDResult } from "@/types";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { eventBus } from "@/utils/eventBus";

export function usePersonnels(): UseCRUDResult<Personnel, PersonnelFormData, Partial<PersonnelFormData>> {
  const { user } = useAuth();
  const [data, setData] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pour un établissement connecté, l'ID est user.id
  // Pour un personnel connecté, l'ID est user.etablissement_id
  const etablissementId = user?.etablissement_id || user?.id;

  // Abonnement temps réel via EventBus
  useEffect(() => {
    const offCreate = eventBus.on("personnel_create", (p: any) => {
      setData(prev => (prev.find(x => x.id === p.id) ? prev : [...prev, p]));
    });
    const offUpdate = eventBus.on("personnel_update", (p: any) => {
      setData(prev => prev.map(x => (x.id === p.id ? { ...x, ...p } : x)));
    });
    const offDelete = eventBus.on("personnel_delete", (p: any) => {
      setData(prev => prev.filter(x => x.id !== p.id));
    });
    return () => { offCreate(); offUpdate(); offDelete(); };
  }, []);

  // Récupérer les personnels
  const fetchPersonnels = useCallback(async () => {
    if (!etablissementId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const personnels = await personnelsService.getByEtablissement(etablissementId);
      setData(personnels);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [etablissementId]);

  // Créer un personnel avec rafraîchissement automatique
  const create = useCallback(async (formData: PersonnelFormData): Promise<Personnel | null> => {
    if (!etablissementId) {
      toast.error("Aucun établissement sélectionné");
      return null;
    }

    try {
      const newPersonnel = await personnelsService.create({
        ...formData,
        etablissement_id: etablissementId,
      });

      // Rafraîchir automatiquement la liste complète
      await fetchPersonnels();
      return newPersonnel;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(errorMessage);
      throw err; // Propager l'erreur pour que le formulaire puisse la gérer
    }
  }, [etablissementId, fetchPersonnels]);

  // Mettre à jour un personnel avec rafraîchissement automatique
  const update = useCallback(async (id: number, formData: Partial<PersonnelFormData>): Promise<Personnel | null> => {
    try {
      console.log("🔍 [usePersonnels] Mise à jour personnel ID:", id, "avec données:", formData);

      // Trouver le personnel existant dans nos données pour éviter un appel API
      const existingPersonnel = data.find(p => p.id === id);

      let updatedPersonnel: Personnel;

      if (existingPersonnel) {
        // Utiliser la méthode rapide avec les données existantes
        updatedPersonnel = await personnelsService.updateWithExistingData(id, formData, existingPersonnel);
      } else {
        // Fallback vers la méthode normale
        updatedPersonnel = await personnelsService.update(id, formData, etablissementId);
      }

      // Rafraîchir automatiquement la liste complète
      await fetchPersonnels();
      return updatedPersonnel;
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la mise à jour";
      toast.error(errorMessage);
      throw err; // Propager l'erreur
    }
  }, [fetchPersonnels, etablissementId, data]);

  // Supprimer un personnel avec rafraîchissement automatique
  const remove = useCallback(async (id: number): Promise<boolean> => {
    try {
      console.log("🔍 [usePersonnels] Suppression personnel ID:", id);
      
      await personnelsService.delete(id);

      console.log("✅ [usePersonnels] Personnel supprimé");

      // Rafraîchir automatiquement la liste complète
      await fetchPersonnels();
      return true;
    } catch (err: any) {
      console.error("❌ [usePersonnels] Erreur lors de la suppression:", err);
      const errorMessage = err.message || "Erreur lors de la suppression";
      toast.error(errorMessage);
      throw err; // Propager l'erreur
    }
  }, [fetchPersonnels]);

  // Rechercher des personnels
  const search = useCallback(async (query: {
    nom?: string;
    email?: string;
    poste?: string;
    role?: string;
    statut?: string;
  }): Promise<Personnel[]> => {
    if (!etablissementId) return [];

    try {
      return await personnelsService.search(etablissementId, query);
    } catch (err: any) {
      toast.error(err.message);
      return [];
    }
  }, [etablissementId]);

  // Récupérer les statistiques
  const getStats = useCallback(async () => {
    if (!etablissementId) return null;

    try {
      return await personnelsService.getStats(etablissementId);
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, [etablissementId]);

  // Charger les données au montage
  useEffect(() => {
    fetchPersonnels();
  }, [fetchPersonnels]);

  return {
    data,
    count: data.length,
    loading,
    error,
    refetch: fetchPersonnels,
    create,
    update,
    remove,
    // Méthodes spécifiques aux personnels
    search,
    getStats,
  } as any;
}

// Hook pour un personnel spécifique
export function usePersonnel(id: number, etablissementId?: number) {
  const { user } = useAuth();
  const [personnel, setPersonnel] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const etabId = etablissementId || user?.etablissement_id || user?.id;

  useEffect(() => {
    const fetchPersonnel = async () => {
      if (!id || !etabId) {
        setLoading(false);
        return;
      }

      try {
        const data = await personnelsService.getById(id, etabId);
        setPersonnel(data);
      } catch (err: any) {
        setError(err.message);
        setPersonnel(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, [id, etabId]);

  return { personnel, loading, error };
}

// Hook pour les statistiques des personnels
export function usePersonnelsStats() {
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
        const data = await personnelsService.getStats(etablissementId);
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
