import { useGetProject } from "@/api/queries/projects.api.ts";
import { ModulesList } from "@/components/business/ModulesList/ModulesList.tsx";
import { ProjectCircle } from "@/components/business/ProjectCircle/ProjectCircle.tsx";
import { TasksList } from "@/components/business/TaskList/TaskList.tsx";
import { useGlobalStore } from "@/stores/global.store.ts";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
export const Route = createFileRoute("/projects/$custom_id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setCustomId, setProjectId } = useGlobalStore();
  const { custom_id } = Route.useParams();
  const { data: project, isFetching: projectIsFetching } = useGetProject({
    variables: { custom_id },
  });

  useEffect(() => {
    if (project) {
      setCustomId(project.custom_id);
      setProjectId(project.id);
    }
  }, [project, setCustomId, setProjectId]);

  if (projectIsFetching) return "Loading...";
  if (!project) return "Not found";
  return (
    <>
      <VStack w="100%" bg={"surface_container"} p="12px" borderRadius={"24px"}>
        <HStack w="100%">
          <ProjectCircle color={project.color} />
          <Text as={"h1"} fontWeight={"bold"} color={"text"}>
            {project.title}
          </Text>
        </HStack>

        <HStack w="100%">
          <Text as={"h3"} color={"text_variant"}>
            {project.description}
          </Text>
        </HStack>
      </VStack>

      <HStack justifyContent={"space-between"}>
        <HStack>
          <Text as={"h2"} fontWeight={"bold"}>
            MOdules
          </Text>
        </HStack>
        <HStack>
          <Button>Create module</Button>
        </HStack>
      </HStack>
      <ModulesList project={project} />
      <TasksList project={project} />
    </>
  );
}
