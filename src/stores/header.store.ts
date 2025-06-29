import { create } from "zustand";

interface IStore {
	isCollapsed: boolean;
	toggleIsCollapsed: () => void;
}

export const useHeader = create<IStore>((set) => ({
	isCollapsed: false,
	toggleIsCollapsed: () =>
		set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
