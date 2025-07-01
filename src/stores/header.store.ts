import { create } from "zustand";

interface IStore {
  isCollapsed: boolean;
  toggleIsCollapsed: (newState?: boolean) => void;
}

export const useHeader = create<IStore>((set) => ({
  isCollapsed: false,
  toggleIsCollapsed: (newState = undefined) => {
    set((state) => ({
      isCollapsed: newState !== undefined ? newState : !state.isCollapsed,
    }));
  },
}));
