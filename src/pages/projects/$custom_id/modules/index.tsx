import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$custom_id/modules/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/modules/"!</div>;
}
