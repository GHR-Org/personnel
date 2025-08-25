import apiClient from "@/func/APIClient";
import { Equipment } from "@/lib/stores/maintenance_store";


const APIURL = process.env.NEXT_PUBLIC_API_URL

interface EquipementListResponse {
  message: string;
  equipements: Equipment[];
}

/**
 * Service pour la gestion des appels API liés aux équipements.
 */
class APIEquipement {
  /**
   * Récupère la liste de tous les équipements depuis la base de données.
   * @returns Une promesse qui résout avec un tableau d'objets Equipment.
   */
  public async getAllEquipements( etablissement_id : number): Promise<Equipment[]> {
    try {
      
      const response = await apiClient.get<EquipementListResponse>(`${APIURL}/equipement/etablissement/${etablissement_id}`);
      return response.data.equipements;
    } catch (error) {
      console.error("Erreur lors de la récupération des équipements:", error);
      throw error;
    }
  }
  /**
   * Crée un nouvel équipement dans la base de données.
   * @param equipmentData Les données du nouvel équipement à créer.
   * @returns Une promesse qui résout avec l'objet Equipment créé par le backend, incluant son ID.
   */
   public async createEquipement(equipmentData: Equipment): Promise<Equipment> {
    try {
        console.table(equipmentData)
      const response = await apiClient.post<Equipment>(`${APIURL}/equipement`, equipmentData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'équipement:", error);
      throw error;
    }
  }
  public async deleteEquipement(id: string): Promise<void> {
    try {
      await apiClient.delete(`${APIURL}/equipement/${id}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'équipement:", error);
      throw error;
    }
  }
   public async updateEquipement(equipmentData: Equipment): Promise<Equipment> {
    try {
      const response = await apiClient.put<Equipment>(
        `${APIURL}/equipement/${equipmentData.id}`,
        equipmentData
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'équipement:", error);
      throw error;
    }
  }
}

// Exportez une instance de la classe pour l'utiliser dans d'autres parties de l'application
const apiEquipement = new APIEquipement();

export default apiEquipement;