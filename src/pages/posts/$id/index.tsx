import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$id/")({
	component: RouteComponent,
});

function RouteComponent() {
	// const { id } = Route.useParams();
	// const naviage = Route.useNavigate();

	// useEffect(() => {
	// 	if (post) {
	// 		naviage({ search: { search: "" }, replace: true });
	// 	}
	// 	return () => {
	// 		naviage({ search: { search: "" } });
	// 	};
	// }, [post, naviage]);

	// const { data: post } = postsHooks.useOne({ $id: id });
	return <div>Post:</div>;
}
