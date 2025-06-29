import { create } from "zustand";

interface IStore {
	project_id: number;
	custom_id: string;
	setProjectId: (project_id: number) => void;
	setCustomId: (custom_id: string) => void;
}

export const useGlobalStore = create<IStore>((set) => ({
	project_id: 0,
	custom_id: "null",
	setProjectId: (project_id) => set(() => ({ project_id })),
	setCustomId: (custom_id) => set(() => ({ custom_id })),
}));
