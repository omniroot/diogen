import dayjs from "dayjs";
import { create } from "zustand";

interface UseAppStore {
	selectedDate: string;
	setSelectedDate: (newDate: string) => void;
}

const useAppStore = create<UseAppStore>((set) => ({
	selectedDate: dayjs().format("YYYY-MM-DD"),
	setSelectedDate: (newDate) => set({ selectedDate: newDate }),
}));

export function useApp() {
	const { selectedDate, setSelectedDate } = useAppStore();

	return { selectedDate, setSelectedDate };
}
