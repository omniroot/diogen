// // import { habitsTable } from "@/api/appwrite.tables.ts";
// import { habitsTable, tablesDB } from "@/api/appwrite.ts";
// import type { HabitsRecords } from "@/api/types/appwrite.js";
// import {
// 	createCoreApi,
// 	createHooksApi,
// 	type DomainHook,
// } from "@/api/utils/appwrite.utils.tsx";

// export const habitsCoreApi = createCoreApi<HabitsRecords>({
// 	tablesDB: tablesDB,
// 	databaseId: habitsTable?.databaseId,
// 	tableId: habitsTable?.$id,
// });

// export const {
// 	useList: useGetHabitsRecords,
// 	useOne: useGetHabitsRecord,
// 	useCreate: useCreateHabitsRecord,
// 	useDelete: useDeleteHabitsRecord,
// 	useUpdate: useUpdateHabitsRecord,
// 	queryKeys: habitsQueryKeys,
// } = createHooksApi<HabitsRecords>({
// 	name: "habits",
// 	coreApis: habitsCoreApi,
// });

// interface UseHabit {
// 	$id: string;
// 	queries?: DomainHook<HabitsRecords>["queries"];
// }

// export const useHabitsRecord = ({ $id, queries }: UseHabit) => {
// 	const { data: habit } = useGetHabit($id, queries);
// 	const { mutate: _removeHabit } = useDeleteHabit();

// 	/**
// 	 *
// 	 * @param $targetId
// 	 * * If $targetId passed delete habit by it
// 	 * * else delete habit by $id from useHabit
// 	 */
// 	function remove($targetId?: string) {
// 		_removeHabit({ $id: $targetId ? $targetId : $id });
// 	}

// 	return { habit, removeHabit: remove };
// };
