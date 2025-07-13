import { useGetModule } from "@/api/queries/modules.api.ts";
import { TasksList } from "@/components/business/TasksList/TasksList.tsx";
import { useGlobalStore } from "@/stores/global.store.ts";
import { Text, VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/projects/$custom_id/modules/$module_id/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { module_id } = Route.useParams();
  const { project_id, setModuleId } = useGlobalStore();
  const { data: module } = useGetModule({
    variables: { project_id, id: Number(module_id) },
  });

  useEffect(() => {
    setModuleId(Number(module_id));

    return () => setModuleId(null);
  }, []);

  return (
    <VStack>
      <Text>{module?.title}</Text>
      <TasksList project_id={project_id} module_id={Number(module_id)} />
    </VStack>
  );
}
