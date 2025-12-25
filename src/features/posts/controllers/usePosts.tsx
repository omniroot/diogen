import type { Posts } from "@/api/types/appwrite.js";
import type { DomainHook } from "@/api/utils/appwrite.utils.tsx";
import { postsHooks } from "@/features/posts/api/";

// CONTROLLER
export function usePosts(queries: DomainHook<Posts>) {
	const { useList, useOne, useCreate, useUpdate, useDelete } = postsHooks;
	const { data: posts, isLoading } = useList(queries);
	const createPost = useCreate().mutate;
	const updatePost = useUpdate().mutate;
	const deletePost = useDelete().mutate;
	const someBuissinesLogic = () => {};
	return {
		posts,
		isLoading,
		useOne,
		createPost,
		updatePost,
		deletePost,
		someBuissinesLogic,
	};
}
