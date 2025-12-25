import { postsTable, tablesDB } from "@/api/appwrite.tsx";
import type { Posts } from "@/api/types/appwrite.js";
import { createCoreApi, createHooksApi } from "@/api/utils/appwrite.utils.tsx";

// API
export const postsCoreApi = createCoreApi<Posts>({
	tablesDB,
	databaseId: String(postsTable?.databaseId),
	tableId: String(postsTable?.$id),
});

// HOOKS
export const postsHooks = createHooksApi<Posts>({
	name: "posts",
	coreApis: postsCoreApi,
});

// const a = postsHooks.useList({ title: { contains: "api" } });

// const { createPost } = usePosts();

// const a = createPost({title: "rere", }, {})

// export const usePosts = createDomainApi({
// 	name: "posts",
// 	hooksApi: postsHooks,
// extend: (base) => ({
// 	toggleComplete: (id: string) => {
// 		const items = base.posts().data;
// 		const item = items?.find((x) => x.$id === id);
// 		if (!item) return;
// 		return base[`updatePosts`]({ ...item, completed: !item.completed });
// 	},
// }),
// });

// export function usePosts() {
// 	const {} = postsHooks
// }

// const keyFactory = {
// 	posts: postsHooks.queryKeys,
// 	// tasks: tasksHooks.queryKeys
// };

// keyFactory.posts.list({
// 	$or: [
// 		{
// 			title: { contains: "test" },
// 		},
// 		{
// 			description: { contains: "test" },
// 		},
// 	],
// });

// const { data: posts } = postsHooks.useList({});
// export api.list({
// $or: [{ title: { contains: "api" }, description: { contains: "api" } }],
// title: {
// contains: [],
// },
// });
