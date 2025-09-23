import { getProjectOptions } from "@/api/queries/projects.api.ts";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/projects/$custom_id/modules");

export const ProjectModulesPage = () => {
  const { custom_id } = route.useParams();
  const { data: project } = useQuery(getProjectOptions({ custom_id }));
  return <>Modules for {project?.title}</>;
};
