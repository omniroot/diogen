import { useGetProject } from "@/api/queries/projects.api.ts";
import { useGetTasks } from "@/api/queries/tasks.api.ts";
import { useGetUser } from "@/api/queries/users.api.ts";
import { client } from "@/api/query.client.ts";
import type { ITask } from "@/api/supabase.interface";
import { TaskItem } from "@/components/business/TaskItem/TaskItem";
import { CreateTaskModal } from "@/components/modals/CreateTaskModal/CreateTaskModal.tsx";
import {
  Badge,
  Button,
  HStack,
  Menu,
  Portal,
  Text,
  useCheckboxGroup,
  VStack,
} from "@chakra-ui/react";
import { useState, type FC } from "react";
import { LuFilter } from "react-icons/lu";

const sortItems = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

const filterItems = [{ title: "Hide completed", value: "hidecompleted" }];

interface ITaskListProps {
  project_id?: number | undefined;
  module_id?: number | null;
  empty_module_id?: boolean;
}

export const TasksList: FC<ITaskListProps> = ({
  project_id,
  module_id,
  empty_module_id = false,
}) => {
  const [sort, setSort] = useState("desc");
  const filterGroup = useCheckboxGroup({ defaultValue: ["hidecompleted"] });
  const { data: user } = useGetUser({});

  // const [hideCompleted, setHideCompleted] = useState(true);
  const {
    data: tasks,
    isFetching: tasksIsFetching,
    isFetched: tasksIsFetched,
  } = useGetTasks({
    variables: {
      project_id: project_id ?? null,
      module_id: module_id ?? null,
      user_id: user?.id,
      sortByCreatedAt: sort,
      empty_module_id: empty_module_id,
      // completed: !hideCompleted,
    },

    placeholderData: () => {
      const data = client.getQueryData<ITask[]>([useGetTasks.getKey()]);
      return data;
    },
  });

  let _tasks = tasks?.filter((task) => {
    if (filterGroup.isChecked("hidecompleted")) {
      return task.completed === false && task;
    }
    return task;
  });

  // useEffect(() => {
  //   refetch();
  // }, [sort]);

  console.log({ _tasks });

  return (
    <VStack w="100%">
      <HStack w="100%" justifyContent={"space-between"} p="8px">
        <HStack>
          <Text fontSize={{ base: "xl", sm: "2xl" }} fontWeight={"bold"}>
            Tasks
          </Text>
          {/* <Text>{JSON.stringify(`${project_id} - ${module_id}`)}</Text> */}
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
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline">
                <LuFilter />
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="10rem">
                  <Menu.RadioItemGroup
                    value={sort}
                    onValueChange={(e) => setSort(e.value)}
                  >
                    <Menu.ItemGroupLabel>Sort</Menu.ItemGroupLabel>
                    {sortItems.map((item) => (
                      <Menu.RadioItem key={item.value} value={item.value}>
                        {item.label}
                        <Menu.ItemIndicator />
                      </Menu.RadioItem>
                    ))}
                  </Menu.RadioItemGroup>
                  {/* <Menu.ItemGroup>
                    <Menu.ItemGroupLabel>Sort</Menu.ItemGroupLabel>
                    <Menu.Item value="bold">Bold</Menu.Item>
                    <Menu.Item value="underline">Underline</Menu.Item>
                  </Menu.ItemGroup> */}
                  <Menu.ItemGroup>
                    <Menu.ItemGroupLabel>Filter</Menu.ItemGroupLabel>
                    {filterItems.map(({ title, value }) => (
                      <Menu.CheckboxItem
                        key={value}
                        value={value}
                        checked={filterGroup.isChecked(value)}
                        onCheckedChange={() => filterGroup.toggleValue(value)}
                      >
                        {title}
                        <Menu.ItemIndicator />
                      </Menu.CheckboxItem>
                    ))}
                  </Menu.ItemGroup>
                  {/* <Menu.RadioItemGroup
                    value={value}
                    onValueChange={(e) => setValue(e.value)}
                  >
                    {items.map((item) => (
                      <Menu.RadioItem key={item.value} value={item.value}>
                        {item.label}
                        <Menu.ItemIndicator />
                      </Menu.RadioItem>
                    ))}
                  </Menu.RadioItemGroup> */}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          {/* <Button
            variant={"outline"}
            onClick={() => setSortType((prev) => !prev)}
          >
            {sortType ? <LuCalendarArrowDown /> : <LuCalendarArrowUp />}
          </Button> */}
          <CreateTaskModal />
        </HStack>
      </HStack>
      <VStack w="100%">
        {tasksIsFetched && !tasks?.length && <Text>Tasks not found.</Text>}
        {_tasks?.map((task) => {
          return <TaskItem key={task.id} task={task} />;
        })}
      </VStack>
    </VStack>
  );
};
