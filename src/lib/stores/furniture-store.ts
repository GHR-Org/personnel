import { create } from "zustand";
import {
  FurnitureItem,
  FurnitureData,
  FurnitureType,
  TableStatus,
} from "@/types/table";

export interface FurnitureWithoutId {
  type: FurnitureType;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  name?: string;
}

interface FurnitureStore {
  // Scène 3D
  furniture: FurnitureItem[];
  selected: string | null;
  tableCount: number;

  // Panneau preview
  previewFurniture: FurnitureData[];
  selectedItem: FurnitureData | null;
  previewOpen: boolean;

  // Manipulations
  addFurniture: (item: FurnitureWithoutId) => void;
  setSelected: (id: string | null) => void;
  updateFurniture: (id: string, data: Partial<FurnitureData>) => void;
  updateFurnitureStatus: (id: string, status: TableStatus) => void;
  updateFurnitureRotation: (id: string, rotation: [number, number, number]) => void;
  updateFurnitureName: (id: string, name: string) => void;
  removeFurniture: (id: string) => void;
  clearFurniture: () => void;

  // Preview panel
  setPreviewFurniture: (f: FurnitureData[]) => void;
  setSelectedItem: (item: FurnitureData | null) => void;
  openDrawer: (item: FurnitureData) => void;
  closeDrawer: () => void;
  updateTableStatus: (id: string, status: TableStatus) => void;

  // Storage
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

export const defaultScaleMap: Record<FurnitureType, number> = {
  chaise: 1.2,
  table: 1.4,
  couple: 0.0035,
  caisse: 0.6,
  family: 0.02,
  exterieur: 1.7,
};

export const useFurnitureStore = create<FurnitureStore>((set, get) => ({
  furniture: [],
  selected: null,
  tableCount: 0,
  previewFurniture: [],
  selectedItem: null,
  previewOpen: false,

  addFurniture: (item) => {
    const id = crypto.randomUUID();
    let name = item.name;
    let count = get().tableCount;

    if (item.type === "table" && !name) {
      count += 1;
      name = `Table N°${count}`;
    }

    const newItem: FurnitureItem = {
      id,
      type: item.type,
      position: item.position,
      rotation: item.rotation ?? [0, 0, 0],
      name,
      status: TableStatus.LIBRE,
    };

    const updated = [...get().furniture, newItem];
    localStorage.setItem("room-layout", JSON.stringify(updated));
    set({
      furniture: updated,
      tableCount: count,
      previewFurniture: updated,
    });
  },

  setSelected: (id) => set({ selected: id }),

  updateFurniture: (id, data) => {
    set((state) => {
      const updated = state.furniture.map((item) =>
        item.id === id ? { ...item, ...data } : item
      );

      localStorage.setItem("room-layout", JSON.stringify(updated));

      const previewUpdated = state.previewFurniture.map((item) =>
        item.id === id ? { ...item, ...data } : item
      );

      const updatedSelected =
        state.selectedItem?.id === id
          ? { ...state.selectedItem, ...data }
          : state.selectedItem;

      return {
        furniture: updated,
        previewFurniture: previewUpdated,
        selectedItem: updatedSelected,
      };
    });
  },

  updateFurnitureStatus: (id, status) => {
    get().updateFurniture(id, { status });
  },

  updateFurnitureRotation: (id, rotation) => {
    get().updateFurniture(id, { rotation });
  },

  updateFurnitureName: (id, name) => {
    get().updateFurniture(id, { name });
  },

  removeFurniture: (id) => {
    set((state) => {
      const updated = state.furniture.filter((f) => f.id !== id);
      const previewUpdated = state.previewFurniture.filter((f) => f.id !== id);

      localStorage.setItem("room-layout", JSON.stringify(updated));

      return {
        furniture: updated,
        previewFurniture: previewUpdated,
        selected: state.selected === id ? null : state.selected,
        selectedItem:
          state.selectedItem?.id === id ? null : state.selectedItem,
      };
    });
  },

  clearFurniture: () => {
    localStorage.removeItem("room-layout");
    set({
      furniture: [],
      previewFurniture: [],
      selected: null,
      selectedItem: null,
      tableCount: 0,
    });
  },

  setPreviewFurniture: (furniture) => {
    localStorage.setItem("furniture", JSON.stringify(furniture));
    set({ previewFurniture: furniture });
  },

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
      selectedItem:
        selected?.id === id ? { ...selected, status } : selected,
    });

    localStorage.setItem("furniture", JSON.stringify(updated));

    get().updateFurnitureStatus(id, status);
  },

  saveToStorage: () => {
    const { furniture } = get();
    localStorage.setItem("room-layout", JSON.stringify(furniture));
  },

  loadFromStorage: () => {
    const raw = localStorage.getItem("room-layout");
    if (!raw) return;

    try {
      const parsed: FurnitureItem[] = JSON.parse(raw);
      const updated = parsed.map((item) =>
        (item.type === "table" || item.type === "exterieur") &&
        item.status === undefined
          ? { ...item, status: TableStatus.LIBRE }
          : item
      );

      const tableCount = updated.filter((f) => f.type === "table").length;

      set({
        furniture: updated,
        previewFurniture: updated,
        tableCount,
      });
    } catch (e) {
      console.error("Erreur lors du chargement des données :", e);
    }
  },
}));
