import { useState, useEffect, useCallback } from "react";
import { produitsService } from "@/services/produits";
import { Produit, ProduitFormData, TypeMouvementStock } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { eventBus } from "@/utils/eventBus";

export function useProduits() {
  const { user } = useAuth();
  const [data, setData] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pour un établissement connecté, l'ID est user.id
  // Pour un personnel connecté, l'ID est user.etablissement_id
  const etablissementId = user?.etablissement_id || user?.id;

  
  // Normaliser les produits pour s'aligner sur les réponses backend hétérogènes
  const normalizeProduit = (p: any): Produit => {
    return {
      id: p?.id ?? p?.produit_id ?? 0,
      nom: p?.nom ?? p?.libelle ?? "",
      quantite: Number(p?.quantite ?? p?.stock ?? 0) || 0,
      prix: Number(p?.prix ?? 0) || 0,
      seuil_stock: Number(p?.seuil_stock ?? p?.seuilStock ?? 0) || 0,
      etablissement_id: Number(p?.etablissement_id ?? p?.etablissementId ?? 0) || 0,
      created_at: p?.created_at ?? p?.createdAt ?? undefined,
    } as Produit;
  };

  // Fonction pour charger les produits
  const fetchProduits = useCallback(async () => {
    if (!etablissementId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const produits = await produitsService.getByEtablissement(etablissementId);
      const normalized = (produits || []).filter(Boolean).map(normalizeProduit);
      setData(normalized);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des produits");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [etablissementId]);

  // EventBus abonnements temps réel (aligne avec backend: produit_create/delete/patch)
  useEffect(() => {
    const offCreate = eventBus.on("produit_create", () => { fetchProduits(); });
    const offPatch = eventBus.on("produit_patch", () => { fetchProduits(); });
    const offDelete = eventBus.on("produit_delete", () => { fetchProduits(); });
    return () => { offCreate(); offPatch(); offDelete(); };
  }, [fetchProduits]);

  // Fonction pour créer un produit
  const create = useCallback(async (formData: ProduitFormData): Promise<Produit> => {
    if (!etablissementId || !user?.id) {
      throw new Error("Informations utilisateur manquantes");
    }

    try {
      const dataToSend = {
        ...formData,
        etablissement_id: etablissementId,
        personnel_id: user.id
      };

      const newProduit = await produitsService.create(dataToSend);
      const normalized = normalizeProduit(newProduit);
      
      // Mettre à jour la liste locale
      setData(prev => [...prev, normalized]);
      
      return normalized;
    } catch (error: any) {
      throw error;
    }
  }, [etablissementId, user?.id]);

  // Fonction pour mettre à jour un produit
  const update = useCallback(async (id: number, formData: ProduitFormData): Promise<Produit> => {
    if (!etablissementId || !user?.id) {
      throw new Error("Informations utilisateur manquantes");
    }

    try {
      const dataToSend = {
        ...formData,
        etablissement_id: etablissementId,
        personnel_id: user.id
      };

      const updatedProduit = await produitsService.update(id, dataToSend);
      const normalized = normalizeProduit(updatedProduit);
      
      // Mettre à jour la liste locale
      setData(prev => prev.map(p => p.id === id ? normalized : p));
      
      return normalized;
    } catch (error: any) {
      throw error;
    }
  }, [etablissementId, user?.id]);

  // Fonction pour supprimer un produit
  const remove = useCallback(async (id: number): Promise<void> => {
    try {
      await produitsService.delete(id);
      
      // Mettre à jour la liste locale
      setData(prev => prev.filter(p => p.id !== id));
    } catch (error: any) {
      throw error;
    }
  }, []);

  // Fonction pour mettre à jour le stock
  const updateStock = useCallback(async (
    id: number, 
    quantite: number, 
    type: TypeMouvementStock
  ): Promise<Produit> => {
    if (!user?.id) {
      throw new Error("Informations utilisateur manquantes");
    }

    try {
      const updatedProduit = await produitsService.updateStock(id, quantite, type, user.id);
      const normalized = normalizeProduit(updatedProduit);
      
      // Mettre à jour la liste locale
      setData(prev => prev.map(p => p.id === id ? normalized : p));
      
      return normalized;
    } catch (error: any) {
      throw error;
    }
  }, [user?.id]);

  // Fonction pour rechercher des produits
  const search = useCallback((term: string) => {
    if (!term.trim()) return data;
    
    const searchTerm = term.toLowerCase();
    return data.filter(produit =>
      produit.nom.toLowerCase().includes(searchTerm)
    );
  }, [data]);

  // Fonction pour obtenir les statistiques
  const getStats = useCallback(() => {
    return produitsService.getStats(data);
  }, [data]);

  // Charger les données au montage
  useEffect(() => {
    fetchProduits();
  }, [fetchProduits]);

  return {
    data,
    count: data.length,
    loading,
    error,
    refetch: fetchProduits,
    create,
    update,
    remove,
    updateStock,
    search,
    getStats,
  };
}
