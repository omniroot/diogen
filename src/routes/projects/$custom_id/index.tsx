import { useGetProject } from "@/api/queries/projects.api.ts";
import { ModulesList } from "@/components/business/ModulesList/ModulesList.tsx";
import { ProjectCircle } from "@/components/business/ProjectCircle/ProjectCircle.tsx";
import { TasksList } from "@/components/business/TasksList/TasksList.tsx";
import { useGlobalStore } from "@/stores/global.store.ts";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { LuPlus } from "react-icons/lu";
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

      <HStack justifyContent={"space-between"} p="8px">
        <HStack>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            Modules
          </Text>
        </HStack>
        <HStack>
          <Button variant={"outline"}>
            <LuPlus />
            Create module
          </Button>
        </HStack>
      </HStack>
      <ModulesList project={project} />

      <TasksList project_id={project.id} />
    </>
  );
}
