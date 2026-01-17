import { client } from "@/api/api.ts";
import { tablesDB, usersTable } from "@/api/appwrite.ts";
import type { Users } from "@/api/types/appwrite.d.ts";
import { createCoreApi, createHooksApi } from "@/api/utils/appwrite.utils.tsx";

export const usersCoreApi = createCoreApi<Users>({
	tablesDB: tablesDB,
	databaseId: usersTable?.databaseId,
	tableId: usersTable?.$id,
});

export const { useList: useGetUsers, useOne: useGetUser } = createHooksApi<Users>({
	coreApis: usersCoreApi,
	name: "users",
	queryClient: client,
});

export function useUsers() {
	// const {} =
}

export function useUser(id: string) {
	const { data: users, isLoading } = useGetUsers(
		{ user_id: { equal: id } },
		// { select: (data) => data[0] },
	);

	return { user: users?.[0], isLoading };
}
