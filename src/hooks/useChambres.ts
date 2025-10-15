// ============================================================================
// HOOK CHAMBRES OPTIMISÉ
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { chambresService } from "@/services/chambres";
import { Chambre, ChambreFormData, UseCRUDResult } from "@/types";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { eventBus } from "@/utils/eventBus";

export function useChambres(): UseCRUDResult<Chambre, ChambreFormData, Partial<ChambreFormData>> {
  const { user } = useAuth();
  const [data, setData] = useState<Chambre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pour un établissement connecté, l'ID est user.id
  // Pour un personnel connecté, l'ID est user.etablissement_id
  const etablissementId = user?.etablissement_id || user?.id;

  // Récupérer les chambres
  const fetchChambres = useCallback(async () => {
    if (!etablissementId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const chambres = await chambresService.getByEtablissement(etablissementId);
      setData(chambres);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [etablissementId]);

  // Abonnement temps réel via EventBus
  useEffect(() => {
    const offCreate = eventBus.on("chambre_create", (p: any) => {
      setData(prev => (prev.find(c => c.id === p.id) ? prev : [...prev, p]));
    });
    const offUpdate = eventBus.on("chambre_update", (p: any) => {
      setData(prev => prev.map(c => (c.id === p.id ? { ...c, ...p } : c)));
    });
    const offDelete = eventBus.on("chambre_delete", (p: any) => {
      setData(prev => prev.filter(c => c.id !== p.id));
    });
    return () => { offCreate(); offUpdate(); offDelete(); };
  }, []);

  // Créer une chambre avec rafraîchissement automatique
  const create = useCallback(async (formData: ChambreFormData): Promise<Chambre | null> => {
    if (!etablissementId) {
      toast.error("Aucun établissement sélectionné");
      return null;
    }

    try {
      const newChambre = await chambresService.create({
        ...formData,
        id_etablissement: etablissementId,
      });

      // Rafraîchir automatiquement la liste complète
      await fetchChambres();
      return newChambre;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(errorMessage);
      throw err; // Propager l'erreur pour que le formulaire puisse la gérer
    }
  }, [etablissementId, fetchChambres]);

  // Mettre à jour une chambre avec rafraîchissement automatique
  const update = useCallback(async (id: number, formData: Partial<ChambreFormData>): Promise<Chambre | null> => {
    try {
      const updatedChambre = await chambresService.update(id, formData, etablissementId);

      // Rafraîchir automatiquement la liste complète
      await fetchChambres();
      return updatedChambre;
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la mise à jour";
      toast.error(errorMessage);
      throw err; // Propager l'erreur
    }
  }, [fetchChambres, etablissementId]);

  // Supprimer une chambre avec rafraîchissement automatique
  const remove = useCallback(async (id: number): Promise<boolean> => {
    try {
      await chambresService.delete(id);

      // Rafraîchir automatiquement la liste complète
      await fetchChambres();
      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la suppression";
      toast.error(errorMessage);
      throw err; // Propager l'erreur
    }
  }, [fetchChambres]);

  // Changer l'état d'une chambre
  const changeEtat = useCallback(async (id: number, etat: string): Promise<boolean> => {
    try {
      const updatedChambre = await chambresService.changeEtat(id, etat);
      
      setData(prev => prev.map(chambre => 
        chambre.id === id ? updatedChambre : chambre
      ));
      
      toast.success(`État de la chambre changé vers ${etat}`);
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  }, []);

  // Récupérer les chambres disponibles
  const getDisponibles = useCallback(async (dateDebut?: string, dateFin?: string): Promise<Chambre[]> => {
    if (!etablissementId) return [];

    try {
      return await chambresService.getDisponibles(etablissementId, dateDebut, dateFin);
    } catch (err: any) {
      toast.error(err.message);
      return [];
    }
  }, [etablissementId]);

  // Rechercher des chambres
  const search = useCallback(async (query: {
    numero?: string;
    categorie?: string;
    capacite_min?: number;
    capacite_max?: number;
    etat?: string;
    tarif_min?: number;
    tarif_max?: number;
  }): Promise<Chambre[]> => {
    if (!etablissementId) return [];

    try {
      return await chambresService.search(etablissementId, query);
    } catch (err: any) {
      toast.error(err.message);
      return [];
    }
  }, [etablissementId]);

  // Récupérer les statistiques
  const getStats = useCallback(async () => {
    if (!etablissementId) return null;

    try {
      return await chambresService.getStats(etablissementId);
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, [etablissementId]);

  // Charger les données au montage
  useEffect(() => {
    fetchChambres();
  }, [fetchChambres]);

  return {
    data,
    count: data.length,
    loading,
    error,
    refetch: fetchChambres,
    create,
    update,
    remove,
    // Méthodes spécifiques aux chambres
    changeEtat,
    getDisponibles,
    search,
    getStats,
  } as any;
}

// Hook pour une chambre spécifique
export function useChambre(id: number) {
  const [chambre, setChambre] = useState<Chambre | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChambre = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await chambresService.getById(id);
        setChambre(data);
      } catch (err: any) {
        setError(err.message);
        setChambre(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChambre();
  }, [id]);

  return { chambre, loading, error };
}

// Hook pour les statistiques des chambres
export function useChambresStats() {
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
        const data = await chambresService.getStats(etablissementId);
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
