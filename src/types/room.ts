import { TypeChambre } from "@/lib/enum/TypeRoom"

export interface room {
    id : number
    numero : string
    capacite : number
    equipements : []
    categorie : TypeChambre
    tarif : string
    description : string
    id_etablissement : number
    image : string
    etat : RoomState

}
export enum RoomState {
    LIBRE = "Libre",
    OCCUPEE = "Occupée",
    HORS_SERVICE = "hors service",
    NETTOYAGE = "En nettoyage",
}