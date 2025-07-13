import { useGetTasks } from "@/api/queries/tasks.api.ts";
import { client } from "@/api/query.client.ts";
import type { ITask } from "@/api/supabase.interface";
import { TaskItem } from "@/components/business/TaskItem/TaskItem";
import { CreateTaskModal } from "@/components/modals/CreateTaskModal/CreateTaskModal.tsx";
import { Badge, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useState, type FC } from "react";
import { LuCalendarArrowDown, LuCalendarArrowUp } from "react-icons/lu";

interface ITaskListProps {
  project_id?: number | null;
  module_id?: number | null;
  empty_module_id?: boolean;
}

export const TasksList: FC<ITaskListProps> = ({
  project_id,
  module_id,
  empty_module_id = false,
}) => {
  const [sortType, setSortType] = useState(true);
  const {
    data: tasks,
    isFetching: tasksIsFetching,
    isFetched: tasksIsFetched,
  } = useGetTasks({
    variables: {
      project_id: project_id ?? null,
      module_id: module_id ?? null,
      sortByCreatedAt: sortType ? "desc" : "asc",
      empty_module_id: empty_module_id,
    },

    placeholderData: () => {
      const data = client.getQueryData<ITask[]>([useGetTasks.getKey()]);
      return data;
    },
  });

  return (
    <VStack w="100%">
      <HStack w="100%" justifyContent={"space-between"} p="8px">
        <HStack>
          <Text fontSize={{ base: "xl", sm: "2xl" }} fontWeight={"bold"}>
            Tasks
          </Text>
          <Badge
            size={"lg"}
            variant={"solid"}
            transition={"opacity 200ms"}
            opacity={tasksIsFetching ? 1 : 0}
          >
            Sync
          </Badge>
        </HStack>

        <HStack>
          <Button
            variant={"outline"}
            onClick={() => setSortType((prev) => !prev)}
          >
            {sortType ? <LuCalendarArrowDown /> : <LuCalendarArrowUp />}
          </Button>
          <CreateTaskModal />
        </HStack>
      </HStack>
      <VStack w="100%">
        {tasksIsFetched && !tasks?.length && <Text>Tasks not found.</Text>}
        {tasks?.map((task) => {
          return <TaskItem key={task.id} task={task} />;
        })}
      </VStack>
    </VStack>
  );
};
