import { create } from "zustand";

interface IStore {
  project_id: number | null;
  module_id: number | null;
  custom_id: string | null;
  setProjectId: (project_id: number | null) => void;
  setModuleId: (module_id: number | null) => void;
  setCustomId: (custom_id: string | null) => void;
}

export const useGlobalStore = create<IStore>((set) => ({
  project_id: 0,
  module_id: 0,
  custom_id: "null",
  setProjectId: (project_id) => set(() => ({ project_id })),
  setModuleId: (module_id) => set(() => ({ module_id })),
  setCustomId: (custom_id) => set(() => ({ custom_id })),
}));
