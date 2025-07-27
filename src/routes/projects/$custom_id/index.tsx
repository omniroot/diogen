import { useGetProject } from "@/api/queries/projects.api.ts";
import { ModulesList } from "@/components/business/ModulesList/ModulesList.tsx";
import { ProjectCircle } from "@/components/business/ProjectCircle/ProjectCircle.tsx";
import { TasksList } from "@/components/business/TasksList/TasksList.tsx";
import { useGlobalStore } from "@/stores/global.store.ts";
import { HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/projects/$custom_id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setCustomId, setProjectId } = useGlobalStore();
  const { custom_id } = Route.useParams();
  const { data: project, isFetching: projectIsLoading } = useGetProject({
    variables: { custom_id },
  });

  // const { mutate: updateTask } = useUpdateTask({
  //   onSuccess: () => {
  //     client.refetchQueries({ queryKey: useGetTasks.getKey() });
  //   },
  // });

  useEffect(() => {
    if (project) {
      setCustomId(project.custom_id);
      setProjectId(project.id);
      document.title = `Diogen - ${project.title}`;
    }
  }, [project, setCustomId, setProjectId]);

  // const onDragEnd = (event: DragEndEvent) => {
  //   console.log({ event });

  //   if (!event.over) return;
  //   updateTask({
  //     id: event.active.data.current?.task_id,
  //     data: {
  //       module_id: event.over?.data.current?.module_id,
  //     },
  //   });
  // };

  // if (projectIsFetching) return "Loading...";
  // if (!project) return "Not found";
  return (
    <>
      <VStack w="100%" bg={"surface_container"} p="24px" borderRadius={"24px"}>
        <Skeleton w="100%" loading={projectIsLoading} borderRadius={"8px"}>
          <HStack w="100%">
            <ProjectCircle color={project?.color} />
            <Text as={"h1"} fontWeight={"bold"} color={"text"}>
              {project?.title}
            </Text>
          </HStack>
        </Skeleton>

        <Skeleton w="100%" loading={projectIsLoading} borderRadius={"8px"}>
          <HStack w="100%">
            <Text as={"h3"} color={"text_variant"}>
              {project?.description}
            </Text>
          </HStack>
        </Skeleton>
      </VStack>

      {/* <DndContext onDragEnd={onDragEnd}> */}
      <ModulesList project={project} />

      <TasksList project_id={project?.id} module_id={null} empty_module_id />
      {/* </DndContext> */}
    </>
  );
}
