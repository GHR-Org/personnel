// src/lib/stores/furniture-store.ts
"use client"
import { create } from "zustand";
import {
  FurnitureItem,
  FurnitureData,
  FurnitureType,
  TableStatus,
  FurnitureApiPostData
} from "@/types/table";
import {
  getFurniture,
  postFurniture,
  updateFurniture as apiUpdateFurniture,
  deleteFurniture,
  UpdateFurnitureByStatus,
  UpdateFurnitureByName,
} from "@/func/api/table/APIFurniture";
import { getCurrentUser } from "@/func/api/personnel/apipersonnel";

export interface FurnitureWithoutId {
  type: FurnitureType;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  name: string | "Table N°X";
}




interface FurnitureStore {
  furniture: FurnitureItem[];
  selected: number | null;
  tableCount: number;
  previewFurniture: FurnitureData[];
  selectedItem: FurnitureData | null;
  previewOpen: boolean;

  addFurniture: (item: FurnitureWithoutId) => Promise<void>;
  setSelected: (id: number | null) => void;
  updateFurniture: (id: number, data: Partial<FurnitureData>) => Promise<void>;
  updateFurnitureStatus: (id: number, status: TableStatus) => Promise<void>;
  updateFurnitureRotation: (id: number, rotation: [number, number, number]) => Promise<void>;
  updateFurnitureName: (id: number, name: string) => Promise<void>;
  removeFurniture: (id: number) => Promise<void>;
  clearFurniture: () => void;
  setPreviewFurniture: (f: FurnitureData[]) => void;
  setSelectedItem: (item: FurnitureData | null) => void;
  openDrawer: (item: FurnitureData) => void;
  closeDrawer: () => void;
  updateTableStatus: (id: number, status: TableStatus) => void;
  saveToStorage: () => void;
  loadFromDatabase: () => Promise<void>;
}

export const defaultScaleMap: Record<FurnitureType, number> = {
  chaise: 1.2,
  table: 1.4,
  couple: 0.0035,
  caisse: 0.6,
  family: 0.02,
  exterieur: 1.7,
};

const getIdEtablissement = async (): Promise<number> => {
  const user = await getCurrentUser();
  return user?.etablissement_id ?? 1; 
}
const etablissement_id = getIdEtablissement();

    

export const useFurnitureStore = create<FurnitureStore>((set, get) => ({
  furniture: [],
  selected: null,
  tableCount: 0,
  previewFurniture: [],
  selectedItem: null,
  previewOpen: false,
  // Valeur par défaut

  addFurniture: async (item) => {
    let name = item.name;
    let count = get().tableCount;

    if (item.type === "table" && !name) {
      count += 1;
      name = `Table N°${count}`;
    }

    try {
      // Préparation des données pour l'API
      const newFurnitureDbFormat: FurnitureApiPostData= {
        id: undefined, // ID will be assigned by the backend
        nom: name,
        type: item.type,
        status: TableStatus.LIBRE,
        position: { x: item.position[0], y: item.position[1], z: item.position[2] },
        rotation: { x: item.rotation?.[0] ?? 0, y: item.rotation?.[1] ?? 0, z: item.rotation?.[2] ?? 0 },
        client_id: 0,
        etablissement_id : await etablissement_id,
      };

      // Étape 1 : Appel à l'API pour ajouter le meuble.
      await postFurniture(newFurnitureDbFormat);

      // Étape 2 : Lancer un re-chargement complet des données depuis la base de données.
      await get().loadFromDatabase(); 
    } catch (error) {
      console.error("Erreur lors de l'ajout du meuble via l'API :", error);
    }
  },

  setSelected: (id) => set({ selected: id }),

  updateFurniture: async (id, data) => {
    try {
      // Préparation des données pour l'API
      const updatedData: Partial<Omit<FurnitureApiPostData, 'id'>> = {
        nom: data.name, // Mappage du nom
        type: data.type, // Mappage du type
        status: data.status, // Mappage du statut
        position: data.position ? { x: data.position[0], y: data.position[1], z: data.position[2] } : undefined,
        rotation: data.rotation ? { x: data.rotation[0], y: data.rotation[1], z: data.rotation[2] } : undefined,
      };

      // Appel à l'API pour mettre à jour
      await apiUpdateFurniture(id, updatedData);

      // Mise à jour du store si l'appel API a réussi
      set((state) => {
        const updated = state.furniture.map((item) =>
          item.id === id ? { ...item, ...data } : item
        );
        const previewUpdated = state.previewFurniture.map((item) =>
          item.id === id ? { ...item, ...data } : item
        );
        const updatedSelected =
          state.selectedItem?.id === id ? { ...state.selectedItem, ...data } : state.selectedItem;

        return {
          furniture: updated,
          previewFurniture: previewUpdated,
          selectedItem: updatedSelected,
        };
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du meuble via l'API :", error);
    }
  },

  updateFurnitureStatus: async (id, status) => {
    await UpdateFurnitureByStatus(id, status);
    get().loadFromDatabase();

  },
  updateFurnitureRotation: async (id, rotation) => get().updateFurniture(id, { rotation }),
  updateFurnitureName: async (id, name) => {
    await UpdateFurnitureByName(id, name);
    get().loadFromDatabase();
    
  },

  removeFurniture: async (id) => {
    try {
      const success = await deleteFurniture(id);
      if (success) {
        set((state) => {
          const updated = state.furniture.filter((f) => f.id !== id);
          const previewUpdated = state.previewFurniture.filter((f) => f.id !== id);

          return {
            furniture: updated,
            previewFurniture: previewUpdated,
            selected: state.selected === id ? null : state.selected,
            selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
          };
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du meuble via l'API :", error);
    }
  },

  clearFurniture: () => {
    set({
      furniture: [],
      previewFurniture: [],
      selected: null,
      selectedItem: null,
      tableCount: 0,
    });
  },

  setPreviewFurniture: (furniture) => set({ previewFurniture: furniture }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  openDrawer: (item) => set({ selectedItem: item, previewOpen: true }),
  closeDrawer: () => set({ selectedItem: null, previewOpen: false }),

  updateTableStatus: (id, status) => {
    const updated = get().previewFurniture.map((item) =>
      item.id === id ? { ...item, status } : item
    );
    const selected = get().selectedItem;
    set({
      previewFurniture: updated,
      selectedItem: selected?.id === id ? { ...selected, status } : selected,
    });
    get().updateFurnitureStatus(id, status);
  },

  saveToStorage: () => {
    const { furniture } = get();
    localStorage.setItem("room-layout", JSON.stringify(furniture));
  },

  loadFromDatabase: async () => {
  try {
    // getFurniture retourne maintenant un tableau, pas un objet contenant un tableau.
    const Etablissement_id = await etablissement_id;
    const furnitureFromDb = await getFurniture(Etablissement_id ); 
    
    // Le code de mappage fonctionnera maintenant car furnitureFromDb est un tableau.
     const updated = furnitureFromDb.map((item) => {
        // Le format de l'API a des propriétés plates (positionX, positionY, etc.)
        // Nous les convertissons en tableaux pour le store.
        return {
          id: item.id,
          name: item.nom,
          type: item.type,
          status: item.status,
          position: [item.positionX, item.positionY, item.positionZ] as [number, number, number],
          rotation: [item.rotationX, item.rotationY, item.rotationZ] as [number, number, number],
        };
      });
    const tableCount = updated.filter((f) => f.type === "table").length;

    set({
      furniture: updated,
      previewFurniture: updated,
      tableCount,
    });
  } catch (e) {
    console.error("Erreur lors du chargement des données depuis la base de données :", e);
  }
},
}));