import { ClientSchema } from "@/schemas/client"
import z from "zod"

export interface Client{
    id : number
    first_name : string
    last_name : string
    email : string
    password ?: string
    phone : string
    pays : string
    sexe : Sexe
    account_status : Account_status

}
export enum Sexe{
    HOMME = "Homme",
    FEMME = "Femme",
    AUTRE = "Autre"
}
export enum Account_status{
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export type ClientFormInputs = z.infer<typeof ClientSchema>;
