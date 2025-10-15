// src/services/produits.ts
import { apiService } from "./api";
import { Produit, ProduitFormData, TypeMouvementStock } from "@/types";

export class ProduitsService {
  private baseUrl = "/produit";

  // Récupérer tous les produits d'un établissement
  async getByEtablissement(etablissementId: number): Promise<Produit[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/etablissement/${etablissementId}`);
      return response.produits || [];
    } catch (error) {
      console.error("[ProduitsService] Erreur getByEtablissement:", error);
      throw new Error("Erreur lors du chargement des produits");
    }
  }

  // Créer un nouveau produit
  async create(data: ProduitFormData): Promise<Produit> {
    try {
      const response = await apiService.post(this.baseUrl, data);
      return response.produit;
    } catch (error: any) {
      console.error("[ProduitsService] Erreur create:", error);
      const message = error?.response?.data?.message || "Erreur lors de la création du produit";
      throw new Error(message);
    }
  }

  // Mettre à jour un produit
  async update(id: number, data: ProduitFormData): Promise<Produit> {
    try {
      const response = await apiService.put(`${this.baseUrl}/${id}`, data);
      return response.produit;
    } catch (error: any) {
      console.error("[ProduitsService] Erreur update:", error);
      const message = error?.response?.data?.message || "Erreur lors de la mise à jour du produit";
      throw new Error(message);
    }
  }

  // Supprimer un produit
  async delete(id: number): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      console.error("[ProduitsService] Erreur delete:", error);
      const message = error?.response?.data?.message || "Erreur lors de la suppression du produit";
      throw new Error(message);
    }
  }

  // Mettre à jour le stock (entrée/sortie)
  async updateStock(
    id: number, 
    quantite: number, 
    type: TypeMouvementStock, 
    personnelId: number
  ): Promise<Produit> {
    try {
      const response = await apiService.patch(`${this.baseUrl}/${id}`, {
        quantite,
        type,
        personnel_id: personnelId
      });
      return response.produit;
    } catch (error: any) {
      console.error("[ProduitsService] Erreur updateStock:", error);
      const message = error?.response?.data?.message || "Erreur lors de la mise à jour du stock";
      throw new Error(message);
    }
  }

  // Calculer les statistiques des produits
  getStats(produits: Produit[]) {
    const totalProduits = produits.length;
    const stockTotal = produits.reduce((sum, p) => sum + p.quantite, 0);
    const valeurStock = produits.reduce((sum, p) => sum + (p.quantite * p.prix), 0);
    const produitsEnRupture = produits.filter(p => p.quantite <= p.seuil_stock).length;
    const produitsDisponibles = produits.filter(p => p.quantite > p.seuil_stock).length;

    return {
      totalProduits,
      stockTotal,
      valeurStock,
      produitsEnRupture,
      produitsDisponibles
    };
  }
}

export const produitsService = new ProduitsService();
