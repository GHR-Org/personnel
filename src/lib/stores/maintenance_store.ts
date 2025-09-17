// src/store/store.ts
import { create } from "zustand";
import { toast } from "sonner";
import { persist, createJSONStorage } from "zustand/middleware";
import apiEquipement from "@/func/api/equipement/APIEquipment";
import { getCurrentUser } from "@/func/api/personnel/apipersonnel";
import { v4 as uuidv4 } from "uuid";
import apiIncident from "@/func/api/incidents/APIincident";

// --- Définition des types pour le store ---
export type EquipmentStatus =
  | "Fonctionnel"
  | "En Maintenance"
  | "Hors service"
  | "En panne";

export interface EquipmentFormValues {
  nom: string;
  type: string;
  localisation: string;
  status: EquipmentStatus;
  description?: string;
  etablissement_id: number | null;
}

export interface Equipment extends EquipmentFormValues {
  id: string;
}

export type IncidentSeverity = "Faible" | "Moyen" | "Élevé";
export type IncidentStatus = "Ouvert" | "En cours" | "Fermé";

export interface IncidentFormValues {
  equipement_id: string;
  incident_Id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
}

export interface Incident extends IncidentFormValues {
  id: string;
  reportedAt: string;
}

export type InterventionStatus =
  | "Planifiée"
  | "En cours"
  | "Terminée"
  | "Annulée";

export interface InterventionFormValues {
  incident_Id: string;
  personnel_Id: string;
  scheduledDate: string;
  description: string;
  status: InterventionStatus;
}

export interface Intervention extends InterventionFormValues {
  id: string;
}

type InterventionUpdate = Partial<Omit<Intervention, "id">>;

// --- Définition de l'interface complète de l'état ---
interface AppState {
  equipments: Equipment[];
  incidents: Incident[];
  interventions: Intervention[];
  isLoadingEquipments: boolean;
  isLoadingIncidents: boolean;
  isLoadingInterventions: boolean;
  establishmentId: number | null;

  addEquipment: (equipment: Omit<Equipment, "id">) => Promise<void>;
  addIncident: (incident: IncidentFormValues) => void;
  addIntervention: (intervention: InterventionFormValues) => void;

  getIncidentById: (id: string) => Incident | undefined;
  getEquipmentById: (id: string) => Equipment | undefined;

  updateEquipment: (
    id: string,
    updatedData: Partial<Equipment>
  ) => Promise<void>;
  updateIntervention: (id: string, updates: InterventionUpdate) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;

  deleteIntervention: (id: string) => void;
  deleteEquipment: (id: string) => Promise<void>;

  fetchIncidents: () => Promise<void>;
  fetchEquipments: () => Promise<void>;
  fetchInterventions: () => Promise<void>;

  setEstablishmentId: (id: number | null) => void;
  initializeStore: () => Promise<void>;
}

// --- Création du store avec le middleware `persist` ---
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // État initial
      equipments: [],
      incidents: [],
      interventions: [],
      isLoadingEquipments: false,
      isLoadingIncidents: false,
      isLoadingInterventions: false,
      establishmentId: null,

      // --- Actions ---
      addEquipment: async (newEquipment) => {
        const {
          etablissement_id,
          nom,
          type,
          localisation,
          status,
          description,
        } = newEquipment;
        if (!etablissement_id) {
          toast.error(
            "Échec de l'ajout : l'ID de l'établissement est manquant."
          );
          return;
        }
        const newEquipmentId = `EQ-${uuidv4()}`;
        const equipmentDataWithId = {
          id: newEquipmentId,
          nom,
          type,
          localisation,
          status,
          description,
          etablissement_id,
        };
        try {
          const createdEquipment = await apiEquipement.createEquipement(
            equipmentDataWithId
          );
          set((state) => ({
            equipments: [...state.equipments, createdEquipment],
          }));
        } catch (error) {
          console.error("Échec de l'ajout de l'équipement :", error);
          toast.error("Échec de l'ajout de l'équipement.");
        }
      },

      addIncident: async (newIncident) => {
        try {
          const response = await apiIncident.createIncident(newIncident);
          if (response && response.return) {
            const createdIncident = response.return;
            set((state) => ({
              incidents: [...state.incidents, createdIncident],
            }));
            // Mettre à jour l'équipement en "En panne"
            get().updateEquipment(createdIncident.equipement_id, {
              status: "En panne",
            });
          } else {
            toast.error("Format de réponse de l'API inattendu.");
          }
        } catch (error) {
          console.error("Échec de la création de l'incident :", error);
          toast.error("Échec de la création de l'incident.");
        }
      },

      addIntervention: (newIntervention) => {
        set((state) => {
          const createdIntervention = {
            ...newIntervention,
            id: `INT-${uuidv4()}`,
          };
          // Mettre à jour l'équipement en "En Maintenance"
          const incident = state.incidents.find(
            (inc) => inc.id === createdIntervention.incident_Id
          );
          if (incident) {
            get().updateEquipment(incident.equipement_id, {
              status: "En Maintenance",
            });
          }
          return {
            interventions: [...state.interventions, createdIntervention],
          };
        });
      },

      // Fonctions de mise à jour et suppression
      updateIncident: (id, updates) => {
        set((state) => ({
          incidents: state.incidents.map((incident) =>
            incident.id === id ? { ...incident, ...updates } : incident
          ),
        }));
      },

      updateEquipment: async (id, updatedData) => {
        try {
          const equipmentToUpdate = get().equipments.find(
            (equip) => equip.id === id
          );
          if (!equipmentToUpdate) {
            throw new Error("Équipement non trouvé.");
          }
          const updatedEquipment = await apiEquipement.updateEquipement({
            ...equipmentToUpdate,
            ...updatedData,
          });
          set((state) => ({
            equipments: state.equipments.map((equip) =>
              equip.id === id ? updatedEquipment : equip
            ),
          }));
        } catch (error) {
          console.error("Échec de la mise à jour de l'équipement :", error);
          toast.error("Échec de la mise à jour de l'équipement.");
        }
      },

      updateIntervention: (id, updates) => {
        // Met à jour localement l'intervention d'abord
        set((state) => ({
          interventions: state.interventions.map((intervention) =>
            intervention.id === id
              ? { ...intervention, ...updates }
              : intervention
          ),
        }));

        // Si le statut est "Terminée", on déclenche les mises à jour en chaîne
        if (updates.status === "Terminée") {
          const currentIntervention = get().interventions.find(
            (interv) => interv.id === id
          );

          if (currentIntervention) {
            // Étape 1 : Mettre à jour l'incident
            const incident = get().incidents.find(
              (inc) => inc.id === currentIntervention.incident_Id
            );

            if (incident) {
              get().updateIncident(incident.id, { status: "Fermé" });

              // Étape 2 : Mettre à jour l'équipement
              const equipment = get().equipments.find(
                (eq) => eq.id === incident.equipement_id
              );

              if (equipment) {
                get().updateEquipment(equipment.id, {
                  status: "Fonctionnel",
                });
              }
            }
          }
        }
      },

      deleteIntervention: (id) => {
        set((state) => ({
          interventions: state.interventions.filter(
            (intervention) => intervention.id !== id
          ),
        }));
      },

      deleteEquipment: async (id) => {
        try {
          await apiEquipement.deleteEquipement(id);
          set((state) => ({
            equipments: state.equipments.filter((equip) => equip.id !== id),
          }));
        } catch (error) {
          console.error("Échec de la suppression de l'équipement :", error);
          toast.error("Échec de la suppression de l'équipement.");
        }
      },

      // Fonctions de fetch (simplifiées sans les drapeaux hasFetched)
      fetchEquipments: async () => {
        const establishmentId = get().establishmentId;
        if (!establishmentId) {
          return;
        }
        set({ isLoadingEquipments: true });
        try {
          const fetchedEquipments = await apiEquipement.getAllEquipements(
            establishmentId
          );
          set({ equipments: fetchedEquipments, isLoadingEquipments: false });
        } catch (error) {
          console.error("Échec de la récupération des équipements:", error);
          set({ isLoadingEquipments: false });
          toast.error("Échec de la récupération des équipements.");
        }
      },

      fetchIncidents: async () => {
        set({ isLoadingIncidents: true });
        try {
          const response = await apiIncident.getIncidents();
          set({
            incidents: response,
            isLoadingIncidents: false,
          });
        } catch (error) {
          console.error("Échec de la récupération des incidents :", error);
          set({ isLoadingIncidents: false });
          toast.error("Échec de la récupération des incidents.");
        }
      },

      fetchInterventions: async () => {
        set({ isLoadingInterventions: true });
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ isLoadingInterventions: false });
      },

      setEstablishmentId: (id) => set({ establishmentId: id }),

      initializeStore: async () => {
        const user = await getCurrentUser();
        if (user && user.etablissement_id) {
          const establishmentId = Number(user.etablissement_id);
          set({ establishmentId });
        }
      },

      getIncidentById: (id: string) => {
        return get().incidents.find((incident) => incident.id === id);
      },

      getEquipmentById: (id: string) => {
        return get().equipments.find((equipment) => equipment.id === id);
      },
    }),
    {
      name: "maintenance-app-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);