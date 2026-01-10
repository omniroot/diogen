import { client } from "@/api/api.ts";
import { goalsTable, tablesDB } from "@/api/appwrite.ts";
import type { Goals } from "@/api/types/appwrite.js";
import {
	createCoreApi,
	createHooksApi,
	type DomainHook,
	type DomainHookMultiple,
} from "@/api/utils/appwrite.utils.tsx";

export const goalsCoreApi = createCoreApi<Goals>({
	tablesDB: tablesDB,
	databaseId: goalsTable?.databaseId,
	tableId: goalsTable?.$id,
});

export const { useList: useGetGoals, useOne: useGetGoal } = createHooksApi<Goals>({
	coreApis: goalsCoreApi,
	name: "goals",
	queryClient: client,
});

export const useGoals = (
	queries: DomainHookMultiple<Goals>["queries"],
	overrides?: DomainHookMultiple<Goals>["overrides"],
) => {
	const { data: goals, isLoading, isFetched, error } = useGetGoals(queries, overrides);
	return { goals, isLoading, isFetched, error };
};

export const useGoal = (
	$id: string,
	queries: DomainHook<Goals>["queries"],
	overrides?: DomainHook<Goals>["overrides"],
) => {
	const { data: goal, isLoading, isFetched, error } = useGetGoal($id, queries, overrides);
	return { goal, isLoading, isFetched, error };
};
