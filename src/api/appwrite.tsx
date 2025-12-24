import { useQuery } from "@tanstack/react-query";
import { Account, Client, type Models, OAuthProvider, TablesDB } from "appwrite";
import { keyFactory } from "@/api/api.ts";
import { createAppwriteHooks } from "@/api/appwrite.utils.ts";
import type { Habits, HabitsRecords, Posts } from "@/api/types/appwrite.d.ts";
import appwriteConfig from "~/appwrite.config.json";

// import { createAppwriteHooks } from "@/api/appwrite.utils.ts";

const VITE_APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
// const VITE_APPWRITE_PROJECT_NAME = import.meta.env.VITE_APPWRITE_PROJECT_NAME;
const VITE_APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
	.setEndpoint(VITE_APPWRITE_ENDPOINT)
	.setProject(VITE_APPWRITE_PROJECT_ID); // Replace with your project ID
// .setDevKey(
// 	"0b8bf0cd4a4bfeb8c412cc100a05d0149d9e23975eb83818c228c0ba704e87ffcfc3b20830bdb9a04aedbeb73544e075e947167864b066f450c15c636dfa7d1ea22038ed834af908048a22fdd442581814b8088497c98dbe1d3c057959ef349dc6eccb3110418ea4a5c12547e72d64c03b6d7abfdc97e9b7806fe082ce258b78",
// );
client.ping();
export const account = new Account(client);
export const tablesDB = new TablesDB(client);

// account.createEmailPasswordSession({
// 	email: "omnirootofc@gmail.com",
// 	password: "12345678",
// });
// const a = await account.get();
// console.log({ a });

// const session = await account.getSession({
// 	sessionId: "current",
// });

// // Provider information
// console.log(session.provider);
// console.log(session.providerUid);
// console.log(session.providerAccessToken);

export const habitsTable = appwriteConfig.tables.find((i) => i.name === "habits");
export const habitsRecordsTable = appwriteConfig.tables.find(
	(i) => i.name === "habits_records",
);
export const postsTable = appwriteConfig.tables.find((i) => i.name === "posts");
export const daysRecordsTable = appwriteConfig.tables.find(
	(i) => i.name === "days_records",
);

export const { useList: useGetHabits } = createAppwriteHooks<
	Habits,
	Omit<Habits, keyof Models.Row>
>({
	tablesDB,
	databaseId: String(habitsTable?.databaseId), //"6923a56a000f945ace60",
	tableId: String(habitsTable?.$id), //"6923a6c90018e0309d7f",
	filters: {
		title: "contains",
		// likes: "equal",
	},
});

export const {
	useList: useGetHabitsRecords,
	useCreate: useCreateHabitRecord,
	useUpdate: useUpdateHabitRecord,
} = createAppwriteHooks<HabitsRecords, Omit<HabitsRecords, keyof Models.Row>>({
	tablesDB,
	databaseId: String(habitsRecordsTable?.databaseId), //"6923a56a000f945ace60",
	tableId: String(habitsRecordsTable?.$id), //"6923a6c90018e0309d7f",
	filters: {
		habit_id: "equal",
		date: "equal",
	},
});

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
