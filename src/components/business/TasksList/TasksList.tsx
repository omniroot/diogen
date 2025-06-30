import { useGetTasks } from "@/api/queries/tasks.api.ts";
import { client } from "@/api/query.client.ts";
import type { ITask } from "@/api/supabase.interface";
import { TaskItem } from "@/components/business/TaskItem/TaskItem";
import { CreateTaskModal } from "@/components/modals/CreateTaskModal/CreateTaskModal.tsx";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useState, type FC } from "react";
import { LuCalendarArrowDown, LuCalendarArrowUp } from "react-icons/lu";

interface ITaskListProps {
  project_id?: number;
  module_id?: number;
}

export const TasksList: FC<ITaskListProps> = ({ project_id, module_id }) => {
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
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            Tasks
          </Text>
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
      {tasksIsFetching && <Text>Loading...</Text>}
      {tasksIsFetched && !tasks?.length && <Text>Tasks not found.</Text>}
      {tasks?.map((task) => {
        return <TaskItem key={task.id} task={task} />;
      })}
    </VStack>
  );
};
