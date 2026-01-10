import { client } from "@/api/api.ts";
import { activitiesTable, activitityEntriesTable, tablesDB } from "@/api/appwrite.ts";
import type { Activities, ActivityEntries } from "@/api/types/appwrite.js";
import {
	createCoreApi,
	createHooksApi,
	type DomainHook,
	type DomainHookMultiple,
} from "@/api/utils/appwrite.utils.tsx";
import { useAuth } from "@/features/auth/hooks/auth.hook.ts";

// ==== ACTIVITIES ====

export const activitiesCoreApi = createCoreApi<Activities>({
	tablesDB: tablesDB,
	databaseId: activitiesTable?.databaseId,
	tableId: activitiesTable?.$id,
});

export const {
	useList: useGetActivities,
	useOne: useGetActivity,
	queryKeys: activitiesQueryKeys,
	refetch: refetchActivities,
} = createHooksApi<Activities>({
	coreApis: activitiesCoreApi,
	name: "activities",
	queryClient: client,
});

export const useActivities = (
	queries: DomainHookMultiple<Activities>["queries"],
	overrides?: DomainHookMultiple<Activities>["overrides"],
) => {
	const {
		data: activities,
		isLoading,
		isFetched,
		error,
	} = useGetActivities(queries, overrides);
	return { activities, isLoading, isFetched, error };
};

// ==== ACTIVITY ENTRTIES ====

export const activitityEntriesCoreApi = createCoreApi<ActivityEntries>({
	tablesDB: tablesDB,
	databaseId: activitityEntriesTable?.databaseId,
	tableId: activitityEntriesTable?.$id,
});
export const {
	useList: useGetActivityEntries,
	useOne: useGetActivityEntry,
	useCreate: useCreateActivityEntry,
	useUpdate: useUpdateActivityEntry,
	refetch: refetchActivityEntries,
} = createHooksApi<ActivityEntries>({
	coreApis: activitityEntriesCoreApi,
	name: "activity_entries",
	queryClient: client,
});

export const useActivityEntries = (
	queries: DomainHookMultiple<ActivityEntries>["queries"],
	overrides?: DomainHookMultiple<ActivityEntries>["overrides"],
) => {
	const {
		data: activityEntries,
		isLoading,
		isFetched,
		error,
	} = useGetActivityEntries(queries, overrides);
	return { activityEntries, isLoading, isFetched, error };
};

export const useActivityEntry = (
	$id: string,
	queries?: DomainHook<ActivityEntries>["queries"],
	overrides?: DomainHook<ActivityEntries>["overrides"],
) => {
	const { user } = useAuth();
	const {
		data: activityEntry,
		isLoading,
		isFetched,
		error,
	} = useGetActivityEntry($id, queries, overrides);

	const { mutate: createActivityEntry } = useCreateActivityEntry();
	const { mutate: updateActivityEntry } = useUpdateActivityEntry();

	const onSuccess = (activityEntry: ActivityEntries) => {
		refetchActivityEntries.list({
			where: { activity_id: { equal: activityEntry.activity_id } },
		});
	};

	function updateOrCreate(newEntry: ActivityEntries) {
		if (!newEntry.$id || newEntry.$id.includes("null")) {
			console.log("Create new entry");

			createActivityEntry(
				{
					completed: newEntry.completed,
					activity_id: newEntry.activity_id,
					date: newEntry.date,
					user_id: user?.$id || null,
				},
				{ onSuccess: () => onSuccess(newEntry) },
			);
		} else {
			console.log("Update exist entry", newEntry.$id);

			updateActivityEntry(
				{
					$id: newEntry.$id,
					completed: newEntry.completed,
					$permissions: newEntry.$permissions,
				},
				{ onSuccess: () => onSuccess(newEntry) },
			);
		}
	}

	return { activityEntry, updateOrCreate, isLoading, isFetched, error };
};
