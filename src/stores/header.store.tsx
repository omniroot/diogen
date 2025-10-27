import { create } from "zustand";

interface IUseHeaderStore {
	isOpen: boolean;
	toggleOpen: () => void;
}

export const useHeaderStore = create<IUseHeaderStore>((set) => ({
	isOpen: false,
	toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
