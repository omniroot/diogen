import { create } from "zustand";

const isMobile = window.matchMedia("(max-width: 480px)").matches;
const isTablet = window.matchMedia("(max-width: 768px)").matches && !isMobile;

interface IStore {
  isCollapsed: boolean;
  toggleIsCollapsed: (newState?: boolean) => void;
}

export const useHeader = create<IStore>((set) => ({
  isCollapsed: isMobile || isTablet ? true : false,
  toggleIsCollapsed: (newState = undefined) => {
    set((state) => ({
      isCollapsed: newState !== undefined ? newState : !state.isCollapsed,
    }));
  },
}));
