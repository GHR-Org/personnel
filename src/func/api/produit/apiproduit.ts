import apiClient from "@/func/APIClient";
import { Produit } from "@/types/Produit";


interface GetProduitResponse {
  message: string;
  produits: Produit[]; 
}

const APIURL = process.env.NEXT_PUBLIC_API_URL;


export const getAllProduits = async (etablissement_id: number): Promise<Produit[]> => {
  try {
    const response = await apiClient.get<GetProduitResponse>(
      `${APIURL}/produit/etablissement/${etablissement_id}`
    );
    console.table(response.data.produits)
    return response.data.produits;
    
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des réservations:", error); 
    return []; 
  }
};