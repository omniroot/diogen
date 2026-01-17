import { useIsMutating } from "@tanstack/react-query";
import { Permission } from "appwrite";
import { client } from "@/api/api.ts";
import { activitiesTable, tablesDB } from "@/api/appwrite.ts";
import type { Activities } from "@/api/types/appwrite.d.ts";
import {
	createCoreApi,
	createHooksApi,
	type DomainHook,
	type DomainHookMultiple,
	type OmitAppwrite,
} from "@/api/utils/appwrite.utils.tsx";
import { useAuth } from "@/features/auth/hooks/auth.hook.ts";

// ==== ACTIVITIES ====

export const activitiesCoreApi = createCoreApi<Activities>({
	tablesDB: tablesDB,
	databaseId: activitiesTable?.databaseId,
	tableId: activitiesTable?.$id,
});

export const activitiesHooksApi = createHooksApi<Activities>({
	coreApis: activitiesCoreApi,
	name: "activities",
	queryClient: client,
});

type UseActivitiesList = {
	type: "list";
	queries: DomainHookMultiple<Activities>["queries"];
	values?: any;
};

type UseActivitiesOne = {
	type: "one";
	queries?: DomainHook<Activities>["queries"];
	values: Partial<{ id: string }>;
};

type UseActivitiesNone = {
	type: "null";
	queries?: any;
	values: any;
};

type UseActivities = UseActivitiesList | UseActivitiesOne | UseActivitiesNone;

export const useActivities = ({
	type = "null",
	queries,
	values,
}: Partial<UseActivities> = {}) => {
	const raw = activitiesHooksApi;
	const { mutate: _createActivity } = raw.useCreate();
	const { mutate: _updateActivity } = raw.useUpdate();
	const { mutate: _deleteActivity } = raw.useDelete();
	const isMutating = useIsMutating();
	const { user } = useAuth();

	const { data: activities, isLoading: activitiesIsLoading } = raw.useList(
		{ user_id: { equal: user?.$id }, ...queries } as UseActivitiesList["queries"],
		{
			enabled: type === "list" && !!user?.$id,
		},
	);
	const { data: activity, isLoading: activityIsLoading } = raw.useOne(
		(values as UseActivitiesOne["values"])?.id ?? "",
		{ user_id: { equal: user?.$id }, ...queries } as UseActivitiesOne["queries"],
		{ enabled: type === "one" },
	);

	const domain = {
		createActivity: (
			newActivity: Partial<OmitAppwrite<Activities>>,
			onSuccess?: () => void,
		) => {
			_createActivity(
				{
					user_id: String(user?.$id),
					$permissions: [
						Permission.read(`user:${user?.$id}`),
						Permission.write(`user:${user?.$id}`),
						Permission.delete(`user:${user?.$id}`),
					],
					...newActivity,
				} as Activities,

				{
					onSuccess: () => {
						raw.refetch.list();
						onSuccess?.();
					},
				},
			);
		},
		updateActivity: (
			$id?: string,
			newActivity?: Partial<OmitAppwrite<Activities>>,
			onSuccess?: () => void,
		) => {
			if (!$id) throw Error("Update activity $id not found");

			_updateActivity(
				{
					$id,
					...newActivity,
				} as Activities,

				{
					onSuccess: () => {
						raw.refetch.list();
						onSuccess?.();
					},
				},
			);
		},
		deleteActivity: ($id?: string, onSuccess?: () => void) => {
			if (!$id) throw Error("Delete activity $id not found");
			_deleteActivity(
				{ $id: $id },
				{
					onSuccess: () => {
						raw.refetch.list();
						onSuccess?.();
					},
				},
			);
		},
	};

	if (type === "list") {
		return {
			activities,
			isLoading: activitiesIsLoading,
			isMutating,
			raw,
			domain,
		};
	} else if (type === "one") {
		return {
			activity,
			isLoading: activityIsLoading,
			isMutating,
			raw,
			domain,
		};
	} else {
		return { isMutating, raw, domain };
	}
};

// const { activities } = useActivities({
// 	type: "list",
// 	queries: { title: { contains: "api" } },
// });
// const { activity } = useActivities({ type: "one", values: { id: "superid" } });

// const {domain} = useActivities()
// domain.

// const {
// 	data: activities,
// 	isLoading,
// 	isFetched,
// 	error,
// } = useGetActivities(queries, overrides);

// const { mutate: _createActivity } = useCreateActivity();

// // const createActivity = (newActivity: Activities) => {
// // 	_createActivity(newActivity);
// // };
// return { activities, isLoading, isFetched, error, createActivity: _createActivity };

// export const useActivity = (
// 	$id: string | undefined,
// 	queries: DomainHook<Activities>["queries"],
// 	overrides?: DomainHook<Activities>["overrides"],
// ) => {
// 	const {
// 		data: activity,
// 		isLoading,
// 		isFetched,
// 		error,
// 	} = useGetActivity($id!, queries, { enabled: !!$id, ...overrides });
// 	return { activity, isLoading, isFetched, error };
// };
