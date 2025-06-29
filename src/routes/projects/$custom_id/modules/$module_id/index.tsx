import { HStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useGetModule } from "@/api/queries/modules.api.ts";
import { useGlobalStore } from "@/stores/global.store.ts";

export const Route = createFileRoute(
	"/projects/$custom_id/modules/$module_id/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { module_id } = Route.useParams();
	const { project_id } = useGlobalStore();
	const { data: module } = useGetModule({
		variables: { project_id, module_id: Number(module_id) },
	});

	return <HStack>{module?.title}</HStack>;
}
