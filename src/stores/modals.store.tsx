import { create } from "zustand";

type ModalType = "issue" | "module" | "habit" | "search";
type ModalMode = "create" | "update" | "delete";

interface ModalState {
	type: ModalType | null;
	mode: ModalMode | null;
}

interface ModalStore {
	open: (type: ModalType, mode?: ModalMode) => void;
	close: () => void;
	// toggle: (type: ModalType, mode?: ModalMode) => void;
	// isOpen: (type: ModalType) => boolean;
	isAnyOpen: () => boolean;
	current: ModalState;
}

export const useModalsStore = create<ModalStore>((set, get) => ({
	current: { type: null, mode: null },
	open: (type, mode = "create") => set({ current: { type, mode } }),
	close: () => set({ current: { type: null, mode: null } }),
	isAnyOpen: () => get().current.type !== null,

	// open: (type, mode = "create") => set({ current: { type, mode } }),

	// toggle: (type, mode = "create") => {
	// 	const { current } = get();
	// 	if (current.type === type) {
	// 		set({ current: { type: null, mode: null } });
	// 	} else {
	// 		set({ current: { type, mode } });
	// 	}
	// },

	// isOpen: (type) => get().current.type === type,
}));

export function useModals(type: ModalType) {
	const { current, open, close, isAnyOpen } = useModalsStore();

	console.log({ isAnyOpen });

	return {
		current,
		mode: current.type === type ? current.mode : null,
		type: current.type === type ? current.type : null,
		isOpen: current.type === type,
		open: (mode: ModalMode = "create") => open(type, mode),
		close,
		isAnyOpen,
	};
}
