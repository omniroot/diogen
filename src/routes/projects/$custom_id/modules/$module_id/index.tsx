import { useGetModule } from "@/api/queries/modules.api.ts";
import { useGetProject } from "@/api/queries/projects.api.ts";
import { TasksList } from "@/components/business/TasksList/TasksList.tsx";
import { useGlobalStore } from "@/stores/global.store.ts";
import { HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { LuSquarePen } from "react-icons/lu";

export const Route = createFileRoute(
  "/projects/$custom_id/modules/$module_id/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { custom_id, module_id } = Route.useParams();
  const { project_id, setModuleId } = useGlobalStore();
  const { data: project } = useGetProject({
    variables: { custom_id },
  });
  const { data: module } = useGetModule({
    variables: { project_id, id: Number(module_id) },
  });

  useEffect(() => {
    setModuleId(Number(module_id));

    return () => setModuleId(null);
  }, []);

  return (
    <VStack alignItems={"flex-start"}>
      <HStack
        w="100%"
        justifyContent={"space-between"}
        bg={"surface_container"}
        p="12px   18px"
        borderRadius={"12px"}
      >
        <VStack alignItems={"flex-start"}>
          <Text fontSize={"2xl"} fontWeight={"bold"} color={"text"}>
            {module?.title}
          </Text>
          <Text fontSize={"md"} fontWeight={"bold"} color={"text_variant"}>
            {module?.description}
          </Text>
        </VStack>
        <HStack justifyContent={"flex-end"}>
          <IconButton variant={"ghost"} color={"text"}>
            <LuSquarePen />
          </IconButton>
        </HStack>
      </HStack>

      <TasksList project_id={project?.id} module_id={Number(module_id)} />
    </VStack>
  );
}
