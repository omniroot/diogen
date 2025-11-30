import { create } from "zustand";

interface UseHabitsStore {
	selectedDate: Date;
	isDaySelectOpen: boolean;
	isHabitDrawerOpen: boolean;
	setSelectedDate: (newDate: Date) => void;
	setDaySelectOpen: (newState: boolean) => void;
	setHabitDrawerOpen: (newState: boolean) => void;
}

export const useHabitsStore = create<UseHabitsStore>((set) => ({
	selectedDate: new Date(),
	isDaySelectOpen: false,
	isHabitDrawerOpen: false,
	setSelectedDate: (newDate) => set({ selectedDate: newDate }),
	setDaySelectOpen: (newState) => set({ isDaySelectOpen: newState }),
	setHabitDrawerOpen: (newState) => set({ isHabitDrawerOpen: newState }),
}));
