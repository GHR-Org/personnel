// src/func/api/notification/ApiNotif.ts
import apiClient from "@/func/APIClient";
import { Notification } from "@/types/notification";

const APIURL = process.env.NEXT_PUBLIC_API_URL;
export interface GetNotificationsResponse {
    message: string;
    notifications: Notification[];
}


export const GetNotificationsByEtab = async(etablissementId : number) : Promise<Notification[]> =>
{
    try{
        const response = await apiClient.get<GetNotificationsResponse>(`${APIURL}/notification/etablissement/${etablissementId}`);
        return response.data.notifications;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error : any)
    {
        console.error("Erreur lors de la récupération des notifications :", error);
        return [];
    }
}
