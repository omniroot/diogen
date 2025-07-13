import {
  useGetTask,
  useGetTasks,
  useUpdateTask,
} from "@/api/queries/tasks.api.ts";
import { client } from "@/api/query.client.ts";
import { ITask } from "@/api/supabase.interface.ts";
import { Button, Menu, Portal, Skeleton } from "@chakra-ui/react";
import { FC } from "react";
type IPriority = null | "low" | "medium" | "high";

const getTaskColor = (priority: IPriority) => {
  if (priority === "high") return "red.600";
  if (priority === "medium") return "orange.600";
  if (priority === "low") return "blue.600";
  return "outline_variant";
};

interface IProps {
  task: ITask | undefined;
  isShow?: boolean;
}

interface IItem {
  title: string;
  value: string;
  color: string;
}

const items: IItem[] = [
  { title: "Unset", value: "unset", color: "white" },
  { title: "High", value: "high", color: "red.600" },
  { title: "Medium", value: "medium", color: "orange.600" },
  { title: "Low", value: "low", color: "blue.600" },
];

export const PriorityMenu: FC<IProps> = ({ task, isShow = true }) => {
  const { mutate: updateTask } = useUpdateTask({
    onSuccess: () => {
      client.refetchQueries({ queryKey: useGetTasks.getKey() });
      client.refetchQueries({ queryKey: useGetTask.getKey({ id: task?.id }) });
    },
  });

  const onItemSelect = (item: IItem) => {
    if (task)
      updateTask({
        id: task.id,
        data: {
          priority: item.value === "unset" ? null : item.value,
        },
      });
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Skeleton loading={!task}>
          <Button
            variant="outline"
            size="sm"
            borderWidth={"2px"}
            borderColor={{
              base: getTaskColor(task?.priority as IPriority),
            }}
            borderRadius={"full"}
            hidden={!isShow}
          >
            {task?.priority || "Priority"}
          </Button>
        </Skeleton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {items.map((item) => {
              return (
                <Menu.Item
                  value={item.value}
                  color={item.color}
                  onSelect={() => onItemSelect(item)}
                  key={item.value}
                >
                  {item.title}
                </Menu.Item>
              );
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
