// ============================================================================
// HOOK CLIENTS INTÉGRÉ
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { clientsService } from "@/services/clients";
import { Client, UseListDataResult } from "@/types";
import { toast } from "sonner";
import { eventBus } from "@/utils/eventBus";

export function useClients(): UseListDataResult<Client> {
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Abonnements temps réel via EventBus
  useEffect(() => {
    const offCreate = eventBus.on("client_create", (c: any) => {
      setData(prev => (prev.find(x => x.id === c.id) ? prev : [...prev, c]));
    });
    const offUpdate = eventBus.on("client_update", (c: any) => {
      setData(prev => prev.map(x => (x.id === c.id ? { ...x, ...c } : x)));
    });
    const offDelete = eventBus.on("client_delete", (c: any) => {
      setData(prev => prev.filter(x => x.id !== c.id));
    });
    return () => { offCreate(); offUpdate(); offDelete(); };
  }, []);

  // Récupérer les clients
  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const clients = await clientsService.getAll();
      setData(clients);
    } catch (err: any) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un client
  const create = useCallback(async (formData: Omit<Client, "id" | "created_at">): Promise<Client | null> => {
    try {
      const newClient = await clientsService.create(formData);
      
      setData(prev => [...prev, newClient]);
      toast.success("Client créé avec succès");
      return newClient;
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, []);

  // Mettre à jour un client
  const update = useCallback(async (id: number, formData: Partial<Omit<Client, "id" | "created_at">>): Promise<Client | null> => {
    try {
      const updatedClient = await clientsService.update(id, formData);
      
      setData(prev => prev.map(client => 
        client.id === id ? updatedClient : client
      ));
      
      toast.success("Client mis à jour avec succès");
      return updatedClient;
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, []);

  // Supprimer un client
  const remove = useCallback(async (id: number): Promise<boolean> => {
    try {
      await clientsService.delete(id);
      
      setData(prev => prev.filter(client => client.id !== id));
      toast.success("Client supprimé avec succès");
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  }, []);

  // Rechercher des clients
  const search = useCallback(async (query: string): Promise<Client[]> => {
    try {
      return await clientsService.search(query);
    } catch (err: any) {
      toast.error(err.message);
      return [];
    }
  }, []);

  // Charger les données au montage
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    data,
    count: data.length,
    loading,
    error,
    refetch: fetchClients,
    // Méthodes spécifiques
    create,
    update,
    remove,
    search,
  } as any;
}

// Hook pour les statistiques des clients
export function useClientsStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await clientsService.getStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
