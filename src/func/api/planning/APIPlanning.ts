import apiClient from "@/func/APIClient";
import { PlanningEvent } from "@/types/planning";


const APIUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"; 

interface getPlanningResponse{
    message : string;
    plannings : PlanningEvent[]
}

export const GetPlanningByEtablisement = async(etablissement_id : number) : Promise<PlanningEvent[]> =>{
    try{
        const response = await apiClient.get<getPlanningResponse>(`/${APIUrl}planning/${etablissement_id}`)
        const planningData = response.data.plannings
        console.table(planningData)
        return planningData
    }
    catch (error){
        console.log("erreur lors de la récupération", error)
        return []
    }
}