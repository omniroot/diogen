import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { Account, Client, Functions, TablesDB } from "appwrite";
import appwriteConfig from "~/appwrite.config.json";

const VITE_APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const VITE_APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

export const appwriteClient = new Client()
	.setEndpoint(VITE_APPWRITE_ENDPOINT!)
	.setProject(VITE_APPWRITE_PROJECT_ID!); // Replace with your project ID

// if (!document.baseURI.includes("localhost") || !document.baseURI.includes("diogen")) {
// 	appwriteClient.setDevKey(
// 		"standard_3c444fe5af771a26f5f59dee343931d33e6564092f4938624f4a0bf1ddc0bd016659641e842114ca40710a54e7321f4c83fece5cfcf333d766046bd85f42fd20f4c5b3d0815cd92de184b418d7b0080edc565c3fb21dea8263ed869e08d0a88c880c7893f7f28e4252fd9783ae455132074f23ed7ae1ba3b3bc414a79867fc48",
// 	);
// }

// console.log({ aa: document.baseURI });

export const account = new Account(appwriteClient);
export const tablesDB = new TablesDB(appwriteClient);
export const functions = new Functions(appwriteClient);

export const diogenDB = appwriteConfig.tablesDB.find((i) => i.name === "diogenDB");

export const habitsTable = appwriteConfig.tables.find((i) => i.name === "habits");
export const habitsRecordsTable = appwriteConfig.tables.find(
	(i) => i.name === "habits_records",
);
export const postsTable = appwriteConfig.tables.find((i) => i.name === "posts");
export const daysRecordsTable = appwriteConfig.tables.find(
	(i) => i.name === "days_records",
);

export const usersTable = appwriteConfig.tables.find((i) => i.name === "users");
export const goalsTable = appwriteConfig.tables.find((i) => i.name === "goals");
export const activitiesTable = appwriteConfig.tables.find((i) => i.name === "activities");
export const activitityEntriesTable = appwriteConfig.tables.find(
	(i) => i.name === "activity_entries",
);

export const journalEntriesTable = appwriteConfig.tables.find(
	(i) => i.name === "journal_entries",
);

export const sleepMetricsTable = appwriteConfig.tables.find(
	(i) => i.name === "sleep_metrics",
);

export const getChildrenRowsFunction = appwriteConfig.functions.find(
	(i) => i.name === "getChildrenRows",
);

// const appwrite = createAppwriteCore({
// 	config: appwriteConfig as AppwriteConfig,
// 	mappings: {

// });

// export const appwrite = createAppwriteApi<
// 	typeof appwriteConfig,
// 	{
// 		tables: {
// 			activities: "activities";
// 			activityEntries: "activity_entries";
// 		};
// 	},
// 	{
// 		activities: Activities;
// 		activityEntries: ActivityEntries;
// 	}
// >({
// 	queryClient: client,
// 	tablesDB: tablesDB,
// 	appwriteConfig: appwriteConfig,
// 	mapping: {
// 		// 		// name | id
// 		tables: {
// 			activities: "activities",
// 			activityEntries: "activity_entries",
// 		},
// 	},
// });

// services.activities.

interface UseGetChildrenRows {
	table_id: string;
	parrent_id: string;
}

interface Res<TData> {
	success: boolean;
	total: number;
	documents: TData[];
}

export const useGetChildrenRows = <TData>(
	{ table_id, parrent_id }: UseGetChildrenRows,
	overrides?: Partial<UseQueryOptions<TData[], null, TData[]>>,
) => {
	return useQuery<TData[], null, TData[]>({
		queryKey: ["get", "chidlren", "rows", { table_id, parrent_id }],
		queryFn: async () => {
			const res = await functions.createExecution({
				functionId: String(getChildrenRowsFunction?.$id),
				body: JSON.stringify({
					database_id: diogenDB?.$id, //"6923a56a000f945ace60",
					collection_id: table_id,
					parent_id: parrent_id,
				}),
			});
			const parsed = JSON.parse(res.responseBody) as Res<TData>;

			console.log(res);
			return parsed.documents as TData[];
		},
		...overrides,
	});
};

// export const { useList: useGetHabits } = createAppwriteHooks<
// 	Habits,
// 	Omit<Habits, keyof Models.Row>
// >({
// 	tablesDB,
// 	databaseId: String(habitsTable?.databaseId), //"6923a56a000f945ace60",
// 	tableId: String(habitsTable?.$id), //"6923a6c90018e0309d7f",
// 	filters: {
// 		title: "contains",
// 		// likes: "equal",
// 	},
// });

// export const {
// 	useList: useGetHabitsRecords,
// 	useCreate: useCreateHabitRecord,
// 	useUpdate: useUpdateHabitRecord,
// } = createAppwriteHooks<HabitsRecords, Omit<HabitsRecords, keyof Models.Row>>({
// 	tablesDB,
// 	databaseId: String(habitsRecordsTable?.databaseId), //"6923a56a000f945ace60",
// 	tableId: String(habitsRecordsTable?.$id), //"6923a6c90018e0309d7f",
// 	filters: {
// 		habit_id: "equal",
// 		date: "equal",
// 	},
// });

// export const useGetHabitRecords = (vars: ) => {
// 	return useQuery({
// 		queryKey: keyFactory.habit_records.list(),
// 	});
// };

// Query.between()
/*
export const useGetPosts = (
	
) => {
	return useQuery<Posts[]>({
		queryKey: ["get", "posts", vars],
		queryFn: async () => {
			
		},
		...overrides,
	});
};

*/

// function useGetPost(
// 	vars: Partial<Pick<Posts, "$id">> = {},
// 	overrides: Partial<UseQueryOptions<Posts[]>> = {},
// ) {
// 	return useQuery<Posts[]>({
// 		queryKey: ["get", "posts"],
// 		queryFn: async () => {
// 			const { rows } = await tablesDB.listRows<Posts>({
// 				databaseId: "6923a56a000f945ace60",
// 				tableId: "6923a6c90018e0309d7f",
// 			});

// 			// if (!rows) throw Error;

// 			return rows;
// 		},
// 		...overrides,
// 	});
// }

// const { data } = useGetPosts({ title: "api" });
// const firstElementTitle = data?.[0].title;
