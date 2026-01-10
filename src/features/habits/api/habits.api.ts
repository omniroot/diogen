// import { habitsTable } from "@/api/appwrite.tables.ts";
import { client } from "@/api/api.ts";
import { habitsTable, tablesDB } from "@/api/appwrite.ts";
import type { Habits } from "@/api/types/appwrite.js";
import {
	createCoreApi,
	createHooksApi,
	type DomainHook,
	type DomainHookMultiple,
	type UpdateDataTyped,
} from "@/api/utils/appwrite.utils.tsx";

export const habitsCoreApi = createCoreApi<Habits>({
	tablesDB: tablesDB,
	databaseId: habitsTable?.databaseId,
	tableId: habitsTable?.$id,
});

export const {
	useList: useGetHabits,
	useOne: useGetHabit,
	useCreate: useCreateHabit,
	useDelete: useDeleteHabit,
	useUpdate: useUpdateHabit,
	queryKeys: habitsQueryKeys,
} = createHooksApi<Habits>({
	name: "habits",
	coreApis: habitsCoreApi,
	queryClient: client,
});

// useHabits:
// - createHabit()
// - loadHabits()
// - refetch()
// - reorderHabits()
// - archiveCompleted()
// - bulkUpdate()
// - getById()
// - getAll()

export const useHabits = (
	queries: DomainHookMultiple<Habits>["queries"],
	overrides?: DomainHookMultiple<Habits>["overrides"],
) => {
	const { data: habits, isLoading, refetch } = useGetHabits(queries, overrides);
	const { mutate: _createHabit } = useCreateHabit();

	function create(data: UpdateDataTyped<Habits>) {
		_createHabit(data);
	}

	return { habits, isLoading, refetch, createHabit: create };
};

// useHabit:
// - toggle()
// - update(data)
// - rename()
// - markCompleted()
// - unarchive()
// - remove()   ← важно: удаление по id допустимо

interface UseHabit {
	$id: string;
	queries?: DomainHook<Habits>["queries"];
}

export const useHabit = ({ $id, queries }: UseHabit) => {
	const { data: habit } = useGetHabit($id, queries);
	const { mutate: _removeHabit } = useDeleteHabit();

	/**
	 *
	 * @param $targetId
	 * * If $targetId passed delete habit by it
	 * * else delete habit by $id from useHabit
	 */
	function remove($targetId?: string) {
		_removeHabit({ $id: $targetId ? $targetId : $id });
	}

	return { habit, removeHabit: remove };
};

// const { habit, removeHabit } = useHabit({ $id: "12" });

// const a = removeHabit();
