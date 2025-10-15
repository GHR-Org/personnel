import { useState, useEffect, useCallback } from "react";
import { congesService } from "@/services/conges";
import { personnelsService } from "@/services/personnels";
import { Conge, CongeFormData, Personnel, TypeConge, StatusConge } from "@/types";
import { useAuth } from "./useAuth";
import { eventBus } from "@/utils/eventBus";

// Interface séparée pour les congés avec données du personnel
// Aligne les types "type" et "status" avec ceux de Conge (TypeConge/StatusConge)
// et étend la base Conge pour compatibilité structurelle.
interface CongeWithPersonnelData extends Conge {
  personnelName?: string;
  personnel?: Personnel; // align with Conge (no null)
}

// Interface personnalisée pour le hook
interface UseCongesResult {
  data: CongeWithPersonnelData[];
  loading: boolean;
  error: string | null;
  create: (data: CongeFormData) => Promise<CongeWithPersonnelData>;
  update: (id: number, data: CongeFormData) => Promise<CongeWithPersonnelData>;
  remove: (id: number) => Promise<void>;
}

export function useConges(personnelId?: number): UseCongesResult {
  const { user } = useAuth();
  const [data, setData] = useState<CongeWithPersonnelData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const etablissementId = user?.etablissement_id || user?.id;

  const fetchConges = useCallback(async () => {
    if (!etablissementId && !personnelId) {
      if (process.env.NODE_ENV === 'development') {
        console.warn("⚠️ [useConges] Aucun etablissementId ou personnelId fourni");
      }
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let conges: Conge[] = [];
      if (personnelId) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`📡 [useConges] Récupération des congés pour personnelId: ${personnelId}`);
        }
        conges = await congesService.getByPersonnel(personnelId);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log(`📡 [useConges] Récupération des congés pour etablissementId: ${etablissementId}`);
        }
        conges = await congesService.getByEtablissement(etablissementId!);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log("✅ [useConges] Congés récupérés:", conges);
      }

      // Enrichir les congés avec les données du personnel (appels API séparés)
      const congesWithPersonnel = await Promise.all(
        conges.map(async (conge) => {
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log(`📡 [useConges] Récupération du personnel ID ${conge.personnel_id}`);
            }
            
            // Appel séparé à l'API personnel
            const personnel = await personnelsService.getById(conge.personnel_id);
            
            // Créer le nom complet (utiliser les champs du backend: nom, prenom)
            const personnelName = `${personnel.first_name} ${personnel.last_name}`.trim();
            
            if (process.env.NODE_ENV === 'development') {
              console.log(`✅ [useConges] Personnel récupéré pour ID ${conge.personnel_id}: ${personnelName}`);
            }
            
            return { 
              ...conge, 
              personnel, 
              personnelName 
            } as CongeWithPersonnelData;
          } catch (err) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`⚠️ [useConges] Erreur récupération personnel ${conge.personnel_id}:`, err);
            }
            return { 
              ...conge, 
              // leave personnel undefined on error to align with base type
              personnelName: `Personnel ID: ${conge.personnel_id}` 
            } as CongeWithPersonnelData;
          }
        })
      );

      if (process.env.NODE_ENV === 'development') {
        console.log("✅ [useConges] Congés enrichis:", congesWithPersonnel);
      }

      setData(congesWithPersonnel);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      if (process.env.NODE_ENV === 'development') {
        console.error("❌ [useConges] Erreur lors de la récupération des congés:", errorMessage);
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [etablissementId, personnelId]);

  // Abonnements temps réel via EventBus pour les événements du backend
  useEffect(() => {
    const offCreate = eventBus.on("conge_create", (payload: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("🔔 [useConges] Événement conge_create reçu:", payload);
      }
      // Rafraîchir les données quand un congé est créé
      fetchConges();
    });
    
    const offPatch = eventBus.on("conge_patch", (payload: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("🔔 [useConges] Événement conge_patch reçu:", payload);
      }
      // Rafraîchir les données quand un congé est mis à jour
      fetchConges();
    });
    
    const offDelete = eventBus.on("conge_delete", (payload: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("🔔 [useConges] Événement conge_delete reçu:", payload);
      }
      // Rafraîchir les données quand un congé est supprimé
      fetchConges();
    });

    return () => { 
      offCreate(); 
      offPatch(); 
      offDelete(); 
    };
  }, [fetchConges]);

  const create = useCallback(async (formData: CongeFormData): Promise<CongeWithPersonnelData> => {
    if (!etablissementId) {
      if (process.env.NODE_ENV === 'development') {
        console.warn("⚠️ [useConges] Aucun etablissementId pour la création");
      }
      throw new Error("Établissement non défini");
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log("📡 [useConges] Création d'un congé:", formData);
      }
      const newConge = await congesService.create({ ...formData, etablissement_id: etablissementId });
      
      if (process.env.NODE_ENV === 'development') {
        console.log("✅ [useConges] Congé créé:", newConge);
      }

      // Récupérer les données du personnel pour le nouveau congé
      let personnel: Personnel | undefined = undefined;
      let personnelName = "Inconnu";
      
      try {
        personnel = await personnelsService.getById(newConge.personnel_id, etablissementId);
        personnelName = `${personnel.first_name} ${personnel.last_name}`.trim();
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ [useConges] Personnel récupéré pour nouveau congé ID ${newConge.id}: ${personnelName}`);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`⚠️ [useConges] Erreur récupération personnel pour nouveau congé:`, err);
        }
      }
      
      const enrichedConge = { ...newConge, personnel, personnelName } as CongeWithPersonnelData;
      setData(prev => [...(prev || []), enrichedConge]);
      return enrichedConge;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      if (process.env.NODE_ENV === 'development') {
        console.error("❌ [useConges] Erreur lors de la création du congé:", errorMessage);
      }
      throw new Error(errorMessage);
    }
  }, [etablissementId]);

  const update = useCallback(async (id: number, formData: CongeFormData): Promise<CongeWithPersonnelData> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`📡 [useConges] Mise à jour du congé ID ${id}:`, formData);
      }
      const updatedConge = await congesService.update(id, formData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("✅ [useConges] Congé mis à jour:", updatedConge);
      }

      // Récupérer les données du personnel pour le congé mis à jour
      let personnel: Personnel | null = null;
      let personnelName = "Inconnu";
      
      try {
        personnel = await personnelsService.getById(updatedConge.personnel_id);
        personnelName = `${personnel.first_name} ${personnel.last_name}`.trim();
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ [useConges] Personnel récupéré pour congé mis à jour ID ${id}: ${personnelName}`);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`⚠️ [useConges] Erreur récupération personnel pour congé mis à jour:`, err);
        }
      }
      
      const enrichedConge = { ...updatedConge, personnel, personnelName } as CongeWithPersonnelData;
      setData(prev => (prev || []).map(c => c.id === id ? enrichedConge : c));
      return enrichedConge;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      if (process.env.NODE_ENV === 'development') {
        console.error("❌ [useConges] Erreur lors de la mise à jour du congé:", errorMessage);
      }
      throw new Error(errorMessage);
    }
  }, []);

  const remove = useCallback(async (id: number): Promise<void> => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`📡 [useConges] Suppression du congé ID ${id}`);
      }
      await congesService.delete(id);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("✅ [useConges] Congé supprimé:", id);
      }
      
      setData(prev => (prev || []).filter(c => c.id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      if (process.env.NODE_ENV === 'development') {
        console.error("❌ [useConges] Erreur lors de la suppression du congé:", errorMessage);
      }
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchConges();
  }, [fetchConges]);

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
  };
}