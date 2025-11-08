import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getProjectOptions } from "@/api/queries/projects.api.ts";
import { IssueList } from "@/features/issues/components/IssueList.tsx";
import { ModuleList } from "@/features/modules/components/ModuleList.tsx";
import { useLocationStore } from "@/stores/location.store.tsx";

export const Route = createFileRoute("/projects/$custom_id/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { custom_id } = useLocationStore();
	const { data: project } = useQuery(getProjectOptions({ custom_id }));

	return (
		<>
			<ModuleList project_id={project?.id} />
			<IssueList project_id={project?.id} filterByEmptyModule />
		</>
	);
}
