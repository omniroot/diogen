import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$custom_id/issues")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/projects/issues"!</div>;
}
