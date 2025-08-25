import { Rapport } from "@/app/reception/rapports/column";
import apiClient from "@/func/APIClient";
import { toast } from "sonner";

const APIUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"; // Replace with actual etablissement ID retrieval logic

interface GetRapportsResponse {
  message: string;
  rapports: Rapport[]; 
}

export const getRapportsByEtablissement = async (etablissement_id: number): Promise<Rapport[]> => {
    try {
        // Le type attendu de la réponse complète de l'API est GetPlatsResponse
        const response = await apiClient.get<GetRapportsResponse>(`${APIUrl}/rapport/etablissement/${etablissement_id}`);
        
        // Accédez à la propriété 'plats' qui est le tableau
        const RapportsData = response.data.rapports;
        console.log(RapportsData)
        return RapportsData;
    } catch (error) {
        console.error("Error fetching plats by etablissement:", error);
        throw error;
    }
};

export const createRapport = async (payload: {
  titre: string;
    description: string;
    type: string;
    personnel_id: number;
    etablissement_id: number;
    statut: "En Attente" | "En Cours" | "Terminé";
}): Promise<Rapport> => {
    try {
        const response = await apiClient.post<Rapport>(`${APIUrl}/rapport`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(`Rapport created successfully with ID: ${response.data.id}`);
        return response.data;
    } catch (error) {
        console.error("Error creating rapport:", error);
        throw error;
    }
}
export const DeleteRapport = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`${APIUrl}/rapport/${id}`);
        console.log(`Rapport with ID ${id} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting rapport:", error);
        throw error;
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateRapport = async (id: number, data: any): Promise<void> => {
    try {
        await apiClient.put(`/rapports/${id}`, data);
        toast.success("Rapport mis à jour avec succès.");
    } catch (error) {
        console.error("Erreur lors de la mise à jour du rapport:", error);
        toast.error("Erreur lors de la mise à jour du rapport.");
        throw error;
    }
};