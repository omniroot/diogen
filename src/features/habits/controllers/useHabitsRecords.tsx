import { useGetHabitsRecords } from "@/api/appwrite.tsx";
import type { HabitsRecords } from "@/api/types/appwrite.js";

interface Props {
	record: HabitsRecords[];
}

/**
 *
 * @field date: YYYY-MM-DD
 */
export const useHabitsRecords = (filters: Partial<HabitsRecords>) => {
	const { data: records } = useGetHabitsRecords(filters);
	return { records };
};
