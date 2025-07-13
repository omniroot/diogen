import {
  useGetTask,
  useGetTasks,
  useUpdateTask,
} from "@/api/queries/tasks.api.ts";
import { client } from "@/api/query.client.ts";
import { ITask } from "@/api/supabase.interface.ts";
import { Menu, Button, Portal, Skeleton } from "@chakra-ui/react";
import { FC } from "react";
type ILabel = null | "bug" | "refactoring" | "feature";

const getTaskColor = (priority: ILabel) => {
  if (priority === "bug") return "red.600";
  if (priority === "refactoring") return "orange.600";
  if (priority === "feature") return "purple.600";
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
  { title: "Bug", value: "bug", color: "red.600" },
  { title: "Refactoring", value: "refactoring", color: "orange.600" },
  { title: "Feature", value: "feature", color: "purple.600" },
];

export const LabelMenu: FC<IProps> = ({ task, isShow = true }) => {
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
          label: item.value === "unset" ? null : item.value,
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
              base: getTaskColor(task?.label as ILabel),
            }}
            borderRadius={"full"}
            hidden={!isShow}
          >
            {task?.label || "Label"}
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
