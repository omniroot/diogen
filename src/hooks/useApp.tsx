import dayjs from "dayjs";
import { create } from "zustand";
import type { Activities } from "@/api/types/appwrite.js";

interface UseAppStore {
	selectedDate: string;
	setSelectedDate: (newDate: string) => void;
	selectedActivity: Activities | null;
	setSelectedActivity: (newActivity: Activities | null) => void;
}

const useAppStore = create<UseAppStore>((set) => ({
	selectedDate: dayjs().format("YYYY-MM-DD"),
	setSelectedDate: (newDate) => set({ selectedDate: newDate }),
	selectedActivity: null,
	setSelectedActivity: (newActivity) => set({ selectedActivity: newActivity }),
}));

export function useApp() {
	const { selectedDate, setSelectedDate, selectedActivity, setSelectedActivity } =
		useAppStore();

	console.log({ selectedActivity });

	return { selectedDate, setSelectedDate, selectedActivity, setSelectedActivity };
}
