import { create } from "zustand";

interface ITaskbarStore {
  isOpen: boolean;
  toggleOpen: (newState?: boolean) => void;
  task_id: number | null;
  setTaskId: (newId: number) => void;
}

export const useTaskbarStore = create<ITaskbarStore>((set) => ({
  isOpen: false,
  toggleOpen: (newState = undefined) => {
    set((state) => ({
      isOpen: newState !== undefined ? newState : !state.isOpen,
    }));
  },
  task_id: null,
  setTaskId: (newId) => {
    set(() => ({
      task_id: newId,
    }));
  },
}));
