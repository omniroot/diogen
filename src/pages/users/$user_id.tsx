import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$user_id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user_id } = Route.useParams();
	return <div>Hello {user_id}!</div>;
}
