import { create } from "zustand";

interface IModalsStore {
	createIssueModal: boolean;
	setCreateIssueModal: (open?: boolean) => void;
	createModuleModal: boolean;
	setCreateModuleModal: (open?: boolean) => void;
}

export const useModalsStore = create<IModalsStore>((set) => ({
	createIssueModal: false,
	setCreateIssueModal: (open) => {
		if (open === undefined || open === null) {
			set((state) => ({ createIssueModal: !state.createIssueModal, createModuleModal: false }));
		} else {
			set({ createIssueModal: open, createModuleModal: false });
		}
	},
	createModuleModal: false,
	setCreateModuleModal: (open) => {
		if (open === undefined || open === null) {
			set((state) => ({ createModuleModal: !state.createModuleModal, createIssueModal: false }));
		} else {
			set({ createModuleModal: open, createIssueModal: false });
		}
	},
}));
