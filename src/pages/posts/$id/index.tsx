import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { postsHooks } from "@/api/apis/posts.api.tsx";
import type { Posts } from "@/api/types/appwrite.js";

export const Route = createFileRoute("/posts/$id/")({
	component: RouteComponent,
	validateSearch: () => {
		return { search: "" };
	},
});

function RouteComponent() {
	const { id } = Route.useParams();
	const { search } = Route.useSearch();
	const naviage = Route.useNavigate();
	const post = JSON.parse(search) as Posts;

	useEffect(() => {
		if (post) {
			naviage({ search: { search: "" }, replace: true });
		}
		return () => {
			naviage({ search: { search: "" } });
		};
	}, [post, naviage]);

	// const { data: post } = postsHooks.useOne({ $id: id });
	return <div>Post: {post?.title}</div>;
}
