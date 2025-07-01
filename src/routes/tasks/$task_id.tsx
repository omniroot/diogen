import { useGetTask } from "@/api/queries/tasks.api.ts";
import { Stat, Text, VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { formatDistance } from "date-fns";

export const Route = createFileRoute("/tasks/$task_id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { task_id } = Route.useParams();
  const { data: task } = useGetTask({ variables: { id: Number(task_id) } });

  if (!task) return "Loading...";
  return (
    <VStack w="100%" alignItems={"flex-start"}>
      <Stat.Root>
        <Stat.Label>Title</Stat.Label>
        <Stat.ValueText>{task.title}</Stat.ValueText>
      </Stat.Root>

      {task.description && (
        <Stat.Root>
          <Stat.Label>Description</Stat.Label>
          <Stat.ValueText>{task.description}</Stat.ValueText>
        </Stat.Root>
      )}

      <Stat.Root>
        <Stat.Label>Updated at</Stat.Label>
        <Stat.ValueText>
          {formatDistance(new Date(), task.updated_at)}
        </Stat.ValueText>
      </Stat.Root>
    </VStack>
  );
}
