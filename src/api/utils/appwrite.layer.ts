import type { QueryClient } from "@tanstack/react-query";
import type { TablesDB } from "appwrite";
import type { AppwriteConfig } from "@/api/utils/appwrite.types.ts";

interface ResourceMapping {
	tables: Record<string, string>; // { [friendlyName]: tableId }
	functions?: Record<string, string>; // { [friendlyName]: functionId }
	buckets?: Record<string, string>; // { [friendlyName]: bucketId }
}

interface CreateAppwriteApi<
	TConfig extends AppwriteConfig,
	TMappings extends ResourceMapping,
> {
	queryClient: QueryClient;
	tablesDB: TablesDB;
	appwriteConfig: TConfig;
	mapping: TMappings;
}

export const createAppwriteApi = <
	TConfig extends AppwriteConfig,
	TMapping extends ResourceMapping,
	// TModels extends Record<keyof TMapping["tables"], any>,
>({
	queryClient,
	tablesDB,
	appwriteConfig,
	mapping,
}: CreateAppwriteApi<TConfig, TMapping>) => {
	console.log({ queryClient, tablesDB, appwriteConfig, mapping });

	// ИИ написал какую-то хуйню которую я не понимаю.
	// TODO: Вернуться сюда потом и дописать createAppwriteApi.
	// PLAN:
	// | createAppwriteApi
	// | -> get tables, buckets and etc
	// | -> generate core api from it ( createCoreApi )
	// | -> generate hooks api from core api ( createHooksApi )
	// | -> return done api

	// TODO: ПЕРЕИМЕНОВАТЬ ЭТО
	// const core = createAppwriteCore({
	// 	config: appwriteConfig,
	// 	mappings: {
	// 		tables: mapping.tables,
	// 		functions: mapping.functions,
	// 		buckets: mapping.buckets,
	// 	},
	// });

	// export const activitiesCoreApi = createCoreApi<Activities>({
	// 	tablesDB: tablesDB,
	// 	databaseId: activitiesTable?.databaseId,
	// 	tableId: activitiesTable?.$id,
	// });

	// export const {
	// 	useList: useGetActivities,
	// 	useOne: useGetActivity,
	// 	queryKeys: activitiesQueryKeys,
	// 	refetch: refetchActivities,
	// } = createHooksApi<Activities>({
	// 	coreApis: activitiesCoreApi,
	// 	name: "activities",
	// 	queryClient: client,
	// });
};
