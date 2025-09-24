import { getProjectOptions } from "@/api/queries/projects.api.ts";
import { IssueList } from "@/components/business/IssueList.tsx";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/projects/$custom_id/issues");

export const ProjectIssuesPage = () => {
	const { custom_id } = route.useParams();
	const { data: project } = useQuery(getProjectOptions({ custom_id }));

	return (
		<>
			<h1>Issues for {project?.title}</h1>
			<IssueList project_id={project?.id} />
			{/* <VStack gap={1}>
        {issues?.map((issue) => (
          <IssueItem key={issue.id} issue={issue} />
        ))}
      </VStack> */}
		</>
	);
};
